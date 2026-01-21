import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-zinc-300 mt-2">No existe esa página.</p>

      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 rounded-lg bg-white text-black font-semibold"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
