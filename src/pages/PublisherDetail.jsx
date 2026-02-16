import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import { getPublisherDetail, getPublisherGames } from "../services/rawg";

export default function PublisherDetail() {
    const { id } = useParams();

    const [publisher, setPublisher] = useState(null);
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

                const [pubData, gamesData] = await Promise.all([
                    getPublisherDetail(id),
                    getPublisherGames(id, 1, 20)
                ]);

                if (!cancelled) {
                    setPublisher(pubData);
                    const results = gamesData?.results || [];
                    setGames(results);
                    setHasMore(Boolean(gamesData?.next) && results.length > 0);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || "Error cargando datos del publisher");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadFirst();
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function loadMore() {
        if (!hasMore || loadingMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;

            const data = await getPublisherGames(id, nextPage, 20);
            const results = data?.results || [];

            setGames((prev) => [...prev, ...results]);
            setPage(nextPage);
            setHasMore(Boolean(data?.next) && results.length > 0);
        } catch (err) {
            setError(err.message || "Error cargando más juegos");
        } finally {
            setLoadingMore(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="h-[300px] rounded-3xl bg-zinc-200/60 animate-pulse" />
                <div className="mt-8 grid gap-5 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-60 rounded-2xl bg-zinc-200/60 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-10">
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                    <div className="font-extrabold">❌ Error</div>
                    <div className="mt-2">{error}</div>
                    <Link to="/publishers" className="mt-4 inline-block font-bold underline">Volver a publishers</Link>
                </div>
            </div>
        )
    }

    if (!publisher) return null;

    return (
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">

            <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/60 shadow-sm mb-8">
                <div className="relative h-[250px]">
                    {publisher.image_background && (
                        <img
                            src={publisher.image_background}
                            alt={publisher.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                        <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-md">
                            {publisher.name}
                        </h1>
                        <div className="mt-2 text-white/90 font-medium max-w-2xl text-sm sm:text-base line-clamp-2">
                            <span dangerouslySetInnerHTML={{ __html: publisher.description || "Sin descripción disponible." }} />
                        </div>
                        <div className="mt-4 flex gap-3">
                            <div className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/30">
                                {publisher.games_count} juegos
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-zinc-900">Juegos de {publisher.name}</h2>
                <Link to="/publishers" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                    ← Ver otros publishers
                </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {games.map((g) => (
                    <GameCard key={g.id} game={g} />
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                {hasMore ? (
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 transition disabled:opacity-50"
                    >
                        {loadingMore ? "Cargando..." : "Cargar más juegos"}
                    </button>
                ) : (
                    <span className="text-zinc-500 text-sm font-bold">No hay más juegos para mostrar.</span>
                )}
            </div>

        </div>
    );
}
