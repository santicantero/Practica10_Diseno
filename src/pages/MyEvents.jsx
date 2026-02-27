import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function MyEvents() {
    const { list: events, userEvents } = useSelector((state) => state.events);
    const myEvents = events.filter((e) => userEvents.includes(e.id));

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-zinc-900">📅 Mis Eventos</h1>
                    <p className="mt-2 text-zinc-600">Eventos en los que participas.</p>
                </div>
                <div className="h-16 w-16 flex items-center justify-center rounded-3xl bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-inner">
                    <span className="text-2xl font-bold">{myEvents.length}</span>
                </div>
            </div>

            <div className="mt-10">
                {myEvents.length > 0 ? (
                    <div className="space-y-4">
                        {myEvents.map((event) => (
                            <div key={event.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl border border-zinc-200 bg-white hover:border-cyan-200 transition">
                                <img src={event.image} alt={event.title} className="h-24 w-full sm:w-40 rounded-2xl object-cover shadow-sm" />
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg font-bold text-zinc-900">{event.title}</h3>
                                    <p className="text-sm text-zinc-500">📍 {event.location}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="rounded-full bg-cyan-50 px-4 py-1.5 text-[11px] font-black text-cyan-700 uppercase border border-cyan-100">Confirmado</span>
                                    <Link to="/events" className="text-sm font-bold text-zinc-400 hover:text-red-500 transition">Gestionar</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-zinc-200 bg-white/50 p-20 text-center">
                        <div className="text-5xl opacity-20">🗓️</div>
                        <h3 className="mt-4 text-xl font-bold text-zinc-800">Aún no te has apuntado a nada</h3>
                        <p className="mt-2 text-zinc-500">Pásate por la sección de eventos y descubre qué está pasando.</p>
                        <Link to="/events" className="mt-6 inline-block rounded-2xl bg-zinc-900 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 transition">
                            Explorar eventos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
