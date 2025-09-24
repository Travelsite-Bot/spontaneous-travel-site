import { useRef, useState } from "react";
import AirportInput from "../components/AirportInput"; // ✅ fixed filename
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [oneWay, setOneWay] = useState(true);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const step2Ref = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/flights?origin=${origin}&destination=${destination}&depart_date=${
          departDate?.toISOString().split("T")[0]
        }`
      );
      const data = await res.json();
      let results = data.data || [];

      if (directOnly) {
        results = results.filter((f) => f.number_of_changes === 0);
      }

      if (sortBy === "price") {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === "shortest") {
        results.sort((a, b) => a.duration - b.duration);
      } else if (sortBy === "longest") {
        results.sort((a, b) => b.duration - a.duration);
      }

      setFlights(results);
    } catch (err) {
      console.error("Error fetching flights", err);
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
      <header className="flex flex-col items-start p-4 bg-white/70 shadow-md">
        <h1 className="text-2xl font-light text-gray-400 lowercase">spontaria</h1>
        <p className="italic text-black text-sm mt-1">
          When you have the dates, let the adventure find you...
        </p>
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
            {/* Airport inputs */}
            <AirportInput
              label="From airport"
              value={origin}
              onChange={(val) => setOrigin(val)}
            />
            {tab === "select" && (
              <AirportInput
                label="To airport"
                value={destination}
                onChange={(val) => setDestination(val)}
              />
            )}

            {/* One way / return toggle */}
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={oneWay}
                  onChange={() => setOneWay(true)}
                />
                One-way
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={!oneWay}
                  onChange={() => setOneWay(false)}
                />
                Return
              </label>
            </div>

            {/* Date pickers */}
            <div className="flex gap-2">
              <DatePicker
                selected={departDate}
                onChange={(date) => setDepartDate(date)}
                placeholderText="Departure date"
                className="w-full p-2 border rounded"
              />
              {!oneWay && (
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  placeholderText="Return date"
                  className="w-full p-2 border rounded"
                />
              )}
            </div>

            {/* Passengers */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm">Adults</label>
                <input
                  name="adults"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="text-sm">Children</label>
                <input
                  name="children"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="w-full p-1 border rounded"
                />
              </div>
              <div>
                <label className="text-sm">Infants</label>
                <input
                  name="infants"
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="w-full p-1 border rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white w-full py-2 rounded"
            >
              Search
            </button>
          </form>
        </div>

        {/* Inspiration Sidebar */}
        <div className="hidden md:flex flex-col space-y-4 absolute right-4 top-1/2 -translate-y-1/2 w-36 bg-white/60 p-2 rounded-lg">
          <img
            src="/blog1.jpg"
            alt="Inspiration 1"
            className="w-full aspect-square rounded-lg shadow-md"
          />
          <img
            src="/blog2.jpg"
            alt="Inspiration 2"
            className="w-full aspect-square rounded-lg shadow-md"
          />
          <img
            src="/blog3.jpg"
            alt="Inspiration 3"
            className="w-full aspect-square rounded-lg shadow-md"
          />
        </div>
      </main>

      {/* Step 2 Filters + Results */}
      {showFilters && (
        <section
          ref={step2Ref}
          className="bg-white py-8 px-4 flex flex-col items-center"
        >
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-700">Step 2: Filters</h2>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={() => setDirectOnly(!directOnly)}
                />
                Direct flights only
              </label>

              <div>
                <label className="mr-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="price">Price (lowest)</option>
                  <option value="shortest">Shortest duration</option>
                  <option value="longest">Longest duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Results */}
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Step 3: Results</h2>
            {flights.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {flights.map((f, i) => (
                  <div key={i} className="bg-white rounded shadow p-2">
                    <h3 className="font-semibold text-sm">
                      {f.origin} → {f.destination}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {f.departure_at} — ${f.price}
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
