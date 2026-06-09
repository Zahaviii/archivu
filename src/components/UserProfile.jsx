import { useState, useEffect } from "react";

// Inline beautiful premium SVG avatar presets
const AvatarPresets = [
  {
    id: "glowing-punk",
    name: "Cyberpunk (Gold)",
    bgColor: "rgba(232, 197, 71, 0.1)",
    borderColor: "#E8C547",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#121216" stroke="#E8C547" strokeWidth="2" />
        <circle cx="50" cy="40" r="18" stroke="#E8C547" strokeWidth="2" fill="#222228" />
        <path d="M50 40 L50 25 M38 32 L62 32" stroke="#E8C547" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 80 C26 62, 74 62, 78 80" stroke="#E8C547" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="38" y="36" width="24" height="6" rx="2" fill="#E8C547" opacity="0.3" />
        <circle cx="45" cy="40" r="2" fill="#E8C547" />
        <circle cx="55" cy="40" r="2" fill="#E8C547" />
      </svg>
    )
  },
  {
    id: "noir-detective",
    name: "Noir Detective",
    bgColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255,255,255,0.4)",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#0E0E12" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <path d="M30 42 L70 42 L65 24 L35 24 Z" fill="#222228" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <rect x="25" y="42" width="50" height="4" rx="1" fill="rgba(255,255,255,0.7)" />
        <circle cx="50" cy="55" r="13" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="#15151A" />
        <path d="M24 82 C28 66, 72 66, 76 82" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
        <line x1="43" y1="55" x2="57" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "retro-pilot",
    name: "Classic Anime Pilot",
    bgColor: "rgba(212, 118, 44, 0.1)",
    borderColor: "#D4762C",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#121216" stroke="#D4762C" strokeWidth="2" />
        <polygon points="50,22 68,54 32,54" stroke="#D4762C" strokeWidth="2" fill="#222228" />
        <circle cx="43" cy="46" r="3" fill="#D4762C" />
        <circle cx="57" cy="46" r="3" fill="#D4762C" />
        <path d="M20 78 C24 64, 76 64, 80 78" stroke="#D4762C" strokeWidth="2.5" fill="none" />
        <path d="M30 32 C38 18, 62 18, 70 32" stroke="#D4762C" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    id: "neon-idol",
    name: "Neon Pop Star",
    bgColor: "rgba(255, 45, 45, 0.1)",
    borderColor: "#FF2D2D",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#121216" stroke="#FF2D2D" strokeWidth="2" />
        <path d="M32 30 H68 L60 55 H40 Z" stroke="#FF2D2D" strokeWidth="2" fill="#222228" />
        <polygon points="50,26 53,34 61,34 55,39 57,47 50,42 43,47 45,39 39,34 47,34" fill="#FF2D2D" />
        <path d="M22 80 C26 65, 74 65, 78 80" stroke="#FF2D2D" strokeWidth="2.5" fill="none" />
        <circle cx="34" cy="40" r="6" stroke="#FF2D2D" strokeWidth="1.5" />
        <circle cx="66" cy="40" r="6" stroke="#FF2D2D" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "deep-cinephile",
    name: "Midnight Director",
    bgColor: "rgba(26, 46, 64, 0.25)",
    borderColor: "#3E74A6",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#121216" stroke="#3E74A6" strokeWidth="2" />
        <circle cx="50" cy="40" r="15" stroke="#3E74A6" strokeWidth="2" fill="#222228" />
        <path d="M32 25 L45 25 M68 25 L55 25" stroke="#3E74A6" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 82 C26 66, 74 66, 78 82" stroke="#3E74A6" strokeWidth="2.5" fill="none" />
        <rect x="35" y="36" width="30" height="8" rx="4" fill="#3D4D5C" stroke="#3E74A6" strokeWidth="1.5" />
        <line x1="42" y1="40" x2="48" y2="40" stroke="#FFF" strokeWidth="1.5" />
        <line x1="52" y1="40" x2="58" y2="40" stroke="#FFF" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "cozy-critic",
    name: "Classic Critic",
    bgColor: "rgba(92, 10, 10, 0.15)",
    borderColor: "#9E3C3C",
    svg: (
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" fill="#121216" stroke="#9E3C3C" strokeWidth="2" />
        <circle cx="50" cy="38" r="16" stroke="#9E3C3C" strokeWidth="2" fill="#222228" />
        <path d="M20 80 C24 64, 76 64, 80 80" stroke="#9E3C3C" strokeWidth="2.5" fill="none" />
        <path d="M34 38 Q50,48 66,38" stroke="#9E3C3C" strokeWidth="2" fill="none" />
        <line x1="45" y1="36" x2="55" y2="36" stroke="#9E3C3C" strokeWidth="1.5" />
      </svg>
    )
  }
];

