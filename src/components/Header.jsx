import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const user = useSelector((state) => state.user.profile);
  const favoritesCount = useSelector((state) => state.user.favorites.length);
  const myEventsCount = useSelector((state) => state.user.userEvents.length);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition ${isActive
      ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow"
      : "text-zinc-700 hover:bg-white/70"
    }`;

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-white/40 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow">
              🎮
              <span className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 blur-md" />
            </span>
            <div className="hidden sm:block leading-tight">
              <span className="text-zinc-900">GameScope</span>
              <div className="text-[11px] font-semibold text-zinc-500">
                Discover • Search • Favorite
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/games" className={linkClass}>Videojuegos</NavLink>
            <NavLink to="/events" className={linkClass}>Eventos</NavLink>
            <NavLink to="/publishers" className={linkClass}>Publishers</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <div className="group relative flex items-center gap-2 cursor-pointer rounded-2xl border border-zinc-200/50 bg-white/50 p-1.5 pr-3 hover:bg-white transition shadow-sm">
              <span className="h-8 w-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-indigo-700 text-lg shadow-inner">
                {user.avatar}
              </span>
              <span className="hidden md:block text-sm font-bold text-zinc-800">{user.name}</span>

              {/* Dropdown simulado con hover */}
              <div className="absolute top-full right-0 mt-2 w-48 scale-95 opacity-0 invisible group-hover:scale-100 group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                  <Link
                    to="/my-favorites"
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  >
                    <span>❤️ Mis Favoritos</span>
                    <span className="rounded-lg bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700">
                      {favoritesCount}
                    </span>
                  </Link>
                  <Link
                    to="/my-events"
                    className="mt-1 flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-cyan-50 hover:text-cyan-700 transition"
                  >
                    <span>📅 Mis Eventos</span>
                    <span className="rounded-lg bg-cyan-100 px-1.5 py-0.5 text-[10px] text-cyan-700">
                      {myEventsCount}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
