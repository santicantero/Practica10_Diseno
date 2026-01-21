import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <Link
      to={`/game/${game.id}`}
      className="group rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden"
    >
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
  );
}
