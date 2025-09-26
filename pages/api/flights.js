// pages/api/flights.js
// Normalizes Travelpayouts responses so the frontend can show full names, arrival times, duration, booking links, etc.
// Enforces direct=true at request time if requested earlier in the project.
//
// Requires env var TP_API_TOKEN set in Vercel (or .env.local for local dev).

export default async function handler(req, res) {
  try {
    const { origin = "", destination = "", depart_date } = req.query;

    const API_TOKEN = process.env.TP_API_TOKEN;
    if (!API_TOKEN) {
      console.error("Missing TP_API_TOKEN env var");
      return res.status(500).json({ error: "Missing TP_API_TOKEN env var" });
    }

    const origins = origin
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (origins.length === 0) {
      return res.status(400).json({ error: "At least one origin required" });
    }

    // Helper that fetches with token and returns parsed JSON (if any)
    const fetchWithToken = async (url) => {
      const r = await fetch(url, {
        headers: { "X-Access-Token": API_TOKEN },
      });
      const txt = await r.text();
      let json = null;
      try {
        json = JSON.parse(txt);
      } catch (e) {
        console.error("Non-JSON response from Travelpayouts:", txt.slice(0, 200));
      }
      return { ok: r.ok, status: r.status, json, text: txt };
    };

    // Helper: normalize a single item from TP into the shape frontend expects
    const normalizeItem = (it) => {
      // Some common fields TP may use:
      // - origin / origin_name, destination / destination_name
      // - departure_at, departure, depart_date
      // - arrival_at, arrival, return_at
      // - price or value
      // - duration (minutes)
      // - airline (IATA code)
      // - link / booking_token / deeplink

      const origin_code = it.origin || it.from || it.origin_iata || "";
      const origin_name = it.origin_name || it.origin_full_name || it.from_name || it.from_name_full || it.city_from || it.city_name || origin_code;

      const destination_code = it.destination || it.to || it.destination_iata || "";
      const destination_name = it.destination_name || it.destination_full_name || it.to_name || it.city_to || it.city_name_to || destination_code;

      const departure_at =
        it.departure_at || it.departure || it.time_from || it.depart_date || null;
      // arrival: try several common names
      const arrival_at = it.arrival_at || it.arrival || it.arrival_time || it.return_at || null;

      const price = Number(it.price || it.value || it.amount || 0);

      const duration = Number(it.duration || it.flight_time || it.total_duration || 0);

      const airline_code = it.airline || it.airline_code || it.carrier || it.operating_airline || "";
      // Small built-in map for common carriers; extend this map as needed
      const airlineMap = {
        BA: "British Airways",
        EZY: "easyJet",
        FR: "Ryanair",
        KL: "KLM",
        LH: "Lufthansa",
        AF: "Air France",
        W6: "Wizz Air",
        VY: "Vueling",
        IB: "Iberia",
        SU: "Aeroflot",
        TK: "Turkish Airlines",
        // add more codes as you see them in logs
      };
      const airline_name = airlineMap[airline_code] || it.airline_name || it.airline_full || airline_code || "Unknown";

      // Booking link: TP often returns link / deeplink / link_target
      const booking_link = it.link || it.deep_link || it.booking_link || it.booking_url || it.url || null;

      // Also expose whether the itinerary is direct (0 transfers)
      const direct = typeof it.transfers !== "undefined" ? (Number(it.transfers) === 0) : (it.direct === true || it.stops === 0);

      return {
        origin: origin_code,
        origin_name,
        destination: destination_code,
        destination_name,
        departure_at,
        arrival_at,
        price,
        duration,
        airline_code,
        airline_name,
        direct,
        booking_link,
        raw: it, // keep raw for debugging if needed
      };
    };

    // If destination specified -> use prices_for_dates (one origin may be multiple)
    if (destination) {
      let combined = [];
      for (const og of origins) {
        const params = new URLSearchParams();
        params.append("origin", og);
        params.append("destination", destination);
        if (depart_date) params.append("departure_at", depart_date);
        params.append("currency", "usd");
        params.append("direct", "true"); // enforce direct-only (per your request)

        const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
        const { ok, status, json, text } = await fetchWithToken(url);

        if (!ok) {
          console.error("prices_for_dates error", status, text && text.slice(0, 200));
          continue;
        }

        const items = (json && json.data) || [];
        combined = combined.concat(items.map(normalizeItem));
      }

      // Deduplicate similar flights (by origin/destination/departure)
      const bucket = {};
      combined.forEach((it) => {
        const key = `${it.origin}_${it.destination}_${it.departure_at}`;
        if (!bucket[key] || (it.price && it.price < bucket[key].price)) {
          bucket[key] = it;
        }
      });

      const out = Object.values(bucket);
      return res.status(200).json({ source: "prices_for_dates", count: out.length, data: out });
    }

    // No destination -> Adventure Anywhere: query a curated list of destinations using prices_for_dates
    const adventureDestinations = [
      "BCN", "LIS", "AMS", "ROM", "ATH", "PAR", "BER", "MAD", "DUB", "VIE", "PRG", "BUD", "CPH"
      // extend later if needed
    ];

    let combinedOffers = [];
    for (const og of origins) {
      for (const dest of adventureDestinations) {
        if (dest === og) continue;
        const params = new URLSearchParams();
        params.append("origin", og);
        params.append("destination", dest);
        if (depart_date) params.append("departure_at", depart_date);
        params.append("currency", "usd");
        params.append("direct", "true"); // direct-only

        const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;
        const { ok, status, json, text } = await fetchWithToken(url);

        if (!ok) {
          console.error("adventure prices_for_dates error", status, text && text.slice(0, 200));
          continue;
        }

        const items = (json && json.data) || [];
        combinedOffers = combinedOffers.concat(items.map(normalizeItem));
      }
    }

    // Deduplicate + sort by price ascending
    const best = {};
    combinedOffers.forEach((it) => {
      const key = `${it.origin}_${it.destination}_${it.departure_at}`;
      if (!best[key] || (it.price && it.price < best[key].price)) {
        best[key] = it;
      }
    });

    const out = Object.values(best).sort((a, b) => (a.price || 0) - (b.price || 0));
    return res.status(200).json({ source: "adventure_anywhere", count: out.length, data: out });
  } catch (err) {
    console.error("flights handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
