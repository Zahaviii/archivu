export default function Card({ image, title, score, year, isFavorite, onToggleFavorite, onClick }) {
  return (
    <div className="card" style={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
      <img src={image} alt={title} />
      
      {/* Heart button for favorites */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent card click
          onToggleFavorite();
        }}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "rgba(8, 8, 12, 0.75)",
          border: `1px solid ${isFavorite ? "#FF2D2D" : "rgba(255, 255, 255, 0.2)"}`,
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: isFavorite ? "#FF2D2D" : "#FFF",
          transition: "all 0.2s ease",
          fontSize: "0.9rem",
          zIndex: 5
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          if (!isFavorite) {
            e.currentTarget.style.borderColor = "#FF2D2D";
            e.currentTarget.style.color = "#FF2D2D";
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          if (!isFavorite) {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.color = "#FFF";
          }
        }}
      >
        {isFavorite ? "❤️" : "♡"}
      </button>

      <div className="card-info">
        <p className="card-title">{title}</p>
        <div className="card-meta">
          {score && <span>⭐ {score}</span>}
          {year && <span>{year}</span>}
        </div>
      </div>
    </div>
  );
}
