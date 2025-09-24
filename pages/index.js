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
  const [timeRange, setTimeRange] = useState([0, 1440]);
  const stepRef = useRef(null);

  const handleSearch = async (e) => {
    e && e.preventDefault();
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

  function getFilteredSorted() {
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
      list.sort((a, b) => (Number(a.price || a.value || 0) - Number(b.price || b.value || 0)));
    } else if (sortBy === "shortest") {
      list.sort(
        (a, b) =>
          Number(a.duration || a.fly_duration || a.flight_time || 0) -
          Number(b.duration || b.fly_duration || b.flight_time || 0)
      );
    } else if (sortBy === "longest") {
      list.sort(
        (a, b) =>
          Number(b.duration || b.fly_duration || b.flight_time || 0) -
          Number(a.duration || a.fly_duration || a.flight_time || 0)
      );
    }
    return list;
  }

  function handleTimeInputChange(startISO, endISO) {
    const [hs, ms] = startISO ? startISO.split(":").map(Number) : [0, 0];
    const [he, me] = endISO ? endISO.split(":").map(Number) : [23, 59];
    setTimeRange([hs * 60 + ms, he * 60 + me]);
  }

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
        {/* HEADER */}
        <header className="w-full px-6 py-6 flex items-center justify-between">
          <div className="ml-[5%] flex flex-col">
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "2.8rem",
                color: "rgba(255,255,255,0.92)",
                textShadow: "1px 1px 2px rgba(0,0,0,0.4), -1px -1px 2px rgba(255,255,255,0.3)",
              }}
            >
              spontaria
            </h1>
            <p
              style={{
                marginLeft: "1.5rem", // 👈 moves slogan slightly to right
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 400,
                fontSize: "1.2rem",
                color: "rgba(0,0,0,0.65)",
              }}
            >
              You have the when, let the where find you...
            </p>
          </div>

          <nav className="flex items-center gap-4 text-sm font-sans">
            <a href="/inspiration" className="text-white/90 hover:underline">
              Inspiration
            </a>
            <a href="#" className="text-white/90">
              📷
            </a>
            <a href="#" className="text-white/90">
              📘
            </a>
            <a href="#" className="text-white/90">
              🎵
            </a>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow flex flex-col md:flex-row justify-center gap-6 px-6 pb-12">
          {/* SEARCH BOX */}
          <div className="flex-1 max-w-3xl bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-black/20">
            {/* Tabs */}
            <div className="mb-4 flex gap-2">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium rounded ${
                  tab === "adventure"
                    ? "bg-green-700 text-white"
                    : "bg-green-200 text-green-900"
                }`}
                onClick={() => setTab("adventure")}
              >
                ✈️ Adventure Anywhere
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium rounded ${
                  tab === "select"
                    ? "bg-green-700 text-white"
                    : "bg-green-200 text-green-900"
                }`}
                onClick={() => setTab("select")}
              >
                📍 Select Destination
              </button>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="space-y-4 font-sans">
              <AirportInput
                placeholder="Departing from"
                value={origin}
                onChange={setOrigin}
              />
              {tab === "select" && (
                <AirportInput
                  placeholder="Arriving to"
                  value={destination}
                  onChange={setDestination}
                />
              )}

              {/* One-way / Return */}
              <div className="flex items-center gap-6 mt-1">
                <button
                  type="button"
                  onClick={() => setOneWay(true)}
                  className={`px-3 py-1 rounded ${
                    oneWay ? "bg-green-700 text-white" : "bg-green-200 text-green-900"
                  }`}
                >
                  One-way
                </button>
                <button
                  type="button"
                  onClick={() => setOneWay(false)}
                  className={`px-3 py-1 rounded ${
                    !oneWay ? "bg-green-700 text-white" : "bg-green-200 text-green-900"
                  }`}
                >
                  Return
                </button>
              </div>

              {/* Dates */}
              <div className="flex gap-3 mt-2">
                <DatePicker
                  selected={departDate}
                  onChange={(date) => setDepartDate(date)}
                  placeholderText="Departure date"
                  className="w-full p-2 rounded border border-black/30"
                />
                {!oneWay && (
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    placeholderText="Return date"
                    className="w-full p-2 rounded border border-black/30"
                  />
                )}
              </div>

              {/* Passenger counts */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <label className="block text-sm mb-1">Adults</label>
                  <input
                    name="adults"
                    type="number"
                    min="1"
                    defaultValue="1"
                    className="w-full p-2 rounded border border-black/30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Children</label>
                  <input
                    name="children"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="w-full p-2 rounded border border-black/30"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Infants</label>
                  <input
                    name="infants"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="w-full p-2 rounded border border-black/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-700 text-white rounded font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          {/* INSPIRATION IMAGES (NO TITLE) */}
          <aside className="w-full md:w-80">
            <div className="bg-white/6 rounded-lg p-4">
              <img
                src="/blog1.jpg"
                alt=""
                className="w-full h-36 object-cover rounded mb-2 border border-black/20"
              />
              <img
                src="/blog2.jpg"
                alt=""
                className="w-full h-36 object-cover rounded border border-black/20"
              />
            </div>
          </aside>
        </main>

        {/* RESULTS */}
        {showResults && (
          <section ref={stepRef} className="w-full flex justify-center pb-12 px-6">
            <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-4 font-sans">
              <h2 className="text-lg font-bold mb-3">Your next adventure...</h2>

              {/* Filters */}
              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={() => setDirectOnly(!directOnly)}
                  />
                  Direct only
                </label>
                <div>
                  <label className="mr-2">Sort:</label>
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
                <div className="flex items-center gap-2">
                  <label className="text-sm">Departure window</label>
                  <input
                    type="time"
                    step="900"
                    onChange={(e) =>
                      handleTimeInputChange(
                        e.target.value,
                        document.querySelector("#endTime")?.value || "23:59"
                      )
                    }
                    className="p-1 rounded border"
                  />
                  <input
                    id="endTime"
                    type="time"
                    step="900"
                    onChange={(e) =>
                      handleTimeInputChange(
                        document.querySelector("input[type='time']")?.value || "00:00",
                        e.target.value
                      )
                    }
                    className="p-1 rounded border"
                  />
                </div>
              </div>

              {/* Results list */}
              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filtered.map((f, i) => {
                    const price = f.price || f.value || "N/A";
                    const dep =
                      f.departure_at ||
                      f.departure ||
                      (f?.dTimeUTC
                        ? new Date(f.dTimeUTC * 1000).toLocaleString()
                        : "");
                    const originName =
                      f.origin || f.origin_iata || f.origin_code || "";
                    const destName =
                      f.destination ||
                      f.destination_iata ||
                      f.destination_code ||
                      f.cityTo ||
                      f.flyTo ||
                      "";
                    const airlines = f.airlines
                      ? Array.isArray(f.airlines)
                        ? f.airlines.join(", ")
                        : f.airlines
                      : "";

                    return (
                      <div key={i} className="p-3 border rounded flex gap-3 items-start">
                        <div className="w-28 h-20 bg-gray-100 rounded flex items-center justify-center text-xs">
                          {destName}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">
                                {originName} → {destName}
                              </div>
                              <div className="text-xs text-gray-500">{airlines}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${price}</div>
                              <div className="text-xs text-gray-500">{dep}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {f.duration || f.fly_duration
                              ? `Duration: ${f.duration || f.fly_duration}`
                              : ""}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
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
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: #166534 !important;
          color: #fff !important;
        }
      `}</style>
    </>
  );
}
