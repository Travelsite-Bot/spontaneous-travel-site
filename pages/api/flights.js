// pages/api/flights.js
export default async function handler(req, res) {
  try {
    const { origin, destination, depart_date, adults, children, infants } = req.query;

    const API_TOKEN = process.env.TP_API_TOKEN; // set this in Vercel (do NOT commit)
    if (!API_TOKEN) {
      return res.status(500).json({ error: "Missing API token (TP_API_TOKEN)" });
    }

    // Build query params safely
    const params = new URLSearchParams();
    if (origin) params.append("origin", origin);
    if (destination) params.append("destination", destination);
    if (depart_date) params.append("departure_at", depart_date);
    if (adults) params.append("adults", adults);
    if (children) params.append("children", children);
    if (infants) params.append("infants", infants);

    params.append("currency", "usd");

    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "X-Access-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Flights API error:", response.status, text);
      return res.status(response.status).json({ error: "Flights API error", details: text });
    }

    const data = await response.json();
    // Return raw Travelpayouts response (frontend expects data.data but we pass full object)
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in flights API route:", error);
    return res.status(500).json({ error: "Server error fetching flights" });
  }
}
