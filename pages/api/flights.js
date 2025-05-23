export default async function handler(req, res) {
  const { origin, destination, depart_date } = req.query;

  const API_TOKEN = "c0288af3180b67c1066ef7861aaeeb33";

  const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${depart_date}&currency=usd`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Access-Token": API_TOKEN,
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
}
