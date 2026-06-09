import { useState, useEffect } from "react";

// Solid SVG icons for beautiful presentation
const BackIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" x2="5" y1="12" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const StarIcon = ({ size = 16, fill = "none", color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CalendarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <span style={{ fontSize: "1rem" }}>{filled ? "❤️" : "♡"}</span>
);

export default function DetailView({
  item,
  type,
  onClose,
  isFavorite,
  onToggleFavorite,
  onUpdateWatchlistTab
}) {
  const itemId = type === "anime" ? item.mal_id : item.id;
  
  // Extract values based on media type
  const isAnime = type === "anime";
  const title = isAnime ? item.title : item.title || item.name;
  const score = isAnime ? item.score : item.vote_average?.toFixed(1);
  const year = isAnime 
    ? item.year || item.aired?.prop?.from?.year || (item.aired?.from && new Date(item.aired.from).getFullYear()) 
    : item.release_date?.slice(0, 4);
  const imageURL = isAnime 
    ? item.images?.jpg?.large_image_url || item.images?.jpg?.image_url
    : (item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null);
  const synopsis = isAnime ? item.synopsis : item.overview;
  const genres = isAnime 
    ? (item.genres || []).map(g => g.name) 
    : []; // For TMDB we can map typical fallback or show basic badges

  const statusText = isAnime ? item.status : (item.release_date ? "Released" : "In Production");
  const durationText = isAnime ? item.duration : "Approx. 2h 10m";
  const episodesText = isAnime ? (item.episodes ? `${item.episodes} Episodes` : "On Air") : null;
  const studioText = isAnime ? (item.studios || []).map(s => s.name).join(", ") : "N/A";

  // Watchlist tracker states
  const [watchlistStatus, setWatchlistStatus] = useState(""); // "" | "watching" | "completed" | "plantowatch"
  
  // Personal rating & review states
  const [userRating, setUserRating] = useState(0); // 1-10
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [savedReview, setSavedReview] = useState(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  // Load Watchlist Status, Rating, & Review on open
  useEffect(() => {
    // 1. Get watchlist status
    const listSaved = localStorage.getItem("archivu_watchlist");
    if (listSaved) {
      const currentList = JSON.parse(listSaved);
      const match = currentList.find(w => w.id === itemId && w.type === type);
      if (match) {
        setWatchlistStatus(match.status);
      } else {
        setWatchlistStatus("");
      }
    }

    // 2. Get user review and rating
    const reviewsSaved = localStorage.getItem("archivu_reviews");
    if (reviewsSaved) {
      const allReviews = JSON.parse(reviewsSaved);
      const match = allReviews.find(r => r.id === itemId && r.type === type);
      if (match) {
        setSavedReview(match);
        setUserRating(match.rating);
        setReviewText(match.text);
      } else {
        setSavedReview(null);
        setUserRating(0);
        setReviewText("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, type]);

  // Handle Watchlist status change
  const handleWatchlistChange = (status) => {
    const listSaved = localStorage.getItem("archivu_watchlist") || "[]";
    let currentList = JSON.parse(listSaved);
    
    if (status === "") {
      // Remove from watchlist
      currentList = currentList.filter(w => !(w.id === itemId && w.type === type));
      setWatchlistStatus("");
    } else {
      // Upsert to watchlist
      const existingIdx = currentList.findIndex(w => w.id === itemId && w.type === type);
      const watchItem = {
        id: itemId,
        title: title,
        image: imageURL,
        score: score,
        year: year,
        type: type,
        status: status, // "watching", "completed", "plantowatch"
        updatedAt: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      };

      if (existingIdx > -1) {
        currentList[existingIdx] = watchItem;
      } else {
        currentList.push(watchItem);
      }
      setWatchlistStatus(status);

      // SINKRONISASI OTOMATIS KE SEJARAH AKTIVITAS PROFIL USER
      const progressLabels = {
        watching: "Started watching",
        completed: "Finished watching",
        plantowatch: "Plan to watch"
      };
      
      const savedHistory = localStorage.getItem("archivu_watch_history") || "[]";
      let historyList = JSON.parse(savedHistory);
      // Tambahkan log riwayat tontonan baru
      const newLog = {
        id: Date.now(),
        title: title,
        type: isAnime ? "Anime" : "Movie",
        date: new Date().toLocaleDateString("en-US", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }),
        progress: progressLabels[status],
        episodes: isAnime ? (item.episodes || 12) : 0
      };
      // Masukkan ke history teratas
      localStorage.setItem("archivu_watch_history", JSON.stringify([newLog, ...historyList]));
      if (onUpdateWatchlistTab) {
        onUpdateWatchlistTab();
      }
    }

    localStorage.setItem("archivu_watchlist", JSON.stringify(currentList));
  };

  // Save Review and Rating
  const handleSaveReview = (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please provide a rating (1 - 10) first!");
      return;
    }

    const reviewsSaved = localStorage.getItem("archivu_reviews") || "[]";
    let allReviews = JSON.parse(reviewsSaved);

    const reviewObj = {
      id: itemId,
      type: type,
      title: title,
      image: imageURL,
      rating: userRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };

    const existingIdx = allReviews.findIndex(r => r.id === itemId && r.type === type);
    if (existingIdx > -1) {
      allReviews[existingIdx] = reviewObj;
    } else {
      allReviews.push(reviewObj);
    }

    localStorage.setItem("archivu_reviews", JSON.stringify(allReviews));
    setSavedReview(reviewObj);
    setIsEditingReview(false);
  };

  // Delete Review and Rating
  const handleDeleteReview = () => {
    if (confirm("Delete your rating and review for this item?")) {
      const reviewsSaved = localStorage.getItem("archivu_reviews") || "[]";
      let allReviews = JSON.parse(reviewsSaved);
      allReviews = allReviews.filter(r => !(r.id === itemId && r.type === type));
      localStorage.setItem("archivu_reviews", JSON.stringify(allReviews));
      setSavedReview(null);
      setUserRating(0);
      setReviewText("");
      setIsEditingReview(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "1.5rem auto 4rem auto", animation: "fadeIn 0.4s ease forwards" }}>
      {/* Back button link */}
      <button
        onClick={onClose}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.65)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.825rem",
          cursor: "pointer",
          marginBottom: "2rem",
          padding: "4px 8px",
          borderRadius: "4px",
          transition: "all 0.2s"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = "var(--streetlamp-yellow)";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = "rgba(255,255,255,0.65)";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <BackIcon size={14} color="currentColor" /> Back to Explore
      </button>

      {/* Main detail showcase card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(25, 25, 30, 0.75) 0%, rgba(12, 12, 15, 0.95) 100%)",
        border: "1px solid var(--smoke-grey)",
        borderRadius: "16px",
        padding: "2.5rem",
        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
        marginBottom: "2.5rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Glow ambient background decoration */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(232, 197, 71, 0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "2.5rem"
        }} className="detail-grid">
          
          {/* Column 1: Poster, Favorite, and technical side traits */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              aspectRatio: "2/3",
              background: "#15151a"
            }}>
              <img 
                src={imageURL} 
                alt={title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>

            {/* Favorite & Quick Status triggers */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => onToggleFavorite({
                  id: itemId,
                  title: title,
                  image: imageURL,
                  score: score,
                  year: year,
                  type: type
                })}
                style={{
                  flex: 1,
                  background: isFavorite ? "rgba(255, 45, 45, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${isFavorite ? "#FF2D2D" : "var(--smoke-grey)"}`,
                  borderRadius: "8px",
                  color: isFavorite ? "#FF2D2D" : "rgba(255,255,255,0.85)",
                  padding: "10px 14px",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                <HeartIcon filled={isFavorite} /> {isFavorite ? "Favorited" : "Add to Favorites"}
              </button>
            </div>

            {/* Quick Metadata fields block */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "1rem"
            }}>
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", display: "block" }}>
                  Release Status
                </span>
                <span style={{ fontSize: "0.85rem", color: "#FFF", fontWeight: "600" }}>{statusText || "-"}</span>
              </div>
              {episodesText && (
                <div style={{ marginBottom: "0.85rem" }}>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", display: "block" }}>
                    Episodes Count
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#FFF", fontWeight: "600" }}>{episodesText}</span>
                </div>
              )}
              <div style={{ marginBottom: "0.85rem" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", display: "block" }}>
                  Running Time
                </span>
                <span style={{ fontSize: "0.85rem", color: "#FFF", fontWeight: "600" }}>{durationText || "-"}</span>
              </div>
              {isAnime && (
                <div>
                  <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", display: "block" }}>
                    Production Studio
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#FFF", fontWeight: "600" }}>{studioText || "-"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Core info + Watchlist manager + User Review Widget */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            
            {/* Title & basic scores */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <span style={{
                background: isAnime ? "rgba(212, 118, 44, 0.15)" : "rgba(26, 46, 64, 0.35)",
                color: isAnime ? "var(--cigarette-orange)" : "rgba(100, 180, 255, 1)",
                border: `1px solid ${isAnime ? "rgba(212, 118, 44, 0.3)" : "rgba(100, 180, 255, 0.3)"}`,
                fontSize: "0.65rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "4px",
                textTransform: "uppercase"
              }}>
                {isAnime ? "ANIME" : "MOVIE"}
              </span>
              {year && (
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CalendarIcon size={11} /> {year}
                </span>
              )}
            </div>

            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.75rem",
              fontWeight: "800",
              color: "#FFF",
              margin: "0 0 1rem 0",
              letterSpacing: "-0.02em",
              lineHeight: "1.2"
            }}>
              {title}
            </h2>

            {/* Official Global Score Banner */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.5rem" }}>
              <div style={{
                background: "rgba(232, 197, 71, 0.08)",
                border: "1px solid rgba(232, 197, 71, 0.2)",
                padding: "8px 14px",
                borderRadius: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <StarIcon size={14} fill="var(--streetlamp-yellow)" color="var(--streetlamp-yellow)" />
                <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#FFF" }}>{score || "No Rating"}</span>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono)" }}>GLOBAL SCORE</span>
              </div>
            </div>

            {/* WATCHLIST MANAGER */}
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--smoke-grey)",
              borderRadius: "12px",
              padding: "1.25rem 1.75rem",
              marginBottom: "1.75rem"
            }}>
              <h4 style={{
                margin: "0 0 0.75rem 0",
                fontSize: "0.85rem",
                fontFamily: "var(--font-display)",
                color: "var(--streetlamp-yellow)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                📌 Set Watchlist Status (Watchlist)
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  { id: "watching", label: "📺 Watching", activeBg: "rgba(212, 118, 44, 0.15)", activeBorder: "rgba(212,118,44,0.5)", activeColor: "var(--cigarette-orange)" },
                  { id: "completed", label: "✅ Completed", activeBg: "rgba(40, 167, 69, 0.15)", activeBorder: "rgba(40,167,69,0.5)", activeColor: "#28a745" },
                  { id: "plantowatch", label: "⏳ Plan to Watch", activeBg: "rgba(100, 180, 255, 0.15)", activeBorder: "rgba(100,180,255,0.5)", activeColor: "rgba(100, 180, 255, 1)" }
                ].map((st) => {
                  const isCurrent = watchlistStatus === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => handleWatchlistChange(isCurrent ? "" : st.id)}
                      style={{
                        background: isCurrent ? st.activeBg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isCurrent ? st.activeBorder : "var(--smoke-grey)"}`,
                        color: isCurrent ? st.activeColor : "rgba(255,255,255,0.75)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.785rem",
                        fontWeight: "600",
                        padding: "8px 16px",
                        borderRadius: "30px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {st.label}
                    </button>
                  );
                })}
                {watchlistStatus && (
                  <button
                    onClick={() => handleWatchlistChange("")}
                    style={{
                      background: "rgba(255, 45, 45, 0.05)",
                      border: "1px solid rgba(255, 45, 45, 0.2)",
                      color: "#FF2D2D",
                      fontFamily: "var(--font-display)",
                      fontSize: "0.785rem",
                      fontWeight: "600",
                      padding: "8px 14px",
                      borderRadius: "30px",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    🚫 Remove Watchlist
                  </button>
                )}
              </div>
            </div>

            {/* Synopsis Section */}
            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{
                margin: "0 0 0.5rem 0",
                fontSize: "0.85rem",
                fontFamily: "var(--font-display)",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                📖 Synopsis Summary
              </h4>
              <p style={{
                fontSize: "0.925rem",
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.8)",
                margin: 0
              }}>
                {synopsis || "Synopsis summary for this item is not available from the provider."}
              </p>
            </div>

            {/* Genre Badge Row */}
            {genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1rem" }}>
                {genres.map((g, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-mono)",
                      padding: "3px 9px",
                      borderRadius: "4px"
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RATING & REVIEW WIDGET SECTION CONTAINER */}
      <div style={{
        background: "linear-gradient(135deg, rgba(22, 22, 28, 0.8) 0%, rgba(13, 13, 17, 0.95) 100%)",
        border: "1px solid var(--smoke-grey)",
        borderRadius: "16px",
        padding: "2.5rem",
        boxShadow: "0 15px 40px rgba(0,0,0,0.6)"
      }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.35rem",
          fontWeight: "700",
          color: "#FFF",
          margin: "0 0 1.5rem 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid var(--smoke-grey)",
          paddingBottom: "10px"
        }}>
          ✒️ Member Ratings & Reviews
        </h3>

        {/* Saved ulasan placeholder / edit trigger */}
        {savedReview && !isEditingReview ? (
          <div>
            <div style={{
              background: "rgba(232, 197, 71, 0.03)",
              border: "1px solid rgba(232, 197, 71, 0.15)",
              borderRadius: "12px",
              padding: "1.75rem",
              position: "relative"
            }}>
              {/* Star review score display */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: "4px" }}>
                    SKOR ULASAN ANDA
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ display: "flex" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <span key={num} style={{ marginRight: "1px" }}>
                          <StarIcon 
                            size={14} 
                            fill={num <= savedReview.rating ? "var(--streetlamp-yellow)" : "none"} 
                            color={num <= savedReview.rating ? "var(--streetlamp-yellow)" : "rgba(255,255,255,0.15)"} 
                          />
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--streetlamp-yellow)" }}>
                      {savedReview.rating} <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>/ 10</span>
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)" }}>
                  Written on {savedReview.date}
                </span>
              </div>

              {savedReview.text ? (
                <p style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.85)",
                  background: "rgba(0,0,0,0.2)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.02)",
                  margin: "0 0 1.5rem 0",
                  whiteSpace: "pre-wrap"
                }}>
                  {savedReview.text}
                </p>
              ) : (
                <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "rgba(255,255,255,0.4)", margin: "0 0 1.5rem 0" }}>
                  No written review. Only score rated.
                </p>
              )}

              {/* Edit and Delete Actions */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setIsEditingReview(true)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--smoke-grey)",
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "var(--streetlamp-yellow)";
                    e.currentTarget.style.color = "var(--streetlamp-yellow)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--smoke-grey)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }}
                >
                  ✏️ Edit Review
                </button>
                <button
                  onClick={handleDeleteReview}
                  style={{
                    background: "rgba(255,45,45,0.05)",
                    border: "1px solid rgba(255,45,45,0.15)",
                    color: "#FF2D2D",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  🗑️ Delete Review
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Editor form */
          <form onSubmit={handleSaveReview}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.825rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-display)", marginBottom: "8px", fontWeight: "600" }}>
                Rate This Item (1 - 10)
              </label>
              
              {/* 10-Star click tracker */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex" }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isLit = num <= (hoverRating || userRating);
                    return (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setUserRating(num)}
                        onMouseEnter={() => setHoverRating(num)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "2px",
                          cursor: "pointer",
                          transition: "transform 0.1s"
                        }}
                      >
                        <StarIcon
                          size={18}
                          fill={isLit ? "var(--streetlamp-yellow)" : "none"}
                          color={isLit ? "var(--streetlamp-yellow)" : "rgba(255,255,255,0.25)"}
                        />
                      </button>
                    );
                  })}
                </div>
                {userRating > 0 && (
                  <span style={{ fontSize: "1rem", fontWeight: "800", color: "var(--streetlamp-yellow)", fontFamily: "var(--font-mono)" }}>
                    {userRating} / 10
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.825rem", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-display)", marginBottom: "8px", fontWeight: "600" }}>
                Written Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review, opinion, or detailed analysis about this anime/movie..."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  background: "rgba(0,0,0,0.2)",
                  border: "1px solid var(--smoke-grey)",
                  borderRadius: "8px",
                  color: "#FFF",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                  padding: "12px 16px",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  background: "var(--streetlamp-yellow)",
                  border: "1px solid var(--streetlamp-yellow)",
                  color: "#000",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                💾 Save Rating & Review
              </button>
              {savedReview && (
                <button
                  type="button"
                  onClick={() => setIsEditingReview(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--smoke-grey)",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.8rem",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
