import { useState } from "react";

export default function AdvancedFilterPanel({ tab, filters, onChange, onReset, matchCount, totalCount }) {
  // Define options for Anime
  const animeGenres = [
    { value: "", label: "All Genres" },
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Supernatural", label: "Supernatural" },
    { value: "Suspense", label: "Suspense" },
  ];

  const years = [
    { value: "", label: "All Years" },
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
    { value: "2021", label: "2021" },
    { value: "2020", label: "2020" },
    { value: "2010s", label: "2010s Era" },
    { value: "2000s", label: "2000s Era" },
    { value: "90s", label: "90s & Classic" },
  ];

  const animeStudios = [
    { value: "", label: "All Studios" },
    { value: "Mappa", label: "MAPPA" },
    { value: "Madhouse", label: "Madhouse" },
    { value: "Wit Studio", label: "Wit Studio" },
    { value: "Bones", label: "Bones" },
    { value: "Kyoto Animation", label: "Kyoto Animation" },
    { value: "ufotable", label: "ufotable" },
    { value: "A-1 Pictures", label: "A-1 Pictures" },
    { value: "Toei Animation", label: "Toei Animation" },
    { value: "Studio Ghibli", label: "Studio Ghibli" },
  ];

  const animeCountries = [
    { value: "", label: "All Countries" },
    { value: "Japan", label: "Japan" }
  ];

  const animeDurations = [
    { value: "", label: "All Durations" },
    { value: "short", label: "Short / Mini (< 15 min)" },
    { value: "standard", label: "Standard TV Episode (15-30 min)" },
    { value: "long", label: "Long Format / Movie (> 30 min)" },
  ];

  const animeRatings = [
    { value: "", label: "All Demographic Ratings" },
    { value: "G", label: "G - All Ages" },
    { value: "PG", label: "PG - Children" },
    { value: "PG-13", label: "PG-13 - Teens" },
    { value: "R", label: "R - Mature (17+)" },
  ];

  const animeStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Currently Airing", label: "Currently Airing" },
    { value: "Finished Airing", label: "Finished" },
    { value: "Not yet aired", label: "Upcoming" },
  ];

  // Define options for Movies
  const movieGenres = [
    { value: "", label: "All Genres" },
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Animation", label: "Animation" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Horror", label: "Horror" },
    { value: "Romance", label: "Romance" },
    { value: "Science Fiction", label: "Sci-Fi" },
    { value: "Thriller", label: "Thriller" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Mystery", label: "Mystery" },
  ];

  const movieStudios = [
    { value: "", label: "All Studios / Production" },
    { value: "warner", label: "Warner Bros." },
    { value: "disney", label: "Disney / Pixar" },
    { value: "universal", label: "Universal Pictures" },
    { value: "paramount", label: "Paramount" },
    { value: "columbia", label: "Columbia Pictures" },
    { value: "marvel", label: "Marvel Studios" },
    { value: "a24", label: "A24" },
    { value: "netflix", label: "Netflix" },
  ];

  const movieCountries = [
    { value: "", label: "All Major Countries" },
    { value: "US", label: "United States / UK" },
    { value: "ID", label: "Indonesia" },
    { value: "KR", label: "South Korea" },
    { value: "JP", label: "Japan" },
    { value: "FR", label: "France" },
    { value: "ES", label: "Spain" },
  ];

  const movieDurations = [
    { value: "", label: "All Durations" },
    { value: "short", label: "Short / Light (< 90 Mins)" },
    { value: "standard", label: "Standard / Ideal (90 - 120 Mins)" },
    { value: "long", label: "Intense / Long (120 - 150 Mins)" },
    { value: "epic", label: "Epic / Marathon (> 150 Mins)" },
  ];

  const movieRatings = [
    { value: "", label: "All Scores" },
    { value: "8.0", label: "⭐ Excellent (8.0+)" },
    { value: "7.0", label: "⭐ Very Good (7.0+)" },
    { value: "6.0", label: "⭐ Good (6.0+)" },
    { value: "5.0", label: "⭐ Average (5.0+)" },
  ];

  const movieStatuses = [
    { value: "", label: "All Statuses" },
    { value: "released", label: "Released" },
    { value: "upcoming", label: "Upcoming" },
  ];

  // Helper selectors based on active tab
  const gOptions = tab === "anime" ? animeGenres : movieGenres;
  const sOptions = tab === "anime" ? animeStudios : movieStudios;
  const cOptions = tab === "anime" ? animeCountries : movieCountries;
  const dOptions = tab === "anime" ? animeDurations : movieDurations;
  const rOptions = tab === "anime" ? animeRatings : movieRatings;
  const stOptions = tab === "anime" ? animeStatuses : movieStatuses;

  const activeFilterCount = Object.values(filters).filter(val => val !== "").length;

  return (
    <div 
      className="advanced-filter-panel"
      style={{
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto 2.5rem auto",
        background: "rgba(15, 15, 20, 0.85)",
        border: "1px solid rgba(232, 197, 71, 0.15)",
        borderRadius: "12px",
        padding: "1.75rem",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        position: "relative",
        animation: "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize: "0.7rem",
            color: "var(--streetlamp-yellow)",
            background: "rgba(232, 197, 71, 0.1)",
            border: "1px solid rgba(232, 197, 71, 0.3)",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "600",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase"
          }}>
            Advanced Filters
          </span>
          <h4 style={{ fontSize: "0.950rem", fontWeight: "600", color: "#FFF", fontFamily: "var(--font-display)", letterSpacing: "0.5px" }}>
            Specific Search ({tab === "anime" ? "Anime" : "Movies"})
          </h4>
        </div>
        
        {activeFilterCount > 0 && (
          <button 
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "all 0.15s ease",
              textTransform: "uppercase"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "var(--streetlamp-yellow)";
              e.currentTarget.style.background = "rgba(232, 197, 71, 0.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
              e.currentTarget.style.background = "none";
            }}
          >
            ❌ Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Grid of 7 fields */}
      <div className="filter-grid" style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
        gap: "1rem" 
      }}>
        {/* 1. Genre Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Genre</label>
          <select 
            className="filter-select"
            value={filters.genre} 
            onChange={(e) => onChange("genre", e.target.value)}
          >
            {gOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 2. Year Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Year</label>
          <select 
            className="filter-select"
            value={filters.year} 
            onChange={(e) => onChange("year", e.target.value)}
          >
            {years.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 3. Studio/Production Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">{tab === "anime" ? "Studio" : "Studio / Production"}</label>
          <select 
            className="filter-select"
            value={filters.studio} 
            onChange={(e) => onChange("studio", e.target.value)}
          >
            {sOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 4. Country Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Country</label>
          <select 
            className="filter-select"
            value={filters.country} 
            onChange={(e) => onChange("country", e.target.value)}
            disabled={tab === "anime" && apiHasOnlyJapan()}
          >
            {cOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 5. Duration Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Duration</label>
          <select 
            className="filter-select"
            value={filters.duration} 
            onChange={(e) => onChange("duration", e.target.value)}
          >
            {dOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 6. Rating Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Rating</label>
          <select 
            className="filter-select"
            value={filters.rating} 
            onChange={(e) => onChange("rating", e.target.value)}
          >
            {rOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* 7. Status Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label className="filter-label">Status</label>
          <select 
            className="filter-select"
            value={filters.status} 
            onChange={(e) => onChange("status", e.target.value)}
          >
            {stOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Summary count indicator footer */}
      <div style={{ 
        marginTop: "1.25rem", 
        paddingTop: "1rem", 
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.45)", fontFamily: "var(--font-mono)" }}>
          {activeFilterCount > 0 ? (
            <span>
              Found <strong style={{ color: "var(--streetlamp-yellow)" }}>{matchCount}</strong> of <strong style={{ color: "#FFF" }}>{totalCount}</strong> items matching your preferences.
            </span>
          ) : (
            <span>Filters not active. Showing top popular collections.</span>
          )}
        </span>
        {activeFilterCount > 0 && matchCount === 0 && (
          <span style={{ fontSize: "0.75rem", color: "var(--neon-red)", fontWeight: "500" }}>
            ❌ No matches found
          </span>
        )}
      </div>
    </div>
  );

  function apiHasOnlyJapan() {
    return tab === "anime";
  }
}
