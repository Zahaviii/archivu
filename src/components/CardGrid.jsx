import Card from "./Card";
import { IMG_BASE } from "../api/tmdb";

export default function CardGrid({ items, type, favorites, onToggleFavorite, onCardClick }) {
    if (!items || items.length === 0) return <p className="empty">No results found.</p>;

    const favIds = new Set((favorites || []).map(f => f.id));

    return (
    <div className="grid">
        {items.map((item) => {
        if (type === "anime") {
            const itemId = item.mal_id;
            const isFav = favIds.has(itemId);
            const imageURL = item.images?.jpg?.image_url;
            return (
            <Card
                key={itemId}
                image={imageURL}
                title={item.title}
                score={item.score}
                year={item.year}
                isFavorite={isFav}
                onToggleFavorite={() => onToggleFavorite({
                    id: itemId,
                    title: item.title,
                    image: imageURL,
                    score: item.score,
                    year: item.year,
                    type: "anime"
                })}
                onClick={() => onCardClick(item)}
            />
            );
        } else {
            const itemId = item.id;
            const isFav = favIds.has(itemId);
            const imageURL = item.poster_path ? IMG_BASE + item.poster_path : null;
            return (
            <Card
                key={itemId}
                image={imageURL}
                title={item.title}
                score={item.vote_average?.toFixed(1)}
                year={item.release_date?.slice(0, 4)}
                isFavorite={isFav}
                onToggleFavorite={() => onToggleFavorite({
                    id: itemId,
                    title: item.title,
                    image: imageURL,
                    score: item.vote_average?.toFixed(1),
                    year: item.release_date?.slice(0, 4),
                    type: "movie"
                })}
                onClick={() => onCardClick(item)}
            />
            );
        }
        })}
    </div>
    );
}
