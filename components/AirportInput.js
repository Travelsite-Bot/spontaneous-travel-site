import { useState, useEffect } from "react";

const AirportInput = ({ label, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length > 1) {
      // Simulated airport data (replace with real API later)
      const airports = [
        "London Heathrow (LHR)",
        "London Gatwick (LGW)",
        "Paris Charles de Gaulle (CDG)",
        "New York JFK (JFK)",
        "Los Angeles (LAX)",
        "Tokyo Haneda (HND)",
        "Amsterdam Schiphol (AMS)",
        "Rome Fiumicino (FCO)",
        "Berlin Brandenburg (BER)",
        "Barcelona El Prat (BCN)"
      ];
      const filtered = airports.filter((airport) =>
        airport.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder={`Enter airport`}
        className="w-full rounded-lg border border-gray-300 p-2"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 relative">
          {suggestions.map((airport) => (
            <li
              key={airport}
              onClick={() => onChange(airport)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {airport}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AirportInput;
