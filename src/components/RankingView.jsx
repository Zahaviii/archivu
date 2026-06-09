import { useState, useEffect } from "react";
import { getTopAnime, getPopularAnime, getAiringAnime } from "../api/jikan";
import { getPopularMovies, getTopRatedMovies, getTrendingMovies, IMG_BASE } from "../api/tmdb";

// Built-in lightweight custom icons
const TrophyIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
    <path d="M12 2a6 6 0 0 1 6 6v3.5c0 1.66-1.34 3-3 3H9a3 3 0 0 1-3-3V8a6 6 0 0 1 6-6Z" />
  </svg>
);

const StarIcon = ({ size = 12, fill = "none", color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <span>{filled ? "❤️" : "♡"}</span>
);

export default function RankingView({
  favoritesAnime,
  favoritesMovie,
  onToggleFavorite,
  onCardClick
}) {
  // Available sub-tabs matching the exact user requests
  const rankSubTabs = [
    { id: "top_anime", label: "Top Anime" },
    { id: "top_film", label: "Top Movies" },
    { id: "trending_week", label: "Weekly Trending" },
    { id: "most_popular", label: "Most Popular" },
    { id: "highest_rated", label: "Highest Rated" }
  ];

  const [activeSubTab, setActiveSubTab] = useState("top_anime");
  const [loading, setLoading] = useState(false);
  
  // Data lists
  const [animeList, setAnimeList] = useState([]);
  const [movieList, setMovieList] = useState([]);
  
  // Active toggle inside dual-lists (All, Anime, Film)
  const [filterType, setFilterType] = useState("all"); // 'all', 'anime', 'movie'

  const favAnimeIds = new Set((favoritesAnime || []).map(f => f.id));
  const favMovieIds = new Set((favoritesMovie || []).map(f => f.id));

  useEffect(() => {
    fetchRankingData();
  }, [activeSubTab]);

  const fetchRankingData = async () => {
    setLoading(true);
    try {
      if (activeSubTab === "top_anime") {
        const data = await getTopAnime();
        setAnimeList(data || []);
        setMovieList([]);
      } else if (activeSubTab === "top_film") {
        const data = await getTopRatedMovies();
        setMovieList(data || []);
        setAnimeList([]);
      } else if (activeSubTab === "trending_week") {
        const [anime, movies] = await Promise.all([
          getAiringAnime(),
          getTrendingMovies()
        ]);
        setAnimeList(anime || []);
        setMovieList(movies || []);
      } else if (activeSubTab === "most_popular") {
        const [anime, movies] = await Promise.all([
          getPopularAnime(),
          getPopularMovies()
        ]);
        setAnimeList(anime || []);
        setMovieList(movies || []);
      } else if (activeSubTab === "highest_rated") {
        const [anime, movies] = await Promise.all([
          getTopAnime(),
          getTopRatedMovies()
        ]);
        setAnimeList(anime || []);
        setMovieList(movies || []);
      }
    } catch (err) {
      console.error("Failed to load rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render Rank Badge helper
  const renderRankBadge = (index) => {
    const isTop3 = index < 3;
    let badgeBg = "rgba(15, 15, 15, 0.85)";
    let badgeBorder = "rgba(255, 255, 255, 0.15)";
    let badgeColor = "rgba(255, 255, 255, 0.85)";
    let label = `#${index + 1}`;

    if (index === 0) {
      badgeBg = "linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)"; // Gold
      badgeBorder = "#FFDF00";
      badgeColor = "#000000";
      label = "👑 1";
    } else if (index === 1) {
      badgeBg = "linear-gradient(135deg, #E6E6E6 0%, #999999 100%)"; // Silver
      badgeBorder = "#E6E6E6";
      badgeColor = "#000000";
      label = "🥈 2";
    } else if (index === 2) {
      badgeBg = "linear-gradient(135deg, #FFaa44 0%, #B87333 100%)"; // Bronze
      badgeBorder = "#B87333";
      badgeColor = "#000000";
      label = "🥉 3";
    }

    return (
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        background: badgeBg,
        border: `1px solid ${badgeBorder}`,
        color: badgeColor,
        fontFamily: "var(--font-mono)",
        fontSize: "0.725rem",
        fontWeight: isTop3 ? "800" : "600",
        padding: "3px 9px",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: "3px"
      }}>
        {label}
      </div>
    );
  };

  // Rendering a unified card component within RankinView
  const RankingCard = ({ item, type, index }) => {
    const isAnime = type === "anime";
    const itemId = isAnime ? item.mal_id : item.id;
    const isFav = isAnime ? favAnimeIds.has(itemId) : favMovieIds.has(itemId);
    const imageURL = isAnime 
      ? item.images?.jpg?.image_url 
      : (item.poster_path ? IMG_BASE + item.poster_path : null);
    const title = item.title;
    const score = isAnime ? item.score : item.vote_average?.toFixed(1);
    const year = isAnime ? item.year || item.aired?.prop?.from?.year : item.release_date?.slice(0, 4);

    return (
      <div 
        key={`${type}-${itemId}`}
        className="card" 
        style={{ 
          position: "relative",
          cursor: "pointer",
          animation: "fadeIn 0.4s ease forwards" 
        }}
        onClick={() => onCardClick(item, type)}
      >
        {renderRankBadge(index)}

        <img src={imageURL} alt={title} style={{ width: "100%", height: "280px", objectFit: "cover" }} />
        
        {/* Heart button for favorites */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite({
              id: itemId,
              title: title,
              image: imageURL,
              score: score,
              year: year,
              type: type
            });
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "rgba(8, 8, 12, 0.75)",
            border: `1px solid ${isFav ? "#FF2D2D" : "rgba(255, 255, 255, 0.2)"}`,
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: isFav ? "#FF2D2D" : "#FFF",
            transition: "all 0.2s ease",
            fontSize: "0.9rem",
            zIndex: 11
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            if (!isFav) {
              e.currentTarget.style.borderColor = "#FF2D2D";
              e.currentTarget.style.color = "#FF2D2D";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            if (!isFav) {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.color = "#FFF";
            }
          }}
        >
          <HeartIcon filled={isFav} />
        </button>

        <div className="card-info" style={{ padding: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span style={{
              background: isAnime ? "rgba(212, 118, 44, 0.15)" : "rgba(26, 46, 64, 0.35)",
              color: isAnime ? "var(--cigarette-orange)" : "rgba(100, 180, 255, 1)",
              border: `1px solid ${isAnime ? "rgba(212, 118, 44, 0.3)" : "rgba(100, 180, 255, 0.3)"}`,
              fontSize: "0.58rem",
              fontFamily: "var(--font-mono)",
              fontWeight: "bold",
              padding: "1px 5px",
              borderRadius: "3px",
              textTransform: "uppercase"
            }}>
              {isAnime ? "ANIME" : "MOVIE"}
            </span>
            {year && (
              <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                {year}
              </span>
            )}
          </div>
          <p className="card-title" style={{ fontSize: "0.88rem", fontWeight: "600", color: "#FFF", margin: "2px 0 6px 0", height: "40px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </p>
          <div className="card-meta" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <StarIcon size={12} fill="var(--streetlamp-yellow)" color="var(--streetlamp-yellow)" />
              <span style={{ color: "#FFF", fontSize: "0.8rem", fontWeight: "700" }}>{score || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Determine lists to show depending on Sub-tab
  const hasDualLists = ["trending_week", "most_popular", "highest_rated"].includes(activeSubTab);

  return (
    <div style={{ maxWidth: "1200px", margin: "1.5rem auto 4rem auto" }}>
      {/* Header section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: "8px", 
          background: "rgba(232, 197, 71, 0.08)", 
          border: "1px solid rgba(232, 197, 71, 0.25)", 
          padding: "6px 16px", 
          borderRadius: "30px", 
          marginBottom: "1rem",
          boxShadow: "0 4px 20px rgba(232, 197, 71, 0.05)"
        }}>
          <TrophyIcon size={13} color="var(--streetlamp-yellow)" />
          <span style={{ 
            fontSize: "0.725rem", 
            fontFamily: "var(--font-mono)", 
            color: "var(--streetlamp-yellow)", 
            fontWeight: 600, 
            textTransform: "uppercase", 
            letterSpacing: "1.5px" 
          }}>
            Leaderboard & Rankings
          </span>
        </div>
        <h2 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "3rem", 
          fontWeight: "800", 
          color: "#FFFFFF", 
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em"
        }}>
          Popular Leaderboards
        </h2>
        <p style={{ 
          fontSize: "1rem", 
          color: "rgba(255, 255, 255, 0.55)", 
          maxWidth: "600px", 
          margin: "0 auto",
          lineHeight: "1.5"
        }}>
          Explore the best trending anime and movies chosen by critics and the community this week!
        </p>
      </div>

      {/* Sub-tab menu for ranking category */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        flexWrap: "wrap", 
        gap: "10px", 
        marginBottom: "2.5rem",
        borderBottom: "1px solid var(--smoke-grey)",
        paddingBottom: "1.25rem"
      }}>
        {rankSubTabs.map((subTab) => {
          const isActive = activeSubTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => {
                setActiveSubTab(subTab.id);
                setFilterType("all");
              }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: isActive ? "600" : "500",
                background: isActive ? "var(--streetlamp-yellow)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? "var(--streetlamp-yellow)" : "var(--smoke-grey)"}`,
                color: isActive ? "var(--noir-black)" : "rgba(255,255,255,0.75)",
                padding: "8px 18px",
                borderRadius: "30px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: isActive ? "0 4px 15px rgba(232, 197, 71, 0.25)" : "none"
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--streetlamp-yellow)";
                  e.currentTarget.style.color = "var(--streetlamp-yellow)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "var(--smoke-grey)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }
              }}
            >
              {subTab.label}
            </button>
          );
        })}
      </div>

      {/* Type Filter Buttons for Dual-list Tabs (Trending, Popular, Highest Rated) */}
      {hasDualLists && !loading && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "2.5rem"
        }}>
          {["all", "anime", "movie"].map((opt) => {
            const isActive = filterType === opt;
            const labels = { all: "All (Compare)", anime: "Anime Only", movie: "Movies Only" };
            return (
              <button
                key={opt}
                onClick={() => setFilterType(opt)}
                style={{
                  background: isActive ? "rgba(232, 197, 71, 0.12)" : "transparent",
                  border: `1px solid ${isActive ? "var(--streetlamp-yellow)" : "rgba(255, 255, 255, 0.1)"}`,
                  color: isActive ? "var(--streetlamp-yellow)" : "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {labels[opt]}
              </button>
            );
          })}
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            border: "3px solid rgba(232, 197, 71, 0.15)", 
            borderTopColor: "var(--streetlamp-yellow)", 
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <p style={{ marginTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Loading Leaderboards...</p>
        </div>
      ) : (
        <div>
          {/* Top Anime Only */}
          {activeSubTab === "top_anime" && (
            <div className="grid">
              {animeList.slice(0, 20).map((item, index) => (
                <RankingCard key={item.mal_id} item={item} type="anime" index={index} />
              ))}
            </div>
          )}

          {/* Top Film Only */}
          {activeSubTab === "top_film" && (
            <div className="grid">
              {movieList.slice(0, 20).map((item, index) => (
                <RankingCard key={item.id} item={item} type="movie" index={index} />
              ))}
            </div>
          )}

          {/* Dual Lists (Trending, Popular, Highest Rated) rendered depending on selection side-by-side or singular */}
          {hasDualLists && (
            <div>
              {/* Filter Type is ALL: Elegant dual lists side by side */}
              {filterType === "all" && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2.5rem",
                }}
                className="ranking-dual-columns"
                >
                  {/* Left Column Anime */}
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      color: "var(--streetlamp-yellow)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      borderBottom: "1px solid var(--smoke-grey)",
                      paddingBottom: "8px",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      📺 Anime Leaderboard
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {animeList.slice(0, 10).map((item, idx) => {
                        const itemId = item.mal_id;
                        const isFav = favAnimeIds.has(itemId);
                        const imageURL = item.images?.jpg?.image_url;
                        return (
                          <div 
                            key={`list-anime-${itemId}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid var(--smoke-grey)",
                              borderRadius: "6px",
                              padding: "10px 14px",
                              gap: "14px",
                              cursor: "pointer"
                            }}
                            onClick={() => onCardClick(item, "anime")}
                          >
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "1rem",
                              fontWeight: "700",
                              width: "30px",
                              color: idx === 0 ? "#FFDF00" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "rgba(255,255,255,0.4)"
                            }}>
                              #{idx + 1}
                            </span>
                            <img src={imageURL} alt={item.title} style={{ width: "40px", height: "55px", objectFit: "cover", borderRadius: "4px" }} />
                            <div style={{ flex: 1, overflow: "hidden" }}>
                              <h4 style={{ fontSize: "0.825rem", color: "#FFF", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                                {item.title}
                              </h4>
                              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", margin: "3px 0 0 0" }}>
                                {item.year || item.aired?.prop?.from?.year || "-"} • ⭐ {item.score || "N/A"}
                              </p>
                            </div>
                            <button
                              onClick={() => onToggleFavorite({
                                id: itemId,
                                title: item.title,
                                image: imageURL,
                                score: item.score,
                                year: item.year || item.aired?.prop?.from?.year,
                                type: "anime"
                              })}
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1rem",
                                color: isFav ? "#FF2D2D" : "rgba(255,255,255,0.2)",
                                transition: "color 0.2s"
                              }}
                            >
                              <HeartIcon filled={isFav} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column Film */}
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      color: "rgba(100, 180, 255, 1)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      borderBottom: "1px solid var(--smoke-grey)",
                      paddingBottom: "8px",
                      marginBottom: "1.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      🎬 Movie Leaderboard
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {movieList.slice(0, 10).map((item, idx) => {
                        const itemId = item.id;
                        const isFav = favMovieIds.has(itemId);
                        const imageURL = item.poster_path ? IMG_BASE + item.poster_path : null;
                        return (
                          <div 
                            key={`list-movie-${itemId}`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid var(--smoke-grey)",
                              borderRadius: "6px",
                              padding: "10px 14px",
                              gap: "14px",
                              cursor: "pointer"
                            }}
                            onClick={() => onCardClick(item, "movie")}
                          >
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "1rem",
                              fontWeight: "700",
                              width: "30px",
                              color: idx === 0 ? "#FFDF00" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "rgba(255,255,255,0.4)"
                            }}>
                              #{idx + 1}
                            </span>
                            <img src={imageURL} alt={item.title} style={{ width: "40px", height: "55px", objectFit: "cover", borderRadius: "4px" }} />
                            <div style={{ flex: 1, overflow: "hidden" }}>
                              <h4 style={{ fontSize: "0.825rem", color: "#FFF", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                                {item.title}
                              </h4>
                              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", margin: "3px 0 0 0" }}>
                                {item.release_date?.slice(0, 4) || "-"} • ⭐ {item.vote_average?.toFixed(1) || "N/A"}
                              </p>
                            </div>
                            <button
                              onClick={() => onToggleFavorite({
                                id: itemId,
                                title: item.title,
                                image: imageURL,
                                score: item.vote_average?.toFixed(1),
                                year: item.release_date?.slice(0, 4),
                                type: "movie"
                              })}
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "1rem",
                                color: isFav ? "#FF2D2D" : "rgba(255,255,255,0.2)",
                                transition: "color 0.2s"
                              }}
                            >
                              <HeartIcon filled={isFav} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Type is Anime (Show only anime as Grid) */}
              {filterType === "anime" && (
                <div className="grid">
                  {animeList.slice(0, 20).map((item, index) => (
                    <RankingCard key={item.mal_id} item={item} type="anime" index={index} />
                  ))}
                </div>
              )}

              {/* Filter Type is Movie (Show only movies as Grid) */}
              {filterType === "movie" && (
                <div className="grid">
                  {movieList.slice(0, 20).map((item, index) => (
                    <RankingCard key={item.id} item={item} type="movie" index={index} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Embedded Spin Animation keyframe */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .ranking-dual-columns {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
