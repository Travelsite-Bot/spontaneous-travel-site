// components/AirportInput.js
import { useState, useEffect, useRef } from "react";

export default function AirportInput({ label, value, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    // click outside to close
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setShowList(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    // if parent sets a value (IATA code), show that in the input as value string (optional)
    if (!value) return;
    // If value looks like an IATA (3 letters), keep input text as code until user types
    if (typeof value === "string" && value.length <= 4 && value === value.toUpperCase()) {
      setQuery(value);
    }
  }, [value]);

  async function fetchSuggestions(val) {
    if (!val || val.length < 2) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/airports?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      setResults(data || []);
      setShowList(true);
    } catch (err) {
      console.error("airport fetch err", err);
      setResults([]);
      setShowList(false);
    }
  }

  const onInput = (e) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v); // optimistic: parent gets text OR code upon selection
    fetchSuggestions(v);
  };

  const selectAirport = (a) => {
    // `a` has { name, code, city }
    onChange(a.code);
    setQuery(`${a.name} (${a.code})`);
    setResults([]);
    setShowList(false);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <label className="block text-sm font-medium mb-1 text-white/95">{label}</label>
      <input
        type="text"
        value={query}
        onChange={onInput}
        placeholder="Type an airport or city"
        className="w-full p-2 rounded bg-white/90"
      />
      {showList && results.length > 0 && (
        <ul className="absolute z-20 bg-white border rounded w-full mt-1 max-h-44 overflow-y-auto shadow-lg">
          {results.map((r) => (
            <li
              key={r.code || r.id || (r.name + Math.random())}
              onClick={() => selectAirport(r)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-medium">{r.name} ({r.code})</div>
              <div className="text-xs text-gray-500">{r.city || ""}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
