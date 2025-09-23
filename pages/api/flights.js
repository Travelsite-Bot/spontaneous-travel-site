export default async function handler(req, res) {
  const { origin, destination, depart_date } = req.query;

  const API_TOKEN = process.env.TP_API_TOKEN; // ✅ from Vercel env var

  if (!API_TOKEN) {
    return res.status(500).json({ error: "Missing API token" });
  }

  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${depart_date}&currency=usd`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Access-Token": API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Flights fetch failed", error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
}
