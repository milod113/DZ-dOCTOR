import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Import React hooks
import {
    FlaskConical, Calendar, User, ChevronRight,
    Search, Filter, X, Clock, Car, MapPin // Added Car and MapPin
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function RequestIndex({ requests, filters }: any) {
    // --- STATE FOR FILTERS ---
    const [search, setSearch] = useState(filters.search || '');
    const [dateStart, setDateStart] = useState(filters.date_start || '');
    const [dateEnd, setDateEnd] = useState(filters.date_end || '');
    const [status, setStatus] = useState(filters.status || '');

    // --- DEBOUNCED SEARCH LOGIC ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Only trigger reload if the search actually changed from initial prop
            if (search !== (filters.search || '')) {
                handleFilterChange();
            }
        }, 500); // Wait 500ms after typing

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Apply filters immediately for dates/status
    const handleFilterChange = () => {
        router.get(
            route('laboratory.requests.index'),
            { search, date_start: dateStart, date_end: dateEnd, status },
            { preserveState: true, replace: true }
        );
    };

    // Trigger explicit reload for dates/selects
    const applyFilters = () => {
        handleFilterChange();
    };

    const clearFilters = () => {
        setSearch('');
        setDateStart('');
        setDateEnd('');
        setStatus('');
        router.get(route('laboratory.requests.index'));
    };

    return (
        <AppLayout>
            <Head title="Demandes d'Analyses" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FlaskConical className="w-8 h-8 text-purple-600" />
                            Demandes Reçues
                        </h2>
                        <p className="text-gray-500 mt-1">Gérez les demandes entrantes des médecins.</p>
                    </div>
                </div>

                {/* --- FILTERS BAR --- */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">

                        {/* Search Input */}
                        <div className="md:col-span-4">
                            <InputLabel value="Rechercher un patient" />
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <TextInput
                                    className="pl-10 w-full"
                                    placeholder="Nom du patient..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Date Start */}
                        <div className="md:col-span-2">
                            <InputLabel value="Du" />
                            <TextInput
                                type="date"
                                className="w-full mt-1"
                                value={dateStart}
                                onChange={(e) => setDateStart(e.target.value)}
                                onBlur={applyFilters} // Apply on blur
                            />
                        </div>

                        {/* Date End */}
                        <div className="md:col-span-2">
                            <InputLabel value="Au" />
                            <TextInput
                                type="date"
                                className="w-full mt-1"
                                value={dateEnd}
                                onChange={(e) => setDateEnd(e.target.value)}
                                onBlur={applyFilters}
                            />
                        </div>

                        {/* Status Select */}
                        <div className="md:col-span-2">
                            <InputLabel value="Statut" />
                            <select
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setTimeout(() => applyFilters(), 0); }}
                            >
                                <option value="">Tous</option>
                                <option value="pending">En Attente</option>
                                <option value="processing">En Cours</option>
                                <option value="completed">Terminé</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
                            >
                                <Filter className="w-4 h-4" /> Filtrer
                            </button>
                            {(search || dateStart || dateEnd || status) && (
                                <button
                                    onClick={clearFilters}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Réinitialiser"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RESULTS LIST --- */}
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
                    <ul role="list" className="divide-y divide-gray-100">
                        {requests.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">Aucun résultat</h3>
                                <p>Essayez de modifier vos filtres de recherche.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 text-purple-600 hover:underline text-sm font-medium"
                                >
                                    Tout effacer
                                </button>
                            </div>
                        ) : (
                            requests.data.map((req: any) => (
                                <li key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <Link
                                        href={route('laboratory.requests.show', req.id)}
                                        className="flex items-center justify-between gap-x-6 py-5 px-6"
                                    >
                                        <div className="flex min-w-0 gap-x-4">
                                            {/* Status Indicator */}
                                            <div className="flex flex-col items-center justify-center">
                                                <div className={`w-3 h-3 rounded-full mb-1 ${
                                                    req.status === 'pending' ? 'bg-yellow-400' :
                                                    req.status === 'completed' ? 'bg-green-500' :
                                                    'bg-blue-500'
                                                }`} />
                                            </div>

                                            <div className="min-w-0 flex-auto">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                                        {req.guest_name || req.patient_user?.name || 'Patient Inconnu'}
                                                    </p>
                                                    {/* Home Visit Badge */}
                                                    {req.is_home_visit && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                            <Car className="w-3 h-3" /> À Domicile
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-1 flex text-xs leading-5 text-gray-500 gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" /> Dr. {req.doctor_profile?.user?.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(req.created_at).toLocaleDateString()}
                                                    </span>
                                                    {/* Home Visit Address Preview */}
                                                    {req.is_home_visit && req.home_visit_address && (
                                                        <span className="flex items-center gap-1 text-blue-600 truncate max-w-[200px]">
                                                            <MapPin className="w-3 h-3" /> {req.home_visit_address}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Preview of tests */}
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {req.tests_requested && req.tests_requested.slice(0, 3).map((test: string, idx: number) => (
                                                        <span key={idx} className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                            {test}
                                                        </span>
                                                    ))}
                                                    {req.tests_requested && req.tests_requested.length > 3 && (
                                                        <span className="text-xs text-gray-400 self-center">+{req.tests_requested.length - 3} autres</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-none items-center gap-x-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                req.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {req.status === 'pending' ? 'En attente' :
                                                 req.status === 'completed' ? 'Terminé' : req.status}
                                            </span>
                                            <ChevronRight className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                        </div>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Pagination (Simple Next/Prev) */}
                {requests.links && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex gap-2">
                            {requests.links.map((link: any, key: number) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-4 py-2 text-sm rounded-lg ${
                                            link.active
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        className="px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
