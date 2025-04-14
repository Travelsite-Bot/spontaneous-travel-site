import { useState } from "react";

const airports = [
  { code: "LGW", name: "London Gatwick" },
  { code: "LHR", name: "London Heathrow" },
  { code: "STN", name: "London Stansted" },
  { code: "CDG", name: "Paris Charles de Gaulle" },
  { code: "JFK", name: "New York JFK" },
  { code: "AMS", name: "Amsterdam Schiphol" },
  { code: "FRA", name: "Frankfurt" },
  { code: "BCN", name: "Barcelona El Prat" },
  { code: "DUB", name: "Dublin" },
  // Add more as needed
];

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const elevenMonthsLater = new Date(
    new Date().setMonth(new Date().getMonth() + 11)
  )
    .toISOString()
    .split("T")[0];

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const filterAirports = (query) =>
    airports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.code.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#edf5ee] to-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <img
          src="/HomePage.jpg"
          alt="Backpacker Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Where will you end up next?
          </h1>
          <p className="text-lg md:text-xl max-w-xl">
            Search anywhere. Leave anytime. Let spontaneity guide you.
          </p>
        </div>
      </section>

      {/* Search Box Section */}
      <section className="w-full bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto bg-[#f1f5f2] rounded-2xl shadow-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Start your adventure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="text"
                placeholder="e.g. London"
                className="w-full rounded-lg border border-gray-300 p-2"
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
              />
              {fromQuery && (
                <ul className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-md w-full max-h-40 overflow-y-auto">
                  {filterAirports(fromQuery).map((airport) => (
                    <li
                      key={airport.code}
                      onClick={() => setFromQuery(`${airport.name} (${airport.code})`)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {airport.name} ({airport.code})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="text"
                placeholder="Anywhere"
                className="w-full rounded-lg border border-gray-300 p-2"
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
              />
              {toQuery && (
                <ul className="absolute z-10 bg-white border border-gray-200 mt-1 rounded-md w-full max-h-40 overflow-y-auto">
                  {filterAirports(toQuery).map((airport) => (
                    <li
                      key={airport.code}
                      onClick={() => setToQuery(`${airport.name} (${airport.code})`)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {airport.name} ({airport.code})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Departure Date</label>
              <input
                type="date"
                min={today}
                max={elevenMonthsLater}
                className="w-full rounded-lg border border-gray-300 p-2 cursor-pointer"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Return Date</label>
              <input
                type="date"
                min={today}
                max={elevenMonthsLater}
                className="w-full rounded-lg border border-gray-300 p-2 cursor-pointer"
              />
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium mb-1">Departure Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  step="900"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  step="900"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>

            {/* Return Time */}
            <div>
              <label className="block text-sm font-medium mb-1">Return Time</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  step="900"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
                <span className="self-center">to</span>
                <input
                  type="time"
                  step="900"
                  className="w-full rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>

          {/* Direct flight + Search */}
          <div className="flex items-center justify-between mt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              Direct flights only
            </label>
            <button className="bg-[#7ca982] hover:bg-[#6d9572] text-white font-medium py-2 px-6 rounded-xl transition">
              Search
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

