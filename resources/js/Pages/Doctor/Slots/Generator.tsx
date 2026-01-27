import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function SlotGenerator({ clinics }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        start_date: '',
        end_date: '',
        days: [0, 1, 2, 3, 4], // Par défaut: Dimanche à Jeudi (Algérie)
        start_time: '09:00',
        end_time: '16:00',
        duration: 30,
        clinic_id: clinics[0]?.id || ''
    });

    // Mapping des jours pour l'affichage
    const weekDays = [
        { id: 0, label: 'Dimanche' },
        { id: 1, label: 'Lundi' },
        { id: 2, label: 'Mardi' },
        { id: 3, label: 'Mercredi' },
        { id: 4, label: 'Jeudi' },
        { id: 5, label: 'Vendredi' },
        { id: 6, label: 'Samedi' },
    ];

    const toggleDay = (dayId: number) => {
        if (data.days.includes(dayId)) {
            setData('days', data.days.filter(d => d !== dayId));
        } else {
            setData('days', [...data.days, dayId].sort());
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.slots.generate'), {
            onSuccess: () => reset('start_date', 'end_date'),
        });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Générateur de Planning</h2>
                </div>
                <p className="text-gray-600 ml-11">Générez vos créneaux en masse pour la période sélectionnée</p>
            </div>

            <form onSubmit={submit} className="space-y-8">
                {/* 1. Plage de Dates */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Période de Génération
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-600">Date de début</span>
                            </div>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.start_date}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-600">Date de fin</span>
                            </div>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Jours Travaillés */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Jours de Travail
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {weekDays.map(day => (
                            <button
                                key={day.id}
                                type="button"
                                onClick={() => toggleDay(day.id)}
                                className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                                    data.days.includes(day.id)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-sm font-medium">{day.label.substring(0, 3)}</span>
                                <span className={`text-xs mt-1 ${data.days.includes(day.id) ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {day.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    {errors.days && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            {errors.days}
                        </p>
                    )}
                </div>

                {/* 3. Horaires de Travail */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Horaires Quotidiennes
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Heure de début</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="time"
                                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Heure de fin</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="time"
                                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Durée par créneau</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={data.duration}
                                onChange={e => setData('duration', parseInt(e.target.value))}
                            >
                                <option value="15">15 minutes</option>
                                <option value="20">20 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 4. Sélection Clinique */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Lieu de Consultation
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <select
                            className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            value={data.clinic_id}
                            onChange={e => setData('clinic_id', e.target.value)}
                        >
                            {clinics.map((c: any) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800">Récapitulatif</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {data.days.length} jour(s) par semaine • {data.duration} min par créneau • {data.start_time} à {data.end_time}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                                {clinics.find((c: any) => c.id === data.clinic_id)?.name || 'Clinique'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Génération en cours...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            🚀 Générer le Planning
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
