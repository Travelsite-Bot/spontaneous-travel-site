// pages/api/flights.js
// Backend proxy for Travelpayouts flight data.
// Normalizes fields for consistent frontend use.

export default async function handler(req, res) {
  try {
    const { origin = "", destination = "", depart_date } = req.query;

    const API_TOKEN = process.env.TP_API_TOKEN;
    if (!API_TOKEN) {
      return res.status(500).json({ error: "Missing TP_API_TOKEN env var" });
    }

    // Normalize origins into array of IATA codes
    const origins = origin
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (origins.length === 0) {
      return res.status(400).json({ error: "At least one origin required" });
    }

    // Helper to fetch URL with token
    const fetchWithToken = async (url) => {
      const r = await fetch(url, {
        headers: { "X-Access-Token": API_TOKEN },
      });
      const txt = await r.text();
      let json = null;
      try {
        json = JSON.parse(txt);
      } catch (e) {
        console.error("Non-JSON response:", txt.slice(0, 200));
      }
      return { ok: r.ok, status: r.status, json, text: txt };
    };

    // --- Normalize helper ---
    const normalize = (it) => {
      return {
        origin: it.origin || it.from || "",
        destination: it.destination || it.to || "",
        price: Number(it.price || it.value || 0),
        departure_at:
          it.departure_at ||
          it.departure ||
          (it.depart_date ? `${it.depart_date}T00:00:00Z` : null),
        direct: it.transfers === 0 || it.direct || false,
        airline: it.airline || "",
        flight_number: it.flight_number || "",
      };
    };

    // If destination provided -> use prices_for_dates
    if (destination) {
      let combined = [];
      for (const og of origins) {
        const params = new URLSearchParams();
        params.append("origin", og);
        params.append("destination", destination);
        if (depart_date) params.append("departure_at", depart_date);
        params.append("currency", "usd");

        const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
        const { ok, status, json, text } = await fetchWithToken(url);

        if (!ok) {
          console.error("Flights API error", status, text);
          continue;
        }

        const items = (json && json.data) || [];
        combined = combined.concat(items.map(normalize));
      }

      // Deduplicate
      const best = {};
      combined.forEach((it) => {
        const key = `${it.origin}_${it.destination}_${it.departure_at}`;
        if (!best[key] || it.price < best[key].price) {
          best[key] = it;
        }
      });

      const out = Object.values(best);
      return res.status(200).json({
        source: "prices_for_dates",
        count: out.length,
        data: out,
      });
    }

    // No destination -> Adventure Anywhere
    let combinedOffers = [];
    for (const og of origins) {
      const params = new URLSearchParams();
      params.append("origin", og);
      if (depart_date) params.append("departure_at", depart_date);
      params.append("currency", "usd");

      const url = `https://api.travelpayouts.com/aviasales/v3/get_special_offers?${params.toString()}`;
      const { ok, status, json, text } = await fetchWithToken(url);

      if (!ok) {
        console.error("Special offers API error", status, text);
        continue;
      }

      const items = (json && json.data) || [];
      const annotated = items.map((it) =>
        normalize({ ...it, origin: og })
      );
      combinedOffers = combinedOffers.concat(annotated);
    }

    combinedOffers.sort((a, b) => a.price - b.price);

    return res.status(200).json({
      source: "special_offers",
      count: combinedOffers.length,
      data: combinedOffers,
    });
  } catch (err) {
    console.error("flights handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
