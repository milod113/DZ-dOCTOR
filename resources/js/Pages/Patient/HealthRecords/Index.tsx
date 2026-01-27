import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FlaskConical, Calendar, FileText, CheckCircle,
    Clock, AlertCircle, MapPin, Download, User as UserIcon,
    Activity, Filter, Search, ChevronRight, FileSearch,
    TrendingUp, Shield, Zap, Bell, Plus, Eye,
    Thermometer, Heart, Brain, Droplets, Pill,
    ArrowRight, ChevronDown, ChevronUp, X, Copy,
    Share2, Printer, BookOpen, Star, Award,
    BarChart3, History, RefreshCw, ExternalLink
} from 'lucide-react';
import { useState } from 'react';

export default function HealthRecordsIndex({ analyses }: any) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedAnalysis, setExpandedAnalysis] = useState<number | null>(null);

    // Helper to format the JSON test list
    const formatTests = (tests: any) => {
        if (Array.isArray(tests)) {
            // If it's an array of strings ["NFS", "Glucose"]
            if (typeof tests[0] === 'string') return tests.join(', ');
            // If it's an array of objects [{name: "NFS"}, ...]
            return tests.map(t => t.name || t.test_name || JSON.stringify(t)).join(', ');
        }
        return 'Analyses diverses';
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'completed':
                return {
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-100 dark:border-emerald-800',
                    gradient: 'from-emerald-500 to-green-400',
                    label: 'Résultats Disponibles',
                    icon: CheckCircle
                };
            case 'processing':
            case 'received':
                return {
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-100 dark:border-blue-800',
                    gradient: 'from-blue-500 to-cyan-400',
                    label: 'En cours d\'analyse',
                    icon: Activity
                };
            case 'pending':
                return {
                    color: 'text-amber-600 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-100 dark:border-amber-800',
                    gradient: 'from-amber-500 to-orange-400',
                    label: 'En attente',
                    icon: Clock
                };
            case 'cancelled':
                return {
                    color: 'text-rose-600 dark:text-rose-400',
                    bg: 'bg-rose-50 dark:bg-rose-900/20',
                    border: 'border-rose-100 dark:border-rose-800',
                    gradient: 'from-rose-500 to-red-400',
                    label: 'Annulé',
                    icon: AlertCircle
                };
            default: return {
                color: 'text-gray-600 dark:text-gray-400',
                bg: 'bg-gray-50 dark:bg-gray-900/20',
                border: 'border-gray-100 dark:border-gray-800',
                gradient: 'from-gray-500 to-gray-400',
                label: status,
                icon: FlaskConical
            };
        }
    };

    const getTestIcon = (test: string) => {
        if (test.toLowerCase().includes('sang') || test.toLowerCase().includes('nfs')) return <Heart className="w-4 h-4" />;
        if (test.toLowerCase().includes('glucose') || test.toLowerCase().includes('sucre')) return <Droplets className="w-4 h-4" />;
        if (test.toLowerCase().includes('cholestérol') || test.toLowerCase().includes('lipid')) return <Pill className="w-4 h-4" />;
        if (test.toLowerCase().includes('thyroïde') || test.toLowerCase().includes('hormone')) return <Activity className="w-4 h-4" />;
        if (test.toLowerCase().includes('foie') || test.toLowerCase().includes('hépatique')) return <Thermometer className="w-4 h-4" />;
        if (test.toLowerCase().includes('urine')) return <FileSearch className="w-4 h-4" />;
        return <FlaskConical className="w-4 h-4" />;
    };

    // Filter analyses
    const filteredAnalyses = analyses.data.filter((analysis: any) => {
        const matchesSearch = searchQuery === '' ||
            formatTests(analysis.tests_requested).toLowerCase().includes(searchQuery.toLowerCase()) ||
            (analysis.laboratory?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || analysis.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Stats
    const stats = {
        total: analyses.data.length,
        completed: analyses.data.filter((a: any) => a.status === 'completed').length,
        pending: analyses.data.filter((a: any) => a.status === 'pending').length,
        processing: analyses.data.filter((a: any) => a.status === 'processing' || a.status === 'received').length,
    };

    return (
        <AppLayout>
            <Head title="Mes Analyses" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded-xl shadow-lg">
                                    <FlaskConical className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Mon Historique d'Analyses
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        Retrouvez l'historique complet de vos prélèvements et résultats
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={route('laboratories.search')}
                                className="group relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-700 dark:to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30 transition-all transform hover:-translate-y-0.5"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                <Calendar className="w-5 h-5" />
                                <span>Nouveau RDV</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Analyses</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                                    <FlaskConical className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Terminées</div>
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.completed}</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En attente</div>
                                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2">{stats.pending}</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl">
                                    <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">En cours</div>
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.processing}</div>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par test, laboratoire, date..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-white transition-all duration-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Filter className="w-4 h-4" />
                                    Filtres
                                </button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Statut</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['all', 'completed', 'pending', 'processing', 'cancelled'].map((status) => {
                                                const style = getStatusStyle(status);
                                                const Icon = style.icon;
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => setStatusFilter(status)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                                                            statusFilter === status
                                                                ? `bg-gradient-to-r ${style.gradient} text-white shadow-md`
                                                                : `${style.bg} ${style.color} hover:shadow-sm`
                                                        }`}
                                                    >
                                                        <Icon className="w-4 h-4" />
                                                        {style.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {filteredAnalyses.length === 0 ? (
                        <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/10 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FlaskConical className="w-10 h-10 text-indigo-600 dark:text-indigo-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Aucun dossier trouvé</h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                                {searchQuery || statusFilter !== 'all'
                                    ? "Aucune analyse ne correspond à vos critères de recherche."
                                    : "Vous n'avez pas encore d'historique d'analyses."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href={route('laboratories.search')}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-700 dark:to-purple-600 hover:from-indigo-700 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Prendre RDV
                                </Link>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                            setShowFilters(false);
                                        }}
                                        className="bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
                                    >
                                        <X className="w-5 h-5" />
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Results Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Mes Analyses
                                        <span className="text-indigo-600 dark:text-indigo-400 ml-2">({filteredAnalyses.length})</span>
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Cliquez pour voir les détails et télécharger les résultats
                                    </p>
                                </div>
                            </div>

                            {/* Analyses List */}
                            <div className="grid grid-cols-1 gap-4">
                                {filteredAnalyses.map((analysis: any) => {
                                    const status = getStatusStyle(analysis.status);
                                    const StatusIcon = status.icon;
                                    const isExpanded = expandedAnalysis === analysis.id;

                                    return (
                                        <div
                                            key={analysis.id}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        >
                                            {/* Main Card */}
                                            <div
                                                className="p-6 cursor-pointer"
                                                onClick={() => setExpandedAnalysis(isExpanded ? null : analysis.id)}
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    {/* Left Info */}
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <div className={`p-3 rounded-xl ${status.bg} shadow-sm`}>
                                                            <StatusIcon className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                    {formatTests(analysis.tests_requested)}
                                                                </h3>
                                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border} flex items-center gap-2`}>
                                                                    <StatusIcon className="w-3 h-3" />
                                                                    {status.label}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                                                                        <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                                            {analysis.laboratory ? analysis.laboratory.name : 'Laboratoire Inconnu'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            {analysis.laboratory?.city || 'Ville non spécifiée'}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                                                                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                                            {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                            Pris le
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {analysis.doctor_profile && analysis.doctor_profile.user && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
                                                                            <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                                Dr. {analysis.doctor_profile.user.name}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                                Prescrit par
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Actions */}
                                                    <div className="flex items-center gap-3">
                                                        {analysis.status === 'completed' && analysis.result_file_path ? (
                                                            <div className="flex flex-col gap-2">
                                                                <a
                                                                    href={route('patient.analyses.download', analysis.id)}
                                                                    className="group/btn flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-600 dark:to-green-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 transition-all"
                                                                >
                                                                    <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                                                                    Télécharger
                                                                </a>
                                                                <button className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    Voir le PDF
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${status.bg} ${status.color} ${status.border}`}>
                                                                <StatusIcon className="w-4 h-4" />
                                                                {status.label}
                                                            </div>
                                                        )}

                                                        <button className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                            {isExpanded ?
                                                                <ChevronUp className="w-5 h-5" /> :
                                                                <ChevronDown className="w-5 h-5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            {isExpanded && (
                                                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 p-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                                Détails de l'analyse
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tests demandés</div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {Array.isArray(analysis.tests_requested) && analysis.tests_requested.map((test: any, idx: number) => (
                                                                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                                                                                {getTestIcon(test)}
                                                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                                    {typeof test === 'string' ? test : test.name || JSON.stringify(test)}
                                                                                </span>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Notes</div>
                                                                    <p className="text-gray-700 dark:text-gray-300">
                                                                        {analysis.notes || 'Aucune note spécifiée'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                                <FileSearch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                                Actions
                                                            </h4>
                                                            <div className="space-y-3">
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {analysis.status === 'completed' && analysis.result_file_path && (
                                                                        <>
                                                                            <a
                                                                                href={route('patient.analyses.download', analysis.id)}
                                                                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-600 dark:to-green-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                                                                            >
                                                                                <Download className="w-4 h-4" />
                                                                                Télécharger
                                                                            </a>
                                                                            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                                                                <Printer className="w-4 h-4" />
                                                                                Imprimer
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        Référence: <span className="font-mono text-gray-700 dark:text-gray-300">{analysis.id}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Results Banner */}
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-700 dark:to-purple-600 rounded-2xl p-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Votre santé en un clin d'œil</h3>
                                        <p className="text-indigo-100">
                                            Téléchargez et partagez vos résultats avec votre médecin
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-medium transition-colors flex items-center gap-2 border border-white/30">
                                            <Share2 className="w-4 h-4" />
                                            Partager
                                        </button>
                                        <Link
                                            href={route('laboratories.search')}
                                            className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-gray-50 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Nouvelle analyse
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