export default function UserProfile({ 
  favoritesAnime, 
  favoritesMovie, 
  onRemoveFavoriteAnime, 
  onRemoveFavoriteMovie,
  onCardClick 
}) {
  // Local states for User Details
  const [name, setName] = useState(() => localStorage.getItem("archivu_user_name") || "Archivu Collector");
  const [bio, setBio] = useState(() => localStorage.getItem("archivu_user_bio") || "Lover of visual art, premium anime, and legendary cinematography.");
  const [selectedAvatarId, setSelectedAvatarId] = useState(() => localStorage.getItem("archivu_user_avatar") || "glowing-punk");
  const [customAvatarUrl, setCustomAvatarUrl] = useState(() => localStorage.getItem("archivu_custom_avatar_url") || "");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);
  const [tempCustomUrl, setTempCustomUrl] = useState(customAvatarUrl);

  // Dynamic Watchlist state
  const [watchlist, setWatchlist] = useState([]);
  const [activeWatchTab, setActiveWatchTab] = useState("watching");

  useEffect(() => {
    const saved = localStorage.getItem("archivu_watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const handleRemoveWatchlist = (id, type) => {
    const saved = localStorage.getItem("archivu_watchlist") || "[]";
    const updated = JSON.parse(saved).filter(w => !(w.id === id && w.type === type));
    setWatchlist(updated);
    localStorage.setItem("archivu_watchlist", JSON.stringify(updated));
  };

  // Normalize saved local item into a complete object for DetailView compatibility
  const handleItemClick = (savedItem, mediaType) => {
    if (!onCardClick) return;
    const isAnime = mediaType === "anime";
    const apiItem = {
      id: savedItem.id,
      mal_id: savedItem.id,
      title: savedItem.title,
      score: savedItem.score,
      year: savedItem.year,
      images: isAnime ? { jpg: { large_image_url: savedItem.image, image_url: savedItem.image } } : null,
      poster_path: !isAnime && savedItem.image ? savedItem.image.replace("https://image.tmdb.org/t/p/w500", "").replace("https://image.tmdb.org/t/p/w300", "") : null,
      type: mediaType,
      overview: !isAnime ? "Full details are available on the explore page." : null,
      synopsis: isAnime ? "Full details are available on the explore page." : null
    };
    onCardClick(apiItem, mediaType);
  };

  // Statistics trackers derived dynamically from actual watch logs (no gimmicks)
  const [watchLogs, setWatchLogs] = useState(() => {
    const saved = localStorage.getItem("archivu_watch_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [newLogTitle, setNewLogTitle] = useState("");
  const [newLogType, setNewLogType] = useState("Anime");
  const [newLogEpisodes, setNewLogEpisodes] = useState("12");

  // Dynamically compute stats from user's watchlist logs
  const animeCount = watchLogs.filter(log => log.type === "Anime").length;
  const animeEpisodeCount = watchLogs
    .filter(log => log.type === "Anime")
    .reduce((acc, log) => acc + (parseInt(log.episodes) || 12), 0);
  const movieCount = watchLogs.filter(log => log.type === "Film" || log.type === "Movie").length;

  // Save changes to profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setName(tempName);
    setBio(tempBio);
    setCustomAvatarUrl(tempCustomUrl);
    localStorage.setItem("archivu_user_name", tempName);
    localStorage.setItem("archivu_user_bio", tempBio);
    localStorage.setItem("archivu_custom_avatar_url", tempCustomUrl);
    setIsEditing(false);
  };

  // Add watch log manually
  const handleAddWatchLog = (e) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    const eps = newLogType === "Anime" ? (parseInt(newLogEpisodes) || 12) : 0;
    const today = new Date().toLocaleDateString("en-US", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });

    const newLog = {
      id: Date.now(),
      title: newLogTitle,
      type: newLogType,
      date: today,
      progress: "Finished watching",
      episodes: eps
    };

    const updated = [newLog, ...watchLogs];
    setWatchLogs(updated);
    localStorage.setItem("archivu_watch_history", JSON.stringify(updated));

    setNewLogTitle("");
  };

  const handleClearLogs = () => {
    if (confirm("Do you want to clear your entire watch history?")) {
      setWatchLogs([]);
      localStorage.removeItem("archivu_watch_history");
    }
  };

  const handleDeleteLog = (id) => {
    const updated = watchLogs.filter(log => log.id !== id);
    setWatchLogs(updated);
    localStorage.setItem("archivu_watch_history", JSON.stringify(updated));
  };

  // Pick the rendered svg preset or the image url
  const currentPreset = AvatarPresets.find(p => p.id === selectedAvatarId) || AvatarPresets[0];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "4rem" }}>
      
      {/* Profil Banner Card */}
      <div style={{
        background: "linear-gradient(135deg, rgba(34, 34, 40, 0.4) 0%, rgba(15, 15, 18, 0.8) 100%)",
        border: "1px solid var(--smoke-grey)",
        borderRadius: "16px",
        padding: "clamp(1rem, 5vw, 2.5rem)",
        marginBottom: "2.5rem",
        position: "relative",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6)",
        overflow: "hidden"
      }}>
        {/* Glow neon-accent background decoration */}
        <div style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(232, 197, 71, 0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-90px",
          left: "-30px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(212, 118, 44, 0.06) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="user-profile-header" style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "2.5rem",
          flexWrap: "wrap"
        }}>
          {/* Avatar Display */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `3px solid ${customAvatarUrl ? "var(--streetlamp-yellow)" : currentPreset.borderColor}`,
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: currentPreset.bgColor,
              padding: customAvatarUrl ? "0" : "6px",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}>
              {customAvatarUrl ? (
                <img 
                  src={customAvatarUrl} 
                  alt="Custom Avatar" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => {
                    // fall back
                    setCustomAvatarUrl("");
                  }}
                />
              ) : (
                currentPreset.svg
              )}
            </div>
            
            <span style={{
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              color: "rgba(255, 255, 255, 0.35)",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "4px 10px",
              borderRadius: "12px",
              textTransform: "uppercase",
              letterSpacing: "1.5px"
            }}>
              {customAvatarUrl ? "Avatar URL" : currentPreset.name}
            </span>
          </div>

          {/* Profile Text Display or Form */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {!isEditing ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "0.5rem" }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 5vw, 2rem)",
                    fontWeight: "800",
                    color: "#FFFFFF",
                    margin: 0,
                    letterSpacing: "-0.01em"
                  }}>
                    {name}
                  </h3>
                  <button
                    onClick={() => {
                      setTempName(name);
                      setTempBio(bio);
                      setTempCustomUrl(customAvatarUrl);
                      setIsEditing(true);
                    }}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "0.75rem",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      transition: "0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "var(--streetlamp-yellow)";
                      e.currentTarget.style.color = "var(--streetlamp-yellow)";
                      e.currentTarget.style.background = "rgba(232, 197, 71, 0.05)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    }}
                  >
                    Edit Profile
                  </button>
                </div>

                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.725rem",
                  color: "var(--streetlamp-yellow)",
                  textTransform: "uppercase",
                  letterSpacing: "2.5px",
                  marginBottom: "1rem"
                }}>
                  ARCHIVU AMBASSADOR #2026
                </p>

                <p style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.7",
                  color: "rgba(255, 255, 255, 0.7)",
                  margin: "0 0 1.5rem 0",
                  whiteSpace: "pre-wrap"
                }}>
                  {bio}
                </p>

                {/* Favorite Preset Avatars Quick Switch (Non-editing view shortcut) */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginTop: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)", marginRight: "4px" }}>Preset Avatar:</span>
                  {AvatarPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedAvatarId(preset.id);
                        localStorage.setItem("archivu_user_avatar", preset.id);
                      }}
                      title={preset.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: `2px solid ${selectedAvatarId === preset.id ? "var(--streetlamp-yellow)" : "transparent"}`,
                        padding: "1px",
                        background: selectedAvatarId === preset.id ? "rgba(232, 197, 71, 0.15)" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {preset.svg}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
               <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: "6px" }}>Profile Name</label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={35}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#15151A",
                      border: "1px solid var(--smoke-grey)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--streetlamp-yellow)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--smoke-grey)"}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: "6px" }}>Short Bio</label>
                  <textarea
                    rows={3}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={200}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#15151A",
                      border: "1px solid var(--smoke-grey)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      outline: "none",
                      fontSize: "0.9rem",
                      resize: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--streetlamp-yellow)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--smoke-grey)"}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", marginBottom: "6px" }}>Or Custom Avatar URL (Image link)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/your-image.png"
                    value={tempCustomUrl}
                    onChange={(e) => setTempCustomUrl(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "#15151A",
                      border: "1px solid var(--smoke-grey)",
                      borderRadius: "6px",
                      color: "#FFFFFF",
                      outline: "none",
                      fontSize: "0.9rem"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--streetlamp-yellow)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--smoke-grey)"}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="submit"
                    style={{
                      background: "var(--streetlamp-yellow)",
                      border: "1px solid var(--streetlamp-yellow)",
                      color: "var(--noir-black)",
                      fontWeight: "600",
                      padding: "8px 20px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "rgba(255, 255, 255, 0.7)",
                      padding: "8px 20px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Stats and Log System */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
        marginBottom: "3rem"
      }}>
        {/* Watch Statistics Cards */}
        <div style={{
          background: "rgba(15, 15, 18, 0.7)",
          border: "1px solid var(--smoke-grey)",
          borderRadius: "12px",
          padding: "1.75rem"
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "#FFFFFF",
            marginBottom: "1.5rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            borderBottom: "1px solid var(--smoke-grey)",
            paddingBottom: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>Watching Statistics</span>
            <span style={{ fontSize: "0.65rem", color: "var(--streetlamp-yellow)", fontFamily: "var(--font-mono)" }}>Auto Calculated</span>
          </h4>

          {/* Stat 1: Anime */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.45)" }}>TOTAL ANIME</p>
                <h5 style={{ fontSize: "1.65rem", fontWeight: "700", color: "#FFF", margin: "4px 0" }}>{animeCount} <span style={{ fontSize: "0.85rem", fontWeight: "400", color: "rgba(255,255,255,0.4)" }}>Titles</span></h5>
              </div>
              <div style={{ fontSize: "1.25rem", opacity: 0.7, paddingRight: "8px" }}>📺</div>
            </div>

            {/* Stat 2: Anime Episodes */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.45)" }}>ANIME EPISODES</p>
                <h5 style={{ fontSize: "1.65rem", fontWeight: "700", color: "#FFF", margin: "4px 0" }}>{animeEpisodeCount} <span style={{ fontSize: "0.85rem", fontWeight: "400", color: "rgba(255,255,255,0.4)" }}>eps</span></h5>
                <span style={{ fontSize: "0.68rem", color: "rgba(212, 118, 44, 0.8)", fontFamily: "var(--font-mono)" }}>~{Math.round((animeEpisodeCount * 24) / 60)} Hours watched</span>
              </div>
              <div style={{ fontSize: "1.25rem", opacity: 0.7, paddingRight: "8px" }}>⏳</div>
            </div>

            {/* Stat 3: Movies */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.45)" }}>TOTAL MOVIES</p>
                <h5 style={{ fontSize: "1.65rem", fontWeight: "700", color: "#FFF", margin: "4px 0" }}>{movieCount} <span style={{ fontSize: "0.85rem", fontWeight: "400", color: "rgba(255,255,255,0.4)" }}>Titles</span></h5>
                <span style={{ fontSize: "0.68rem", color: "rgba(62, 116, 166, 0.8)", fontFamily: "var(--font-mono)" }}>~{movieCount * 2} Hours watched</span>
              </div>
              <div style={{ fontSize: "1.25rem", opacity: 0.7, paddingRight: "8px" }}>🎬</div>
            </div>
          </div>
        </div>

        {/* Dynamic Watch Logger Panel (Log Tontonan Baru) */}
        <div style={{
          background: "rgba(15, 15, 18, 0.7)",
          border: "1px solid var(--smoke-grey)",
          borderRadius: "12px",
          padding: "1.75rem",
          display: "flex",
          flexDirection: "column"
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "#FFFFFF",
            marginBottom: "1.25rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            borderBottom: "1px solid var(--smoke-grey)",
            paddingBottom: "8px"
          }}>
            Log New Watch
          </h4>

          <form onSubmit={handleAddWatchLog} style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            <input
              type="text"
              placeholder="Example: Demon Slayer, Tenet, etc."
              value={newLogTitle}
              onChange={(e) => setNewLogTitle(e.target.value)}
              style={{
                padding: "0.75rem",
                background: "#08080C",
                border: "1px solid var(--smoke-grey)",
                borderRadius: "6px",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--streetlamp-yellow)"}
              onBlur={(e) => e.target.style.borderColor = "var(--smoke-grey)"}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <select
                value={newLogType}
                onChange={(e) => setNewLogType(e.target.value)}
                style={{
                  flex: "1",
                  padding: "0.75rem",
                  background: "#08080C",
                  border: "1px solid var(--smoke-grey)",
                  borderRadius: "6px",
                  color: "#FFFFFF",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                <option value="Anime">Anime</option>
                <option value="Movie">Movie</option>
              </select>

              {newLogType === "Anime" && (
                <input
                  type="number"
                  min="1"
                  max="500"
                  placeholder="Eps"
                  title="Jumlah episode"
                  value={newLogEpisodes}
                  onChange={(e) => setNewLogEpisodes(e.target.value)}
                  style={{
                    width: "75px",
                    padding: "0.75rem",
                    background: "#08080C",
                    border: "1px solid var(--smoke-grey)",
                    borderRadius: "6px",
                    color: "#FFFFFF",
                    fontSize: "0.85rem",
                    textAlign: "center"
                  }}
                />
              )}
            </div>

            <button
              type="submit"
              className="tab active"
              style={{
                width: "100%",
                padding: "0.85rem",
                fontSize: "0.775rem",
                fontWeight: "700",
                letterSpacing: "1px",
                marginTop: "10px"
              }}
            >
              Save to Log & Update Stats
            </button>
          </form>

          {/* Quick Realtime log feed */}
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifycontent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)" }}>RECENT LOGS ({watchLogs.length})</span>
              {watchLogs.length > 0 && (
                <button 
                  onClick={handleClearLogs}
                  style={{ background: "transparent", border: "none", color: "var(--neon-red)", fontSize: "0.7rem", fontFamily: "var(--font-mono)", cursor: "pointer" }}
                >
                  X CLEAR
                </button>
              )}
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "115px", overflowY: "auto", paddingRight: "4px" }}>
              {watchLogs.length === 0 ? (
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>No watch history found.</p>
              ) : (
                watchLogs.map((log) => (
                  <div key={log.id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.02)",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    borderLeft: `2.5px solid ${log.type === "Anime" ? "var(--cigarette-orange)" : "var(--rainy-blue)"}`,
                    fontSize: "0.75rem",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", maxWidth: "180px", overflow: "hidden" }}>
                      <span style={{ fontWeight: "600", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{log.title}</span>
                      <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>{log.type}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>{log.date}</span>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255, 45, 45, 0.6)",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          padding: "0 4px",
                          display: "flex",
                          alignItems: "center"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = "rgba(255, 45, 45, 1)"}
                        onMouseOut={(e) => e.currentTarget.style.color = "rgba(255, 45, 45, 0.6)"}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Section with status filters */}
      <div style={{
        background: "linear-gradient(135deg, rgba(20, 20, 24, 0.4) 0%, rgba(10, 10, 12, 0.8) 100%)",
        border: "1px solid var(--smoke-grey)",
        borderRadius: "16px",
        padding: "2rem",
        marginBottom: "3.5rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          borderBottom: "1px solid var(--smoke-grey)",
          paddingBottom: "1rem",
          marginBottom: "1.5rem"
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0
          }}>
            📋 My Watchlist
          </h4>
          
          {/* Sub-tabs Watching, Completed, Plan to Watch */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { id: "watching", label: "📺 Watching", color: "var(--cigarette-orange)" },
              { id: "completed", label: "✅ Completed", color: "#28a745" },
              { id: "plantowatch", label: "⏳ Plan to Watch", color: "rgba(100, 180, 255, 1)" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveWatchTab(t.id)}
                style={{
                  background: activeWatchTab === t.id ? "rgba(255,255,255,0.06)" : "transparent",
                  border: `1px solid ${activeWatchTab === t.id ? t.color : "transparent"}`,
                  color: activeWatchTab === t.id ? t.color : "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-display)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Watchlist Grid */}
        {(() => {
          const filteredWatchlist = watchlist.filter(w => w.status === activeWatchTab);
          if (filteredWatchlist.length === 0) {
            return (
              <div style={{ padding: "2rem 0", textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                  No shows or movies in your "{activeWatchTab === "watching" ? "Watching" : activeWatchTab === "completed" ? "Completed" : "Plan to Watch"}" list.
                </p>
              </div>
            );
          }

          return (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "1.25rem"
            }}>
              {filteredWatchlist.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="card"
                  style={{ position: "relative", cursor: "pointer", transform: "translateY(0)", transition: "all 0.2s" }}
                  onClick={() => handleItemClick(item, item.type)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--streetlamp-yellow)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--smoke-grey)";
                  }}
                >
                  <img src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                  
                  {/* Quick status badge overlay */}
                  <span style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "rgba(0,0,0,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    fontSize: "0.55rem",
                    fontFamily: "var(--font-mono)",
                    color: "rgba(255,255,255,0.6)",
                    padding: "2px 6px",
                    textTransform: "uppercase"
                  }}>
                    {item.type}
                  </span>

                  {/* Remove Watchlist Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveWatchlist(item.id, item.type);
                    }}
                    title="Remove from Watchlist"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(8, 8, 12, 0.85)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "rgba(255,255,255,0.5)",
                      zIndex: 3,
                      fontSize: "0.85rem",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#FF2D2D";
                      e.currentTarget.style.color = "#FF2D2D";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    }}
                  >
                    ×
                  </button>

                  <div className="card-info">
                    <p className="card-title" style={{ fontSize: "0.775rem", height: "36px", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.title}</p>
                    <div className="card-meta" style={{ marginTop: "4px" }}>
                      {item.score && <span>⭐ {item.score}</span>}
                      {item.year && <span>{item.year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Anime Favorit Section */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--smoke-grey)",
          paddingBottom: "8px",
          marginBottom: "1.5rem"
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8C547" stroke="#E8C547">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favorite Anime ({favoritesAnime.length})
          </h4>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-mono)" }}>
            Star them while browsing
          </span>
        </div>

        {favoritesAnime.length === 0 ? (
          <div style={{
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px dashed var(--smoke-grey)",
            borderRadius: "8px",
            padding: "2.5rem",
            textAlign: "center"
          }}>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              No anime added to favorites yet.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1.25rem"
          }}>
            {favoritesAnime.map((item) => (
              <div 
                key={item.id} 
                className="card"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => handleItemClick(item, "anime")}
              >
                <img src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                
                {/* Remove heart button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavoriteAnime(item.id);
                  }}
                  title="Remove from Favorites"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(8, 8, 12, 0.8)",
                    border: "1px solid rgba(255, 45, 45, 0.3)",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#FF2D2D",
                    zIndex: 2,
                    fontSize: "0.95rem"
                  }}
                >
                  ❤️
                </button>

                <div className="card-info">
                  <p className="card-title" style={{ fontSize: "0.8rem", height: "36px", margin: 0 }}>{item.title}</p>
                  <div className="card-meta" style={{ marginTop: "4px" }}>
                    {item.score && <span>⭐ {item.score}</span>}
                    {item.year && <span>{item.year}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Film Favorit Section */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--smoke-grey)",
          paddingBottom: "8px",
          marginBottom: "1.5rem"
        }}>
          <h4 style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.2rem",
            color: "#FFFFFF",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8C547" stroke="#E8C547">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Favorite Movies ({favoritesMovie.length})
          </h4>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-mono)" }}>
            Star them while browsing
          </span>
        </div>

        {favoritesMovie.length === 0 ? (
          <div style={{
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px dashed var(--smoke-grey)",
            borderRadius: "8px",
            padding: "2.5rem",
            textAlign: "center"
          }}>
            <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              No movies added to favorites yet.
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1.25rem"
          }}>
            {favoritesMovie.map((item) => (
              <div 
                key={item.id} 
                className="card"
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => handleItemClick(item, "movie")}
              >
                <img src={item.image} alt={item.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
                
                {/* Remove heart button overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavoriteMovie(item.id);
                  }}
                  title="Remove from Favorites"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(8, 8, 12, 0.8)",
                    border: "1px solid rgba(255, 45, 45, 0.3)",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#FF2D2D",
                    zIndex: 2,
                    fontSize: "0.95rem"
                  }}
                >
                  ❤️
                </button>

                <div className="card-info">
                  <p className="card-title" style={{ fontSize: "0.8rem", height: "36px", margin: 0 }}>{item.title}</p>
                  <div className="card-meta" style={{ marginTop: "4px" }}>
                    {item.score && <span>⭐ {item.score}</span>}
                    {item.year && <span>{item.year}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
