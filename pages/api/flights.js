// pages/api/flights.js
export default async function handler(req, res) {
  try {
    const { origin, destination, depart_date } = req.query;

    const API_TOKEN = process.env.TP_API_TOKEN;
    if (!API_TOKEN) {
      return res.status(500).json({ error: "Missing TP_API_TOKEN env var" });
    }

    const params = new URLSearchParams();
    if (origin) params.append("origin", origin);
    if (destination) params.append("destination", destination);
    if (depart_date) params.append("departure_at", depart_date);
    params.append("currency", "usd");

    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-Access-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Flights API error", response.status, txt);
      return res.status(response.status).json({ error: "Flights API returned an error", details: txt });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("flights handler error", err);
    return res.status(500).json({ error: "Server error" });
  }
}
