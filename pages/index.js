// pages/index.js
import { useRef, useState } from "react";
import AirportInput from "../components/airportinputs";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState(""); // will hold IATA code from AirportInput
  const [destination, setDestination] = useState("");
  const step2Ref = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const depart_date = form.get("depart_date");
    const adults = form.get("adults") || 1;
    const children = form.get("children") || 0;
    const infants = form.get("infants") || 0;

    // origin / destination come from AirportInput state (IATA codes)
    try {
      const qs = new URLSearchParams({
        origin: origin || "",
        destination: destination || "",
        depart_date: depart_date || "",
        adults: adults,
        children: children,
        infants: infants,
      });

      const res = await fetch(`/api/flights?${qs.toString()}`);
      const data = await res.json();
      // Travelpayouts returns results inside data.data (older) or data?.data, so prefer that
      const results = data?.data || data?.result || [];
      setFlights(results);
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlights([]);
    }

    setShowFilters(true);
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/HomePage.jpg')" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white/70 shadow-md">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <nav className="flex items-center space-x-4 text-sm">
          <a href="#">About</a>
          <span>|</span>
          <a href="#">Inspiration</a>
          <span>|</span>
          <div className="flex space-x-2">
            <button title="Instagram">📷</button>
            <button title="Facebook">📘</button>
            <button title="TikTok">🎵</button>
          </div>
        </nav>
      </header>

      {/* Main Search */}
      <main className="flex-grow flex items-center justify-center relative p-6">
        <div className="w-full max-w-xl bg-white/90 p-6 rounded-xl shadow-md z-10">
          <div className="flex mb-4 bg-gray-100 rounded overflow-hidden">
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "adventure" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
              onClick={() => setTab("adventure")}
            >
              ✈️ Adventure Anywhere
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "select" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
              onClick={() => setTab("select")}
            >
              📍 Select Destination
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Airport inputs use our autocomplete component */}
            <AirportInput label="From Airport" value={origin} onChange={setOrigin} />
            {tab === "select" && (
              <AirportInput label="To Airport" value={destination} onChange={setDestination} />
            )}

            <div className="flex gap-2">
              <input name="depart_date" type="date" required className="w-full p-2 border rounded" />
              <input name="return_date" type="date" className="w-full p-2 border rounded" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm">Adults</label>
                <input name="adults" type="number" min="1" defaultValue="1" className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="text-sm">Children</label>
                <input name="children" type="number" min="0" defaultValue="0" className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="text-sm">Infants</label>
                <input name="infants" type="number" min="0" defaultValue="0" className="w-full p-1 border rounded" />
              </div>
            </div>

            <button type="submit" className="bg-green-700 text-white w-full py-2 rounded">Search</button>
          </form>
        </div>

        {/* Inspiration Sidebar */}
        <div className="hidden md:flex flex-col space-y-4 absolute right-4 top-1/2 -translate-y-1/2 w-36 bg-white/60 p-2 rounded-lg">
          <img src="/blog1.jpg" alt="Inspiration 1" className="w-full aspect-square rounded-lg shadow-md" />
          <img src="/blog2.jpg" alt="Inspiration 2" className="w-full aspect-square rounded-lg shadow-md" />
          <img src="/blog3.jpg" alt="Inspiration 3" className="w-full aspect-square rounded-lg shadow-md" />
        </div>
      </main>

      {/* Step 2 Filters + Results */}
      {showFilters && (
        <section ref={step2Ref} className="bg-white py-8 px-4 flex flex-col items-center">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Step 2: Filters</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Departure Start Time</label>
                <input type="time" step="900" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Departure End Time</label>
                <input type="time" step="900" className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>

          {/* Step 3: Results */}
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Step 3: Results</h2>

            {flights && flights.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {flights.map((f, i) => (
                  <div key={i} className="bg-white rounded shadow p-2">
                    <h3 className="font-semibold text-sm">
                      {/* Travelpayouts flight object shape can vary. Try common fields or fallback */}
                      {(f.origin || f.origin_iata || f.origin_code) || "FROM"} → {(f.destination || f.destination_iata || f.destination_code) || "TO"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {/* departure_at or depart_date may be present */}
                      {f.departure_at || f.departure || f.depart_at || ""} — ${f.price || f.value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No results yet. Try searching.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
