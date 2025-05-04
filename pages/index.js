import { useState } from "react";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState("adventure"); // 'adventure' or 'select'

  const handleSearch = (e) => {
    e.preventDefault();
    setShowFilters(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/HomePage.jpg')" }}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white/70 shadow-md">
        <img src="/logo.png" alt="Logo" className="h-12" />
        <nav className="flex items-center space-x-4 text-sm">
          <a href="#">About</a>
          <span>|</span>
          <a href="#">Inspiration</a>
          <span>|</span>
          <div className="flex space-x-2">
            <button title="Instagram">📷</button>
            <button title="Facebook">📘</button>
            <button title="TikTok">🎵</button>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col md:flex-row justify-center items-center p-6">
        {/* Centered Search Area */}
        <div className="flex-1 w-full max-w-xl bg-white/90 p-6 rounded-xl shadow-md">
          {/* Tabs */}
          <div className="mb-4">
            <button
              className={`mr-2 px-3 py-1 rounded-full ${tab === "adventure" ? "bg-green-700 text-white" : "bg-gray-200"}`}
              onClick={() => setTab("adventure")}
            >
              ✈️ Adventure Anywhere
            </button>
            <button
              className={`px-3 py-1 rounded-full ${tab === "select" ? "bg-green-700 text-white" : "bg-gray-200"}`}
              onClick={() => setTab("select")}
            >
              📍 Select Destination
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              placeholder="From airport"
              required
              className="w-full p-2 border rounded"
            />
            {tab === "select" && (
              <input
                type="text"
                placeholder="To airport"
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex gap-2">
              <input
                type="date"
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm">Adults</label>
                <input type="number" min="1" defaultValue="1" className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="text-sm">Children</label>
                <input type="number" min="0" defaultValue="0" className="w-full p-1 border rounded" />
              </div>
              <div>
                <label className="text-sm">Infants</label>
                <input type="number" min="0" defaultValue="0" className="w-full p-1 border rounded" />
              </div>
            </div>
            <button type="submit" className="bg-green-700 text-white w-full py-2 rounded">
              Search
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-bold mb-2">Step 2: Filters</h3>
              <label className="block mb-2">
                <input type="checkbox" /> Direct flights only
              </label>
              <div>
                <label className="block">Departure time:</label>
                <select className="w-full p-2 border rounded">
                  <option>Any</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
              <p className="mt-4">[Flight results would show here]</p>
            </div>
          )}
        </div>

        {/* Blog / Inspiration Sidebar */}
        <aside className="flex-1 mt-10 md:mt-0 md:ml-10 bg-white/90 p-4 rounded-xl shadow-md max-w-sm">
          <h3 className="text-xl font-semibold mb-4">Inspiration</h3>
          <div className="grid gap-4">
            <div className="relative">
              <img src="/blog1.jpg" alt="Blog 1" className="rounded shadow w-full" />
              <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-sm rounded">
                Best weekend cities
              </span>
            </div>
            <div className="relative">
              <img src="/blog2.jpg" alt="Blog 2" className="rounded shadow w-full" />
              <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-sm rounded">
                Travel light tips
              </span>
            </div>
            <div className="relative">
              <img src="/blog3.jpg" alt="Blog 3" className="rounded shadow w-full" />
              <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-sm rounded">
                Hidden gem destinations
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
