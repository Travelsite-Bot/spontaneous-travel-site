mkdir components
touch components/AirportInput.js
import { useState, useEffect } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length < 2) return;

    const fetchSuggestions = async () => {
      const res = await fetch(
        `https://api.tequila.kiwi.com/locations/query?term=${value}&location_types=airport&limit=5`,
        {
          headers: {
            apikey: "YOUR_KIWI_API_KEY" // You can leave this out temporarily
          }
        }
      );
      const data = await res.json();
      setSuggestions(data.locations || []);
      setShowSuggestions(true);
    };

    fetchSuggestions();
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 p-2"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Start typing..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-md max-h-40 overflow-y-auto mt-1 rounded-md border">
          {suggestions.map((airport) => (
            <li
              key={airport.id}
              onClick={() => {
                onChange(`${airport.city.name} (${airport.code})`);
                setShowSuggestions(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {airport.city.name} ({airport.code}) – {airport.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
