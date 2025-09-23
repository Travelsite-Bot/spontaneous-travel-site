// components/airportinputs.js
import { useState, useEffect } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const fetchAirports = async () => {
      try {
        const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!cancelled) setSuggestions(data || []);
      } catch (err) {
        console.error("Error fetching airports:", err);
      }
    };

    fetchAirports();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleSelect = (airport) => {
    // send IATA code back to parent
    onChange(airport.code);
    // show friendly text in input
    setQuery(`${airport.name} (${airport.code})`);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type an airport or city"
        className="w-full rounded-lg border border-gray-300 p-2"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-44 overflow-y-auto shadow-lg">
          {suggestions.map((airport) => (
            <li
              key={airport.code}
              onClick={() => handleSelect(airport)}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {airport.name} ({airport.code}) — {airport.city || ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
