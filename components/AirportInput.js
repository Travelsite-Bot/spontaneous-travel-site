// components/AirportInput.js
import { useState, useEffect, useRef } from "react";

export default function AirportInput({
  label = "",
  placeholder = "Type city or airport",
  value,
  onChange,
  multiple = false, // if true, selected items become an array in parent
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);
  const wrapRef = useRef(null);

  // normalize parent value to internal selected array when multiple
  const selectedArray = Array.isArray(value) ? value : value ? [value] : [];

  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current?.contains(e.target)) setShowList(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    // if parent sets a single IATA code, display it
    if (!value || multiple) return;
    if (typeof value === "string" && value.length <= 4) {
      setQuery(value);
    }
  }, [value, multiple]);

  async function fetchSuggestions(val) {
    if (!val || val.length < 2) {
      setResults([]);
      setShowList(false);
      return;
    }
    try {
      const res = await fetch(`/api/airports?q=${encodeURIComponent(val)}`);
      if (!res.ok) {
        setResults([]);
        setShowList(false);
        return;
      }
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
    // a: { name, code, city }
    const display = `${a.name} (${a.code})`;
    if (multiple) {
      // append code to parent's array (avoid duplicates)
      const prev = Array.isArray(value) ? [...value] : [];
      if (!prev.includes(a.code)) {
        onChange([...prev, a.code]);
      }
    } else {
      onChange(a.code);
    }
    setQuery(display);
    setResults([]);
    setShowList(false);
  };

  const removeSelected = (code) => {
    if (!multiple) return;
    const prev = Array.isArray(value) ? [...value] : [];
    const next = prev.filter((c) => c !== code);
    onChange(next);
  };

  return (
    <div className="relative" ref={wrapRef}>
      {label && <label className="block text-sm font-medium mb-1 text-white/95">{label}</label>}

      {/* Selected chips for multiple */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {value.map((c) => (
            <div key={c} className="flex items-center gap-2 bg-white/90 px-2 py-1 rounded text-sm shadow-sm">
              <span className="font-medium">{c}</span>
              <button
                type="button"
                onClick={() => removeSelected(c)}
                className="text-xs opacity-70"
                aria-label={`remove ${c}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={onInput}
        placeholder={placeholder}
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
