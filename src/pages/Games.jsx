import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import { getPopularGames, searchGames } from "../services/rawg";
import { filterFavoriteGames } from "../services/favorites";

export default function Games() {
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [onlyFavs, setOnlyFavs] = useState(false);

  // ✅ para que la página no esté vacía al entrar
  useEffect(() => {
    let cancelled = false;

    async function loadPopular() {
      try {
        setLoading(true);
        setError("");
        const data = await getPopularGames(40);
        if (!cancelled) setGames(data.results || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando populares");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPopular();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    try {
      setLoading(true);
      setError("");
      const data = await searchGames(q, 24);
      setGames(data.results || []);
    } catch (err) {
      setError(err.message || "Error buscando juegos");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setQuery("");
    setError("");

    try {
      setLoading(true);
      const data = await getPopularGames(20);
      setGames(data.results || []);
    } catch (err) {
      setError(err.message || "Error cargando populares");
    } finally {
      setLoading(false);
    }
  }

  const gamesToShow = onlyFavs ? filterFavoriteGames(games) : games;


  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO */}
      <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-xs font-bold">
              🔎 Catálogo RAWG
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Explora videojuegos por nombre
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Sugerencias:{" "}
              <span className="font-semibold text-zinc-900">GTA</span>,{" "}
              <span className="font-semibold text-zinc-900">Zelda</span>,{" "}
              <span className="font-semibold text-zinc-900">Elden Ring</span>.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-zinc-900">
              Resultados:{" "}
              <span className="text-indigo-700">{games.length}</span>
            </div>
            <div className="text-xs text-zinc-500">Actualizado al vuelo</div>
          </div>
        </div>

        {/* SEARCH BAR PRO */}
        <form onSubmit={handleSearch} className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                🔍
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: GTA, Mario, Zelda..."
                className="w-full rounded-2xl border border-zinc-200 bg-white/80 px-11 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-zinc-800 transition"
            >
              Buscar
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-zinc-200 bg-white/80 px-5 py-3 text-sm font-bold text-zinc-800 shadow-sm hover:bg-zinc-50 transition"
            >
              Reset
            </button>
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <input
                type="checkbox"
                checked={onlyFavs}
                onChange={(e) => setOnlyFavs(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
              />
              Solo favoritos
            </label>

          </div>
        </form>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold">
            ❌ {error}
          </div>
        )}
      </div>

      {/* RESULTADOS */}
      <div className="mt-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm overflow-hidden"
              >
                <div className="h-44 bg-zinc-200/60 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 w-4/5 bg-zinc-200/70 rounded animate-pulse" />
                  <div className="mt-3 h-3 w-2/5 bg-zinc-200/60 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && games.length > 0 && (
          <>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900">
                  {query.trim() ? "Resultados de búsqueda" : "Populares ahora"}
                </h2>
                <p className="text-sm text-zinc-600">
                  Mostrando{" "}
                  <span className="font-semibold text-zinc-900">
                    {games.length}
                  </span>{" "}
                  juegos
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-white/70 border border-zinc-200 px-3 py-1">
                  Tip: usa nombres cortos
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gamesToShow.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}

            </div>
          </>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="mt-6 rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-8 text-center">
            <div className="text-3xl">🎮</div>
            <h3 className="mt-3 text-lg font-extrabold text-zinc-900">
              No hay resultados
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Prueba con otro nombre (por ejemplo: <b>Zelda</b>).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
