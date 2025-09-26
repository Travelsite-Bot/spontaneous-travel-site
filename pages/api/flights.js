// pages/api/flights.js
// Backend proxy for flight data. Now enforces direct-only flights and builds "Adventure Anywhere"
// from a curated list of destinations using prices_for_dates.

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

    // Helper to fetch with token
    const fetchWithToken = async (url) => {
      const r = await fetch(url, {
        headers: { "X-Access-Token": API_TOKEN },
      });
      const txt = await r.text();
      let json = null;
      try {
        json = JSON.parse(txt);
      } catch (e) {
        // not JSON
      }
      return { ok: r.ok, status: r.status, json, text: txt };
    };

    // If destination provided -> use prices_for_dates for each origin
    if (destination) {
      let combined = [];
      for (const og of origins) {
        const params = new URLSearchParams();
        params.append("origin", og);
        params.append("destination", destination);
        if (depart_date) params.append("departure_at", depart_date);
        params.append("currency", "usd");
        params.append("direct", "true"); // enforce direct flights

        const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
        const { ok, status, json, text } = await fetchWithToken(url);

        if (!ok) {
          console.error("Flights API error", status, text);
          continue;
        }

        const items = (json && json.data) || [];
        combined = combined.concat(items);
      }

      // Deduplicate
      const best = {};
      combined.forEach((it) => {
        const key = `${it.origin}_${it.destination}_${it.departure_at || it.departure}`;
        const price = Number(it.price || it.value || 0);
        if (!best[key] || (price && price < best[key].price)) {
          best[key] = { ...it, price: price || (it.price || it.value) };
        }
      });

      const out = Object.values(best);
      return res.status(200).json({ source: "prices_for_dates", count: out.length, data: out });
    }

    // No destination -> Adventure Anywhere mode
    const adventureDestinations = [
      "BCN", "LIS", "AMS", "ROM", "ATH", "PAR", "BER", "MAD", "DUB", "VIE", "PRG", "BUD", "CPH"
    ];

    let combinedOffers = [];
    for (const og of origins) {
      for (const dest of adventureDestinations) {
        if (og === dest) continue; // skip same city
        const params = new URLSearchParams();
        params.append("origin", og);
        params.append("destination", dest);
        if (depart_date) params.append("departure_at", depart_date);
        params.append("currency", "usd");
        params.append("direct", "true"); // enforce direct flights

        const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
        const { ok, status, json, text } = await fetchWithToken(url);

        if (!ok) {
          console.error("Adventure Anywhere API error", status, text);
          continue;
        }

        const items = (json && json.data) || [];
        const annotated = items.map((it) => ({ ...it, origin_searched: og }));
        combinedOffers = combinedOffers.concat(annotated);
      }
    }

    // Deduplicate + sort by price
    const best = {};
    combinedOffers.forEach((it) => {
      const key = `${it.origin}_${it.destination}_${it.departure_at || it.departure}`;
      const price = Number(it.price || it.value || 0);
      if (!best[key] || (price && price < best[key].price)) {
        best[key] = { ...it, price: price || (it.price || it.value) };
      }
    });

    const out = Object.values(best).sort((a, b) => (a.price || 0) - (b.price || 0));

    return res.status(200).json({ source: "adventure_anywhere", count: out.length, data: out });
  } catch (err) {
    console.error("flights handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
