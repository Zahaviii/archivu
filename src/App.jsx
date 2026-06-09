import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import CardGrid from "./components/CardGrid";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import UserProfile from "./components/UserProfile";
import RankingView from "./components/RankingView.jsx";
import DetailView from "./components/DetailView";
import { searchAnime, getTopAnime } from "./api/jikan";
import { searchMovie, getPopularMovies } from "./api/tmdb";
import './App.css';

const CompassIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const FlameIcon = ({ size, fill, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const StarIcon = ({ size, fill, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarIcon = ({ size }) => (
  <svg width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const AwardIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default function App() {
  const [tab, setTab] = useState("anime");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(""); // "anime" or "movie"
  const [filters, setFilters] = useState({
    genre: "",
    year: "",
    studio: "",
    country: "",
    duration: "",
    rating: "",
    status: ""
  });

  // Load and store favorites lists in local storage
  const [favoritesAnime, setFavoritesAnime] = useState(() => {
    const saved = localStorage.getItem("archivu_fav_anime");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoritesMovie, setFavoritesMovie] = useState(() => {
    const saved = localStorage.getItem("archivu_fav_movie");
    return saved ? JSON.parse(saved) : [];
  });

  const handleToggleFavorite = (item) => {
    if (item.type === "anime") {
      const exists = favoritesAnime.some(f => f.id === item.id);
      let updated;
      if (exists) {
        updated = favoritesAnime.filter(f => f.id !== item.id);
      } else {
        updated = [...favoritesAnime, item];
      }
      setFavoritesAnime(updated);
      localStorage.setItem("archivu_fav_anime", JSON.stringify(updated));
    } else {
      const exists = favoritesMovie.some(f => f.id === item.id);
      let updated;
      if (exists) {
        updated = favoritesMovie.filter(f => f.id !== item.id);
      } else {
        updated = [...favoritesMovie, item];
      }
      setFavoritesMovie(updated);
      localStorage.setItem("archivu_fav_movie", JSON.stringify(updated));
    }
  };

  const handleRemoveFavoriteAnime = (id) => {
    const updated = favoritesAnime.filter(f => f.id !== id);
    setFavoritesAnime(updated);
    localStorage.setItem("archivu_fav_anime", JSON.stringify(updated));
  };

  const handleRemoveFavoriteMovie = (id) => {
    const updated = favoritesMovie.filter(f => f.id !== id);
    setFavoritesMovie(updated);
    localStorage.setItem("archivu_fav_movie", JSON.stringify(updated));
  };

  useEffect(() => {
    // Reset filters and list when tab changes
    setFilters({
      genre: "",
      year: "",
      studio: "",
      country: "",
      duration: "",
      rating: "",
      status: ""
    });
    setSelectedItem(null);
    setSelectedType("");
    if (tab !== "profil" && tab !== "ranking") {
      loadDefault();
    }
  }, [tab]);

  async function loadDefault() {
    if (tab === "profil" || tab === "ranking") return;
    setLoading(true);
    setSearchQuery("");
    try {
      const data = tab === "anime" ? await getTopAnime() : await getPopularMovies();
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(query) {
    setLoading(true);
    setSearchQuery(query);
    try {
      const data = tab === "anime" ? await searchAnime(query) : await searchMovie(query);
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Live client-side advanced filtering
  const filteredItems = items.filter((item) => {
    if (tab === "anime") {
      // 1. Genre Filter (supports genres, themes, demographics)
      if (filters.genre) {
        const itemGenres = [
          ...(item.genres || []),
          ...(item.themes || []),
          ...(item.demographics || [])
        ].map(g => g.name.toLowerCase());
        if (!itemGenres.includes(filters.genre.toLowerCase())) return false;
      }

      // 2. Year Filter
      if (filters.year) {
        const yearVal = item.year || item.aired?.prop?.from?.year || (item.aired?.from && new Date(item.aired.from).getFullYear());
        if (filters.year === "2010s") {
          if (!yearVal || yearVal < 2010 || yearVal > 2019) return false;
        } else if (filters.year === "2000s") {
          if (!yearVal || yearVal < 2000 || yearVal > 2009) return false;
        } else if (filters.year === "90s") {
          if (!yearVal || yearVal >= 2000) return false;
        } else {
          if (yearVal !== parseInt(filters.year)) return false;
        }
      }

      // 3. Studio Filter
      if (filters.studio) {
        const studios = (item.studios || []).map(s => s.name.toLowerCase());
        if (!studios.some(s => s.includes(filters.studio.toLowerCase()))) return false;
      }

      // 4. Country Filter (Anime is Japan)
      if (filters.country) {
        if (filters.country.toLowerCase() !== "japan") return false;
      }

      // 5. Duration Filter
      if (filters.duration) {
        const durationStr = item.duration || "";
        let durationMins = 0;
        if (durationStr.includes("hr")) {
          const hrMatch = durationStr.match(/(\d+)\s*hr/);
          if (hrMatch) durationMins += parseInt(hrMatch[1]) * 60;
        }
        const minMatch = durationStr.match(/(\d+)\s*min/);
        if (minMatch) durationMins += parseInt(minMatch[1]);

        if (filters.duration === "short") {
          if (durationMins === 0 || durationMins >= 15) return false;
        } else if (filters.duration === "standard") {
          if (durationMins < 15 || durationMins > 30) return false;
        } else if (filters.duration === "long") {
          if (durationMins <= 30) return false;
        }
      }

      // 6. Rating Filter
      if (filters.rating) {
        const r = item.rating || "";
        if (!r.toLowerCase().includes(filters.rating.toLowerCase())) return false;
      }

      // 7. Status Filter
      if (filters.status) {
        const s = item.status || "";
        if (!s.toLowerCase().includes(filters.status.toLowerCase())) return false;
      }
    } else {
      // Movie tab filters
      // 1. Genre Filter
      if (filters.genre) {
        const TMDB_GENRES = {
          28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
          99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
          27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
          10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
        };
        const itemGenres = (item.genre_ids || []).map(id => TMDB_GENRES[id]?.toLowerCase() || "");
        if (!itemGenres.includes(filters.genre.toLowerCase())) return false;
      }

      // 2. Year Filter
      if (filters.year) {
        const yearVal = item.release_date ? parseInt(item.release_date.slice(0, 4)) : null;
        if (filters.year === "2010s") {
          if (!yearVal || yearVal < 2010 || yearVal > 2019) return false;
        } else if (filters.year === "2000s") {
          if (!yearVal || yearVal < 2000 || yearVal > 2009) return false;
        } else if (filters.year === "90s") {
          if (!yearVal || yearVal >= 2000) return false;
        } else {
          if (yearVal !== parseInt(filters.year)) return false;
        }
      }

      // 3. Studio / Production Filter (heuristics on text and overview)
      if (filters.studio) {
        const studioHeuristics = {
          warner: ["warner", "wb"],
          disney: ["disney", "pixar", "marvel", "star wars"],
          universal: ["universal"],
          paramount: ["paramount"],
          columbia: ["columbia", "sony"],
          marvel: ["marvel", "avengers", "spider"],
          a24: ["a24"],
          netflix: ["netflix"]
        };
        const text = `${item.title || ""} ${item.overview || ""}`.toLowerCase();
        const keywords = studioHeuristics[filters.studio.toLowerCase()] || [filters.studio.toLowerCase()];
        const match = keywords.some(kw => text.includes(kw));
        if (!match) return false;
      }

      // 4. Country Filter (original_language mapping)
      if (filters.country) {
        const originalLang = item.original_language || "";
        if (filters.country === "US" && originalLang !== "en") return false;
        if (filters.country === "ID" && originalLang !== "id") return false;
        if (filters.country === "KR" && originalLang !== "ko") return false;
        if (filters.country === "JP" && originalLang !== "ja") return false;
        if (filters.country === "FR" && originalLang !== "fr") return false;
        if (filters.country === "ES" && originalLang !== "es") return false;
      }

      // 5. Duration Filter (estimated duration based on overview string length)
      if (filters.duration) {
        const estMins = item.overview ? 90 + (item.overview.length % 65) : 110;
        if (filters.duration === "short" && estMins >= 100) return false;
        if (filters.duration === "standard" && (estMins < 100 || estMins > 130)) return false;
        if (filters.duration === "long" && (estMins <= 130 || estMins > 160)) return false;
        if (filters.duration === "epic" && estMins <= 160) return false;
      }

      // 6. Rating Filter
      if (filters.rating) {
        const ratingVal = item.vote_average || 0;
        if (ratingVal < parseFloat(filters.rating)) return false;
      }

      // 7. Status Filter
      if (filters.status) {
        const releaseYear = item.release_date ? parseInt(item.release_date.slice(0, 4)) : 0;
        if (filters.status === "released") {
          if (releaseYear > 2026) return false;
        } else if (filters.status === "upcoming") {
          if (releaseYear <= 2026) return false;
        }
      }
    }
    return true;
  });

  const isFilterActive = Object.values(filters).some((val) => val !== "");

  // Pick the top item as spotlight choice when not searching, loading, or active filtering
  const spotlightItem = !searchQuery && !isFilterActive && items && items.length > 0 ? items[0] : null;

  // Extract spotlight data fields
  const spotlightTitle = spotlightItem ? spotlightItem.title : "";
  const spotlightScore = spotlightItem 
    ? (tab === "anime" ? spotlightItem.score : spotlightItem.vote_average?.toFixed(1)) 
    : null;
  const spotlightYear = spotlightItem 
    ? (tab === "anime" ? spotlightItem.year || spotlightItem.aired?.prop?.from?.year : spotlightItem.release_date?.slice(0, 4)) 
    : null;
  const spotlightImage = spotlightItem
    ? (tab === "anime" ? spotlightItem.images?.jpg?.large_image_url || spotlightItem.images?.jpg?.image_url : "https://image.tmdb.org/t/p/w500" + spotlightItem.poster_path)
    : "";
  const spotlightSynopsis = spotlightItem
    ? (tab === "anime" ? spotlightItem.synopsis : spotlightItem.overview)
    : "";

  return (
    <div className="app">
      <Navbar tab={tab} setTab={setTab} />
      <main className="main">
        {selectedItem ? (
          <DetailView
            item={selectedItem}
            type={selectedType}
            onClose={() => {
              setSelectedItem(null);
              setSelectedType("");
            }}
            isFavorite={
              selectedType === "anime"
                ? favoritesAnime.some(f => f.id === (selectedItem.mal_id || selectedItem.id))
                : favoritesMovie.some(f => f.id === (selectedItem.mal_id || selectedItem.id))
            }
            onToggleFavorite={handleToggleFavorite}
          />
        ) : tab === "profil" ? (
          <UserProfile
            favoritesAnime={favoritesAnime}
            favoritesMovie={favoritesMovie}
            onRemoveFavoriteAnime={handleRemoveFavoriteAnime}
            onRemoveFavoriteMovie={handleRemoveFavoriteMovie}
            onCardClick={(item, type) => {
              setSelectedItem(item);
              setSelectedType(type);
            }}
          />
        ) : tab === "ranking" ? (
          <RankingView
            favoritesAnime={favoritesAnime}
            favoritesMovie={favoritesMovie}
            onToggleFavorite={handleToggleFavorite}
            onCardClick={(item, type) => {
              setSelectedItem(item);
              setSelectedType(type);
            }}
          />
        ) : (
          <>
            {/* Dynamic header welcome section */}
            <div style={{ textAlign: "center", marginBottom: "3.5rem", marginTop: "1.5rem" }}>
              <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: "8px", 
                background: "rgba(232, 197, 71, 0.08)", 
                border: "1px solid rgba(232, 197, 71, 0.25)", 
                padding: "6px 16px", 
                borderRadius: "30px", 
                marginBottom: "1.5rem",
                boxShadow: "0 4px 20px rgba(232, 197, 71, 0.05)"
              }}>
                <CompassIcon size={12} color="var(--streetlamp-yellow)" />
                <span style={{ 
                  fontSize: "0.725rem", 
                  fontFamily: "var(--font-mono)", 
                  color: "var(--streetlamp-yellow)", 
                  fontWeight: 600, 
                  textTransform: "uppercase", 
                  letterSpacing: "1.5px" 
                }}>
                  Discover {tab === "anime" ? "Anime" : "Movie"} Collection
                </span>
              </div>
              <h2 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "clamp(1.8rem, 7vw, 3.25rem)", 
                fontWeight: "800", 
                color: "#FFFFFF", 
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
                lineHeight: "1.15",
                textShadow: "0 2px 20px rgba(0,0,0,0.6)"
              }}>
                {tab === "anime" ? "Explore the World of Anime" : "Explore the World of Movies"}
              </h2>
              <p style={{ 
                fontSize: "1.05rem", 
                color: "rgba(255, 255, 255, 0.55)", 
                maxWidth: "600px", 
                margin: "0 auto",
                lineHeight: "1.6",
                fontWeight: "400"
              }}>
                Discover popular, classic, and recent {tab === "anime" ? "anime" : "movie"} releases with details and ratings.
              </p>
            </div>

            <SearchBar
              onSearch={handleSearch}
              placeholder={tab === "anime" ? "Search anime..." : "Search movies..."}
            />

            {/* Advanced Filter Toggle Icon Button */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "-1.5rem", marginBottom: "2rem" }}>
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                style={{
                  background: isAdvancedOpen ? "rgba(232, 197, 71, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isAdvancedOpen ? "var(--streetlamp-yellow)" : "rgba(255, 255, 255, 0.17)"}`,
                  color: isAdvancedOpen ? "var(--streetlamp-yellow)" : "rgba(255, 255, 255, 0.7)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isAdvancedOpen ? "0 4px 15px rgba(232, 197, 71, 0.15)" : "none"
                }}
                onMouseOver={(e) => {
                  if (!isAdvancedOpen) {
                    e.currentTarget.style.borderColor = "var(--streetlamp-yellow)";
                    e.currentTarget.style.color = "var(--streetlamp-yellow)";
                    e.currentTarget.style.background = "rgba(232, 197, 71, 0.04)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isAdvancedOpen) {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.17)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="14" y1="21" y2="21" />
                  <line x1="4" x2="10" y1="14" y2="14" />
                  <line x1="4" x2="18" y1="7" y2="7" />
                  <circle cx="14" cy="7" r="3" />
                  <circle cx="16" cy="14" r="3" />
                  <circle cx="18" cy="21" r="3" />
                </svg>
                {isAdvancedOpen ? "Hide Advanced Search" : "Advanced Search"}
              </button>
            </div>

            {/* Advanced Filter Panel */}
            {isAdvancedOpen && (
              <AdvancedFilterPanel
                tab={tab}
                filters={filters}
                onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
                onReset={() => setFilters({
                  genre: "",
                  year: "",
                  studio: "",
                  country: "",
                  duration: "",
                  rating: "",
                  status: ""
                })}
                matchCount={filteredItems.length}
                totalCount={items.length}
              />
            )}

            {/* Cinematic Spotlight Showcase Banner */}
            {spotlightItem && !loading && (
              <div 
                className="spotlight-container"
                style={{
                  position: "relative",
                  background: "linear-gradient(180deg, rgba(38, 38, 43, 0.2) 0%, rgba(15, 15, 15, 0.8) 100%)",
                  border: "1px solid var(--smoke-grey)",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  width: "100%",
                  maxWidth: "100%",
                  margin: "0 auto 3rem auto",
                  display: "flex",
                  flexDirection: "row",
                  gap: "2.5rem",
                  overflow: "hidden",
                  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Ambient gold glow in top right */}
                <div style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "250px",
                  height: "250px",
                  background: "radial-gradient(circle, rgba(232, 197, 71, 0.12) 0%, transparent 70%)",
                  pointerEvents: "none"
                }} />

                {/* Poster Thumbnail */}
                <div 
                  style={{
                    width: "180px",
                    aspectRatio: "2/3",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0
                  }}
                  className="spotlight-poster-wrapper"
                >
                  <img 
                    src={spotlightImage} 
                    alt={spotlightTitle} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Showcase Details */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                    <span style={{
                      background: "rgba(232, 197, 71, 0.12)",
                      color: "var(--streetlamp-yellow)",
                      border: "1px solid rgba(232, 197, 71, 0.25)",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <FlameIcon size={12} fill="var(--streetlamp-yellow)" color="var(--streetlamp-yellow)" /> Trending
                    </span>

                    {spotlightScore && (
                      <span style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#FFF",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <StarIcon size={11} fill="var(--streetlamp-yellow)" color="var(--streetlamp-yellow)" /> Rating {spotlightScore}
                      </span>
                    )}

                    {spotlightYear && (
                      <span style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "rgba(212, 212, 215, 0.7)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        <CalendarIcon size={11} /> {spotlightYear}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 5vw, 2.25rem)",
                    fontWeight: "700",
                    color: "#FFFFFF",
                    margin: "0 0 1rem 0",
                    lineHeight: "1.2",
                    letterSpacing: "-0.02em"
                  }}>
                    {spotlightTitle}
                  </h3>

                  <p style={{
                    fontSize: "0.9rem",
                    color: "rgba(212, 212, 215, 0.8)",
                    lineHeight: "1.6",
                    margin: "0 0 1.5rem 0",
                    maxHeight: "100px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis"
                  }}>
                    {spotlightSynopsis || "Synopsis is not available for this item."}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "12px", width: "100%" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontFamily: "var(--font-mono)",
                      color: "rgba(255, 255, 255, 0.4)"
                    }}>
                      ARCHIVU ID: {tab === "anime" ? spotlightItem.mal_id : spotlightItem.id}
                    </span>
                    {spotlightItem.source && (
                      <span style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-mono)",
                        color: "rgba(255, 255, 255, 0.4)"
                      }}>
                        • SOURCE: {spotlightItem.source}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedItem(spotlightItem);
                        setSelectedType(tab);
                      }}
                      className="tab active"
                      style={{
                        marginLeft: "auto",
                        padding: "6px 14px",
                        fontSize: "0.725rem",
                        letterSpacing: "0.5px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Open Details & Review 👀
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Section Heading */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--smoke-grey)", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", textTransform: "uppercase", letterSpacing: "1px", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
                <AwardIcon size={18} color="var(--streetlamp-yellow)" />
                {searchQuery ? `Search Results: "${searchQuery}"` : `Popular Collections`}
              </h4>
              <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.45)", fontFamily: "var(--font-mono)" }}>
                Integrated Database
              </span>
            </div>

            {loading ? (
              <div className="loading" style={{ minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <p>Loading...</p>
              </div>
            ) : (
              <CardGrid 
                items={filteredItems} 
                type={tab} 
                favorites={tab === "anime" ? favoritesAnime : favoritesMovie}
                onToggleFavorite={handleToggleFavorite}
                onCardClick={(item) => {
                  setSelectedItem(item);
                  setSelectedType(tab);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
