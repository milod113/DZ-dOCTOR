import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, MessageSquare, CheckCircle, Loader2, RefreshCw, Calendar } from 'lucide-react';
import axios from 'axios';

export default function BulkReminderModal({ isOpen, onClose, doctorName }: any) {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [sentIds, setSentIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadPatients();
        } else {
            setSentIds([]);
        }
    }, [isOpen]);

    const loadPatients = () => {
        setLoading(true);
        // UPDATED ROUTE: 'upcoming' fetches Today + Next 3 days
        axios.get(route('doctor.appointments.upcoming'))
            .then(res => {
                setPatients(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const sendWhatsApp = (patient: any) => {
        if (!patient.phone) {
            alert("Pas de numéro de téléphone.");
            return;
        }

        let cleanPhone = patient.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
        else if (!cleanPhone.startsWith('213')) cleanPhone = '213' + cleanPhone;

        // UPDATED MESSAGE: Uses 'date_label' (Aujourd'hui/Demain/Samedi)
        const message = `Bonjour ${patient.name}, rappel de votre rendez-vous ${patient.date_label} (${patient.date_human}) à ${patient.time} chez le Dr. ${doctorName}. Merci de confirmer.`;

        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');

        if (!sentIds.includes(patient.id)) {
            setSentIds([...sentIds, patient.id]);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-gray-100">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                                            <MessageSquare className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                                Rappels (Prochains Jours)
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 font-medium">
                                                Aujourd'hui, Demain & Après-demain
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Content List */}
                                <div className="min-h-[250px] bg-gray-50/50 rounded-xl border border-gray-100 p-2">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
                                            <span className="text-sm font-medium">Chargement des patients...</span>
                                        </div>
                                    ) : patients.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Calendar className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">Aucun rendez-vous confirmé.</p>
                                            <p className="text-xs text-gray-500 mt-1">Tout est calme pour le moment.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                                            {patients.map((p) => {
                                                const isSent = sentIds.includes(p.id);
                                                const isToday = p.date_label === "Aujourd'hui";

                                                return (
                                                    <div
                                                        key={p.id}
                                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                                                            isSent
                                                            ? 'bg-green-50 border-green-200 opacity-75'
                                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Time & Date Badge */}
                                                            <div className="flex flex-col items-center min-w-[70px]">
                                                                <span className="font-bold text-gray-900 text-lg leading-none">
                                                                    {p.time}
                                                                </span>
                                                                <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                                                                    isToday
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-orange-100 text-orange-700'
                                                                }`}>
                                                                    {p.date_label}
                                                                </span>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="border-l pl-4 border-gray-100 flex-1 min-w-0">
                                                                <div className="font-bold text-gray-800 text-sm truncate">
                                                                    {p.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                    {p.phone || <span className="text-red-400 italic">Pas de numéro</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => sendWhatsApp(p)}
                                                            disabled={!p.phone}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all transform active:scale-95 ${
                                                                isSent
                                                                ? 'bg-white text-green-600 border border-green-200 cursor-default'
                                                                : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                                                            } ${!p.phone ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300' : ''}`}
                                                        >
                                                            {isSent ? (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">Envoyé</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <MessageSquare className="w-4 h-4" />
                                                                    <span className="hidden sm:inline">Envoyer</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-between items-center">
                                    <button
                                        onClick={loadPatients}
                                        disabled={loading}
                                        className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                                        Actualiser
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
                                    >
                                        Fermer
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
