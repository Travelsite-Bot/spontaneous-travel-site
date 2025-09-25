// components/PassengerSelect.js
import { useState, useRef, useEffect } from "react";

export default function PassengerSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const update = (field, val) => {
    const updated = { ...value, [field]: Math.max(0, val) };
    onChange(updated);
  };

  const total = value.adults + value.children + value.infants;

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="p-2 rounded border border-black/10 bg-white/90 cursor-pointer text-sm"
      >
        {total} Passenger{total !== 1 ? "s" : ""}
      </div>
      {open && (
        <div className="absolute z-30 bg-white border rounded shadow-md mt-1 w-56 p-3">
          {["adults", "children", "infants"].map((type) => (
            <div key={type} className="flex items-center justify-between mb-2 last:mb-0">
              <span className="capitalize">{type}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update(type, value[type] - 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  -
                </button>
                <span>{value[type]}</span>
                <button
                  type="button"
                  onClick={() => update(type, value[type] + 1)}
                  className="px-2 py-1 bg-gray-100 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
