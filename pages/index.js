import { useRef, useState } from "react";
import AirportInput from "../components/AirportInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [oneWay, setOneWay] = useState(true);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [showResults, setShowResults] = useState(false);
  const stepRef = useRef(null);

  // helper for dd/mm/yyyy formatting
  const formatDDMM = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!origin) return;

    try {
      const res = await fetch(
        `/api/flights?origin=${origin}&destination=${destination}&depart_date=${
          departDate ? departDate.toISOString().split("T")[0] : ""
        }`
      );
      const data = await res.json();
      setFlights(data.data || []);
    } catch (err) {
      console.error("Error fetching flights", err);
      setFlights([]);
    }

    setShowResults(true);
    setTimeout(() => {
      stepRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/HomePage.jpg')" }}
    >
      {/* Header */}
      <header className="flex flex-col items-start p-6">
        <h1 className="text-3xl font-bold text-gray-400 lowercase tracking-wide">
          spontaria
        </h1>
        <p className="italic text-gray-700 mt-1 ml-2 text-base">
          You have the when, let the where find you...
        </p>
      </header>

      {/* Main Search */}
      <main className="flex-grow flex items-center justify-center relative p-6">
        <div className="w-full max-w-xl bg-white/90 p-6 rounded-xl shadow-md z-10">
          {/* Adventure / Select Tabs */}
          <div className="flex mb-4 rounded overflow-hidden">
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "adventure"
                  ? "bg-green-700 text-white"
                  : "bg-green-200 text-gray-700"
              }`}
              onClick={() => setTab("adventure")}
            >
              ✈️ Adventure Anywhere
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "select"
                  ? "bg-green-700 text-white"
                  : "bg-green-200 text-gray-700"
              }`}
              onClick={() => setTab("select")}
            >
              📍 Select Destination
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <AirportInput
              label="Departing Airport(s)"
              value={origin}
              onChange={(val) => setOrigin(val)}
            />
            {tab === "select" && (
              <AirportInput
                label="Destination Airport"
                value={destination}
                onChange={(val) => setDestination(val)}
              />
            )}

            {/* One way / return */}
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={() => setOneWay(true)}
                className={`px-3 py-1 rounded ${
                  oneWay ? "bg-green-700 text-white" : "bg-green-200"
                }`}
              >
                One-way
              </button>
              <button
                type="button"
                onClick={() => setOneWay(false)}
                className={`px-3 py-1 rounded ${
                  !oneWay ? "bg-green-700 text-white" : "bg-green-200"
                }`}
              >
                Return
              </button>
            </div>

            {/* Dates + Passengers */}
            <div className="flex gap-2">
              <DatePicker
                selected={departDate}
                onChange={(date) => setDepartDate(date)}
                placeholderText="Departure date"
                dateFormat="dd/MM/yyyy"
                className="w-full p-2 border rounded"
              />
              {!oneWay && (
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  placeholderText="Return date"
                  dateFormat="dd/MM/yyyy"
                  className="w-full p-2 border rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">Passengers</label>
              <select className="w-full p-2 border rounded">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>Adults + Children</option>
                <option>Adults + Infants</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white w-full py-2 rounded"
            >
              Search
            </button>
          </form>
        </div>
      </main>

      {/* Inspiration slider */}
      <section className="w-full flex justify-center py-6">
        <div className="flex gap-4 overflow-x-auto w-full max-w-4xl px-4">
          {["/blog1.jpg", "/blog2.jpg", "/blog3.jpg"].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Inspiration ${i + 1}`}
              className="w-72 h-48 object-cover rounded-lg shadow-md flex-shrink-0"
            />
          ))}
        </div>
      </section>

      {/* Results */}
      {showResults && (
        <section ref={stepRef} className="w-full flex justify-center pb-12 px-6">
          <div className="w-full max-w-6xl bg-white/95 rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold mb-3">Your next adventure...</h2>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlights((prev) => prev.filter((f) => f.direct));
                    } else {
                      handleSearch();
                    }
                  }}
                />
                Direct only
              </label>

              <select
                onChange={(e) => {
                  const val = e.target.value;
                  setFlights((prev) => {
                    const sorted = [...prev];
                    if (val === "price_low") sorted.sort((a, b) => a.price - b.price);
                    if (val === "price_high") sorted.sort((a, b) => b.price - a.price);
                    if (val === "date")
                      sorted.sort(
                        (a, b) =>
                          new Date(a.departure_at) - new Date(b.departure_at)
                      );
                    return sorted;
                  });
                }}
                className="border rounded p-1"
              >
                <option value="">Sort by</option>
                <option value="price_low">Price (Low → High)</option>
                <option value="price_high">Price (High → Low)</option>
                <option value="date">Earliest Departures</option>
              </select>

              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return handleSearch();
                  setFlights((prev) =>
                    prev.filter((f) => {
                      const hour = new Date(f.departure_at).getHours();
                      if (val === "morning") return hour < 12;
                      if (val === "afternoon") return hour >= 12 && hour < 18;
                      if (val === "evening") return hour >= 18;
                      return true;
                    })
                  );
                }}
                className="border rounded p-1"
              >
                <option value="">Departure time</option>
                <option value="morning">Morning (0–12h)</option>
                <option value="afternoon">Afternoon (12–18h)</option>
                <option value="evening">Evening (18h+)</option>
              </select>
            </div>

            {/* Flights */}
            {flights.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {flights.map((f, i) => (
                  <div
                    key={i}
                    className="p-3 border rounded flex gap-3 items-start bg-white/98"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold">
                            {f.origin} → {f.destination}
                          </div>
                          {!f.direct && (
                            <div className="text-xs text-gray-500">1+ stops</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${f.price}</div>
                          <div className="text-xs text-gray-500">
                            {f.departure_at ? formatDDMM(f.departure_at) : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No results found.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
