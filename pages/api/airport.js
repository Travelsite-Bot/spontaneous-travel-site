// pages/api/airports.js
export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q || q.length < 2) return res.status(200).json([]);

  try {
    const url = `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(q)}&locale=en`;
    const r = await fetch(url);
    const data = await r.json();

    // Prefer airport type but include city fallback
    const airports = (data || [])
      .filter((it) => it.type === "airport")
      .map((a) => ({
        name: a.name,
        code: a.code,
        city: a.city_name || a.country_name || "",
      }));

    if (airports.length > 0) return res.status(200).json(airports);

    // fallback to city matches
    const cities = (data || [])
      .filter((it) => it.type === "city")
      .map((c) => ({
        name: c.name,
        code: c.code || c.name,
        city: c.country_name || "",
      }));

    return res.status(200).json(cities);
  } catch (err) {
    console.error("autocomplete error", err);
    return res.status(500).json([]);
  }
}
