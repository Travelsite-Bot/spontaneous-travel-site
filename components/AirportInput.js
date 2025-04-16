import { useState, useEffect } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value) return setSuggestions([]);

      try {
        const res = await fetch(
          `https://api.skypicker.com/locations?term=${value}&locale=en-US&location_types=airport&limit=5&active_only=true`
        );
        const data = await res.json();
        setSuggestions(data.locations || []);
      } catch (err) {
        console.error("Error fetching airport suggestions:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`e.g. ${label === "From" ? "London Gatwick (LGW)" : "Anywhere"}`}
        className="w-full rounded-lg border border-gray-300 p-2"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10 relative">
          {suggestions.map((airport) => (
            <li
              key={airport.id}
              onClick={() => onChange(`${airport.name} (${airport.code})`)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {airport.name} ({airport.code}) – {airport.city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
