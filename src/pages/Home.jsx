import { useEffect, useState } from "react";
import { getPopularGames } from "../services/rawg";
import Carousel from "../components/Carousel";
import GameCard from "../components/GameCard";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getPopularGames(16);
        if (!cancelled) setGames(data.results || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando juegos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => (cancelled = true);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/30 to-cyan-400/30 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-400/20 to-indigo-400/20 blur-2xl" />

        <div className="relative p-8 sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            🎮 GameScope
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            Populares · Búsqueda · Favoritos
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            Descubre tu próximo juego
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}favorito
            </span>
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-600">
            Explora videojuegos, mira los más populares del momento y guarda tus favoritos.
            Todo alimentado por la API de RAWG.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/games"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition"
            >
              Ir al buscador
            </a>
            <a
              href="#populares"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition"
            >
              Ver populares ↓
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 border border-white">
          ⚡ Trending
        </span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 border border-white">
          🧠 Metacritic vibes
        </span>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-zinc-700 border border-white">
          ⭐ Favoritos guardados
        </span>
      </div>


      {/* Carrusel */}
      <div className="mt-8">
        {loading && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-600">Cargando populares…</p>
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            ❌ {error}
          </div>
        )}

        {!loading && !error && <Carousel items={games} />}
      </div>

      {/* Grid populares */}
      {!loading && !error && (
        <div id="populares" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Populares</h2>
              <p className="text-sm text-zinc-600">
                Una selección rápida para empezar.
              </p>
            </div>

            <a
              href="/games"
              className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
            >
              Ver todos →
            </a>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
