const tvIconXml = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
    <path d="m17 2-5 5-5-5" />
  </svg>
);

const filmIconXml = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M3 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </svg>
);

const userIconXml = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const trophyIconXml = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a6 6 0 0 1 6 6v3.5c0 1.66-1.34 3-3 3H9a3 3 0 0 1-3-3V8a6 6 0 0 1 6-6Z" />
  </svg>
);

export default function Navbar({ tab, setTab }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo-container">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 className="logo" style={{ fontSize: '1.85rem', lineHeight: 1, letterSpacing: '0.12em', margin: 0, fontFamily: 'var(--font-logo)', fontWeight: 800 }}>
            Archivu
          </h1>
          <span style={{ fontSize: '0.64rem', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'var(--font-mono)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Entertainment Archive
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div className="tabs">
          <button
            className={tab === "anime" ? "tab active" : "tab"}
            onClick={() => setTab("anime")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {tvIconXml}
            Anime
          </button>
          <button
            className={tab === "movie" ? "tab active" : "tab"}
            onClick={() => setTab("movie")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {filmIconXml}
            Movies
          </button>
          <button
            className={tab === "ranking" ? "tab active" : "tab"}
            onClick={() => setTab("ranking")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {trophyIconXml}
            Ranking
          </button>
          <button
            className={tab === "profil" ? "tab active" : "tab"}
            onClick={() => setTab("profil")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {userIconXml}
            Profile
          </button>
        </div>
      </div>
    </nav>
  );
}
