import { useState } from "react";

const SearchIcon = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const XIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export default function SearchBar({ onSearch, placeholder }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(query.trim());
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <form className="searchbar" onSubmit={handleSubmit} style={{ position: "relative", width: "100%", maxWidth: "100%", margin: "0 auto 2.5rem auto", display: "flex", alignItems: "center" }}>
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SearchIcon size={18} color="var(--smoke-grey)" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.875rem 3rem 0.875rem 2.75rem",
            background: "rgba(74, 74, 74, 0.12)",
            border: "1px solid var(--smoke-grey)",
            borderRadius: "6px 0 0 6px",
            color: "var(--fog-white)",
            fontFamily: "var(--font-body)",
            fontSize: "0.95rem",
            outline: "none",
            transition: "all 0.2s ease"
          }}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--smoke-grey)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "50%"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--fog-white)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--smoke-grey)"}
            title="Clear search"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
      <button 
        type="submit" 
        style={{
          padding: "0.875rem 2rem",
          background: "var(--streetlamp-yellow)",
          border: "1px solid var(--streetlamp-yellow)",
          borderRadius: "0 6px 6px 0",
          color: "var(--noir-black)",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      >
        Search
      </button>
    </form>
  );
}
