// components/AirportInput.js
import { useState, useEffect, useRef } from "react";

/**
 * Props:
 * - label: string
 * - value: if multiple -> array of selected airport codes; else string
 * - onChange: (value) => void   (value is array for multiple, string for single)
 * - placeholder: string
 * - multiple: boolean
 */
export default function AirportInput({ label, value, onChange, placeholder = "Type one or more airports", multiple = false }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // initialize query display when value is set externally
  useEffect(() => {
    if (multiple) {
      setQuery("");
    } else {
      setQuery(value || "");
    }
  }, [value, multiple]);

  useEffect(() => {
    function handleDocClick(e) {
      if (!wrapRef.current?.contains(e.target)) {
        setShowList(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  async function fetchSuggestions(q) {
    if (!q || q.length < 1) {
      setResults([]);
      return;
    }
    try {
      // hit your API endpoint that proxies travelpayouts autocomplete
      const res = await fetch(`/api/airports?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      // ensure results are objects { name, code, city } as your API returns
      setResults(data || []);
      setShowList(true);
    } catch (err) {
      console.error("airport fetch error", err);
      setResults([]);
      setShowList(false);
    }
  }

  const handleInput = (e) => {
    const v = e.target.value;
    setQuery(v);
    fetchSuggestions(v);
    // optimistic: if not multiple, let parent know typed value
    if (!multiple) onChange(v);
  };

  const selectAirport = (a) => {
    // a => { name, code, city }
    if (multiple) {
      const arr = Array.isArray(value) ? [...value] : [];
      // push code if not already present
      if (!arr.includes(a.code)) arr.push(a.code);
      onChange(arr);
      setQuery("");
      setResults([]);
      inputRef.current?.focus();
    } else {
      onChange(a.code || a.name);
      setQuery(`${a.name} (${a.code})`);
      setResults([]);
      setShowList(false);
    }
  };

  const removeChip = (code) => {
    const arr = (Array.isArray(value) ? value : []).filter((c) => c !== code);
    onChange(arr);
  };

  return (
    <div ref={wrapRef} className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>

      {multiple ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap border p-2 rounded bg-white/95">
            {(Array.isArray(value) ? value : []).map((code) => (
              <span key={code} className="inline-flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                {code}
                <button
                  type="button"
                  onClick={() => removeChip(code)}
                  className="ml-2 text-xs"
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}

            <input
              ref={inputRef}
              value={query}
              onChange={handleInput}
              placeholder={placeholder}
              className="flex-1 min-w-[120px] p-1 outline-none"
            />
          </div>
        </div>
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          placeholder={placeholder}
          className="w-full p-2 rounded border bg-white/95"
        />
      )}

      {showList && results.length > 0 && (
        <ul className="absolute z-30 bg-white border rounded w-full mt-1 max-h-44 overflow-y-auto shadow-lg">
          {results.map((r) => (
            <li
              key={r.code || r.name}
              onClick={() => selectAirport(r)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              <div className="font-medium">{r.name} {r.code ? `(${r.code})` : ""}</div>
              <div className="text-xs text-gray-500">{r.city || ""}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
