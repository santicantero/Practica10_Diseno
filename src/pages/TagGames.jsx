import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import { getGamesByTag } from "../services/rawg";

export default function TagGames() {
  const { slug } = useParams();

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFirst() {
      try {
        setLoading(true);
        setError("");
        setGames([]);
        setPage(1);
        setHasMore(true);

        const data = await getGamesByTag(slug, 1, 20);

        if (!cancelled) {
          const results = data?.results || [];
          setGames(results);
          setHasMore(Boolean(data?.next) && results.length > 0);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando juegos por tag");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFirst();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function loadMore() {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const data = await getGamesByTag(slug, nextPage, 20);
      const results = data?.results || [];

      setGames((prev) => [...prev, ...results]);
      setPage(nextPage);
      setHasMore(Boolean(data?.next) && results.length > 0);
    } catch (err) {
      setError(err.message || "Error cargando más resultados");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-zinc-500">TAG</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
            #{slug}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Juegos relacionados con este tag.
          </p>
        </div>

        <Link
          to="/games"
          className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-zinc-800 transition"
        >
          ← Volver al buscador
        </Link>
      </div>

      {loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-zinc-200/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="font-extrabold">❌ Error</div>
          <div className="mt-2">{error}</div>
        </div>
      )}

      {!loading && !error && games.length === 0 && (
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/70 p-6 text-zinc-700">
          No hay juegos para este tag.
        </div>
      )}

      {!loading && !error && games.length > 0 && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            {hasMore ? (
              <button
                onClick={loadMore}
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-indigo-700 transition disabled:opacity-60"
                disabled={loadingMore}
              >
                {loadingMore ? "Cargando..." : "Cargar más"}
              </button>
            ) : (
              <div className="text-sm font-bold text-zinc-500">
                No hay más resultados.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
