import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import useTrans from '@/Hooks/useTrans';
import {
    Search, Stethoscope, Calendar, Star, MapPin, Users, Award, Clock,
    FlaskConical, CheckCircle, Car, ArrowRight, ShieldCheck, Activity,
    Scan, ChevronRight, Sparkles, Zap, Heart, TrendingUp, Globe,
    Phone, Mail, Facebook, Twitter, Instagram, Linkedin, PlayCircle
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

// --- INTERFACES ---
interface Doctor {
    id: number;
    name: string;
    specialty: string;
    city: string;
    image: string;
    rating?: number;
    experience?: number;
    reviews_count?: number;
}

interface Laboratory {
    id: number;
    name: string;
    specialty: string;
    city: string;
    image: string;
    rating?: number;
    reviews_count?: number;
    address?: string;
    logo?: string;
}

interface ImagingCenter {
    id: number;
    name: string;
    specialty: string;
    slug: string;
    city: string;
    image: string;
    rating?: number;
}

interface WelcomeProps extends PageProps {
    featuredDoctors: Doctor[];
    featuredLaboratories: Laboratory[];
    featuredImagingCenters: ImagingCenter[];
    stats: { label: string; value: string | number; icon: string }[]; // Fixed: value can be string or number
}

export default function Welcome({ auth, featuredDoctors, featuredLaboratories, featuredImagingCenters, stats }: WelcomeProps) {
    const { t } = useTrans();
    const { locale } = usePage().props as any;
    const isRtl = locale === 'ar';

    // --- SEARCH STATE ---
    const [searchType, setSearchType] = useState<'doctor' | 'laboratory' | 'imaging'>('doctor');
    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // --- HANDLE SEARCH ROUTING ---
    const handleSearch = () => {
        if (searchType === 'laboratory') {
            router.get(route('laboratories.search'), {
                q: query,
                city: city
            });
        } else if (searchType === 'imaging') {
            router.get(route('imaging.search'), {
                q: query,
                city: city
            });
        } else {
            router.get(route('search'), {
                q: query,
                city: city
            });
        }
    };

    // --- ICONS MAPPING ---
    const statIcons: Record<string, React.ReactNode> = {
        users: <Users className="w-6 h-6" />,
        award: <Award className="w-6 h-6" />,
        clock: <Clock className="w-6 h-6" />,
        star: <Star className="w-6 h-6" />,
        flask: <FlaskConical className="w-6 h-6" />,
        stethoscope: <Stethoscope className="w-6 h-6" />,
        scan: <Scan className="w-6 h-6" />,
        pill: <Activity className="w-6 h-6" />,
        smile: <Users className="w-6 h-6" />,
    };

    const getThemeColor = () => {
        if (searchType === 'laboratory') return 'purple';
        if (searchType === 'imaging') return 'indigo';
        return 'blue';
    };

    // Helper function to check if value is a string that includes '+'
    const hasPlusSign = (value: string | number) => {
        return typeof value === 'string' && value.includes('+');
    };

    return (
        <>
            <Head title="DzDoctor - Votre Santé, Notre Priorité" />

            <div className={`min-h-screen bg-white text-gray-800 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>

                {/* --- ENHANCED NAVBAR --- */}
                <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-100/50 fixed w-full z-50 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-20 items-center">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="relative">
                                    <ApplicationLogo className="block h-10 w-auto text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-2xl bg-gradient-to-r from-blue-900 to-teal-700 bg-clip-text text-transparent">
                                        DzDoctor
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">Health & Wellness</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="relative group">
                                        <div className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-6 py-2.5 rounded-xl hover:bg-gradient-to-r from-blue-50 to-teal-50 border border-transparent group-hover:border-blue-100">
                                            {t('Dashboard')}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-300"></div>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50">
                                            {t('Login')}
                                        </Link>
                                        <Link href={route('register')} className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                                            <div className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                                                {t('Register')}
                                            </div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* --- ENHANCED HERO SECTION --- */}
                <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-200 to-blue-200 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-20"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-blue-100/50 backdrop-blur-sm animate-pulse">
                                <Sparkles className="w-4 h-4" />
                                {t('Plateforme Médicale N°1 en Algérie')}
                                <Zap className="w-4 h-4 text-yellow-500" />
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                                <span className="block mb-2">Votre Santé,</span>
                                <span className="relative">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 animate-gradient-x">
                                        à portée de main.
                                    </span>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Trouvez un médecin, réservez une analyse ou un examen d'imagerie en quelques clics.
                                <span className="block text-lg text-gray-500 mt-2">Service rapide, sécurisé et 100% numérique</span>
                            </p>

                            {/* --- ENHANCED MULTI-SEARCH BAR --- */}
                            <div className="max-w-5xl mx-auto">
                                {/* Enhanced Tabs */}
                                <div className="flex flex-wrap justify-center gap-3 mb-6">
                                    {[
                                        { type: 'doctor' as const, label: 'Médecins', icon: Stethoscope, color: 'blue' },
                                        { type: 'laboratory' as const, label: 'Laboratoires', icon: FlaskConical, color: 'purple' },
                                        { type: 'imaging' as const, label: 'Imagerie', icon: Scan, color: 'indigo' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.type}
                                            onClick={() => setSearchType(tab.type)}
                                            className={`relative group px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-3 ${
                                                searchType === tab.type
                                                ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700 text-white shadow-lg transform scale-105`
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                                            }`}
                                        >
                                            {searchType === tab.type && (
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-sm"></div>
                                            )}
                                            <tab.icon className="w-5 h-5" />
                                            {tab.label}
                                            {searchType === tab.type && (
                                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Enhanced Search Inputs */}
                                <div className={`relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-gray-100/50 flex flex-col lg:flex-row gap-4 transition-all duration-500 hover:shadow-3xl ${
                                    searchType === 'laboratory' ? 'shadow-purple-200/50' :
                                    searchType === 'imaging' ? 'shadow-indigo-200/50' :
                                    'shadow-blue-200/50'
                                }`}>
                                    {/* Decorative Corner */}
                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-white" />
                                    </div>

                                    {/* Keyword Input */}
                                    <div className="flex-1 relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center px-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-300">
                                            {searchType === 'doctor' && <Stethoscope className="w-5 h-5 text-blue-500" />}
                                            {searchType === 'laboratory' && <FlaskConical className="w-5 h-5 text-purple-500" />}
                                            {searchType === 'imaging' && <Scan className="w-5 h-5 text-indigo-500" />}
                                            <input
                                                type="text"
                                                placeholder={
                                                    searchType === 'doctor' ? "Médecin, spécialité, maladie..." :
                                                    searchType === 'laboratory' ? "Nom du laboratoire, type d'analyse..." :
                                                    "Centre, IRM, Scanner, Radiologie..."
                                                }
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 h-16 text-lg pl-4 pr-4"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div>

                                    {/* City Input */}
                                    <div className="flex-1 relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-50 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center px-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-300">
                                            <MapPin className={`w-5 h-5 text-${getThemeColor()}-500`} />
                                            <input
                                                type="text"
                                                placeholder="Wilaya ou Commune (ex: Oran, Alger, Constantine)"
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 h-16 text-lg pl-4 pr-4"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div>

                                    {/* Enhanced Search Button */}
                                    <button
                                        onClick={handleSearch}
                                        className={`relative group h-16 px-10 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                                            searchType === 'laboratory' ? 'bg-gradient-to-r from-purple-600 to-purple-700' :
                                            searchType === 'imaging' ? 'bg-gradient-to-r from-indigo-600 to-indigo-700' :
                                            'bg-gradient-to-r from-blue-600 to-teal-600'
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                        <Search className="w-5 h-5 relative z-10" />
                                        <span className="relative z-10">Rechercher</span>
                                        <ChevronRight className="w-5 h-5 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    </button>
                                </div>

                                {/* Quick Suggestions */}
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <span className="text-sm text-gray-500">Suggestions :</span>
                                    {searchType === 'doctor' && (
                                        <>
                                            <button onClick={() => setQuery('Cardiologue')} className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full transition-colors">Cardiologue</button>
                                            <button onClick={() => setQuery('Dentiste')} className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full transition-colors">Dentiste</button>
                                            <button onClick={() => setQuery('Pédiatre')} className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full transition-colors">Pédiatre</button>
                                        </>
                                    )}
                                    {searchType === 'laboratory' && (
                                        <>
                                            <button onClick={() => setQuery('Analyses sanguines')} className="text-sm text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-1.5 rounded-full transition-colors">Analyses sanguines</button>
                                            <button onClick={() => setQuery('Biologie')} className="text-sm text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-1.5 rounded-full transition-colors">Biologie</button>
                                        </>
                                    )}
                                    {searchType === 'imaging' && (
                                        <>
                                            <button onClick={() => setQuery('IRM')} className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-full transition-colors">IRM</button>
                                            <button onClick={() => setQuery('Scanner')} className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-full transition-colors">Scanner</button>
                                            <button onClick={() => setQuery('Radiologie')} className="text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-full transition-colors">Radiologie</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- ENHANCED STATS SECTION --- */}
                <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-gray-100 opacity-30"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Une plateforme de confiance</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Rejoignez des milliers d'utilisateurs qui nous font confiance pour leurs soins de santé</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    {/* Background Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Icon Container */}
                                    <div className="relative inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        {statIcons[stat.icon] || <Star className="w-8 h-8" />}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative">
                                        <div className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            {stat.value}
                                            {/* FIXED: Check if value is string with '+' sign */}
                                            {typeof stat.value === 'string' && stat.value.includes('+') && (
                                                <TrendingUp className="w-5 h-5 text-green-500 inline-block ml-2" />
                                            )}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>

                                    {/* Hover Border */}
                                    <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- ENHANCED FEATURED DOCTORS SECTION --- */}
                <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
                            <div className="mb-8 lg:mb-0">
                                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Recommandés
                                </div>
                                <h2 className="text-5xl font-bold text-gray-900 mb-3">Top Médecins</h2>
                                <p className="text-gray-600 text-lg">Professionnels de santé vérifiés et recommandés par nos patients</p>
                            </div>
                            <Link href={route('search')} className="group relative inline-flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold px-6 py-3 rounded-full border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                                <span>Voir tous les médecins</span>
                                <div className="relative">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute -inset-2 bg-blue-100 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </div>
                            </Link>
                        </div>

                        {featuredDoctors.length === 0 ? (
                            <div className="text-center py-24 bg-gradient-to-br from-white to-blue-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Stethoscope className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun médecin disponible</h3>
                                <p className="text-gray-500 max-w-md mx-auto">Les médecins seront bientôt disponibles. Revenez plus tard !</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {featuredDoctors.map((doctor) => (
                                    <Link
                                        href={route('doctor.show', doctor.id)}
                                        key={doctor.id}
                                        className="group relative"
                                        onMouseEnter={() => setHoveredCard(doctor.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* Card Shadow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-3xl blur-xl transition-all duration-500 ${
                                            hoveredCard === doctor.id ? 'opacity-30 scale-105' : 'opacity-0 scale-95'
                                        }`}></div>

                                        {/* Main Card */}
                                        <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col">
                                            {/* Image Container */}
                                            <div className="relative h-64 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                                                <img
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />

                                                {/* Badge */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <div className="bg-white/95 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {doctor.specialty}
                                                    </div>
                                                </div>

                                                {/* Rating */}
                                                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-gray-900">{doctor.rating || 4.8}</span>
                                                    <span className="text-xs text-gray-500">({doctor.reviews_count || 120})</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                                                    {doctor.name}
                                                </h3>

                                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {doctor.city}
                                                    {doctor.experience && (
                                                        <span className="ml-4 flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {doctor.experience}+ ans
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <Heart className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm text-gray-500">Disponible aujourd'hui</span>
                                                    </div>
                                                    <div className="text-blue-600 font-bold text-sm flex items-center gap-2 group/btn">
                                                        Prendre RDV
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Indicator */}
                                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* --- ENHANCED LABORATORIES SECTION --- */}
                <section className="py-24 bg-gradient-to-b from-white to-purple-50/30 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
                            <div className="mb-8 lg:mb-0">
                                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm mb-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Certifiés
                                </div>
                                <h2 className="text-5xl font-bold text-gray-900 mb-3">Laboratoires Partenaires</h2>
                                <p className="text-gray-600 text-lg">Centres de diagnostic certifiés avec résultats rapides et fiables</p>
                            </div>
                            <Link href={route('laboratories.search')} className="group relative inline-flex items-center gap-3 text-purple-600 hover:text-purple-700 font-semibold px-6 py-3 rounded-full border border-purple-100 bg-white hover:bg-purple-50 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                                <span>Voir tous les laboratoires</span>
                                <div className="relative">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute -inset-2 bg-purple-100 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                                </div>
                            </Link>
                        </div>

                        {(!featuredLaboratories || featuredLaboratories.length === 0) ? (
                            <div className="text-center py-24 bg-gradient-to-br from-white to-purple-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                <FlaskConical className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun laboratoire disponible</h3>
                                <p className="text-gray-500 max-w-md mx-auto">Les laboratoires seront bientôt disponibles.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {featuredLaboratories.map((lab) => (
                                    <Link
                                        href={route('lab.show', lab.id)}
                                        key={lab.id}
                                        className="group relative"
                                        onMouseEnter={() => setHoveredCard(lab.id + 1000)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* Card Shadow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl transition-all duration-500 ${
                                            hoveredCard === lab.id + 1000 ? 'opacity-30 scale-105' : 'opacity-0 scale-95'
                                        }`}></div>

                                        {/* Main Card */}
                                        <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col">
                                            {/* Logo/Image Container */}
                                            <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
                                                {lab.image && !lab.image.includes('ui-avatars') ? (
                                                    <img
                                                        src={lab.image}
                                                        alt={lab.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="relative">
                                                        <FlaskConical className="w-24 h-24 text-purple-200 group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-xl"></div>
                                                    </div>
                                                )}

                                                {/* Verification Badge */}
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Certifié
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                                                    {lab.name}
                                                </h3>

                                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {lab.city}
                                                    {lab.address && (
                                                        <span className="ml-2 text-xs opacity-75 line-clamp-1">{lab.address}</span>
                                                    )}
                                                </div>

                                                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                            <span className="font-bold text-gray-900">{lab.rating || 5.0}</span>
                                                            <span className="text-xs text-gray-500">({lab.reviews_count || 45})</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-purple-600 font-bold text-sm flex items-center gap-2 group/btn">
                                                        Réserver une analyse
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Indicator */}
                                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* --- ENHANCED IMAGING CENTERS SECTION --- */}
         {/* --- ENHANCED IMAGING CENTERS SECTION --- */}
                <section className="py-24 bg-gradient-to-b from-white to-indigo-50/30 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16">
                            <div className="mb-8 lg:mb-0">
                                <div className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    Équipements Modernes
                                </div>
                                <h2 className="text-5xl font-bold text-gray-900 mb-3">Centres d'Imagerie</h2>
                                <p className="text-gray-600 text-lg">Technologie de pointe pour des diagnostics précis et rapides</p>
                            </div>
                            <Link href={route('imaging.search')} className="group relative inline-flex items-center gap-3 text-indigo-600 hover:text-indigo-700 font-semibold px-6 py-3 rounded-full border border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                                <span>Voir tous les centres</span>
                                <div className="relative">
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </Link>
                        </div>

                        {(!featuredImagingCenters || featuredImagingCenters.length === 0) ? (
                            <div className="text-center py-24 bg-gradient-to-br from-white to-indigo-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Scan className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun centre disponible</h3>
                                <p className="text-gray-500 max-w-md mx-auto">Les centres d'imagerie seront bientôt disponibles.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {featuredImagingCenters.map((center) => (
                                    <Link
                                        // ✅ ROUTE FIXED HERE
                                        href={route('imaging.show', center.slug)}
                                        key={center.id}
                                        className="group relative"
                                    >
                                        {/* Card Shadow Effect (Converted to CSS group-hover) */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur-xl transition-all duration-500 opacity-0 scale-95 group-hover:opacity-30 group-hover:scale-105"></div>

                                        {/* Main Card */}
                                        <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 flex flex-col h-full">

                                            {/* Image Container */}
                                            <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-8 overflow-hidden">
                                                {center.image && !center.image.includes('ui-avatars') ? (
                                                    <img
                                                        src={center.image}
                                                        alt={center.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="relative">
                                                        <Scan className="w-24 h-24 text-indigo-200 group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 blur-xl"></div>
                                                    </div>
                                                )}

                                                {/* Specialty Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <div className="bg-white/95 backdrop-blur-sm text-indigo-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                                                        {center.specialty}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                                                    {center.name}
                                                </h3>

                                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {center.city}
                                                </div>

                                                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                            <span className="font-bold text-gray-900">{center.rating || 4.9}</span>
                                                            <span className="text-xs text-gray-500">(excellents)</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-indigo-600 font-bold text-sm flex items-center gap-2 group/btn">
                                                        Prendre RDV
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Hover Indicator */}
                                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:w-full transition-all duration-500"></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-6 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/20">
                            <Sparkles className="w-4 h-4" />
                            Rejoignez-nous aujourd'hui
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                            Commencez votre parcours de santé
                        </h2>
                        <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
                            Inscrivez-vous gratuitement et bénéficiez d'un accès immédiat à tous nos services de santé numérique.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href={route('register')}
                                className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative flex items-center justify-center gap-3">
                                    Créer un compte gratuit
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link
                                href="#"
                                className="group px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 hover:shadow-lg transition-all duration-300"
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <PlayCircle className="w-5 h-5" />
                                    Voir la démo
                                </span>
                            </Link>
                        </div>
                        <p className="text-white/60 text-sm mt-8">Aucune carte de crédit requise • 100% sécurisé • Support 24/7</p>
                    </div>
                </section>

                {/* --- ENHANCED FOOTER --- */}
                <footer className="bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="py-16">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                                {/* Brand Column */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 group">
                                        <div className="relative">
                                            <ApplicationLogo className="block h-12 w-auto text-white group-hover:scale-110 transition-transform duration-300" />
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-3xl block">DzDoctor</span>
                                            <span className="text-gray-400 text-sm font-medium">Health & Wellness Platform</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        La plateforme médicale N°1 en Algérie. Votre santé, notre priorité depuis 2023.
                                    </p>
                                    <div className="flex gap-4">
                                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group">
                                            <Facebook className="w-5 h-5 group-hover:text-blue-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group">
                                            <Twitter className="w-5 h-5 group-hover:text-sky-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group">
                                            <Instagram className="w-5 h-5 group-hover:text-pink-400" />
                                        </a>
                                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group">
                                            <Linkedin className="w-5 h-5 group-hover:text-blue-300" />
                                        </a>
                                    </div>
                                </div>

                                {/* Quick Links */}
                                <div>
                                    <h3 className="font-bold text-lg mb-6 text-white">Navigation</h3>
                                    <ul className="space-y-4">
                                        <li><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Accueil</Link></li>
                                        <li><Link href={route('search')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Médecins</Link></li>
                                        <li><Link href={route('laboratories.search')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Laboratoires</Link></li>
                                        <li><Link href={route('imaging.search')} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Imagerie</Link></li>
                                    </ul>
                                </div>

                                {/* Services */}
                                <div>
                                    <h3 className="font-bold text-lg mb-6 text-white">Services</h3>
                                    <ul className="space-y-4">
                                        <li><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Prise de RDV en ligne</Link></li>
                                        <li><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Téléconsultation</Link></li>
                                        <li><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Résultats en ligne</Link></li>
                                        <li><Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" /> Rappels médicaux</Link></li>
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div>
                                    <h3 className="font-bold text-lg mb-6 text-white">Contactez-nous</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 text-gray-400">
                                            <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                                            <span className="hover:text-white transition-colors cursor-pointer">+213 123 456 789</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-gray-400">
                                            <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                                            <span className="hover:text-white transition-colors cursor-pointer">contact@dzdoctor.dz</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-gray-400">
                                            <Globe className="w-5 h-5 mt-1 flex-shrink-0" />
                                            <span>Alger, Algérie</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="py-8 border-t border-gray-800">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-gray-400 text-sm">
                                    &copy; {new Date().getFullYear()} DzDoctor. Tous droits réservés.
                                </div>
                                <div className="flex gap-8 text-sm text-gray-400">
                                    <Link href="#" className="hover:text-white transition-colors">À propos</Link>
                                    <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                                    <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
                                    <Link href="#" className="hover:text-white transition-colors">CGU</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
