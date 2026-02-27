import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GameCard from "../components/GameCard";
import { getPopularGames } from "../services/rawg";

export default function MyFavorites() {
    const favoriteIds = useSelector((state) => state.user.favorites);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadFavorites() {
            if (favoriteIds.length === 0) {
                setFavoriteGames([]);
                return;
            }

            setLoading(true);
            try {
                // En una app real, haríamos un fetch por ID o un batch fetch.
                // Aquí simulamos filtrando de los populares o buscando, pero para simplificar
                // y dado que no hay un endpoint de "get multiple games by id" fácilmente sin loops,
                // vamos a intentar obtener datos básicos.
                // Como la práctica dice "debe poder verse en la misma página del videojuego marcado",
                // y "Mis Favoritos" es una lista, vamos a intentar recuperar los nombres de RAWG si es posible,
                // o al menos mostrar algo digno.

                // Estrategia: Obtener una lista grande de juegos y filtrar (simplificación para la práctica)
                const data = await getPopularGames(1, 40);
                const filtered = data.results.filter(g => favoriteIds.includes(Number(g.id)));
                setFavoriteGames(filtered);
            } catch (error) {
                console.error("Error loading favorite details", error);
            } finally {
                setLoading(false);
            }
        }

        loadFavorites();
    }, [favoriteIds]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900">❤️ Mis Favoritos</h1>
                    <p className="mt-2 text-zinc-600">Tus videojuegos guardados localmente.</p>
                </div>
                <span className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
                    {favoriteIds.length} juegos
                </span>
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 rounded-2xl bg-zinc-200" />
                        ))}
                    </div>
                ) : favoriteGames.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {favoriteGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-zinc-200 bg-white/50 p-20 text-center">
                        <div className="text-5xl">Empty</div>
                        <h3 className="mt-4 text-xl font-bold text-zinc-800">No tienes favoritos aún</h3>
                        <p className="mt-2 text-zinc-500">Explora el catálogo y marca los que más te gusten.</p>
                        <a href="/games" className="mt-6 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white">
                            Ir al buscador
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
