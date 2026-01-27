import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar, MapPin, Clock, FileText, Download,
    CheckCircle, XCircle, AlertCircle, Scan,
    ArrowRight, Activity, Filter, Search, Plus,
    FileSearch, Radio, Image as ImageIcon, TrendingUp
} from 'lucide-react';

export default function PatientImagingIndex({ requests, filters = {} }: any) {

    // ✅ Defensive check for filters.search to prevent crash
    const [search, setSearch] = useState(filters.search || '');
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const handleSearch = (e: any) => {
        const value = e.target.value;
        setSearch(value);

        router.get(
            route('patient.imaging.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (filter: string) => {
        setActiveFilter(filter);
        router.get(
            route('patient.imaging.index'),
            { status: filter === 'all' ? '' : filter, search },
            { preserveState: true, replace: true }
        );
    };

    // Helper for Status Colors (Dark Mode Compatible)
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'confirmed':
                return {
                    badge: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 dark:from-emerald-900/30 dark:to-emerald-900/10 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                    icon: CheckCircle, // ✅ Return the component reference, not the element <Icon />
                    label: 'Confirmé',
                    dot: 'bg-emerald-500'
                };
            case 'rejected':
                return {
                    badge: 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 dark:from-rose-900/30 dark:to-rose-900/10 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                    icon: XCircle,
                    label: 'Refusé',
                    dot: 'bg-rose-500'
                };
            case 'completed':
                return {
                    badge: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 dark:from-blue-900/30 dark:to-blue-900/10 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    icon: CheckCircle,
                    label: 'Terminé',
                    dot: 'bg-blue-500'
                };
            default: // pending
                return {
                    badge: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 dark:from-amber-900/30 dark:to-amber-900/10 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                    icon: Clock,
                    label: 'En attente',
                    dot: 'bg-amber-500'
                };
        }
    };

    const filtersList = [
        { key: 'all', label: 'Tous', icon: Filter },
        { key: 'pending', label: 'En attente', icon: Clock },
        { key: 'confirmed', label: 'Confirmés', icon: CheckCircle },
        { key: 'completed', label: 'Terminés', icon: Radio },
        { key: 'rejected', label: 'Refusés', icon: XCircle },
    ];

    // Stats calculation
    const stats = {
        total: requests.data.length,
        pending: requests.data.filter((r: any) => r.status === 'pending').length,
        confirmed: requests.data.filter((r: any) => r.status === 'confirmed').length,
        completed: requests.data.filter((r: any) => r.status === 'completed').length,
        rejected: requests.data.filter((r: any) => r.status === 'rejected').length,
    };

    return (
        <AppLayout>
            <Head title="Mes Rendez-vous Imagerie" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- HEADER --- */}
                    <div className="mb-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                                        <Scan className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Mes Rendez-vous d'Imagerie
                                    </h1>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 ml-12">
                                    Suivez l'état de vos demandes d'examens radiologiques et analyses médicales
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* SEARCH INPUT */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un centre ou examen..."
                                            value={search}
                                            onChange={handleSearch}
                                            className="pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm w-full sm:w-72 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <Link
                                    href={route('imaging.search')}
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Nouvelle Demande</span>
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
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
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

                    {/* --- STATS SUMMARY --- */}
                    {requests.data.length > 0 && (
                        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                        <Activity className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">En attente</p>
                                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{stats.pending}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-800 dark:to-amber-900">
                                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">Confirmés</p>
                                        <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{stats.confirmed}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900">
                                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-5 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-sm">
                                <div className="flex items center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Terminés</p>
                                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.completed}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900">
                                        <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CONTENT --- */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {requests.data.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Scan className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Aucune demande d'imagerie
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    {search
                                        ? "Aucune demande ne correspond à votre recherche."
                                        : "Vous n'avez pas encore effectué de demande d'examen d'imagerie médicale."}
                                </p>
                                {search ? (
                                    <button
                                        onClick={() => handleSearch({ target: { value: '' } })}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Effacer la recherche
                                    </button>
                                ) : (
                                    <Link
                                        href={route('imaging.search')}
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Trouver un centre d'imagerie
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80 border-b border-gray-200 dark:border-gray-700">
                                        <tr>
                                            <th className="px-8 py-5 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4" />
                                                    Centre & Examen
                                                </div>
                                            </th>
                                            <th className="px-8 py-5 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Date & Heure
                                                </div>
                                            </th>
                                            <th className="px-8 py-5 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm">
                                                Statut
                                            </th>
                                            <th className="px-8 py-5 font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-sm text-right">
                                                Documents
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {requests.data.map((req: any) => {
                                            const status = getStatusStyle(req.status);
                                            // ✅ FIX: Use Capitalized Variable for Component
                                            const StatusIcon = status.icon;

                                            const appointmentDate = new Date(req.requested_date);
                                            const isUpcoming = appointmentDate > new Date();
                                            const isToday = appointmentDate.toDateString() === new Date().toDateString();

                                            return (
                                                <tr
                                                    key={req.id}
                                                    className={`group hover:bg-gradient-to-r hover:from-gray-50 hover:to-white dark:hover:from-gray-700/30 dark:hover:to-gray-800/30 transition-all duration-200 ${
                                                        isToday ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-900/5' : ''
                                                    }`}
                                                >

                                                    {/* Center Info */}
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-start gap-4">
                                                            <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                                                                isUpcoming
                                                                    ? 'bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-600 dark:text-cyan-400'
                                                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400'
                                                            }`}>
                                                                <Activity className="w-6 h-6" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="font-bold text-gray-900 dark:text-white text-lg">
                                                                    {req.exam ? req.exam.name : 'Examen d\'imagerie'}
                                                                </div>
                                                                <div className="text-gray-700 dark:text-gray-300 font-medium">
                                                                    {req.center ? req.center.name : 'Centre d\'imagerie'}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                                                                    <MapPin className="w-3.5 h-3.5" />
                                                                    {req.center ? `${req.center.address}, ${req.center.city}` : 'Adresse non disponible'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Date & Time */}
                                                    <td className="px-8 py-5">
                                                        <div className="space-y-2">
                                                            <div className={`font-semibold text-lg ${isToday ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                                                                {appointmentDate.toLocaleDateString('fr-FR', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                <Clock className="w-4 h-4" />
                                                                <span className="font-medium">
                                                                    {appointmentDate.toLocaleTimeString('fr-FR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                                {isToday && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
                                                                        Aujourd'hui
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-8 py-5">
                                                        <div className="space-y-3">
                                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${status.badge}`}>
                                                                <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                                                                {/* ✅ Correctly Rendered Component */}
                                                                <StatusIcon className="w-4 h-4" />
                                                                {status.label}
                                                            </span>

                                                            {/* Show rejection reason if rejected */}
                                                            {req.status === 'rejected' && req.rejection_reason && (
                                                                <div className="mt-2">
                                                                    <div className="text-xs font-medium text-rose-700 dark:text-rose-300 mb-1">Motif de refus :</div>
                                                                    <div className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-200 dark:border-rose-800">
                                                                        {req.rejection_reason}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex flex-col items-end gap-3">
                                                            {req.prescription_path ? (
                                                                <div className="flex gap-2">
                                                                    <a
                                                                        href={`/storage/${req.prescription_path}`}
                                                                        target="_blank"
                                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:border-cyan-300 dark:hover:border-cyan-800 hover:shadow-md group/btn"
                                                                    >
                                                                        <FileText className="w-4 h-4" />
                                                                        Voir l'ordonnance
                                                                    </a>
                                                                    <a
                                                                        href={`/storage/${req.prescription_path}`}
                                                                        download
                                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium rounded-xl border border-cyan-200 dark:border-cyan-800 transition-all duration-200 hover:shadow-md group/btn"
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                        Télécharger
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-600 text-sm italic bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                                                                    Aucun document joint
                                                                </span>
                                                            )}

                                                            {req.status === 'completed' && (
                                                                <button className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium flex items-center gap-1 group/results">
                                                                    Voir les résultats
                                                                    <ArrowRight className="w-3 h-3 group-hover/results:translate-x-1 transition-transform" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* --- PAGINATION --- */}
                        {requests.links && requests.data.length > 0 && (
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Affichage de <span className="font-semibold text-gray-900 dark:text-white">{requests.from}</span> à <span className="font-semibold text-gray-900 dark:text-white">{requests.to}</span> sur <span className="font-semibold text-gray-900 dark:text-white">{requests.total}</span> demandes
                                    </p>
                                    <div className="flex gap-1">
                                        {requests.links.map((link: any, key: number) => (
                                            link.url ? (
                                                <Link
                                                    key={key}
                                                    href={link.url}
                                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
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
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
