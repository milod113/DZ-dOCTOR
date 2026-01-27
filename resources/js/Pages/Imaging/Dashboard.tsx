import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Scan, Users, Calendar, TrendingUp, AlertTriangle,
    CheckCircle, Clock, Settings, Plus, Zap, Activity,
    Search, Filter, ChevronRight, Download, Eye,
    BarChart3, Shield, Building, MapPin, Phone,
    ArrowUpRight, ArrowDownRight, MoreVertical,
    UserCheck, Bell, CalendarDays, RotateCcw,
    Star, TrendingDown, DollarSign, Award
} from 'lucide-react';

export default function Dashboard({ auth, center, stats }: any) {
    const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
    const [equipmentStatus, setEquipmentStatus] = useState([
        { name: 'IRM 3 Tesla', status: 'operational', lastMaintenance: '2024-01-15' },
        { name: 'Scanner 64 Barrettes', status: 'operational', lastMaintenance: '2024-01-10' },
        { name: 'Table Radio Numérique', status: 'maintenance', lastMaintenance: '2024-01-05' },
        { name: 'Échographe Doppler', status: 'operational', lastMaintenance: '2024-01-20' },
    ]);

    const equipment = center.equipment_list || ['IRM 3 Tesla', 'Scanner 64 Barrettes', 'Table Radio Numérique', 'Échographe Doppler'];

    // Mock appointments data
    const todayAppointments = [
        { id: 1, time: '09:00', patient: 'Amine Benali', exam: 'IRM Cérébrale', status: 'in_progress', machine: 'IRM 1', duration: '45min', priority: 'high' },
        { id: 2, time: '10:30', patient: 'Sarah Kadi', exam: 'Scanner Thoracique', status: 'waiting', machine: 'Scanner A', duration: '30min', priority: 'normal' },
        { id: 3, time: '11:15', patient: 'Mohamed Said', exam: 'Échographie Abdominale', status: 'confirmed', machine: 'Echo 2', duration: '20min', priority: 'normal' },
        { id: 4, time: '14:00', patient: 'Lina Belkacem', exam: 'Mammographie', status: 'confirmed', machine: 'Mammo 1', duration: '25min', priority: 'normal' },
    ];

    const upcomingAppointments = [
        { id: 5, time: '15:30', patient: 'Karim Zidane', exam: 'Scanner Crânien', status: 'scheduled', machine: 'Scanner B', date: 'Demain', priority: 'high' },
        { id: 6, time: '16:45', patient: 'Nadia Chen', exam: 'IRM Rachis', status: 'scheduled', machine: 'IRM 2', date: 'Dans 2 jours', priority: 'normal' },
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'waiting': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
            case 'confirmed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'scheduled': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getEquipmentStatusColor = (status: string) => {
        switch(status) {
            case 'operational': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
            case 'out_of_service': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <AppLayout>
            <Head title="Tableau de Bord Imagerie" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                                        <Scan className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {center.name}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                            <Building className="w-4 h-4" />
                                            {center.address || 'Adresse non spécifiée'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${
                                        center.verification_status === 'verified'
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse'
                                    }`}>
                                        {center.verification_status === 'verified' ? (
                                            <>
                                                <Shield className="w-4 h-4" />
                                                <span>Centre Vérifié</span>
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4" />
                                                <span>En attente de vérification</span>
                                            </>
                                        )}
                                    </div>

                                    <Link
                                        href={'#'}
                                        className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
                                        title="Paramètres"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </Link>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                                            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-white">{auth.user.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Administrateur</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Alert */}
                        {center.verification_status === 'pending' && (
                            <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 flex items-start gap-4 animate-fadeIn">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-amber-800 dark:text-amber-300 text-lg">Centre en attente de validation</h3>
                                    <p className="text-amber-700 dark:text-amber-400 mt-2">
                                        Votre dossier (Agrément N° {center.license_number}) est en cours d'examen par notre équipe.
                                        Vous pouvez configurer votre centre, mais il ne sera visible qu'après validation.
                                    </p>
                                    <div className="flex items-center gap-4 mt-4">
                                        <span className="text-xs font-medium px-3 py-1 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg">
                                            En moyenne 2-3 jours ouvrables
                                        </span>
                                        <button className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300">
                                            Voir le statut détaillé →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Rendez-vous Aujourd'hui"
                                value={stats.appointments_today || '0'}
                                icon={<Calendar className="w-6 h-6" />}
                                color="from-indigo-500 to-blue-500"
                                trend={{ value: '+12%', positive: true }}
                                detail="4 patients programmés"
                            />
                            <StatCard
                                title="Examens ce mois"
                                value={stats.total_exams || '87'}
                                icon={<Activity className="w-6 h-6" />}
                                color="from-violet-500 to-purple-600"
                                trend={{ value: '+5%', positive: true }}
                                detail="vs mois dernier"
                            />
                            <StatCard
                                title="Taux d'occupation"
                                value="82%"
                                icon={<BarChart3 className="w-6 h-6" />}
                                color="from-blue-500 to-cyan-500"
                                trend={{ value: '+8%', positive: true }}
                                detail="Optimisé"
                            />
                            <StatCard
                                title="Revenus estimés"
                                value="450K DA"
                                icon={<DollarSign className="w-6 h-6" />}
                                color="from-emerald-500 to-teal-600"
                                trend={{ value: '+15%', positive: true }}
                                detail="Ce mois"
                            />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column - Schedule */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Schedule Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                                                    <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Planning du Jour</h2>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                                    <button
                                                        onClick={() => setActiveTab('today')}
                                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                                            activeTab === 'today'
                                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                        }`}
                                                    >
                                                        Aujourd'hui
                                                    </button>
                                                    <button
                                                        onClick={() => setActiveTab('upcoming')}
                                                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                                            activeTab === 'upcoming'
                                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                        }`}
                                                    >
                                                        À venir
                                                    </button>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span>Confirmé</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                                <span>En cours</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <span>En attente</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {(activeTab === 'today' ? todayAppointments : upcomingAppointments).map((apt) => (
                                                <div key={apt.id} className="group p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 hover:shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-center min-w-[70px]">
                                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{apt.time}</div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">{apt.duration || apt.date}</div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                                        {apt.patient}
                                                                    </h4>
                                                                    {apt.priority === 'high' && (
                                                                        <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-medium rounded">
                                                                            Prioritaire
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <Activity className="w-3 h-3" />
                                                                        {apt.exam}
                                                                    </div>
                                                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                                                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                                                                        {apt.machine}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(apt.status)}`}>
                                                                {apt.status === 'in_progress' ? 'En cours' :
                                                                 apt.status === 'waiting' ? 'En attente' :
                                                                 apt.status === 'confirmed' ? 'Confirmé' : 'Programmé'}
                                                            </span>
                                                            <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all">
                                                                <Eye className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Empty State */}
                                            <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-900/30">
                                                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {activeTab === 'today'
                                                        ? "Aucun autre rendez-vous aujourd'hui"
                                                        : "Aucun rendez-vous programmé pour les prochains jours"}
                                                </p>
                                                <button className="mt-3 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-2 mx-auto">
                                                    <Plus className="w-4 h-4" />
                                                    Ajouter un rendez-vous
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-lg">Actions Rapides</h3>
                                        <Zap className="w-5 h-5 text-yellow-300" />
                                    </div>
                                    <div className="space-y-3">
                                        <button className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-between transition-all duration-200 group border border-white/10 backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Plus className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">Ajouter un Examen</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <button className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-between transition-all duration-200 group border border-white/10 backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">Gérer les Disponibilités</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <button className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-between transition-all duration-200 group border border-white/10 backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Download className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">Exporter les Statistiques</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </div>

                                {/* Equipment Status */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg">
                                                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">État des Équipements</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">3/4 opérationnels</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300">
                                            Voir tout
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {equipmentStatus.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        item.status === 'operational' ? 'bg-emerald-500' :
                                                        item.status === 'maintenance' ? 'bg-amber-500 animate-pulse' :
                                                        'bg-rose-500'
                                                    }`}></div>
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Maintenance: {new Date(item.lastMaintenance).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getEquipmentStatusColor(item.status)}`}>
                                                    {item.status === 'operational' ? 'Opérationnel' :
                                                     item.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full mt-6 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-800">
                                        <RotateCcw className="w-4 h-4 inline mr-2" />
                                        Planifier une maintenance
                                    </button>
                                </div>

                                {/* Performance Metrics */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Performances</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Satisfaction patients</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-white">94%</span>
                                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Temps d'attente moyen</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-white">18 min</span>
                                                <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Note moyenne</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 dark:text-white">4.7/5</span>
                                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Enhanced StatCard Component
function StatCard({ title, value, icon, color, trend, detail }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-sm group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
                        trend.positive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    }`}>
                        {trend.positive ? (
                            <ArrowUpRight className="w-3 h-3" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3" />
                        )}
                        {trend.value}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{detail}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
