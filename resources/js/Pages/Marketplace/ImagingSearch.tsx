import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef, FormEventHandler } from 'react';
import {
    Search, MapPin, Filter, Scan, Star,
    ArrowRight, ShieldCheck, Activity, X,
    Clock, Zap, Award, Building, Phone,
    Calendar, CheckCircle, Eye, TrendingUp,
    Download, Shield, Users, Thermometer,
    Heart, ChevronRight, Radio
} from 'lucide-react';

interface ImagingSearchProps {
    centers: {
        data: any[];
        links: any[];
        from?: number;
        to?: number;
        total?: number;
        meta?: any;
    };
    filters: {
        q?: string;
        city?: string;
        modality?: string;
        equipment?: string;
    };
    cities: string[];
}

export default function ImagingSearch({ centers, filters, cities }: ImagingSearchProps) {
    // --- STATE ---
    const [values, setValues] = useState({
        q: filters.q || '',
        city: filters.city || '',
        modality: filters.modality || '',
        equipment: filters.equipment || '',
        emergency: filters.emergency === 'true',
    });

    const [showFilters, setShowFilters] = useState(false);
    const [favoriteCenters, setFavoriteCenters] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'grid' | 'list'>('grid');
    const isFirstRender = useRef(true);

    const modalities = [
        'IRM', 'Scanner (TDM)', 'Radiologie', 'Échographie',
        'Mammographie', 'Panoramique Dentaire', 'Scintigraphie',
        'Écho-Doppler', 'Ostéodensitométrie', 'Angiographie'
    ];

    const equipmentList = [
        'IRM 3 Tesla', 'Scanner 64 Barrette', 'Échographe Doppler',
        'Mammographe Numérique', 'Table Radiologique', 'Salle Angio',
        'Pet Scanner', 'IRM Ouvert', 'Echographe 4D'
    ];

    // --- DEBOUNCED SEARCH ---
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const queryParams: any = {};
            if (values.q) queryParams.q = values.q;
            if (values.city) queryParams.city = values.city;
            if (values.modality) queryParams.modality = values.modality;
            if (values.equipment) queryParams.equipment = values.equipment;
            if (values.emergency) queryParams.emergency = 'true';

            router.get(route('imaging.search'), queryParams, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [values]);

    // --- HANDLERS ---
    const clearFilters = () => {
        setValues({ q: '', city: '', modality: '', equipment: '', emergency: false });
    };

    const toggleFavorite = (centerId: number) => {
        setFavoriteCenters(prev =>
            prev.includes(centerId)
                ? prev.filter(id => id !== centerId)
                : [...prev, centerId]
        );
    };

    const hasActiveFilters = values.q || values.city || values.modality || values.equipment || values.emergency;

    return (
        <AppLayout>
            <Head title="Recherche Centres d'Imagerie" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* --- HERO --- */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <span className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full animate-pulse"></span>
                                {centers.total || 0} Centres d'Imagerie Disponibles
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Trouvez votre{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                                    Centre d'Imagerie
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                IRM, Scanner, Radiologie... Comparez et prenez rendez-vous avec les meilleurs centres certifiés.
                            </p>
                        </div>

                        {/* --- QUICK STATS --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: Shield, value: '100%', label: 'Centres Vérifiés', color: 'from-emerald-500 to-teal-500' },
                                { icon: Zap, value: '24/7', label: 'Urgences', color: 'from-amber-500 to-orange-500' },
                                { icon: Clock, value: '≤48h', label: 'Rendez-vous Rapide', color: 'from-blue-500 to-cyan-500' },
                                { icon: Award, value: '4.8/5', label: 'Satisfaction', color: 'from-purple-500 to-violet-500' },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- SEARCH CARD --- */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 mb-8 transition-all duration-300">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                                    {/* Name Input */}
                                    <div className="lg:col-span-4 relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                            placeholder="Nom du centre ou examen recherché"
                                            value={values.q}
                                            onChange={e => setValues(prev => ({ ...prev, q: e.target.value }))}
                                        />
                                        {values.q && (
                                            <button
                                                type="button"
                                                onClick={() => setValues(prev => ({ ...prev, q: '' }))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* City Select */}
                                    <div className="lg:col-span-3 relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                                        <select
                                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 appearance-none cursor-pointer dark:text-white"
                                            value={values.city}
                                            onChange={e => setValues(prev => ({ ...prev, city: e.target.value }))}
                                        >
                                            <option value="" className="dark:bg-gray-800">Toutes les villes</option>
                                            {cities.map((city: string) => (
                                                <option key={city} value={city} className="dark:bg-gray-800">{city}</option>
                                            ))}
                                        </select>
                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 -rotate-90" />
                                    </div>

                                    {/* Advanced Filter Toggle */}
                                    <div className="lg:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="w-full h-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 font-semibold py-4 px-4 rounded-xl hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/40 dark:hover:to-purple-800/40 transition-all duration-300 border border-indigo-200 dark:border-indigo-800"
                                        >
                                            <Filter className="h-5 w-5" />
                                            Filtres
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="lg:col-span-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            disabled={!hasActiveFilters}
                                            className={`px-4 py-4 border rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                                                !hasActiveFilters
                                                ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700'
                                                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800'
                                            }`}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                                        >
                                            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                            Rechercher
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filtres Avancés</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'examen</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                    value={values.modality}
                                                    onChange={e => setValues(prev => ({ ...prev, modality: e.target.value }))}
                                                >
                                                    <option value="" className="dark:bg-gray-800">Tous les examens</option>
                                                    {modalities.map((mod) => (
                                                        <option key={mod} value={mod} className="dark:bg-gray-800">{mod}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Équipement</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                    value={values.equipment}
                                                    onChange={e => setValues(prev => ({ ...prev, equipment: e.target.value }))}
                                                >
                                                    <option value="" className="dark:bg-gray-800">Tous les équipements</option>
                                                    {equipmentList.map((eq) => (
                                                        <option key={eq} value={eq} className="dark:bg-gray-800">{eq}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                                onClick={() => setValues(prev => ({ ...prev, emergency: !prev.emergency }))}>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                        checked={values.emergency}
                                                        readOnly
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Service d'urgence</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">24h/24 disponible</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Active Filters */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        {values.q && (
                                            <span className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                Recherche: {values.q}
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, q: '' }))} className="hover:text-indigo-900 dark:hover:text-indigo-200">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {values.city && (
                                            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                Ville: {values.city}
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, city: '' }))} className="hover:text-blue-900 dark:hover:text-blue-200">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {values.modality && (
                                            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                Examen: {values.modality}
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, modality: '' }))} className="hover:text-purple-900 dark:hover:text-purple-200">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {values.emergency && (
                                            <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                Urgences
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, emergency: false }))} className="hover:text-amber-900 dark:hover:text-amber-200">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Centres d'Imagerie
                                    <span className="text-indigo-600 dark:text-indigo-400 ml-2">({centers.total || 0})</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Trouvez le centre adapté à vos besoins</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span>Tous les centres sont certifiés</span>
                                </div>
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab('grid')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'grid'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Grille
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('list')}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'list'
                                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Liste
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- RESULTS --- */}
                        {centers.data.length === 0 ? (
                            <div className="text-center py-16 bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/10 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <div className="mx-auto h-20 w-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6">
                                    <Scan className="h-10 w-10 text-indigo-600 dark:text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun centre trouvé</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    Aucun résultat ne correspond à vos critères de recherche.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={clearFilters}
                                        className="bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                                    >
                                        Voir tous les centres
                                    </button>
                                    <Link
                                        href={route('home')}
                                        className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                                    >
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Results Grid */}
                                <div className={`mb-8 ${activeTab === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}`}>
                                    {centers.data.map((center: any) => {
                                        const isFavorite = favoriteCenters.includes(center.id);
                                        const imageUrl = center.logo_path
                                            ? `/storage/${center.logo_path}`
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(center.name)}&background=E0E7FF&color=4F46E5&size=128`;

                                        return (
                                            <Link
                                                key={center.id}
                                                href={route('imaging.show', center.slug)}
                                                className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex ${
                                                    activeTab === 'list' ? 'flex-row' : 'flex-col'
                                                }`}
                                            >
                                                {/* Image/Logo Section */}
                                                <div className={`relative ${
                                                    activeTab === 'list'
                                                        ? 'w-1/3 h-48'
                                                        : 'h-48'
                                                    } bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center overflow-hidden`}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={center.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${center.name}&background=eee&color=999&size=128`;
                                                        }}
                                                    />

                                                    {/* Favorite Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleFavorite(center.id);
                                                        }}
                                                        className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
                                                    >
                                                        <Heart
                                                            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                        />
                                                    </button>

                                                    {/* Badges */}
                                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                        <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-indigo-100 dark:border-indigo-800">
                                                            <ShieldCheck className="w-3 h-3" /> Vérifié
                                                        </span>
                                                        {center.emergency_service && (
                                                            <span className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                                <Zap className="w-3 h-3" /> Urgence
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Section */}
                                                <div className={`p-5 flex-1 flex flex-col ${
                                                    activeTab === 'list' ? 'w-2/3' : ''
                                                }`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                                {center.name}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {center.address}, {center.city}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{center.rating || '4.8'}</span>
                                                            <span className="text-yellow-600 dark:text-yellow-500 text-xs">({center.reviews_count || 120})</span>
                                                        </div>
                                                    </div>

                                                    {/* Equipment Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {center.equipment_list && center.equipment_list.slice(0, 3).map((item: string, idx: number) => (
                                                            <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md font-medium">
                                                                {item}
                                                            </span>
                                                        ))}
                                                        {center.equipment_list && center.equipment_list.length > 3 && (
                                                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs px-2 py-1 rounded-md font-medium">
                                                                +{center.equipment_list.length - 3}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Services & Info */}
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-emerald-500" />
                                                            <div>
                                                                <div className="text-xs font-medium text-gray-900 dark:text-white">Ouvert</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">8h-20h</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-blue-500" />
                                                            <div>
                                                                <div className="text-xs font-medium text-gray-900 dark:text-white">Réservation</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">En ligne</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Section */}
                                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <Building className="w-4 h-4" />
                                                            <span>Agréé Ministère Santé</span>
                                                        </div>
                                                        <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50">
                                                            Voir centre
                                                            <ChevronRight className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Stats Banner */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-2xl p-6 mb-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { value: '98%', label: 'Satisfaction Patients', icon: Award },
                                            { value: '≤48h', label: 'Rendez-vous Rapide', icon: Calendar },
                                            { value: '24/7', label: 'Support Urgence', icon: Zap },
                                            { value: '200+', label: 'Centres Certifiés', icon: Building }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="flex justify-center mb-2">
                                                    <div className="p-2 bg-white/20 rounded-lg">
                                                        <stat.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                                <div className="text-indigo-100 font-medium text-sm">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                {centers.links && centers.links.length > 3 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Affichage {centers.from} à {centers.to} sur {centers.total} résultats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {centers.links.map((link: any, i: number) => (
                                                <Link
                                                    key={i}
                                                    href={link.url || '#'}
                                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg'
                                                            : link.url
                                                                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                                                                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Popular Modalities */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Examens Populaires</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[
                                    { name: 'IRM Cérébrale', icon: Scan, color: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20' },
                                    { name: 'Scanner', icon: Radio, color: 'from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20' },
                                    { name: 'Échographie', icon: Activity, color: 'from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20' },
                                    { name: 'Mammographie', icon: Thermometer, color: 'from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20' },
                                    { name: 'Radiologie', icon: Radio, color: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20' },
                                    { name: 'Doppler', icon: Activity, color: 'from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20' }
                                ].map((modality, idx) => (
                                    <Link
                                        key={idx}
                                        href={route('imaging.search', { modality: modality.name })}
                                        className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${modality.color} mb-3 group-hover:scale-110 transition-transform`}>
                                            <modality.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {modality.name}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
