import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import Pagination from "../components/Pagination";
import { getPopularGames, searchGames } from "../services/rawg";
import { filterFavoriteGames } from "../services/favorites";

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const queryParam = searchParams.get("search") || "";

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [inputValue, setInputValue] = useState(queryParam);

  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        let data;
        if (queryParam) {
          data = await searchGames(queryParam, page, 24);
        } else {
          data = await getPopularGames(page, 20);
        }

        if (!cancelled) {
          setGames(data.results || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando juegos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, queryParam]);

  function handleSearch(e) {
    e.preventDefault();
    const q = inputValue.trim();

    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (q) newParams.set("search", q);
      else newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  }

  function handleReset() {
    setInputValue("");
    setSearchParams({});
  }

  function setPage(newPage) {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  }

  const gamesToShow = onlyFavs ? filterFavoriteGames(games) : games;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-xs font-bold">
              🔎 Catálogo RAWG
            </span>
            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Explora videojuegos
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {queryParam ? `Resultados para: ${queryParam}` : "Mostrando juegos populares"}
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-zinc-900">
              Página <span className="text-indigo-700">{page}</span>
            </div>
            <div className="text-xs text-zinc-500">
              {queryParam ? "Búsqueda activa" : "Populares"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                🔍
              </span>

              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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

      <div className="mt-8">
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gamesToShow.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            <Pagination
              page={page}
              setPage={setPage}
              hasNext={games.length >= 20}
            />
          </>
        )}

        {!loading && games.length === 0 && !error && (
          <div className="mt-6 rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-8 text-center">
            <div className="text-3xl">🎮</div>
            <h3 className="mt-3 text-lg font-extrabold text-zinc-900">
              No hay resultados
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Prueba con otro nombre o revisa la paginación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
