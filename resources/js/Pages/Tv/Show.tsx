import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    User,
    Clock,
    Calendar,
    Activity,
    Stethoscope,
    ArrowRightCircle,
    Bell,
    Users,
    MapPin,
    Star,
    AlertCircle,
    Volume2,
    Play
} from 'lucide-react';

export default function TvShow({ doctor, current, queue, date, sound_trigger }: any) {

    // --- STATES ---
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [lastTrigger, setLastTrigger] = useState(sound_trigger);
    const [isNewCall, setIsNewCall] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // --- INITIALISATION AUDIO ---
    useEffect(() => {
        // Assurez-vous d'avoir le fichier 'public/ding-dong.mp3'
        audioRef.current = new Audio('/ding-dong.mp3');
        audioRef.current.load();

        // Charger les voix
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    // --- FONCTION DE SYNTHÈSE VOCALE (IA VOICE) ---
    const announcePatient = (name: string, room: string, ticket: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Arrêter les lectures précédentes

            // 🗣️ LE TEXTE À LIRE (Modifié pour inclure le ticket)
            // Exemple : "Ticket numéro 45. Monsieur Jean Dupont, attendu en salle 12."
            const text = `Ticket numéro ${ticket}. ${name}, est attendu en salle ${room}.`;

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = 'fr-FR';
            utterance.rate = 0.85; // Vitesse
            utterance.pitch = 1;   // Tonalité
            utterance.volume = 1;  // Volume

            // Essayer de trouver une voix française de qualité
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google") && v.lang.includes("fr"))
                                || voices.find(v => v.lang.includes("fr"));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            window.speechSynthesis.speak(utterance);
        }
    };

    // --- LOGIQUE DE DÉCLENCHEMENT ---
    useEffect(() => {
        if (current && sound_trigger !== lastTrigger && hasInteracted) {

            // 1. Jouer le Jingle "Ding-Dong"
            const playPromise = audioRef.current?.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Erreur audio (bloqué ou manquant):", error));
            }

            // 2. Parler après 1.5 secondes (délai pour le jingle)
            setTimeout(() => {
                const name = current.guest_name || current.patient_user?.name || "au cabinet";
                const room = doctor.room_number || "12";
                // On utilise le numéro de ticket s'il existe, sinon l'ID du rendez-vous
                const ticket = current.ticket_number || current.id || "inconnu";

                announcePatient(name, room, ticket);
            }, 1500);

            // 3. Animations visuelles
            setIsNewCall(true);
            setPulseAnimation(true);

            const timer1 = setTimeout(() => setIsNewCall(false), 8000);
            const timer2 = setTimeout(() => setPulseAnimation(false), 10000);

            setLastTrigger(sound_trigger);

            return () => { clearTimeout(timer1); clearTimeout(timer2); };
        } else if (sound_trigger !== lastTrigger) {
            // Mise à jour silencieuse si premier chargement sans interaction
            setLastTrigger(sound_trigger);
        }
    }, [sound_trigger, current, hasInteracted]);

    // --- AUTO-REFRESH (POLLING) ---
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['current', 'queue', 'sound_trigger'],
                preserveScroll: true,
                preserveState: true
            });
        }, 5000); // Vérifie toutes les 5 secondes

        return () => clearInterval(interval);
    }, []);

    // --- HORLOGE ---
    const formatTime = () => {
        const now = new Date();
        return {
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            seconds: now.getSeconds(),
            isEvenMinute: now.getMinutes() % 2 === 0
        };
    };

    const [currentTime, setCurrentTime] = useState(formatTime());

    useEffect(() => {
        const timeInterval = setInterval(() => setCurrentTime(formatTime()), 1000);
        return () => clearInterval(timeInterval);
    }, []);

    // --- DÉMARRAGE MANUEL ---
    const startTvDisplay = () => {
        // Débloque l'audio
        if(audioRef.current) {
            audioRef.current.play().then(() => {
                audioRef.current?.pause();
                audioRef.current!.currentTime = 0;
            }).catch(() => {});
        }
        // Débloque la synthèse vocale
        if ('speechSynthesis' in window) {
            const wakeUp = new SpeechSynthesisUtterance("");
            window.speechSynthesis.speak(wakeUp);
        }
        setHasInteracted(true);
    };

    const getQueueStatusColor = (index: number) => {
        const colors = [
            'bg-gradient-to-r from-green-500 to-emerald-400',
            'bg-gradient-to-r from-blue-500 to-cyan-400',
            'bg-gradient-to-r from-purple-500 to-pink-400',
            'bg-gradient-to-r from-amber-500 to-orange-400',
            'bg-gradient-to-r from-gray-500 to-gray-400'
        ];
        return colors[Math.min(index, colors.length - 1)];
    };

    // --- ECRAN DE DÉMARRAGE (OVERLAY) ---
    if (!hasInteracted) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white z-50 font-sans">
                <div className="text-center space-y-8 animate-fade-in p-10 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 max-w-md w-full mx-4">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                        <Volume2 className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">TV Salle d'Attente</h1>
                        <p className="text-gray-400">Cliquez pour activer le son et la voix</p>
                    </div>
                    <button
                        onClick={startTvDisplay}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-all duration-300 w-full"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        Lancer l'affichage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col font-sans overflow-hidden">
            <Head title={`TV Display - Dr. ${doctor.user.name}`} />

            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* HEADER */}
            <div className="relative bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 text-white p-6 shadow-2xl border-b border-blue-700/50 z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-blue-900 animate-pulse"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dr. {doctor.user.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-cyan-300 text-lg font-medium">{doctor.specialty || 'Médecin Généraliste'}</span>
                                <div className="hidden sm:flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    {currentTime.time}
                                </div>
                                <div className={`text-lg font-medium ${currentTime.isEvenMinute ? 'text-cyan-300' : 'text-blue-200'}`}>
                                    {date}
                                </div>
                            </div>
                            <div className="hidden md:block w-1 h-12 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-blue-300">Salle</div>
                                <div className="text-xl font-bold text-white flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    N°{doctor.room_number || '12'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">

                {/* CURRENT PATIENT DISPLAY */}
                <div className="lg:col-span-2 flex flex-col">
                    <div className={`relative bg-gradient-to-br ${current ? 'from-white to-gray-50' : 'from-blue-50/10 to-gray-100/10'} rounded-3xl shadow-2xl border-2 ${current ? 'border-green-400/30' : 'border-blue-400/20'} flex-1 flex flex-col items-center justify-center p-8 transition-all duration-1000 ${pulseAnimation ? 'animate-pulse-slow' : ''}`}>

                        {/* Animated Call Indicator */}
                        {isNewCall && (
                            <div className="absolute inset-0 rounded-3xl border-4 border-green-500 animate-ping opacity-30"></div>
                        )}

                        {/* Status Badge */}
                        <div className={`absolute top-6 right-6 px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg uppercase tracking-widest shadow-xl ${current
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white animate-bounce-subtle'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'}`}>
                            {current ? 'En Consultation' : 'En Attente'}
                        </div>

                        {current ? (
                            <div className={`text-center w-full ${isNewCall ? 'animate-zoom-in' : 'animate-fade-in'}`}>

                                {/* Avatar */}
                                <div className="relative mb-6 md:mb-8">
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto shadow-2xl border-8 border-green-200/50">
                                        <User className="w-20 h-20 md:w-32 md:h-32 text-green-600" />
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-2 rounded-full text-sm md:text-lg font-bold shadow-lg whitespace-nowrap">
                                        À PRÉSENT
                                    </div>
                                </div>

                                {/* Patient Details */}
                                <div className="mb-2">
                                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-lg mb-2">
                                        Ticket N°{current.ticket_number || current.id}
                                    </span>
                                </div>
                                <h3 className="text-5xl md:text-8xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 md:mb-8 leading-tight truncate px-4">
                                    {current.guest_name || current.patient_user?.name}
                                </h3>

                                {/* Call to Action */}
                                <div className="inline-flex items-center gap-2 md:gap-4 text-xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 md:px-8 md:py-6 rounded-2xl shadow-2xl animate-pulse-slow">
                                    <Activity className="w-8 h-8 md:w-10 md:h-10" />
                                    <span>Veuillez entrer</span>
                                    <ArrowRightCircle className="w-8 h-8 md:w-10 md:h-10 animate-bounce-x" />
                                </div>

                                {/* Additional Info */}
                                <div className="mt-8 flex items-center justify-center gap-6 text-lg text-gray-600">
                                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span>{new Date(current.slot.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center animate-fade-in">
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto shadow-2xl border-8 border-blue-200/50 opacity-80">
                                        <Users className="w-20 h-20 md:w-32 md:h-32 text-blue-400" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                                        <Bell className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-bold text-gray-300 mb-4">Salle d'attente</h3>
                                <p className="text-xl md:text-2xl text-gray-400 max-w-lg mx-auto">
                                    Le médecin vous appellera prochainement.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* QUEUE LIST */}
                <div className="bg-gradient-to-br from-white/10 to-gray-50/5 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 flex flex-col h-[500px] lg:h-auto">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white">File d'attente</h3>
                                <div className="text-cyan-300 text-xs md:text-sm font-medium flex items-center gap-1">
                                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                                    {queue.length} en attente
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {queue.length > 0 ? (
                            queue.map((appt: any, index: number) => (
                                <div
                                    key={appt.id}
                                    className={`group p-4 rounded-2xl border border-white/10 bg-gradient-to-r ${getQueueStatusColor(index)}/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`relative w-12 h-12 rounded-full ${getQueueStatusColor(index)} flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
                                            {index + 1}
                                            {index === 0 && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold text-lg text-white truncate">
                                                    {appt.guest_name || appt.patient_user?.name}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-gray-300 text-sm">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(appt.slot.start_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 h-full flex flex-col items-center justify-center">
                                <Users className="w-12 h-12 text-gray-500 mb-2" />
                                <p className="text-gray-500">Aucun patient en attente</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* STYLES & ANIMATIONS */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }

                @keyframes zoom-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-zoom-in { animation: zoom-in 0.5s ease-out; }

                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
                .animate-bounce-x { animation: bounce-x 1s infinite; }

                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-pulse-slow { animation: pulse-slow 3s infinite; }
            `}</style>
        </div>
    );
}
