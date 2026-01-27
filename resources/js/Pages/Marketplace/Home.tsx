import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import useTrans from '@/Hooks/useTrans';
import { useState } from 'react';
import {
    MapPin, Stethoscope, Search, Star, Filter, Clock,
    Award, CheckCircle, ChevronRight, X, Heart,
    Zap, Shield, Users, Calendar, Eye
} from 'lucide-react';

export default function Home({ doctors, specialties, filters }: any) {
    const { t } = useTrans();
    const { locale } = usePage().props as any;
    const isRtl = locale === 'ar';

    const [values, setValues] = useState({
        city: filters.city || '',
        specialty: filters.specialty || ''
    });

    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        experience: '',
        rating: '',
        availability: '',
        languages: ''
    });

    const [favoriteDoctors, setFavoriteDoctors] = useState<number[]>([]);

    const handleSearch = (e: any) => {
        e.preventDefault();
        const allFilters = { ...values, ...selectedFilters };
        router.get(route('search'), allFilters, { preserveState: true });
    };

    const clearFilters = () => {
        setValues({ city: '', specialty: '' });
        setSelectedFilters({ experience: '', rating: '', availability: '', languages: '' });
        router.get(route('search'), {}, { preserveState: true });
    };

    const toggleFavorite = (doctorId: number) => {
        setFavoriteDoctors(prev =>
            prev.includes(doctorId)
                ? prev.filter(id => id !== doctorId)
                : [...prev, doctorId]
        );
    };

    const hasActiveFilters = values.city || values.specialty ||
        selectedFilters.experience || selectedFilters.rating ||
        selectedFilters.availability || selectedFilters.languages;

    return (
        <AppLayout>
            <Head title={t('Find Your Doctor - DzDoctor')} />

            <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Hero Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full animate-pulse"></span>
                            {t('Trusted by 50,000+ Patients')}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Find Your Perfect{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                Healthcare Partner
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Connect with certified specialists and book appointments in minutes
                        </p>
                    </div>

                    {/* Search & Filter Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 mb-10 transition-all duration-300">
                        <form onSubmit={handleSearch} className="space-y-6">
                            {/* Main Search */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-4 relative group">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder={t('City, State or Zip Code')}
                                        className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white`}
                                        value={values.city}
                                        onChange={e => setValues({...values, city: e.target.value})}
                                    />
                                </div>

                                <div className="lg:col-span-4 relative group">
                                    <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                                    <select
                                        className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 appearance-none cursor-pointer dark:text-white`}
                                        value={values.specialty}
                                        onChange={e => setValues({...values, specialty: e.target.value})}
                                    >
                                        <option value="" className="dark:bg-gray-800 dark:text-white">{t('All Medical Specialties')}</option>
                                        {specialties.map((s: any) => (
                                            <option key={s.id} value={s.id} className="dark:bg-gray-800 dark:text-white">{s.name}</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 -rotate-90" />
                                </div>

                                <div className="lg:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="w-full h-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 font-semibold py-4 px-4 rounded-xl hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 transition-all duration-300 border border-blue-200 dark:border-blue-800"
                                    >
                                        <Filter className="h-5 w-5" />
                                        {t('Filters')}
                                    </button>
                                </div>

                                <div className="lg:col-span-2">
                                    <button
                                        type="submit"
                                        className="w-full h-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                                    >
                                        <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        {t('Search')}
                                    </button>
                                </div>
                            </div>

                            {/* Advanced Filters */}
                            {showFilters && (
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 flex items-center gap-1"
                                        >
                                            <X className="h-4 w-4" />
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                value={selectedFilters.experience}
                                                onChange={e => setSelectedFilters({...selectedFilters, experience: e.target.value})}
                                            >
                                                <option value="" className="dark:bg-gray-800">Any Experience</option>
                                                <option value="5" className="dark:bg-gray-800">5+ years</option>
                                                <option value="10" className="dark:bg-gray-800">10+ years</option>
                                                <option value="15" className="dark:bg-gray-800">15+ years</option>
                                                <option value="20" className="dark:bg-gray-800">20+ years</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                value={selectedFilters.rating}
                                                onChange={e => setSelectedFilters({...selectedFilters, rating: e.target.value})}
                                            >
                                                <option value="" className="dark:bg-gray-800">Any Rating</option>
                                                <option value="4.5" className="dark:bg-gray-800">4.5+ stars</option>
                                                <option value="4.0" className="dark:bg-gray-800">4.0+ stars</option>
                                                <option value="3.5" className="dark:bg-gray-800">3.5+ stars</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Availability</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                value={selectedFilters.availability}
                                                onChange={e => setSelectedFilters({...selectedFilters, availability: e.target.value})}
                                            >
                                                <option value="" className="dark:bg-gray-800">Any Time</option>
                                                <option value="today" className="dark:bg-gray-800">Today</option>
                                                <option value="tomorrow" className="dark:bg-gray-800">Tomorrow</option>
                                                <option value="week" className="dark:bg-gray-800">This Week</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 dark:text-white"
                                                value={selectedFilters.languages}
                                                onChange={e => setSelectedFilters({...selectedFilters, languages: e.target.value})}
                                            >
                                                <option value="" className="dark:bg-gray-800">All Languages</option>
                                                <option value="en" className="dark:bg-gray-800">English</option>
                                                <option value="fr" className="dark:bg-gray-800">French</option>
                                                <option value="ar" className="dark:bg-gray-800">Arabic</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {values.city && (
                                        <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                            City: {values.city}
                                            <button type="button" onClick={() => setValues({...values, city: ''})} className="hover:text-blue-900 dark:hover:text-blue-200">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {values.specialty && (
                                        <span className="inline-flex items-center gap-1 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                            {specialties.find((s: any) => s.id == values.specialty)?.name}
                                            <button type="button" onClick={() => setValues({...values, specialty: ''})} className="hover:text-teal-900 dark:hover:text-teal-200">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedFilters.experience && (
                                        <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                            {selectedFilters.experience}+ years
                                            <button type="button" onClick={() => setSelectedFilters({...selectedFilters, experience: ''})} className="hover:text-purple-900 dark:hover:text-purple-200">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedFilters.rating && (
                                        <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full text-sm font-medium">
                                            {selectedFilters.rating}+ stars
                                            <button type="button" onClick={() => setSelectedFilters({...selectedFilters, rating: ''})} className="hover:text-amber-900 dark:hover:text-amber-200">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: Users, value: '500+', label: 'Verified Doctors', color: 'from-blue-500 to-cyan-500' },
                            { icon: Shield, value: '24/7', label: 'Secure Booking', color: 'from-emerald-500 to-teal-500' },
                            { icon: Zap, value: '15min', label: 'Quick Response', color: 'from-amber-500 to-orange-500' },
                            { icon: Award, value: '98%', label: 'Satisfaction Rate', color: 'from-violet-500 to-purple-500' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Available Doctors
                                <span className="text-blue-600 dark:text-blue-400 ml-2">({doctors.total || 0})</span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Top-rated specialists available for consultation</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
                                <Award className="h-4 w-4 text-yellow-500" />
                                <span>All doctors are verified and certified</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {doctors.data.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No doctors found</h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                Try adjusting your search criteria or browse all available specialists
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                                >
                                    Show All Doctors
                                </button>
                                <Link
                                    href={route('specialties.index')}
                                    className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700"
                                >
                                    Browse Specialties
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {doctors.data.map((doctor: any) => {
                                    const imageUrl = doctor.photo_url ||
                                                     doctor.profile_photo_url ||
                                                     `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.first_name + ' ' + doctor.last_name)}&background=EFF6FF&color=2563EB&size=128`;

                                    const isFavorite = favoriteDoctors.includes(doctor.id);

                                    return (
                                        <div key={doctor.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                                            {/* Favorite Button */}
                                            <button
                                                onClick={() => toggleFavorite(doctor.id)}
                                                className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
                                            >
                                                <Heart
                                                    className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                />
                                            </button>

                                            <div className="p-6 flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="h-16 w-16 rounded-full border-2 border-blue-50 dark:border-blue-900/30 overflow-hidden shadow-inner">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={doctor.last_name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${doctor.first_name}&background=eee&color=999&size=128`;
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                                                <CheckCircle className="h-3 w-3 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                Dr. {doctor.first_name} {doctor.last_name}
                                                            </h3>
                                                            <p className="text-sm bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent font-semibold">
                                                                {doctor.specialties.map((s:any) => s.name).join(', ')}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {doctor.city || doctor.clinics?.[0]?.city || 'Algiers'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rating & Experience */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 px-3 py-1.5 rounded-lg">
                                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{doctor.rating || '5.0'}</span>
                                                        <span className="text-yellow-600 dark:text-yellow-400 text-sm">({doctor.reviews_count || 120})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{doctor.experience || 5}+ years</span>
                                                    </div>
                                                </div>

                                                {/* Clinics */}
                                                <div className="space-y-3">
                                                    {doctor.clinics?.slice(0, 2).map((c:any, idx: number) => (
                                                        <div key={c.id} className={`flex items-start gap-3 p-3 rounded-xl ${idx === 0
                                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20'
                                                            : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                                            <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white">{c.name}</h4>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{c.address}, {c.city}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {doctor.clinics?.length > 2 && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium text-center">
                                                            +{doctor.clinics.length - 2} more locations
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Languages & Availability */}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                            English
                                                        </span>
                                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                            French
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Available Today</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Link
                                                        href={route('doctor.show', doctor.id)}
                                                        className="block text-center bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg group"
                                                    >
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span>Book Now</span>
                                                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </Link>
                                                    <Link
                                                        href={route('doctor.show', doctor.id)}
                                                        className="block text-center bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-semibold py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
                                                    >
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            <span>View Profile</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Stats Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 mb-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { value: '98%', label: 'Patient Satisfaction', icon: Award },
                                        { value: '24/7', label: 'Available Support', icon: Shield },
                                        { value: '15min', label: 'Avg. Response Time', icon: Zap },
                                        { value: '500+', label: 'Active Doctors', icon: Users }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className="flex justify-center mb-2">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <stat.icon className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                            <div className="text-blue-100 font-medium text-sm">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination */}
                            {doctors.links && doctors.links.length > 3 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {doctors.from} to {doctors.to} of {doctors.total} results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {doctors.links.map((link: any, i: number) => (
                                            <Link
                                                key={i}
                                                href={link.url || '#'}
                                                className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
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

                    {/* Featured Specialties */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Popular Specialties</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {specialties.slice(0, 6).map((specialty: any) => (
                                <Link
                                    key={specialty.id}
                                    href={route('search', { specialty: specialty.id })}
                                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="mb-2">
                                        <div className="inline-flex p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-blue-700/30 transition-all">
                                            <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {specialty.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {specialty.doctors_count || 0} doctors
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
