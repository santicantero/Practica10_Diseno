import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/actions/userActions";

export default function GameCard({ game }) {
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state) => state.user.favorites);
  const isFav = favoriteIds.includes(Number(game.id));

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(game.id));
  };

  return (
    <div className="group relative rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden">
      <Link to={`/game/${game.id}`} className="block">
        <div className="relative">
          <img
            src={game.background_image}
            alt={game.name}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />

          {/* badge rating */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-sm">
              ⭐ {Number(game.rating || 0).toFixed(2)}
            </span>

            {game.released && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                {game.released}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-zinc-900 leading-snug line-clamp-2">
            {game.name}
          </h3>
          <p className="mt-2 text-sm text-indigo-700 font-semibold">
            Ver detalle →
          </p>
        </div>
      </Link>

      {/* Botón de favorito */}
      <button
        onClick={handleToggleFav}
        className={`absolute top-3 right-3 h-9 w-9 flex items-center justify-center rounded-xl transition-all shadow-md ${isFav
            ? "bg-red-500 text-white scale-110"
            : "bg-white/90 text-zinc-400 hover:text-red-500 hover:scale-110"
          }`}
      >
        <span className="text-lg">{isFav ? "❤️" : "🤍"}</span>
      </button>
    </div>
  );
}
