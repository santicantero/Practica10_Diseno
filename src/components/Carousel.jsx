import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Carousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const slides = useMemo(() => (items || []).filter(Boolean), [items]);
  const total = slides.length;

  const go = (i) => {
    if (!total) return;
    const next = (i + total) % total;
    setIndex(next);
  };

  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  // autoplay
  useEffect(() => {
    if (!total) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const pause = () => timerRef.current && clearInterval(timerRef.current);

  const onPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    pause();
  };

  const onPointerUp = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    isDragging.current = false;

    if (Math.abs(dx) > 60) {
      dx < 0 ? next() : prev();
    }
  };

  if (!total) return null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-sm"
      onMouseEnter={pause}
      onMouseLeave={() => {
        timerRef.current = setInterval(next, 5000);
      }}
    >
      {/* Slides */}
      <div
        className="relative h-[260px] sm:h-[340px] lg:h-[380px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (isDragging.current = false)}
      >
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((g) => (
            <div key={g.id} className="relative min-w-full">
              <img
                src={g.background_image}
                alt={g.name}
                className="h-full w-full object-cover"
                draggable={false}
                loading="lazy"
              />

              {/* overlay pro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(800px_300px_at_20%_20%,rgba(99,102,241,.35),transparent_60%)] opacity-70" />

              {/* content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm">
                    ⭐ {Number(g.rating || 0).toFixed(2)}
                    <span className="text-zinc-500">·</span>
                    {g.released || "—"}
                  </p>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow">
                    {g.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/game/${g.id}`}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 transition"
                    >
                      Ver detalle
                    </Link>
                    <Link
                      to="/games"
                      className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white border border-white/20 hover:bg-white/20 transition"
                    >
                      Ir al buscador
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm hover:bg-white/90 transition grid place-items-center"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/70 backdrop-blur border border-white/60 shadow-sm hover:bg-white/90 transition grid place-items-center"
          aria-label="Siguiente"
        >
          ›
        </button>

        {/* Dots flotando (opción A) */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-white/90 shadow-sm"
                  : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir al slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
