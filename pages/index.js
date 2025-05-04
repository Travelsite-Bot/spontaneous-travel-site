// pages/index.js
import { useState } from "react";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowFilters(true);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Main Content */}
      <div style={{ flex: 3, padding: "2rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo (Replace src with your logo path) */}
          <img src="/logo.png" alt="Logo" style={{ height: 50 }} />
          <nav>
            <a href="#">About</a> | <a href="#">Blog</a> | <a href="#">Socials</a>
          </nav>
        </header>

        {/* Search Tabs */}
        <div style={{ marginTop: "2rem" }}>
          <button style={{ marginRight: 10 }}>✈️ Adventure Anywhere</button>
          <button>📍 Select Destination</button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginTop: "1rem", display: "grid", gap: "1rem", maxWidth: 500 }}>
          <input type="text" placeholder="From airport" required />
          <input type="text" placeholder="To airport (if not random)" />
          <div style={{ display: "flex", gap: "1rem" }}>
            <input type="date" placeholder="Start Date" required />
            <input type="date" placeholder="End Date" required />
          </div>
          <div>
            <label>Adults: </label>
            <input type="number" min="1" defaultValue="1" />
          </div>
          <div>
            <label>Children (2–12): </label>
            <input type="number" min="0" defaultValue="0" />
          </div>
          <div>
            <label>Infants (0–2): </label>
            <input type="number" min="0" defaultValue="0" />
          </div>
          <button type="submit">Search</button>
        </form>

        {/* Filters after search */}
        {showFilters && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Step 2: Filters</h3>
            <label><input type="checkbox" /> Direct flights only</label>
            <div>
              <label>Departure time:</label>
              <select>
                <option>Any</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
            {/* Add flight results display here */}
            <p>[Flight results would show here]</p>
          </div>
        )}
      </div>

      {/* Blog Sidebar */}
      <div style={{ flex: 1, background: "#f0f0f0", padding: "1rem" }}>
        <h3>From the Blog</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ position: "relative" }}>
            <img src="/blog1.jpg" alt="Blog" style={{ width: "100%", height: "auto" }} />
            <span style={{
              position: "absolute", bottom: "10px", left: "10px",
              background: "rgba(0,0,0,0.6)", color: "#fff", padding: "5px"
            }}>Best weekend cities</span>
          </div>
          <div style={{ position: "relative" }}>
            <img src="/blog2.jpg" alt="Blog" style={{ width: "100%", height: "auto" }} />
            <span style={{
              position: "absolute", bottom: "10px", left: "10px",
              background: "rgba(0,0,0,0.6)", color: "#fff", padding: "5px"
            }}>Travel light tips</span>
          </div>
        </div>
      </div>
    </div>
  );
}
