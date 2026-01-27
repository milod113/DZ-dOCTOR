import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Users, Calendar, Clock, Activity,
    ChevronRight, AlertCircle, CheckCircle,
    Stethoscope, UserPlus, Phone, Check, X,
    Siren, Eye, MessageSquare, TrendingUp,
    BarChart3, FileText, Bell,
    Video, FileCheck, AlertTriangle, Sparkles,
    ArrowUpRight, Shield, Zap, Target,
    Star, Download, Heart, Brain,
    Thermometer, Pill, Activity as ActivityIcon,
    Settings, PlusCircle, Award,
    Home, UserCheck, CalendarDays
} from 'lucide-react';
import UrgentBookingModal from '@/Components/UrgentBookingModal';

export default function Dashboard({
    stats,
    next_appointment,
    today_appointments,
    appointments_to_confirm,
    is_secretary,
    doctor_name
}: any) {

    const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        const hour = time.getHours();

        if (hour < 12) setGreeting('Bonjour');
        else if (hour < 18) setGreeting('Bon après-midi');
        else setGreeting('Bonsoir');

        return () => clearInterval(timer);
    }, [time]);

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'short'
        });
    };

    const quickConfirm = (id: number) => {
        router.patch(route('doctor.appointments.update-status', id), {
            status: 'confirmed'
        }, { preserveScroll: true });
    };

    const getPatientPriorityColor = (condition: string) => {
        switch(condition) {
            case 'grave': return 'bg-gradient-to-r from-rose-500 to-red-500';
            case 'moyen': return 'bg-gradient-to-r from-amber-500 to-orange-500';
            default: return 'bg-gradient-to-r from-emerald-500 to-green-500';
        }
    };

    const getPatientPriorityLabel = (condition: string) => {
        switch(condition) {
            case 'grave': return 'URGENT';
            case 'moyen': return 'MODERATE';
            default: return 'STABLE';
        }
    };

    const getMedicalIcon = () => {
        const icons = [Heart, Brain, Thermometer, Pill, ActivityIcon];
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        return <Icon className="w-4 h-4" />;
    };

    return (
        <AppLayout>
            <Head title="Tableau de Bord Médical" />

            <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 sm:px-6 lg:px-8">
                {/* --- ENHANCED HEADER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {greeting}, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{doctor_name}</span>
                                </h1>
                                <p className="text-gray-600 mt-1 flex items-center gap-3">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="flex items-center gap-1.5 font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        <Clock className="w-4 h-4" />
                                        {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </p>
                            </div>
                        </div>
                        {is_secretary && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Secrétariat • Cabinet {doctor_name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsUrgentModalOpen(true)}
                            className="group relative flex items-center gap-3 bg-gradient-to-r from-rose-600 to-red-500 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-rose-200 transition-all transform hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            <Siren className="w-5 h-5 animate-pulse" />
                            <span>Cas Urgent</span>
                        </button>

                        <Link
                            href={route('doctor.appointments.store-walk-in')}
                            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-500 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            <UserPlus className="w-5 h-5" />
                            <span>Nouveau Patient</span>
                        </Link>
                    </div>
                </div>

                {/* --- STATS CARDS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600">Patients Aujourd'hui</div>
                                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.today_count}</div>
                                <div className="text-xs text-gray-500 mt-1">Consultations</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-100/50">
                            <div className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +12% vs hier
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600">Demandes Web</div>
                                <div className="text-3xl font-bold text-amber-600 mt-2">{stats.pending_requests}</div>
                                <div className="text-xs text-gray-500 mt-1">En attente</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-amber-100/50">
                            <Link href="#" className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                Traiter maintenant
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600">Satisfaction</div>
                                <div className="text-3xl font-bold text-emerald-600 mt-2">98.5%</div>
                                <div className="text-xs text-gray-500 mt-1">Taux de satisfaction</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                                <Star className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600">Temps Moyen</div>
                                <div className="text-3xl font-bold text-violet-600 mt-2">24min</div>
                                <div className="text-xs text-gray-500 mt-1">Par consultation</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                                <Clock className="w-6 h-6 text-violet-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN DASHBOARD GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- LEFT COLUMN (Main Workflow) --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. URGENT CONFIRMATIONS BANNER */}
                        {appointments_to_confirm.length > 0 && (
                            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-2xl p-6 text-white shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <Bell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">Confirmations en attente</h3>
                                                <p className="text-amber-100 text-sm">Appeler ces patients maintenant</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                                            {appointments_to_confirm.length} patients
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {appointments_to_confirm.map((appt: any) => (
                                            <div key={appt.id} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between border border-white/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                                        {appt.patient_user?.name.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{appt.patient_user?.name}</div>
                                                        <div className="text-amber-100 text-sm flex items-center gap-2">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(appt.slot.start_at)} • {formatTime(appt.slot.start_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => quickConfirm(appt.id)}
                                                        className="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 transition-all flex items-center gap-2 shadow-sm"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        Confirmer
                                                    </button>
                                                    <Link
                                                        href={route('doctor.appointments.show', appt.id)}
                                                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. NEXT PATIENT HERO CARD */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="relative p-8 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <Target className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Patient Actuel</h2>
                                            <p className="text-blue-100 text-sm">En consultation ou à venir</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 rounded-full text-sm font-bold backdrop-blur-sm border border-white/20">
                                        {next_appointment ? 'EN ATTENTE' : 'SALLE VIDE'}
                                    </div>
                                </div>

                                {next_appointment ? (
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-blue-100 flex items-center justify-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent shadow-2xl">
                                                    {next_appointment.patient_user?.name.charAt(0) || 'G'}
                                                </div>
                                                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${getPatientPriorityColor(next_appointment.patient_condition)} text-white`}>
                                                    {getPatientPriorityLabel(next_appointment.patient_condition)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-4xl font-bold">
                                                    {next_appointment.patient_user?.name || next_appointment.guest_name}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="font-bold">{formatTime(next_appointment.slot.start_at)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatDate(next_appointment.slot.start_at)}</span>
                                                    </div>
                                                    <div className={`px-3 py-1.5 rounded-lg ${next_appointment.type === 'urgent' ? 'bg-rose-500/30' : 'bg-emerald-500/30'} border ${next_appointment.type === 'urgent' ? 'border-rose-500/50' : 'border-emerald-500/50'}`}>
                                                        <span className="text-sm font-bold">
                                                            {next_appointment.type === 'walk_in' ? 'SANS RDV' :
                                                             next_appointment.type === 'urgent' ? 'URGENCE' : 'EN LIGNE'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                            <Link
                                                href={route('doctor.appointments.show', next_appointment.id)}
                                                className="group relative flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-bold hover:shadow-xl transition-all"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity"></div>
                                                <FileText className="w-4 h-4" />
                                                Dossier Patient
                                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <button className="px-6 py-3.5 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-3 border border-white/20">
                                                <MessageSquare className="w-4 h-4" />
                                                Envoyer Rappel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <div className="w-32 h-32 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-6 border border-white/20">
                                            <Users className="w-16 h-16 text-white/50" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Salle d'attente vide</h3>
                                        <p className="text-blue-100 max-w-md mx-auto">
                                            Aucun patient programmé pour l'instant. Prêt pour une consultation ?
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. TODAY'S AGENDA */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Agenda du Jour</h3>
                                            <p className="text-gray-600 text-sm">Vos rendez-vous programmés</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('doctor.appointments.index')}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 font-semibold text-sm transition-all"
                                    >
                                        Tout voir
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {today_appointments.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                                            <Calendar className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Agenda vide</h4>
                                        <p className="text-gray-600 max-w-sm mx-auto">
                                            Aucun rendez-vous prévu aujourd'hui. Profitez-en pour gérer vos disponibilités.
                                        </p>
                                    </div>
                                ) : (
                                    today_appointments.map((appt: any) => (
                                        <div
                                            key={appt.id}
                                            className="group p-5 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center min-w-[60px]">
                                                        <span className="text-2xl font-bold text-gray-900">{formatTime(appt.slot.start_at)}</span>
                                                        <span className="text-xs text-gray-500 mt-1">Durée: 30min</span>
                                                    </div>

                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            {appt.patient_user?.name.charAt(0) || appt.guest_name.charAt(0)}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-gray-900">
                                                            {appt.patient_user?.name || appt.guest_name}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                                appt.status === 'confirmed' ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700' :
                                                                appt.status === 'pending' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700' :
                                                                appt.patient_condition === 'grave' ? 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700' :
                                                                'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                                                            }`}>
                                                                {appt.patient_condition === 'grave' ? 'URGENT' :
                                                                 appt.status === 'pending' ? 'À CONFIRMER' :
                                                                 appt.status.toUpperCase()}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {appt.type === 'urgent' ? 'Urgence' :
                                                                 appt.type === 'walk_in' ? 'Présentiel' : 'En ligne'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={route('doctor.appointments.show', appt.id)}
                                                        className="p-2 text-gray-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <button className="p-2 text-gray-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-600 rounded-lg transition-colors" title="Envoyer rappel">
                                                        <Bell className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (Stats & Tools) --- */}
                    <div className="space-y-8">
                        {/* QUICK TOOLS */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Outils Rapides</h3>
                                <Sparkles className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" />
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href={route('doctor.slots.index')}
                                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all border border-transparent hover:border-blue-200"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">Gérer Planning</div>
                                        <div className="text-sm text-gray-500">Définir vos disponibilités</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                                </Link>

                                {!is_secretary && (
                                    <Link
                                        href={route('doctor.team.index')}
                                        className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all border border-transparent hover:border-purple-200"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                                            <Users className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">Mon Équipe</div>
                                            <div className="text-sm text-gray-500">Gérer les secrétaires</div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                                    </Link>
                                )}

                              <Link
    href="#"
    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-blue-100"
>
    <Eye className="w-4 h-4" />
    View Details
</Link>
                            </div>
                        </div>

                        {/* MEDICAL TIPS */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Conseil du Jour</h4>
                                        <p className="text-sm text-gray-600">Tips médicaux</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        {getMedicalIcon()}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Vérification des antécédents</div>
                                        <div className="text-xs text-gray-600">Toujours vérifier les allergies avant prescription</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-white/50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Protocole sanitaire</div>
                                        <div className="text-xs text-gray-600">Désinfection des mains entre chaque patient</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SYSTEM STATUS */}
                        <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-lg font-bold">Statut du Système</h4>
                                    <p className="text-blue-200 text-sm">Tout fonctionne normalement</p>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Video className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">TV Display</span>
                                    </div>
                                    <span className="text-emerald-400 text-sm font-medium">Actif</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">Notifications WhatsApp</span>
                                    </div>
                                    <span className="text-emerald-400 text-sm font-medium">Connecté</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">Sécurité</span>
                                    </div>
                                    <span className="text-emerald-400 text-sm font-medium">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* URGENT BOOKING MODAL */}
            <UrgentBookingModal
                isOpen={isUrgentModalOpen}
                onClose={() => setIsUrgentModalOpen(false)}
            />
        </AppLayout>
    );
}
