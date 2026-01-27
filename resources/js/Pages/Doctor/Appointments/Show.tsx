import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar, User, Phone, Clock, MapPin, ArrowRight, AlertTriangle,
    CheckCircle, ArrowLeft, Mail, CalendarDays, Stethoscope,
    Building, ChevronRight, ShieldCheck, UserCircle, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal'; // <--- Import the Modal
import ActivityTimeline from '@/Components/ActivityTimeline';
export default function AppointmentShow({ appointment, nearbySlots, is_walk_in }: any) {

    // --- STATE MANAGEMENT ---
    const [reschedulingSlot, setReschedulingSlot] = useState<number | null>(null); // Tracks loading spinner on button
    const [cancelling, setCancelling] = useState(false); // Tracks loading spinner on cancel button

    // Modal States
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    // We need to store the target slot details temporarily to show them in the modal
    const [targetSlot, setTargetSlot] = useState<{id: number, date: string} | null>(null);

    // Helper to determine display name
    const patientName = is_walk_in ? appointment.guest_name : appointment.patient_user?.name;
    const patientContact = is_walk_in ? appointment.guest_phone : appointment.patient_user?.email;

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
            time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })
        };
    };

    const appointmentTime = formatDate(appointment.slot.start_at);

    // --- HANDLERS ---

    // 1. Trigger Reschedule Modal
    const confirmReschedule = (slotId: number, startAt: string) => {
        setTargetSlot({ id: slotId, date: startAt });
        setIsRescheduleModalOpen(true);
    };

    // 2. Execute Reschedule (Called by Modal)
    const executeReschedule = () => {
        if (!targetSlot) return;

        router.post(route('doctor.appointments.reschedule', appointment.id), {
            new_slot_id: targetSlot.id
        }, {
            onStart: () => {
                setReschedulingSlot(targetSlot.id);
                setIsRescheduleModalOpen(false);
            },
            onFinish: () => setReschedulingSlot(null),
        });
    };

    // 3. Trigger Cancel Modal
    const confirmCancel = () => {
        setIsCancelModalOpen(true);
    };

    // 4. Execute Cancel (Called by Modal)
    const executeCancel = () => {
        router.patch(route('doctor.appointments.update-status', appointment.id), {
            status: 'cancelled'
        }, {
            onStart: () => {
                setCancelling(true);
                setIsCancelModalOpen(false);
            },
            onFinish: () => setCancelling(false),
        });
    };

    return (
        <AppLayout>
            <Head title={`Rendez-vous: ${patientName}`} />

            {/* --- MODAL 1: RESCHEDULE (INFO/BLUE) --- */}
            <ConfirmationModal
                isOpen={isRescheduleModalOpen}
                onClose={() => setIsRescheduleModalOpen(false)}
                onConfirm={executeReschedule}
                title="Confirmer le déplacement"
                message={`Voulez-vous vraiment déplacer ce rendez-vous au ${targetSlot ? formatDate(targetSlot.date).full : ''} ?`}
                confirmText="Oui, Déplacer"
                cancelText="Annuler"
                type="info" // Blue color
            />

            {/* --- MODAL 2: CANCEL (DANGER/RED) --- */}
            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={executeCancel}
                title="Annuler le Rendez-vous ?"
                message="Êtes-vous sûr de vouloir annuler ce rendez-vous ? Le créneau horaire sera libéré immédiatement."
                confirmText="Oui, Annuler"
                cancelText="Retour"
                type="danger" // Red color
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">

                {/* Header with Back Button */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('doctor.slots.index')}
                        className="inline-flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-x-1 text-gray-600 hover:text-gray-900 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        <span className="font-medium">Retour au planning</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</div>
                        <div className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize ${
                            appointment.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : appointment.status === 'pending'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                            {appointment.status === 'confirmed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {appointment.status}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Patient & Appointment Details */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Patient Card */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">Informations Patient</h2>
                                            <p className="text-gray-500 text-sm">Détails du profil et contact</p>
                                        </div>
                                    </div>
                                    {is_walk_in ? (
                                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                            <UserCircle className="w-4 h-4" />
                                            Patient externe
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                                            <ShieldCheck className="w-4 h-4" />
                                            Patient enregistré
                                        </span>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                                                is_walk_in
                                                    ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700'
                                                    : 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700'
                                            }`}>
                                                {patientName?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{patientName}</h3>
                                                <p className="text-gray-500 text-sm">Patient principal</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    {is_walk_in ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">Contact</div>
                                                    <div className="font-medium">{patientContact || 'Non spécifié'}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <Building className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">Clinique</div>
                                                    <div className="font-medium">{appointment.slot.clinic?.name || 'Non spécifiée'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                                        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4 text-blue-500" />
                                            Motif de consultation
                                        </h4>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <p className="text-gray-700 leading-relaxed">
                                                {appointment.reason || 'Aucun motif spécifique fourni.'}
                                            </p>
                                        </div>
                                        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                            <CalendarDays className="w-4 h-4" />
                                            Rendez-vous créé le {formatDate(appointment.created_at).date}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                                        <Calendar className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Détails du Rendez-vous</h2>
                                        <p className="text-gray-500 text-sm">Date, heure et informations</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Heure</div>
                                                <div className="text-2xl font-bold text-gray-900 mt-1">{appointmentTime.time}</div>
                                            </div>
                                        </div>
                                        <div className="text-lg font-medium text-gray-700">{appointmentTime.date}</div>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            Durée: {appointment.slot.duration || 30} minutes
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <MapPin className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lieu</div>
                                                <div className="text-xl font-bold text-gray-900 mt-1">{appointment.slot.clinic?.name || 'Clinique'}</div>
                                            </div>
                                        </div>
                                        <div className="text-gray-600">
                                            {appointment.slot.clinic?.address || 'Adresse non spécifiée'}
                                        </div>
                                        {appointment.slot.clinic?.phone && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                <Phone className="w-4 h-4" />
                                                {appointment.slot.clinic.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            // --- UPDATED: CALL MODAL TRIGGER ---
                                            onClick={confirmCancel}
                                            disabled={cancelling}
                                            className="flex-1 bg-gradient-to-r from-white to-gray-50 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-3.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                        >
                                            {cancelling ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                                                    Annulation en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                    Annuler le Rendez-vous
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            href={`tel:${patientContact}`}
                                            className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 py-3.5 rounded-xl font-bold transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 group"
                                        >
                                            <Phone className="w-5 h-5 transition-transform group-hover:scale-110" />
                                            Appeler le Patient
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* --- ADD AUDIT TRAIL HERE --- */}
                <ActivityTimeline logs={appointment.activity_logs} />
                    </div>

                    {/* Right Column - Reschedule Panel */}
                    <div className="space-y-8">
                        {/* Reschedule Header */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Réorganiser</h3>
                                        <p className="text-blue-100 text-sm mt-1">Déplacer ce rendez-vous</p>
                                    </div>
                                </div>
                                <p className="text-blue-200 text-sm leading-relaxed">
                                    Besoin de modifier la date ? Sélectionnez un créneau disponible ci-dessous pour replanifier instantanément.
                                </p>
                            </div>
                            <div className="px-6 py-3 bg-white/10 text-xs font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                {nearbySlots.length} créneaux disponibles à proximité
                            </div>
                        </div>

                        {/* Available Slots */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-gray-700 text-base flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        Créneaux Recommandés
                                    </h4>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                        {nearbySlots.length} disponibles
                                    </span>
                                </div>
                            </div>

                            <div className="max-h-[500px] overflow-y-auto">
                                {nearbySlots.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h4 className="font-bold text-gray-700 mb-2">Aucun créneau disponible</h4>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Aucun créneau à proximité n'est disponible actuellement.
                                        </p>
                                        <Link
                                            href={route('doctor.slots.generate')}
                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            <span>Générer plus de créneaux</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {nearbySlots.map((slot: any) => {
                                            const slotTime = formatDate(slot.start_at);
                                            return (
                                                <div
                                                    key={slot.id}
                                                    className="p-5 hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer border-l-4 border-transparent hover:border-blue-300"
                                                    // --- UPDATED: CALL MODAL TRIGGER ---
                                                    onClick={() => confirmReschedule(slot.id, slot.start_at)}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-gray-900">{slotTime.date}</div>
                                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                                        <Clock className="w-3 h-3" />
                                                                        {slotTime.time}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Building className="w-3 h-3" />
                                                                {slot.clinic?.name || 'Clinique principale'}
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmReschedule(slot.id, slot.start_at);
                                                            }}
                                                            disabled={reschedulingSlot === slot.id}
                                                            className="bg-white border border-blue-200 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >
                                                            {reschedulingSlot === slot.id ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                                                    Traitement...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Déplacer
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 flex items-center gap-2 text-xs">
                                                        <div className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                                            {slot.duration || 30} min
                                                        </div>
                                                        <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                                                            Disponible
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {nearbySlots.length > 0 && (
                                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                    <div className="text-xs text-gray-500 text-center">
                                        Cliquez sur un créneau pour déplacer le rendez-vous
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-5">
                            <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Statistiques Rapides
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{nearbySlots.length}</div>
                                    <div className="text-xs text-gray-600">Créneaux libres</div>
                                </div>
                                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {appointment.slot.duration || 30}
                                    </div>
                                    <div className="text-xs text-gray-600">Durée (min)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
