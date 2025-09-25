// pages/index.js
import Head from "next/head";
import { useRef, useState } from "react";
import AirportInput from "../components/AirportInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// helper to format date display (dd/mm/yyyy)
function formatDDMM(date) {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [oneWay, setOneWay] = useState(true);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // origin can be string (single) or array (multiple) depending on mode
  const [origins, setOrigins] = useState([]); // use array for multi select
  const [destination, setDestination] = useState("");

  const [directOnly, setDirectOnly] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [timeRange, setTimeRange] = useState([0, 1440]);
  const stepRef = useRef(null);

  // slider images
  const images = ["/blog1.jpg", "/blog2.jpg", "/blog3.jpg"];
  const [slideIdx, setSlideIdx] = useState(0);

  const handlePrev = () => setSlideIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setSlideIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  // Build origin param for backend (comma separated)
  const originParam = Array.isArray(origins) ? origins.join(",") : origins || "";

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (!originParam) return alert("Please select at least one departure airport.");
    if (!departDate) return alert("Please choose a departure date.");

    try {
      const params = new URLSearchParams();
      params.append("origin", originParam);
      if (destination) params.append("destination", destination);
      params.append("depart_date", departDate.toISOString().split("T")[0]);

      const res = await fetch(`/api/flights?${params.toString()}`);
      const data = await res.json();
      setFlights(data.data || []);
      setShowResults(true);
      setTimeout(() => stepRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch (err) {
      console.error("Search error:", err);
      setFlights([]);
      setShowResults(true);
    }
  };

  // Client filtering + sorting
  const getFilteredSorted = () => {
    let list = Array.isArray(flights) ? [...flights] : [];
    if (directOnly) {
      list = list.filter((f) => {
        if (typeof f.number_of_changes === "number") return f.number_of_changes === 0;
        if (Array.isArray(f.route)) return f.route.length <= 1;
        return true;
      });
    }

    list = list.filter((f) => {
      const dt =
        f.departure_at ||
        f.departure ||
        (f?.dTimeUTC ? new Date(f.dTimeUTC * 1000).toISOString() : null);
      if (!dt) return true;
      const d = new Date(dt);
      const mins = d.getHours() * 60 + d.getMinutes();
      return mins >= timeRange[0] && mins <= timeRange[1];
    });

    if (sortBy === "price") {
      list.sort((a, b) => (Number(a.price || 0) - Number(b.price || 0)));
    } else if (sortBy === "shortest") {
      list.sort((a, b) => (Number(a.duration || 0) - Number(b.duration || 0)));
    } else if (sortBy === "longest") {
      list.sort((a, b) => (Number(b.duration || 0) - Number(a.duration || 0)));
    }

    return list;
  };

  const filtered = getFilteredSorted();

  return (
    <>
      <Head>
        <title>spontaria — find travel by dates</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Dancing+Script:wght@400;600&display=swap"
        />
      </Head>

      <div
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/HomePage.jpg')" }}
      >
        {/* header */}
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <div>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "2.6rem",
                  color: "rgba(255,255,255,0.85)", // slightly dimmer
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                spontaria
              </h1>
            </div>

            {/* paper airplane SVG with route-text */}
            <div style={{ marginTop: 6 }}>
              <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <path id="route" d="M4 20 C40 0, 90 40, 160 12" />
                </defs>
                <text fontFamily="'Dancing Script', cursive" fontSize="14" fill="rgba(0,0,0,0.65)">
                  <textPath href="#route" startOffset="0">You have the when, let the where find you...</textPath>
                </text>
                <!-- Simple paper airplane -->
                <g transform="translate(168, -2)">
                  <path d="M0 20 L16 10 L12 20 L16 30 Z" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.12)" />
                </g>
              </svg>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-sm font-sans">
            <a href="/inspiration" className="text-white/90 hover:underline" style={{ fontFamily: "Inter, sans-serif" }}>
              Inspiration
            </a>
            <a href="#" className="text-white/90">📷</a>
            <a href="#" className="text-white/90">📘</a>
            <a href="#" className="text-white/90">🎵</a>
          </nav>
        </header>

        {/* search area centered */}
        <main className="flex-grow flex flex-col items-center px-6 pb-12">
          <div className="w-full max-w-3xl bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-lg" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
            {/* tabs */}
            <div className="mb-3 flex gap-2">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium rounded ${tab === "adventure" ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}
                onClick={() => { setTab("adventure"); setOrigins([]); setDestination(""); }}
              >
                ✈️ Adventure Anywhere
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium rounded ${tab === "select" ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}
                onClick={() => { setTab("select"); setOrigins([]); setDestination(""); }}
              >
                📍 Select Destination
              </button>
            </div>

            {/* inputs: one-line for one-way/return + dates */}
            <form onSubmit={handleSearch} className="space-y-3">
              {/* airports: multi when adventure, single when select */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <AirportInput
                    label="Departing from"
                    placeholder={tab === "adventure" ? "Type one or more airports (e.g. LON)" : "Departing from"}
                    value={tab === "adventure" ? origins : origins[0] || ""}
                    onChange={(v) => {
                      // AirportInput returns arrays when multiple=true
                      if (tab === "adventure") {
                        // v is array of codes (AirportInput ensures)
                        setOrigins(Array.isArray(v) ? v : [v].filter(Boolean));
                      } else {
                        // single mode
                        setOrigins(v ? [v] : []);
                      }
                    }}
                    multiple={tab === "adventure"}
                  />
                </div>

                {tab === "select" && (
                  <div className="w-48">
                    <AirportInput
                      label="Arriving to"
                      placeholder="Arriving to"
                      value={destination}
                      onChange={(v) => setDestination(v)}
                      multiple={false}
                    />
                  </div>
                )}
              </div>

              {/* one line: one-way/return + dates */}
              <div className="flex gap-3 items-center">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setOneWay(true)} className={`px-3 py-1 rounded ${oneWay ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}>One-way</button>
                  <button type="button" onClick={() => setOneWay(false)} className={`px-3 py-1 rounded ${!oneWay ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}>Return</button>
                </div>

                <div style={{ flex: 1 }} className="flex gap-2">
                  <DatePicker
                    selected={departDate}
                    onChange={(date) => setDepartDate(date)}
                    placeholderText="Departure date"
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-2 rounded border border-black/10 bg-white/90"
                  />

                  {!oneWay && (
                    <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      placeholderText="Return date"
                      dateFormat="dd/MM/yyyy"
                      className="w-full p-2 rounded border border-black/10 bg-white/90"
                    />
                  )}
                </div>

                <div style={{ width: 120 }}>
                  <div className="text-sm mb-1">Passengers</div>
                  <div className="flex gap-2">
                    <input name="adults" type="number" min="1" defaultValue="1" className="w-1/3 p-2 rounded border border-black/10" />
                    <input name="children" type="number" min="0" defaultValue="0" className="w-1/3 p-2 rounded border border-black/10" />
                    <input name="infants" type="number" min="0" defaultValue="0" className="w-1/3 p-2 rounded border border-black/10" />
                  </div>
                </div>
              </div>

              {/* image slider under search */}
              <div className="mt-4 relative">
                <div className="h-40 rounded overflow-hidden">
                  <img src={images[slideIdx]} alt="" className="w-full h-40 object-cover rounded" />
                </div>
                <button type="button" onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded p-1">‹</button>
                <button type="button" onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded p-1">›</button>
              </div>

              <div className="mt-4">
                <button type="submit" className="w-full py-3 bg-green-700 text-white rounded font-semibold">Search</button>
              </div>
            </form>
          </div>
        </main>

        {/* results area */}
        {showResults && (
          <section ref={stepRef} className="w-full flex justify-center pb-12 px-6">
            <div className="w-full max-w-6xl bg-white/95 rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3">Your next adventure...</h2>

              {/* filters under heading */}
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
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

                <div className="flex items-center gap-2">
                  <label className="text-sm">Departure window</label>
                  <input type="time" step="900" onChange={(e) => {
                    handleTimeInputChange(e.target.value, document.querySelector("#endTime")?.value || "23:59");
                  }} className="p-1 rounded border" />
                  <input id="endTime" type="time" step="900" onChange={(e) => {
                    handleTimeInputChange(document.querySelector("input[type='time']")?.value || "00:00", e.target.value);
                  }} className="p-1 rounded border" />
                </div>
              </div>

              {/* results list */}
              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map((f, i) => {
                    const price = f.price || f.value || "N/A";
                    const dep = f.departure_at || f.departure || (f?.dTimeUTC ? new Date(f.dTimeUTC * 1000).toLocaleString() : "");
                    const originName = f.origin || f.origin_iata || f.origin_code || f.origin_searched || "";
                    const destName = f.destination || f.destination_iata || f.destination_code || f.cityTo || f.flyTo || "";
                    const airlines = f.airlines ? (Array.isArray(f.airlines) ? f.airlines.join(", ") : f.airlines) : "";

                    return (
                      <div key={i} className="p-3 border rounded flex gap-3 items-start bg-white/98">
                        <div className="w-28 h-20 bg-gray-100 rounded flex items-center justify-center text-xs">
                          {destName}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">{originName} → {destName}</div>
                              <div className="text-xs text-gray-500">{airlines}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${price}</div>
                              <div className="text-xs text-gray-500">{dep ? formatDDMM(dep) : ""}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {f.duration ? `Duration: ${f.duration}` : ""}
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
          </section>
        )}
      </div>

      <style jsx global>{`
        body { font-family: 'Inter', sans-serif; }
        .react-datepicker__header { background: #166534; border-bottom: none; }
        .react-datepicker__current-month { color: #fff; font-weight: 600; }
        .react-datepicker__day:hover { background: #14532d; color: #fff; border-radius: 50%; }
        .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background: #166534 !important; color: #fff !important; }
      `}</style>
    </>
  );
}
