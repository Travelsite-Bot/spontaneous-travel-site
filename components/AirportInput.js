import { useState, useEffect } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState(value || "");

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchAirports = async () => {
      try {
        const response = await fetch(`/api/airports?q=${query}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching airports", err);
      }
    };

    fetchAirports();
  }, [query]);

  const handleSelect = (airport) => {
    onChange(airport.code); // ✅ save IATA code
    setQuery(`${airport.name} (${airport.code})`); // show nice text
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type an airport"
        className="w-full rounded-lg border border-gray-300 p-2"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((airport) => (
            <li
              key={airport.code}
              onClick={() => handleSelect(airport)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {airport.name} ({airport.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
