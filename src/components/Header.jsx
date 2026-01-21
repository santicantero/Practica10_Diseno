import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-semibold transition ${
      isActive
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
            <div className="leading-tight">
              <span className="text-zinc-900">GameScope</span>
              <div className="text-[11px] font-semibold text-zinc-500">
                Discover • Search • Favorite
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/games" className={linkClass}>Videojuegos</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
