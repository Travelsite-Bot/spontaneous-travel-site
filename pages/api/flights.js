export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json([]);
  }

  try {
    const url = `https://autocomplete.travelpayouts.com/places2?term=${q}&locale=en`;
    const response = await fetch(url);
    const data = await response.json();

    // Simplify results
    const airports = data
      .filter((item) => item.type === "airport")
      .map((a) => ({
        name: a.name,
        code: a.code,
        city: a.city_name,
      }));

    res.status(200).json(airports);
  } catch (error) {
    console.error("Airport search failed", error);
    res.status(500).json({ error: "Failed to fetch airports" });
  }
}
