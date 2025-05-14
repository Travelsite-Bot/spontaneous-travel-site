import { useState } from "react";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState("adventure");

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

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative p-6">
        {/* Search Form Box */}
        <div className="w-full max-w-xl bg-white/90 p-6 rounded-xl shadow-md z-10">
          {/* Tabs Styled as Integrated Nav */}
          <div className="flex mb-4 bg-gray-100 rounded overflow-hidden">
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "adventure" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
              onClick={() => setTab("adventure")}
            >
              ✈️ Adventure Anywhere
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                tab === "select" ? "bg-green-700 text-white" : "text-gray-600"
              }`}
              onClick={() => setTab("select")}
            >
              📍 Select Destination
            </button>
          </div>

          {/* Search Form */}
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
              <input type="date" required className="w-full p-2 border rounded" />
              <input type="date" required className="w-full p-2 border rounded" />
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

          {/* Filters After Search */}
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

              {/* Mock Search Results Section */}
              <div className="mt-8 p-6 bg-white/80 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Step 3: Example Results</h2>
                <div className="grid gap-4">
                  <div className="p-4 border rounded flex justify-between items-center bg-white">
                    <div>
                      <p className="font-medium">✈️ Stockholm → Rome</p>
                      <p className="text-sm text-gray-600">Direct · 3h 15m</p>
                    </div>
                    <p className="font-bold text-green-700">$120</p>
                  </div>
                  <div className="p-4 border rounded flex justify-between items-center bg-white">
                    <div>
                      <p className="font-medium">✈️ Stockholm → Paris</p>
                      <p className="text-sm text-gray-600">1 stop · 5h</p>
                    </div>
                    <p className="font-bold text-green-700">$98</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Note: This is a prototype layout for review.</p>
              </div>
            </div>
          )}
        </div>

        {/* Inspiration Strip - Enhanced Overlay */}
        <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2">
          <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-lg w-40">
            <div className="flex flex-col space-y-4">
              <img src="/blog1.jpg" alt="Inspiration 1" className="w-full rounded-lg shadow-md" />
              <img src="/blog2.jpg" alt="Inspiration 2" className="w-full rounded-lg shadow-md" />
              <img src="/blog3.jpg" alt="Inspiration 3" className="w-full rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
