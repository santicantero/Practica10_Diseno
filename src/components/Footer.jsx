export default function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-600 flex flex-wrap gap-2 justify-between">
        <p>Proyecto React · RAWG API</p>
        <p>Creado por · Santi Cantero</p>
        <p>© {new Date().getFullYear()} GameScope</p>
      </div>
    </footer>
  );
}
