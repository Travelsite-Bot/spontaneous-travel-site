// pages/index.js
import Head from "next/head";
import { useRef, useState } from "react";
import AirportInput from "../components/AirportInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [oneWay, setOneWay] = useState(true);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directOnly, setDirectOnly] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [timeRange, setTimeRange] = useState([0, 1440]); // minutes
  const stepRef = useRef(null);

  const handleSearch = async (e) => {
    e && e.preventDefault();

    // basic validation
    if (!origin) return alert("Please select a departure airport.");
    if (!departDate) return alert("Please choose a departure date.");

    try {
      const qs = new URLSearchParams({
        origin,
        destination,
        depart_date: departDate.toISOString().split("T")[0],
      });

      const res = await fetch(`/api/flights?${qs.toString()}`);
      const data = await res.json();
      const results = data?.data || [];

      setFlights(results);
      setShowResults(true);
      setTimeout(() => stepRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch (err) {
      console.error("Search error:", err);
      setFlights([]);
      setShowResults(true);
    }
  };

  // Filter & sort on client-side
  function getFilteredSorted() {
    let list = Array.isArray(flights) ? [...flights] : [];

    // Filter by direct
    if (directOnly) {
      list = list.filter((f) => {
        // Travelpayouts/aviasales shape can vary; check route length or number_of_changes
        if (typeof f.number_of_changes === "number") return f.number_of_changes === 0;
        if (Array.isArray(f.route)) return f.route.length <= 1;
        return true;
      });
    }

    // Filter by timeRange (minutes since midnight)
    list = list.filter((f) => {
      const dt = f.departure_at || f.departure || (f?.dTimeUTC ? new Date(f.dTimeUTC * 1000).toISOString() : null);
      if (!dt) return true;
      const d = new Date(dt);
      const mins = d.getHours() * 60 + d.getMinutes();
      return mins >= timeRange[0] && mins <= timeRange[1];
    });

    // Sort
    if (sortBy === "price") {
      list.sort((a, b) => (Number(a.price || a.value || 0) - Number(b.price || b.value || 0)));
    } else if (sortBy === "shortest") {
      list.sort((a, b) => (Number(a.duration || a.fly_duration || a.flight_time || 0) - Number(b.duration || b.fly_duration || b.flight_time || 0)));
    } else if (sortBy === "longest") {
      list.sort((a, b) => (Number(b.duration || b.fly_duration || b.flight_time || 0) - Number(a.duration || a.fly_duration || a.flight_time || 0)));
    }

    return list;
  }

  // helper to format minutes range from inputs
  function handleTimeInputChange(startISO, endISO) {
    // startISO and endISO are "HH:MM" strings
    const [hs, ms] = startISO ? startISO.split(":").map(Number) : [0, 0];
    const [he, me] = endISO ? endISO.split(":").map(Number) : [23, 59];
    setTimeRange([hs * 60 + ms, he * 60 + me]);
  }

  const filtered = getFilteredSorted();

  return (
    <>
      <Head>
        <title>spontaria — find travel by dates</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Pacifico&display=swap" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <div
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{
          backgroundImage: "url('/HomePage.jpg')",
        }}
      >
        {/* HEADER — transparent over background */}
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <div>
            <div className="mb-1">
              <h1
                className="uppercase tracking-wide"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "2.6rem",
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 6px 20px rgba(0,0,0,0.6)",
                  letterSpacing: "0.04em",
                }}
              >
                spontaria
              </h1>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Pacifico, cursive",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "#000",
                  background: "rgba(255,255,255,0.0)",
                }}
              >
                When you have the when, let the where find you
              </p>
            </div>
          </div>

          {/* Nav: Inspiration + socials */}
          <nav className="flex items-center gap-4 text-sm">
            <a href="/inspiration" className="text-white/90 hover:underline">Inspiration</a>
            <a href="#" title="Instagram" className="text-white/90">📷</a>
            <a href="#" title="Facebook" className="text-white/90">📘</a>
            <a href="#" title="TikTok" className="text-white/90">🎵</a>
          </nav>
        </header>

        {/* Search Panel — centered box with slightly transparent backdrop so background image covers whole screen */}
        <main className="flex-grow flex items-start justify-center px-6 pb-12 pt-4">
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="mb-4 flex gap-2">
                  <button
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded ${tab === "adventure" ? "bg-green-700 text-white" : "bg-white/20 text-white"}`}
                    onClick={() => setTab("adventure")}
                  >
                    ✈️ Adventure Anywhere
                  </button>
                  <button
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded ${tab === "select" ? "bg-green-700 text-white" : "bg-white/20 text-white"}`}
                    onClick={() => setTab("select")}
                  >
                    📍 Select Destination
                  </button>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <AirportInput label="From airport" value={origin} onChange={setOrigin} />
                  {tab === "select" && <AirportInput label="To airport" value={destination} onChange={setDestination} />}

                  {/* One-way / Return */}
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 text-white/95">
                      <input type="radio" checked={oneWay} onChange={() => setOneWay(true)} />
                      <span>One-way</span>
                    </label>
                    <label className="flex items-center gap-2 text-white/95">
                      <input type="radio" checked={!oneWay} onChange={() => setOneWay(false)} />
                      <span>Return</span>
                    </label>
                  </div>

                  {/* Datepickers (modern) */}
                  <div className="flex gap-3 mt-2">
                    <DatePicker
                      selected={departDate}
                      onChange={(date) => setDepartDate(date)}
                      placeholderText="Departure date"
                      className="w-full p-2 rounded"
                      dayClassName={() => "datepicker-day"}
                      popperPlacement="bottom-start"
                    />
                    {!oneWay && (
                      <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        placeholderText="Return date"
                        className="w-full p-2 rounded"
                        dayClassName={() => "datepicker-day"}
                        popperPlacement="bottom-start"
                      />
                    )}
                  </div>

                  <div className="flex gap-3 mt-2">
                    <input name="adults" type="number" min="1" defaultValue="1" className="w-1/3 p-2 rounded" placeholder="Adults" />
                    <input name="children" type="number" min="0" defaultValue="0" className="w-1/3 p-2 rounded" placeholder="Children" />
                    <input name="infants" type="number" min="0" defaultValue="0" className="w-1/3 p-2 rounded" placeholder="Infants" />
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="w-full py-3 bg-green-700 text-white rounded font-semibold">Search</button>
                  </div>
                </form>
              </div>

              {/* Right column: quick inspiration card + small help (visible on larger screens) */}
              <aside className="w-80 hidden md:block">
                <div className="bg-white/6 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-white/95 mb-2">Inspiration</h4>
                  <img src="/blog1.jpg" alt="" className="w-full h-36 object-cover rounded mb-2" />
                  <img src="/blog2.jpg" alt="" className="w-full h-36 object-cover rounded mb-2" />
                </div>
              </aside>
            </div>
          </div>
        </main>

        {/* Combined Filters & Results area */}
        {showResults && (
          <section ref={stepRef} className="w-full flex justify-center pb-12 px-6">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left/Center: results */}
              <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-bold mb-3">Your next adventure...</h2>

                {/* Filters toolbar above results for mobile too */}
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={directOnly} onChange={() => setDirectOnly(!directOnly)} />
                      Direct only
                    </label>

                    <div>
                      <label className="mr-2">Sort:</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-1 rounded">
                        <option value="price">Price (lowest)</option>
                        <option value="shortest">Shortest duration</option>
                        <option value="longest">Longest duration</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm">Departure window</label>
                    <input type="time" step="900" onChange={(e) => handleTimeInputChange(e.target.value, (document.querySelector("#endTime")?.value || "23:59"))} className="p-1 rounded" />
                    <input id="endTime" type="time" step="900" onChange={(e) => handleTimeInputChange((document.querySelector("input[type='time']")?.value || "00:00"), e.target.value)} className="p-1 rounded" />
                  </div>
                </div>

                {/* Results list */}
                {filtered.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filtered.map((f, i) => {
                      const price = f.price || f.value || "N/A";
                      const dep = f.departure_at || f.departure || (f?.dTimeUTC ? new Date(f.dTimeUTC * 1000).toLocaleString() : "");
                      const originName = f.origin || f.origin_iata || f.origin_code || "";
                      const destName = f.destination || f.destination_iata || f.destination_code || f.cityTo || f.flyTo || "";
                      const airlines = f.airlines ? (Array.isArray(f.airlines) ? f.airlines.join(", ") : f.airlines) : "";

                      return (
                        <div key={i} className="p-3 border rounded flex gap-3 items-start">
                          <div className="w-28 h-20 bg-gray-100 rounded flex items-center justify-center text-xs">{destName}</div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-semibold">{originName} → {destName}</div>
                                <div className="text-xs text-gray-500">{airlines}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${price}</div>
                                <div className="text-xs text-gray-500">{dep}</div>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {/* optional duration/changes display */}
                              {f.duration || f.fly_duration ? `Duration: ${f.duration || f.fly_duration}` : ""}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No results. Try a different date or airport.</div>
                )}
              </div>

              {/* Right: Filters column */}
              <aside className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold mb-3">Filters</h3>
                <div className="mb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={directOnly} onChange={() => setDirectOnly(!directOnly)} />
                    Direct flights only
                  </label>
                </div>

                <div className="mb-3">
                  <label className="block mb-1">Sort</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded">
                    <option value="price">Price (lowest)</option>
                    <option value="shortest">Shortest</option>
                    <option value="longest">Longest</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Departure window</label>
                  <input type="time" step="900" onChange={(e) => handleTimeInputChange(e.target.value, (document.querySelector("#endTimeSide")?.value || "23:59"))} className="w-full p-2 border rounded mb-2" />
                  <input id="endTimeSide" type="time" step="900" onChange={(e) => handleTimeInputChange((document.querySelector("#startTimeSide")?.value || "00:00"), e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </aside>
            </div>
          </section>
        )}
      </div>

      {/* Global custom styles for datepicker & imprint effect */}
      <style jsx global>{`
        /* datepicker header green and hover day effect */
        .react-datepicker__header {
          background: #166534;
          border-bottom: none;
        }
        .react-datepicker__current-month {
          color: #fff;
          font-weight: 600;
        }
        .react-datepicker__day:hover {
          background: #14532d;
          color: #fff;
          border-radius: 50%;
        }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
          background: #166534 !important;
          color: #fff !important;
        }
        /* small day styling */
        .datepicker-day {
          border-radius: 0.35rem;
        }
        /* make the header text look 'imprinted' (shadow) */
        /* already set inline, but ensure fonts used */
        body { font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
      `}</style>
    </>
  );
}
