import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar, Clock, MapPin, Stethoscope,
    CheckCircle, XCircle, AlertCircle, ArrowRight,
    User, Search, Users, ChevronRight, Filter,
    Plus, CalendarDays, History, TrendingUp
} from 'lucide-react';

export default function PatientAppointmentsIndex({ appointments, filters }: any) {

    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const handleSearch = (e: any) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            route('patient.appointments.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (filter: string) => {
        setActiveFilter(filter);
        router.get(
            route('patient.appointments.index'),
            { status: filter === 'all' ? '' : filter, search },
            { preserveState: true, replace: true }
        );
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'confirmed':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
                    text: 'text-emerald-700 dark:text-emerald-300',
                    border: 'border-emerald-200 dark:border-emerald-800',
                    icon: CheckCircle,
                    label: 'Confirmé',
                    dot: 'bg-emerald-500'
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/30',
                    text: 'text-amber-700 dark:text-amber-300',
                    border: 'border-amber-200 dark:border-amber-800',
                    icon: Clock,
                    label: 'En attente',
                    dot: 'bg-amber-500'
                };
            case 'cancelled':
                return {
                    bg: 'bg-rose-50 dark:bg-rose-900/30',
                    text: 'text-rose-700 dark:text-rose-300',
                    border: 'border-rose-200 dark:border-rose-800',
                    icon: XCircle,
                    label: 'Annulé',
                    dot: 'bg-rose-500'
                };
            case 'completed':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/30',
                    text: 'text-blue-700 dark:text-blue-300',
                    border: 'border-blue-200 dark:border-blue-800',
                    icon: CheckCircle,
                    label: 'Terminé',
                    dot: 'bg-blue-500'
                };
            default:
                return {
                    bg: 'bg-gray-50 dark:bg-gray-800',
                    text: 'text-gray-600 dark:text-gray-300',
                    border: 'border-gray-200 dark:border-gray-700',
                    icon: Calendar,
                    label: status,
                    dot: 'bg-gray-500'
                };
        }
    };

    const filtersList = [
        { key: 'all', label: 'Tous', icon: CalendarDays },
        { key: 'upcoming', label: 'À venir', icon: TrendingUp },
        { key: 'completed', label: 'Terminés', icon: CheckCircle },
        { key: 'cancelled', label: 'Annulés', icon: XCircle },
    ];

    return (
        <AppLayout>
            <Head title="Mes Rendez-vous" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- HEADER --- */}
                    <div className="mb-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                                        <Calendar className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Mes Rendez-vous
                                    </h1>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 ml-12">
                                    Gérez vos consultations et suivez votre historique médical
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* SEARCH INPUT */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={search}
                                            onChange={handleSearch}
                                            className="pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm w-full sm:w-72 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <Link
                                    href={route('search')}
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Nouveau RDV</span>
                                </Link>
                            </div>
                        </div>

                        {/* FILTER TABS */}
                        <div className="mt-8 flex flex-wrap gap-2">
                            {filtersList.map((filter) => {
                                const Icon = filter.icon;
                                const isActive = activeFilter === filter.key;

                                return (
                                    <button
                                        key={filter.key}
                                        onClick={() => handleFilter(filter.key)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {filter.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- APPOINTMENTS LIST --- */}
                    <div className="space-y-4">
                        {appointments.data.length === 0 ? (
                            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-lg">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Calendar className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucun rendez-vous trouvé
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    {search
                                        ? "Aucun rendez-vous ne correspond à votre recherche."
                                        : "Vous n'avez aucun rendez-vous pour le moment."}
                                </p>
                                {search ? (
                                    <button
                                        onClick={() => handleSearch({ target: { value: '' } })}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Effacer la recherche
                                    </button>
                                ) : (
                                    <Link
                                        href={route('search')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Prendre un rendez-vous
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {appointments.data.map((apt: any) => {
                                    const status = getStatusStyle(apt.status);
                                    const StatusIcon = status.icon;
                                    const appointmentDate = new Date(apt.slot?.start_at);
                                    const isUpcoming = appointmentDate > new Date();
                                    const isToday = appointmentDate.toDateString() === new Date().toDateString();

                                    // Patient name logic
                                    const isFamily = !!apt.family_member;
                                    const patientName = isFamily
                                        ? `${apt.family_member.name} (${apt.family_member.relationship === 'child' ? 'Enfant' : apt.family_member.relationship === 'spouse' ? 'Conjoint(e)' : 'Parent'})`
                                        : "Moi-même";

                                    return (
                                        <div
                                            key={apt.id}
                                            className={`bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 group ${
                                                isUpcoming
                                                    ? 'border-l-4 border-l-indigo-500 dark:border-l-indigo-400 hover:border-l-indigo-600 dark:hover:border-l-indigo-300'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            } ${isToday ? 'ring-2 ring-indigo-500/20 dark:ring-indigo-400/20' : ''}`}
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                {/* Left Section */}
                                                <div className="flex items-start gap-4">
                                                    {/* Date Card */}
                                                    <div className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-xl border shadow-sm flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${
                                                        isToday
                                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 border-transparent text-white'
                                                            : isUpcoming
                                                            ? 'bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                                                            : 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {isToday && (
                                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                                <span className="text-xs font-bold text-white">!</span>
                                                            </div>
                                                        )}
                                                        <span className="text-xs font-semibold uppercase tracking-wide">
                                                            {appointmentDate.toLocaleDateString('fr-FR', { month: 'short' })}
                                                        </span>
                                                        <span className="text-2xl font-bold mt-1">
                                                            {appointmentDate.getDate()}
                                                        </span>
                                                        <span className="text-xs mt-1">
                                                            {appointmentDate.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                                        </span>
                                                    </div>

                                                    {/* Appointment Details */}
                                                    <div className="flex-1">
                                                        {/* Patient Badge */}
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-sm font-medium ${
                                                            isFamily
                                                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                        }`}>
                                                            {isFamily ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                                            {patientName}
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                                                                    {apt.type === 'consultation' ? 'Consultation' : 'Contrôle'} - {apt.doctor_profile?.user?.name || 'Médecin'}
                                                                </h3>
                                                                <span className={`px-3 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${
                                                                    status.bg
                                                                } ${status.text} ${status.border}`}>
                                                                    <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                                                                    {status.label}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                        {appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                                                <div className="flex items-center gap-2">
                                                                    <Stethoscope className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                                                                    <span>Dr. {apt.doctor_profile?.user?.name || 'Médecin'}</span>
                                                                </div>
                                                                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                                                <div className="flex items-center gap-2">
                                                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                                                                    <span>{apt.clinic?.name || 'Cabinet Médical'}</span>
                                                                </div>
                                                            </div>

                                                            {apt.notes && (
                                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">
                                                                        <span className="font-medium text-gray-700 dark:text-gray-300">Note :</span> "{apt.notes}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                {isUpcoming && (
                                                    <div className="lg:self-start">
                                                        <Link
                                                            href={route('patient.appointments.show', apt.id)}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group/btn"
                                                        >
                                                            <span>Détails</span>
                                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* --- PAGINATION --- */}
                    {appointments.links && appointments.data.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Affichage de <span className="font-semibold text-gray-900 dark:text-white">{appointments.from}</span> à <span className="font-semibold text-gray-900 dark:text-white">{appointments.to}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{appointments.total}</span> rendez-vous
                                </p>
                                <div className="flex gap-1">
                                    {appointments.links.map((link: any, key: number) => (
                                        link.url ? (
                                            <Link
                                                key={key}
                                                href={link.url}
                                                className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:-translate-y-0.5'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={key}
                                                className="min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Summary */}
                    {appointments.data.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">Confirmés</p>
                                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">3</p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">À venir</p>
                                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">2</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Terminés</p>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</p>
                                    </div>
                                    <History className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
