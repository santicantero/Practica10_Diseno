import { Link, useSearchParams } from "react-router-dom";

export default function Pagination({ page, setPage, hasNext }) {
    const [searchParams] = useSearchParams();

    const getPageUrl = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        return `?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-10">
            <Link
                to={page > 1 ? getPageUrl(page - 1) : "#"}
                onClick={(e) => {
                    if (page <= 1) e.preventDefault();
                    else setPage(page - 1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold border border-zinc-200 bg-white text-zinc-900 shadow-sm transition ${page <= 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-zinc-50 hover:scale-105"
                    }`}
            >
                ← Anterior
            </Link>

            <span className="text-sm font-extrabold text-zinc-900 bg-white/70 px-4 py-2 rounded-xl border border-zinc-200/50">
                Página {page}
            </span>

            <Link
                to={hasNext ? getPageUrl(page + 1) : "#"}
                onClick={(e) => {
                    if (!hasNext) e.preventDefault();
                    else setPage(page + 1);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold bg-zinc-900 text-white shadow-sm transition ${!hasNext
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-zinc-800 hover:scale-105"
                    }`}
            >
                Siguiente →
            </Link>
        </div>
    );
}
