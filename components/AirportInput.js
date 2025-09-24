import { useState } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInput = async (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/airports?query=${val}`);
      const data = await res.json();
      setResults(data || []);
    } catch (err) {
      console.error("Error fetching airports", err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query || value}
        onChange={handleInput}
        placeholder={label}
        className="w-full p-2 border rounded"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
          {results.map((airport, i) => (
            <li
              key={i}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(airport.code);
                setQuery(`${airport.city} (${airport.code})`);
                setResults([]);
              }}
            >
              {airport.city} ({airport.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
