// pages/api/flights.js
// Backend proxy for flight data. Supports:
// - Select Destination: origin + destination -> prices_for_dates (per origin if multiple)
// - Adventure Anywhere: origin only -> get_special_offers (per origin if multiple)
// Accepts origin as single IATA (LON) or comma-separated list (LON,MAN,LGW)

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
        // not JSON
      }
      return { ok: r.ok, status: r.status, json, text: txt };
    };

    // If destination provided -> use prices_for_dates for each origin, combine results
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
          // If one origin fails, log and continue
          console.error("Flights API error", status, text);
          continue;
        }

        // smartly merge: many Travelpayouts endpoints return `.data` as array
        const items = (json && json.data) || [];
        combined = combined.concat(items);
      }

      // Deduplicate by destination+departure_at+price heuristics, keep lowest price per destination/time
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

    // No destination -> Adventure Anywhere -> use get_special_offers per origin and combine
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
      // Annotate with originUsed so UI can show which origin produced the deal
      const annotated = items.map((it) => ({ ...it, origin_searched: og }));
      combinedOffers = combinedOffers.concat(annotated);
    }

    // Sort deals by price ascending and return
    combinedOffers.sort((a, b) => (Number(a.price || 0) - Number(b.price || 0)));

    return res.status(200).json({ source: "special_offers", count: combinedOffers.length, data: combinedOffers });
  } catch (err) {
    console.error("flights handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
