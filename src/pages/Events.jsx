import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleEventSignup } from "../redux/actions/userActions";
import { fetchEvents } from "../services/eventsService";

export default function Events() {
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userEvents = useSelector((state) => state.user.userEvents);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchEvents();
                setEvents(data || []);
            } catch (err) {
                setError(err.message || "Error al cargar eventos");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const isSignedUp = (id) => userEvents.includes(id);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-8 sm:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-white/10 backdrop-blur-sm">
                            ✨ Próximos Eventos
                        </span>
                        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Comunidad Gamer</h1>
                        <p className="mt-3 text-zinc-400 text-lg">
                            Únete a ferias, meetups y torneos. Apúntate para recibir notificaciones y conectar con otros jugadores.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-4 min-w-[100px] backdrop-blur-md">
                            <span className="text-2xl font-bold text-white">{events.length}</span>
                            <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mt-1">Disponibles</span>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 min-w-[100px] backdrop-blur-md">
                            <span className="text-2xl font-bold text-indigo-400">{userEvents.length}</span>
                            <span className="text-[10px] uppercase font-black text-indigo-500/50 tracking-widest mt-1">Apuntado</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        ❌ {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.id} className="group relative flex flex-col rounded-3xl border border-zinc-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="h-52 overflow-hidden relative">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-zinc-900 shadow-sm">
                                            📍 {event.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Estado</span>
                                            <span className={`text-xs font-bold ${isSignedUp(event.id) ? 'text-green-600' : 'text-zinc-600'}`}>
                                                {isSignedUp(event.id) ? '✓ Apuntado' : 'Disponible'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => dispatch(toggleEventSignup(event.id))}
                                            className={`rounded-2xl px-6 py-2.5 text-sm font-bold transition-all duration-200 shadow-sm ${isSignedUp(event.id)
                                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                                                }`}
                                        >
                                            {isSignedUp(event.id) ? "Cancelar" : "Apuntarme"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
