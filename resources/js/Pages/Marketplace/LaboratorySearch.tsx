import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    FlaskConical, Search, MapPin, Filter,
    CheckCircle, Star, Clock, Car, ChevronRight, X,
    Shield, Zap, TestTube, Building, Phone, Mail,
    Calendar, Users, Award, TrendingUp, Download,
    Home, Globe, Clock4, Thermometer, Pill, Syringe
} from 'lucide-react';

export default function LaboratorySearch({ laboratories, filters = {}, cities = [] }: any) {
    // --- STATE ---
    const parseBool = (val: any) => val === true || val === 'true' || val === '1' || val === 1;

    const [values, setValues] = useState({
        q: filters.q || '',
        city: filters.city || '',
        home_visit: parseBool(filters.home_visit),
        emergency: parseBool(filters.emergency),
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
    const isFirstRender = useRef(true);

    // --- EFFECT: DEBOUNCED SEARCH ---
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const queryParams: any = {};
            if (values.q) queryParams.q = values.q;
            if (values.city) queryParams.city = values.city;
            if (values.home_visit) queryParams.home_visit = '1';
            if (values.emergency) queryParams.emergency = '1';

            router.get(route('laboratories.search'), queryParams, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [values]);

    // --- HANDLERS ---
    const resetFilters = () => {
        setValues({ q: '', city: '', home_visit: false, emergency: false });
    };

    const hasActiveFilters = values.q || values.city || values.home_visit || values.emergency;

    return (
        <AppLayout>
            <Head title="Trouver un Laboratoire" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* --- HEADER --- */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full animate-pulse"></span>
                                {laboratories.total || 0} Laboratoires Disponibles
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Trouvez votre{' '}
                                <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                    Laboratoire d'Analyses
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                Recherchez par nom, ville ou service spécialisé. Résultats certifiés et vérifiés.
                            </p>
                        </div>

                        {/* --- QUICK STATS --- */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: Shield, value: '100%', label: 'Résultats Vérifiés', color: 'from-emerald-500 to-teal-500' },
                                { icon: Zap, value: '24/7', label: 'Urgences', color: 'from-amber-500 to-orange-500' },
                                { icon: Car, value: '85%', label: 'À Domicile', color: 'from-blue-500 to-cyan-500' },
                                { icon: Clock, value: '≤30min', label: 'Temps Moyen', color: 'from-purple-500 to-violet-500' },
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
                                        <FlaskConical className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                            placeholder="Nom du laboratoire (ex: Labo Bio, Pasteur...)"
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
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                                        <select
                                            className="w-full pl-12 pr-10 py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 appearance-none cursor-pointer dark:text-white"
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
                                            onClick={() => setShowAdvanced(!showAdvanced)}
                                            className="w-full h-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 font-semibold py-4 px-4 rounded-xl hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/40 dark:hover:to-blue-800/40 transition-all duration-300 border border-purple-200 dark:border-purple-800"
                                        >
                                            <Filter className="h-5 w-5" />
                                            Filtres
                                        </button>
                                    </div>

                                    {/* Search Button */}
                                    <div className="lg:col-span-3 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={resetFilters}
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
                                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                                        >
                                            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                            Rechercher
                                        </button>
                                    </div>
                                </div>

                                {/* Advanced Filters */}
                                {showAdvanced && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filtres Avancés</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                                onClick={() => setValues(prev => ({ ...prev, home_visit: !prev.home_visit }))}>
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                        checked={values.home_visit}
                                                        readOnly
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Prélèvement à domicile</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Service disponible</span>
                                                </div>
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
                                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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
                                            <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                Recherche: {values.q}
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, q: '' }))} className="hover:text-purple-900 dark:hover:text-purple-200">
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
                                        {values.home_visit && (
                                            <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                                À Domicile
                                                <button type="button" onClick={() => setValues(prev => ({ ...prev, home_visit: false }))} className="hover:text-emerald-900 dark:hover:text-emerald-200">
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

                        {/* View Tabs */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Laboratoires Disponibles
                                    <span className="text-purple-600 dark:text-purple-400 ml-2">({laboratories.total || 0})</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Trouvez le laboratoire adapté à vos besoins</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
                                <button
                                    onClick={() => setActiveTab('map')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeTab === 'map'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    Carte
                                </button>
                            </div>
                        </div>

                        {/* --- RESULTS --- */}
                        {laboratories.data.length === 0 ? (
                            <div className="text-center py-16 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/10 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center mb-6">
                                    <FlaskConical className="h-10 w-10 text-purple-600 dark:text-purple-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun laboratoire trouvé</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                    Aucun résultat ne correspond à vos critères de recherche.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={resetFilters}
                                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                                    >
                                        Voir tous les laboratoires
                                    </button>
                                    <Link
                                        href={route('home')}
                                        className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-purple-50 dark:hover:bg-gray-700"
                                    >
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Results Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    {laboratories.data.map((lab: any) => (
                                        <Link
                                            key={lab.id}
                                            href={route('lab.show', lab.id)}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
                                        >
                                            {/* Image/Logo Section */}
                                            <div className="relative h-48 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center overflow-hidden">
                                                {lab.logo_path ? (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={`/storage/${lab.logo_path}`}
                                                            alt={lab.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg">
                                                            <FlaskConical className="w-16 h-16 text-purple-400 dark:text-purple-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                    <span className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg border border-purple-100 dark:border-purple-800">
                                                        <Shield className="w-3 h-3" /> Vérifié
                                                    </span>
                                                    {lab.offers_home_visit && (
                                                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                            <Car className="w-3 h-3" /> À Domicile
                                                        </span>
                                                    )}
                                                    {lab.emergency_service && (
                                                        <span className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                                            <Zap className="w-3 h-3" /> Urgence
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quick Info */}
                                                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>4.8</span>
                                                        <span className="text-gray-500 dark:text-gray-400">/5</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                                        {lab.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {lab.address}, {lab.city}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Services & Hours */}
                                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <Clock4 className="w-4 h-4 text-emerald-500" />
                                                            <div>
                                                                <div className="text-xs font-medium text-gray-900 dark:text-white">Ouvert</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">8h-20h</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <TestTube className="w-4 h-4 text-purple-500" />
                                                            <div>
                                                                <div className="text-xs font-medium text-gray-900 dark:text-white">Analyses</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">Sang, Urine, PCR</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <Users className="w-4 h-4" />
                                                            <span>Certifié ANS</span>
                                                        </div>
                                                        <span className="text-purple-600 dark:text-purple-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50">
                                                            Voir détails
                                                            <ChevronRight className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Stats Banner */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-6 mb-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {[
                                            { value: '98%', label: 'Satisfaction Clients', icon: Award },
                                            { value: '24h', label: 'Résultats Rapides', icon: Clock },
                                            { value: '500+', label: 'Analyses Différentes', icon: Thermometer },
                                            { value: '95%', label: 'Précision des Tests', icon: TrendingUp }
                                        ].map((stat, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="flex justify-center mb-2">
                                                    <div className="p-2 bg-white/20 rounded-lg">
                                                        <stat.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                                <div className="text-purple-100 font-medium text-sm">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                {laboratories.links && laboratories.links.length > 3 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Affichage {laboratories.from} à {laboratories.to} sur {laboratories.total} résultats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {laboratories.links.map((link: any, i: number) => (
                                                <Link
                                                    key={i}
                                                    href={link.url || '#'}
                                                    className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
                                                        link.active
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
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

                        {/* Popular Tests */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Analyses Populaires</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[
                                    { name: 'Hémogramme', icon: TestTube, color: 'from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20' },
                                    { name: 'Glycémie', icon: Syringe, color: 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20' },
                                    { name: 'Cholestérol', icon: Pill, color: 'from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20' },
                                    { name: 'COVID-19', icon: Thermometer, color: 'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20' },
                                    { name: 'Test VIH', icon: FlaskConical, color: 'from-purple-100 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20' },
                                    { name: 'Urine', icon: TestTube, color: 'from-yellow-100 to-lime-100 dark:from-yellow-900/20 dark:to-lime-900/20' }
                                ].map((test, idx) => (
                                    <div key={idx} className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md transition-all duration-300">
                                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${test.color} mb-3 group-hover:scale-110 transition-transform`}>
                                            <test.icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {test.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
