// components/AirportInput.js
import { useState, useEffect, useRef } from "react";

export default function AirportInput({ label, value, onChange, multiple = false, placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setShowList(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!value) return;
    if (!multiple && typeof value === "string" && value.length <= 4 && value === value.toUpperCase()) {
      setQuery(value);
    }
  }, [value, multiple]);

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
    if (!multiple) onChange(v);
    fetchSuggestions(v);
  };

  const selectAirport = (a) => {
    if (multiple) {
      const current = Array.isArray(value) ? [...value] : [];
      if (!current.includes(a.code)) {
        const updated = [...current, a.code];
        onChange(updated);
      }
      setQuery("");
    } else {
      onChange(a.code);
      setQuery(`${a.name} (${a.code})`);
    }
    setResults([]);
    setShowList(false);
  };

  const removeAirport = (code) => {
    if (multiple) {
      const updated = value.filter((c) => c !== code);
      onChange(updated);
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      {label && <label className="block text-sm font-medium mb-1 text-white/95">{label}</label>}
      <div className="flex flex-wrap items-center gap-1 p-2 rounded bg-white/90 border border-gray-200">
        {multiple && Array.isArray(value) && value.map((code) => (
          <span key={code} className="px-2 py-1 bg-green-100 text-green-800 rounded flex items-center gap-1 text-sm">
            {code}
            <button type="button" onClick={() => removeAirport(code)} className="text-xs text-red-500 hover:text-red-700">✕</button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={onInput}
          placeholder={placeholder || "Type an airport or city"}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
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
