// pages/index.js
import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import AirportInput from "../components/AirportInput";
import PassengerSelect from "../components/PassengerSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function formatDDMM(date) {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatTime(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Basic airline code → name map (extend as needed)
const airlines = {
  BA: "British Airways",
  EZY: "easyJet",
  FR: "Ryanair",
  KL: "KLM",
  LH: "Lufthansa",
  AF: "Air France",
  W6: "Wizz Air",
};

function getTimeOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 15, 30, 45]) {
      const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      opts.push(label);
    }
  }
  return opts;
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [tab, setTab] = useState("adventure");
  const [flights, setFlights] = useState([]);
  const [oneWay, setOneWay] = useState(true);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [origins, setOrigins] = useState([]);
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [currency, setCurrency] = useState("usd");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const stepRef = useRef(null);

  const images = ["/blog1.jpg", "/blog2.jpg", "/blog3.jpg", "/blog4.jpg"];
  const timeOptions = getTimeOptions();

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
      params.append("currency", currency);

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

  // auto-scroll slider
  const sliderRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 250, behavior: "smooth" });
        if (
          sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // filter flights by time
  const filteredFlights = flights.filter((f) => {
    if (!timeStart && !timeEnd) return true;
    const depHour = new Date(f.departure_at).getHours();
    const depMin = new Date(f.departure_at).getMinutes();
    const dep = depHour * 60 + depMin;

    const parseHM = (str) => {
      const [h, m] = str.split(":").map(Number);
      return h * 60 + m;
    };

    if (timeStart && dep < parseHM(timeStart)) return false;
    if (timeEnd && dep > parseHM(timeEnd)) return false;
    return true;
  });

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
          <div>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "2.6rem",
                color: "#C0C0C0", // silver pastel
              }}
            >
              spontaria
            </h1>
            <div
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.1rem",
                marginTop: "4px",
                marginLeft: "12px",
                color: "darkgrey",
              }}
            >
              You have the when, let the where find you...
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

        {/* search */}
        <main className="flex-grow flex flex-col items-center px-6 pb-12">
          <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg" style={{ border: "1px solid rgba(0,0,0,0.06)" }}>
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

            {/* inputs */}
            <form onSubmit={handleSearch} className="space-y-3">
              <AirportInput
                label="Departing Airport(s)"
                placeholder="Departing Airport(s)"
                value={tab === "adventure" ? origins : origins[0] || ""}
                onChange={(v) => {
                  if (tab === "adventure") {
                    setOrigins(Array.isArray(v) ? v : [v].filter(Boolean));
                  } else {
                    setOrigins(v ? [v] : []);
                  }
                }}
                multiple={tab === "adventure"}
              />

              {tab === "select" && (
                <AirportInput
                  label="Arriving to"
                  placeholder="Arriving to"
                  value={destination}
                  onChange={(v) => setDestination(v)}
                  multiple={false}
                />
              )}

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setOneWay(true)} className={`px-3 py-1 rounded ${oneWay ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}>One-way</button>
                <button type="button" onClick={() => setOneWay(false)} className={`px-3 py-1 rounded ${!oneWay ? "bg-green-700 text-white" : "bg-green-100 text-green-900"}`}>Return</button>
              </div>

              <div className="flex gap-2">
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
                <PassengerSelect value={passengers} onChange={setPassengers} />
              </div>

              <div>
                <button type="submit" className="w-full py-3 bg-green-700 text-white rounded font-semibold">Search</button>
              </div>
            </form>
          </div>

          {/* slider */}
          <div ref={sliderRef} className="mt-8 flex gap-3 max-w-5xl overflow-x-auto scrollbar-hide">
            {images.map((src, i) => (
              <img key={i} src={src} alt="" className="h-48 w-80 object-cover rounded shadow flex-shrink-0" />
            ))}
          </div>
        </main>

        {/* results */}
        {showResults && (
          <section ref={stepRef} className="w-full flex justify-center pb-12 px-6">
            <div className="w-full max-w-6xl bg-white/95 rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-bold mb-3">Your next adventure...</h2>

              {/* filter bar */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="usd">USD</option>
                  <option value="gbp">GBP</option>
                  <option value="eur">EUR</option>
                </select>

                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    setFlights((prev) => {
                      const sorted = [...prev];
                      if (val === "price_low") sorted.sort((a, b) => a.price - b.price);
                      if (val === "price_high") sorted.sort((a, b) => b.price - a.price);
                      if (val === "date") sorted.sort((a, b) => new Date(a.departure_at) - new Date(b.departure_at));
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

                {/* time range filter */}
                <div className="flex items-center gap-1">
                  <label>From:</label>
                  <select value={timeStart} onChange={(e) => setTimeStart(e.target.value)} className="border rounded p-1">
                    <option value="">Any</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <label>To:</label>
                  <select value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} className="border rounded p-1">
                    <option value="">Any</option>
                    {timeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* flights */}
              {filteredFlights.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredFlights.map((f, i) => (
                    <div key={i} className="p-3 border rounded flex gap-3 items-start bg-white/98">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-semibold">
                              {f.origin} → {f.destination}
                            </div>
                            <div className="text-xs text-gray-500">
                              {airlines[f.airline] || f.airline || "Unknown airline"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(f.departure_at)} → {formatTime(f.return_at || f.arrival_at)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDuration(f.duration)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {currency.toUpperCase()} {f.price}
                            </div>
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
                  No results. Try a different date or airport.
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
