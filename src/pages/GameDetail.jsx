import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getGameDetail, getGameScreenshots } from "../services/rawg";
import { isFavorite, toggleFavorite } from "../services/favorites";

export default function GameDetail() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [shots, setShots] = useState([]);
  const [activeShot, setActiveShot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingShots, setLoadingShots] = useState(true);
  const [error, setError] = useState("");
  const [fav, setFav] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadingShots(true);
        setError("");

        const data = await getGameDetail(id);
        const shotsData = await getGameScreenshots(id, 12);

        if (!cancelled) {
          setGame(data);
          setFav(isFavorite(data.id));
          setShots(shotsData?.results || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando detalle");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoadingShots(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const genresLinks = useMemo(() => {
    if (!game?.genres?.length) return "—";
    return (
      <div className="flex flex-wrap gap-1">
        {game.genres.map((g, i) => (
          <span key={g.id}>
            <Link
              to={`/tag/${g.slug}`}
              className="hover:text-indigo-600 hover:underline transition"
            >
              {g.name}
            </Link>
            {i < game.genres.length - 1 && ", "}
          </span>
        ))}
      </div>
    );
  }, [game]);

  const platformsText = useMemo(() => {
    if (!game?.platforms?.length) return "—";
    return game.platforms
      .map((p) => p.platform?.name)
      .filter(Boolean)
      .join(", ");
  }, [game]);

  const publishersLinks = useMemo(() => {
    if (!game?.publishers?.length) return "—";
    return (
      <div className="flex flex-wrap gap-1">
        {game.publishers.map((p, i) => (
          <span key={p.id}>
            <Link
              to={`/publisher/${p.id}`}
              className="hover:text-indigo-600 hover:underline transition"
            >
              {p.name}
            </Link>
            {i < game.publishers.length - 1 && ", "}
          </span>
        ))}
      </div>
    );
  }, [game]);

  const released = game?.released || "—";
  const rating = typeof game?.rating === "number" ? game.rating.toFixed(2) : "—";

  function onToggleFav() {
    if (!game) return;
    const next = toggleFavorite(game.id);
    setFav(next);
  }

  function closeModal() {
    setActiveShot(null);
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeModal();
    }
    if (activeShot) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeShot]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-[320px] rounded-3xl bg-zinc-200/60 animate-pulse" />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl bg-zinc-200/60 h-56 animate-pulse" />
          <div className="rounded-3xl bg-zinc-200/60 h-56 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="font-extrabold">❌ Error</div>
          <div className="mt-2">{error}</div>
          <Link
            to="/games"
            className="mt-5 inline-flex rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition"
          >
            Volver a videojuegos
          </Link>
        </div>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/60 shadow-sm fade-up">
        <div className="relative h-[330px] sm:h-[420px]">
          <img
            src={game.background_image}
            alt={game.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_320px_at_18%_18%,rgba(99,102,241,.55),transparent_60%)] opacity-80" />

          <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/75 backdrop-blur px-4 py-2 text-sm font-bold text-zinc-900 shadow-sm hover:bg-white transition"
            >
              ← Volver
            </Link>

            <button
              onClick={onToggleFav}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-extrabold shadow-sm transition ${fav
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-white/75 text-zinc-900 hover:bg-white"
                }`}
            >
              {fav ? "★ En favoritos" : "☆ Añadir a favoritos"}
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-zinc-900">
                  ⭐ {rating}
                </span>
                <span className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-bold text-white">
                  📅 {released}
                </span>
                {game?.metacritic ? (
                  <span className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-bold text-white">
                    🏆 Metacritic {game.metacritic}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow">
                {game.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                {(game.genres || []).slice(0, 6).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/20 transition"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              {game?.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {game.tags.slice(0, 10).map((t) => (
                    <Link
                      key={t.id}
                      to={`/tag/${t.slug}`}
                      className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-extrabold text-white hover:bg-white/25 transition"
                      title={`Ver juegos con tag: ${t.name}`}
                    >
                      #{t.name}
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 fade-up">
            <h2 className="text-lg font-extrabold text-zinc-900">Detalles</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Info label="Géneros" value={genresLinks} />
              <Info label="Plataformas" value={platformsText} />
              <Info label="Publishers" value={publishersLinks} />
              <Info label="Lanzamiento" value={released} />
              <Info label="Rating" value={rating} />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 fade-up">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-zinc-900">
                  Galería
                </h2>
                <p className="text-sm text-zinc-600">
                  Capturas del juego (RAWG)
                </p>
              </div>

              <div className="text-xs text-zinc-500">
                {shots.length ? `${shots.length} imágenes` : ""}
              </div>
            </div>

            {loadingShots ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-zinc-200/60 animate-pulse"
                  />
                ))}
              </div>
            ) : shots.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-600">
                No hay capturas disponibles para este juego.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {shots.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveShot(s.image)}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition"
                    title="Abrir imagen"
                  >
                    <img
                      src={s.image}
                      alt="Screenshot"
                      className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-xs font-extrabold text-zinc-900 opacity-0 group-hover:opacity-100 transition">
                      Ver en grande
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 fade-up">
            <h2 className="text-lg font-extrabold text-zinc-900">Descripción</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-700">
              {game.description_raw || "Sin descripción disponible."}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm p-6 fade-up">
            <h3 className="text-sm font-extrabold text-zinc-900">
              Acciones rápidas
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/games"
                className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 transition text-center"
              >
                Buscar más juegos
              </Link>

              <button
                onClick={onToggleFav}
                className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition ${fav
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50"
                  }`}
              >
                {fav ? "Quitar de favoritos" : "Añadir a favoritos"}
              </button>
            </div>

            <div className="mt-4 text-xs text-zinc-500">
              Tip: el banner y la galería hacen que “se note” el juego.
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-zinc-200/70 bg-white/70 backdrop-blur shadow-sm fade-up">
            <div className="p-4">
              <div className="text-sm font-extrabold text-zinc-900">Portada</div>
              <div className="mt-3 overflow-hidden rounded-2xl">
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700 hover:text-indigo-800"
        >
          ← Volver a videojuegos
        </Link>
      </div>

      {activeShot && (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-4 sm:p-8 flex items-center justify-center fade-in"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute -top-3 -right-3 rounded-full bg-white text-zinc-900 w-10 h-10 font-black shadow-sm hover:bg-zinc-100 transition"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <img
                src={activeShot}
                alt="Screenshot grande"
                className="w-full max-h-[78vh] object-contain bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
      <div className="text-xs font-bold text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-zinc-900">{value}</div>
    </div>
  );
}
