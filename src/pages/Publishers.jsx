import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { getPublishers } from "../services/rawg";

export default function Publishers() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page") || "1", 10);
    const queryParam = searchParams.get("search") || "";

    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

                const data = await getPublishers(page, 20, queryParam);

                if (!cancelled) {
                    setPublishers(data.results || []);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || "Error cargando publishers");
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

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-bold">
                            🏢 Compañías
                        </span>
                        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                            Explora Publishers
                        </h1>
                        <p className="mt-2 text-sm text-zinc-600">
                            Encuentra tus estudios y distribuidoras favoritas.
                        </p>
                    </div>

                    <div className="hidden sm:block text-right">
                        <div className="text-sm font-semibold text-zinc-900">
                            Página <span className="text-emerald-700">{page}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Buscar publisher..."
                        className="flex-1 rounded-2xl border border-zinc-200 bg-white/80 px-5 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition"
                    />
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
                </form>
            </div>

            <div className="mt-8">
                {loading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-44 rounded-2xl bg-zinc-200/60 animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && !error && publishers.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">
                        No se encontraron publishers.
                    </div>
                )}

                {!loading && publishers.length > 0 && (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {publishers.map((pub) => (
                                <Link
                                    key={pub.id}
                                    to={`/publisher/${pub.id}`}
                                    className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition"
                                >
                                    <div className="h-32 bg-gray-100 relative">
                                        {pub.image_background && (
                                            <img
                                                src={pub.image_background}
                                                alt=""
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                    <div className="p-5 relative -mt-6">
                                        <div className="text-center">
                                            <h3 className="text-lg font-extrabold text-zinc-900 group-hover:text-emerald-700 transition">
                                                {pub.name}
                                            </h3>
                                            <div className="mt-2 text-xs font-semibold text-zinc-500">
                                                {pub.games_count} juegos
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            setPage={setPage}
                            hasNext={publishers.length >= 20}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
