import { useState } from "react";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("random");

  const handleSearch = (e) => {
    e.preventDefault();
    setShowFilters(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{ backgroundImage: "url('/HomePage.jpg')" }}
    >
      {/* Main Content */}
      <div className="flex-1 p-8 bg-white bg-opacity-80">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-12" />
          <nav className="text-sm space-x-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Socials</a>
          </nav>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`py-2 px-4 rounded-full text-sm ${
              activeTab === "random"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("random")}
          >
            ✈️ Adventure Anywhere
          </button>
          <button
            className={`py-2 px-4 rounded-full text-sm ${
              activeTab === "select"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("select")}
          >
            📍 Select Destination
          </button>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="grid gap-4 max-w-md bg-white p-6 rounded-xl shadow-lg"
        >
          <input
            type="text"
            placeholder="From airport"
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="To airport (if not random)"
            className="p-2 border rounded"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              required
              className="p-2 border rounded w-1/2"
            />
            <input
              type="date"
              required
              className="p-2 border rounded w-1/2"
            />
          </div>
          <div>
            <label className="block text-sm">Adults:</label>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Children (2–12):</label>
            <input
              type="number"
              min="0"
              defaultValue="0"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Infants (0–2):</label>
            <input
              type="number"
              min="0"
              defaultValue="0"
              className="p-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Filters + Step 2 */}
        {showFilters && (
          <div className="mt-10 bg-white bg-opacity-90 p-6 rounded-xl shadow-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Step 2: Filter Your Results</h3>
            <div className="mb-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" /> Direct flights only
              </label>
            </div>
            <div>
              <label className="block mb-1">Departure time:</label>
              <select className="p-2 border rounded w-full">
                <option>Any</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
            <p className="mt-4 text-gray-600 italic">[Flight results would show here]</p>
          </div>
        )}
      </div>

      {/* Blog Sidebar */}
      <aside className="w-1/4 p-4 bg-gray-100 bg-opacity-90 overflow-auto">
        <h3 className="text-lg font-semibold mb-4">From the Blog</h3>
        <div className="space-y-4">
          {[1, 2].map((id) => (
            <div key={id} className="relative group">
              <img
                src={`/blog${id}.jpg`}
                alt={`Blog ${id}`}
                className="rounded-lg w-full h-auto"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                {id === 1 ? "Best weekend cities" : "Travel light tips"}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
