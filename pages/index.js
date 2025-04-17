import { useState } from "react";
import AirportInput from "../components/AirportInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const times = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = String(Math.floor(i / 4)).padStart(2, "0");
    const minute = String((i % 4) * 15).padStart(2, "0");
    return `${hour}:${minute}`;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#edf5ee] to-white">
      {/* Hero */}
      <section className="relative h-[80vh] w-full">
        <img
          src="/HomePage.jpg"
          alt="Backpacker Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Where will you end up next?
          </h1>
          <p className="text-lg md:text-xl max-w-xl">
            Search anywhere. Leave anytime. Let spontaneity guide you.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto bg-[#f1f5f2] rounded-2xl shadow-xl p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Start your adventure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From */}
            <AirportInput label="From" value={from} onChange={setFrom} />

            {/* To */}
            <AirportInput label="To" value={to} onChange={setTo} />

            {/* Departure Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Departure Date
              </label>
              <DatePicker
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                minDate={new Date()}
                dateFormat="dd MMM yyyy"
                placeholderText="Select departure"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Return Date
              </label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                minDate={departureDate || new Date()}
                dateFormat="dd MMM yyyy"
                placeholderText="Select return"
                className="w-full rounded-lg border border-gray-300 p-2"
              />
            </div>

            {/* Departure Time Range */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Departure Time
              </label>
              <div className="flex gap-2">
                <select className="w-full rounded-lg border border-gray-300 p-2">
                  {times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
                <span className="self-center">to</span>
                <select className="w-full rounded-lg border border-gray-300 p-2">
                  {times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Return Time Range */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Return Time
              </label>
              <div className="flex gap-2">
                <select className="w-full rounded-lg border border-gray-300 p-2">
                  {times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
                <span className="self-center">to</span>
                <select className="w-full rounded-lg border border-gray-300 p-2">
                  {times.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Direct flight + Search */}
          <div className="flex items-center justify-between mt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" />
              Direct flights only
            </label>
            <button className="bg-[#7ca982] hover:bg-[#6d9572] text-white font-medium py-2 px-6 rounded-xl transition">
              Search
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
