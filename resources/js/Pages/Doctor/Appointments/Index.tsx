import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Plus,
    User,
    Siren,
    Activity,
    Volume2,
    Filter,
    Clock,
    Phone,
    QrCode,
    MoreVertical,
    Download,
    Eye,
    CalendarDays,
    UserX,
    Mail,
    MessageSquare,
    Users,
    TrendingUp,
    Bell,
    Shield,
    Sparkles,
    ArrowUpRight,
    Zap,
    Heart,
    ChevronRight,
    Settings,
    AlertTriangle,
    Info,
    Radio
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import WalkInModal from '@/Components/WalkInModal';
import BulkReminderModal from '@/Components/BulkReminderModal';

export default function AppointmentIndex({ appointments, filters, slots = [], doctorName }: any) {

    // --- STATE ---
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [showQuickActions, setShowQuickActions] = useState<string | null>(null);

    // Debounce search
    const [debouncedSearch] = useDebounce(search, 500);

    // --- MODAL STATES ---
    const [isWalkInOpen, setIsWalkInOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [isRemindersOpen, setIsRemindersOpen] = useState(false);

    const openBookingModal = (slotId: number) => {
        setSelectedSlotId(slotId);
        setIsWalkInOpen(true);
    };

    // --- EFFECT: RELOAD ON FILTER CHANGE ---
    useEffect(() => {
        if (debouncedSearch !== (filters.search || '') || date !== (filters.date || '') || statusFilter !== (filters.status || 'all')) {
             router.get(
                route('doctor.appointments.index'),
                {
                    search: debouncedSearch,
                    date: date,
                    status: statusFilter === 'all' ? null : statusFilter
                },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch, date, statusFilter]);

    // --- HELPER: UPDATE STATUS ---
    const updateStatus = (id: number, status: string) => {
        if (status !== 'in_progress' && !confirm(`Mark this appointment as ${status}?`)) return;
        router.patch(route('doctor.appointments.update-status', id), { status }, { preserveScroll: true });
        setShowQuickActions(null);
    };

    // --- HELPER: SINGLE WHATSAPP REMINDER ---
    const openWhatsApp = (phone: string | null, name: string, date: string, time: string) => {
        if (!phone) {
            alert("No phone number available for this patient.");
            return;
        }

        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '213' + cleanPhone.substring(1);
        else if (!cleanPhone.startsWith('213')) cleanPhone = '213' + cleanPhone;

        const message = `Bonjour ${name}, rappel de votre rendez-vous chez le Dr. ${doctorName} le ${date} à ${time}. Merci de confirmer votre présence.`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
        setShowQuickActions(null);
    };

    const statusColors: any = {
        confirmed: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:border-blue-800',
        completed: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 dark:border-emerald-800',
        cancelled: 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border-rose-200 dark:from-rose-900/30 dark:to-red-900/30 dark:text-rose-300 dark:border-rose-800',
        no_show: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300 dark:border-amber-800',
        in_progress: 'bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 dark:from-violet-900/30 dark:to-purple-900/30 dark:text-violet-300 dark:border-violet-800',
    };

    const statusIcons: any = {
        confirmed: <Clock className="w-3.5 h-3.5" />,
        completed: <CheckCircle className="w-3.5 h-3.5" />,
        cancelled: <XCircle className="w-3.5 h-3.5" />,
        no_show: <UserX className="w-3.5 h-3.5" />,
        in_progress: <Activity className="w-3.5 h-3.5" />,
    };

    const tabs = [
        { id: 'all', label: 'All', count: appointments.total, icon: <CalendarDays className="w-4 h-4" /> },
        { id: 'confirmed', label: 'Upcoming', count: appointments.data.filter((a: any) => a.status === 'confirmed').length, icon: <Clock className="w-4 h-4" /> },
        { id: 'in_progress', label: 'Active', count: appointments.data.filter((a: any) => a.status === 'in_progress').length, icon: <Activity className="w-4 h-4" /> },
        { id: 'completed', label: 'Completed', count: appointments.data.filter((a: any) => a.status === 'completed').length, icon: <CheckCircle className="w-4 h-4" /> },
        { id: 'cancelled', label: 'Cancelled', count: appointments.data.filter((a: any) => a.status === 'cancelled').length, icon: <XCircle className="w-4 h-4" /> },
    ];

    const getTimeStatus = (startTime: string) => {
        const now = new Date();
        const appointmentTime = new Date(startTime);
        const diffMinutes = Math.floor((appointmentTime.getTime() - now.getTime()) / (1000 * 60));

        if (diffMinutes < 0) return {
            text: 'Overdue',
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-gradient-to-r from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20',
            border: 'border-rose-100 dark:border-rose-800'
        };
        if (diffMinutes < 30) return {
            text: 'Soon',
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
            border: 'border-amber-100 dark:border-amber-800'
        };
        if (diffMinutes < 60) return {
            text: 'Upcoming',
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
            border: 'border-blue-100 dark:border-blue-800'
        };
        return {
            text: 'Scheduled',
            color: 'text-gray-600 dark:text-gray-400',
            bg: 'bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-800 dark:to-gray-800',
            border: 'border-gray-100 dark:border-gray-700'
        };
    };

    // Calculate stats
    const stats = {
        total: appointments.total,
        today: appointments.data.filter((a: any) => {
            const apptDate = new Date(a.slot.start_at).toDateString();
            const today = new Date().toDateString();
            return apptDate === today;
        }).length,
        upcoming: appointments.data.filter((a: any) => a.status === 'confirmed').length,
        completed: appointments.data.filter((a: any) => a.status === 'completed').length,
    };

    return (
        <AppLayout>
            <Head title="Appointment Management" />

            {/* --- MODALS --- */}
            <WalkInModal
                isOpen={isWalkInOpen}
                onClose={() => setIsWalkInOpen(false)}
                slotId={selectedSlotId}
            />

            <BulkReminderModal
                isOpen={isRemindersOpen}
                onClose={() => setIsRemindersOpen(false)}
                doctorName={doctorName}
            />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6 dark:bg-gray-900 transition-colors duration-200">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-xl shadow-lg">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointment Dashboard</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Managing schedule for <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">Dr. {doctorName}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link
        href={route('doctor.secretary.scan')}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-900 text-purple-700 dark:text-purple-300 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all shadow-sm hover:shadow-md"
    >
        <QrCode className="w-4 h-4" />
        Scan Check-In
    </Link>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsRemindersOpen(true)}
                            className="group relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-400 dark:from-emerald-600 dark:to-green-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            <MessageSquare className="w-4 h-4" />
                            Bulk Reminders
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="group relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-700 dark:to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all transform hover:-translate-y-0.5">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                            <Plus className="w-4 h-4" />
                            New Appointment
                        </button>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Today</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.today}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</div>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.upcoming}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</div>
                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{stats.completed}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.total}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl">
                                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & SEARCH BAR */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between">
                            <div className="flex-1 max-w-xl">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search patients by name, phone, or email..."
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all text-sm bg-gray-50/50 dark:bg-gray-900/50 dark:text-white"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex items-center">
                                    <Calendar className="absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    <input
                                        type="date"
                                        className="w-full sm:w-48 pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 text-sm text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/50"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <button className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <Filter className="w-4 h-4" />
                                    More Filters
                                </button>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                                        statusFilter === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-700 dark:to-purple-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className={`ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full ${
                                            statusFilter === tab.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* APPOINTMENTS TABLE */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-bold border border-blue-200 dark:border-blue-800">
                                    {appointments.total} Total Appointments
                                </span>
                                <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800">
                                    {slots.length} Available Slots
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 w-48">Time & Date</th>
                                    <th className="px-6 py-4">Patient Details</th>
                                    <th className="px-6 py-4">Priority</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">

                                {/* AVAILABLE SLOTS */}
                                {slots.length > 0 && slots.map((slot: any) => {
                                    const timeStatus = getTimeStatus(slot.start_at);
                                    return (
                                        <tr key={`slot-${slot.id}`} className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/10 hover:from-blue-100/50 hover:to-cyan-100/30 dark:hover:from-blue-800/20 dark:hover:to-cyan-800/20 transition-all border-l-4 border-l-blue-500">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xl text-blue-700 dark:text-blue-400">
                                                        {new Date(slot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                                                        {new Date(slot.start_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className={`mt-2 text-xs font-bold px-2 py-1 rounded-full ${timeStatus.bg} ${timeStatus.color} ${timeStatus.border} inline-block w-fit`}>
                                                        {timeStatus.text}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                                                        <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">Available Slot</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Open for booking</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                    Normal
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                    <Clock className="w-3 h-3" />
                                                    OPEN
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 dark:text-gray-500 italic">-</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openBookingModal(slot.id)}
                                                    className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-700 dark:to-purple-600 hover:from-blue-700 hover:to-purple-600 dark:hover:from-blue-800 dark:hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                                >
                                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                                    <Plus className="w-4 h-4" />
                                                    Quick Book
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* APPOINTMENTS LIST */}
                                {appointments.data.length === 0 && slots.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-6">
                                                    <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No appointments found</h3>
                                                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                                                    Try adjusting your filters or schedule new appointments.
                                                </p>
                                                <button className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-700 dark:to-purple-600 text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-all">
                                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                                    <Plus className="w-5 h-5" />
                                                    Schedule Appointment
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.data.map((appt: any) => {
                                        const displayName = appt.guest_name || appt.patient_user?.name || 'Unknown Patient';
                                        const displayContact = appt.guest_phone || appt.patient_user?.email || '';
                                        const isWalkIn = !!appt.guest_name || appt.type === 'walk_in';
                                        const condition = appt.patient_condition || 'stable';
                                        const isUrgent = condition === 'grave';
                                        const isMedium = condition === 'moyen';
                                        const timeStatus = getTimeStatus(appt.slot.start_at);

                                        let rowClasses = "group transition-all hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 border-l-4";
                                        if (isUrgent) {
                                            rowClasses = "bg-gradient-to-r from-rose-50/60 to-red-50/40 dark:from-rose-900/20 dark:to-red-900/20 hover:from-rose-100/60 hover:to-red-100/40 dark:hover:from-rose-800/30 dark:hover:to-red-800/30 border-l-rose-500 dark:border-l-rose-600";
                                        } else if (isMedium) {
                                            rowClasses = "bg-gradient-to-r from-amber-50/40 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100/40 hover:to-orange-100/30 dark:hover:from-amber-800/30 dark:hover:to-orange-800/30 border-l-amber-400 dark:border-l-amber-500";
                                        } else {
                                            rowClasses += " border-l-blue-400 dark:border-l-blue-500";
                                        }

                                        return (
                                            <tr key={appt.id} className={rowClasses}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`font-bold text-xl ${isUrgent ? 'text-rose-700 dark:text-rose-400' : 'text-gray-900 dark:text-white'}`}>
                                                                {new Date(appt.slot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {appt.status === 'in_progress' && (
                                                                <span className="animate-pulse w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 dark:from-violet-600 dark:to-purple-600"></span>
                                                            )}
                                                        </div>
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-0.5">
                                                            {new Date(appt.slot.start_at).toLocaleDateString(undefined, {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className={`mt-2 text-xs font-bold px-2 py-1 rounded-full ${timeStatus.bg} ${timeStatus.color} ${timeStatus.border} inline-block w-fit`}>
                                                            {timeStatus.text}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md
                                                            ${isUrgent ? 'bg-gradient-to-br from-rose-500 to-red-400 dark:from-rose-600 dark:to-red-500 text-white' :
                                                              isWalkIn ? 'bg-gradient-to-br from-purple-500 to-violet-400 dark:from-purple-600 dark:to-violet-500 text-white' :
                                                              'bg-gradient-to-br from-blue-500 to-purple-400 dark:from-blue-600 dark:to-purple-500 text-white'}`}>
                                                            {isUrgent ? <Siren className="w-6 h-6" /> : displayName.charAt(0).toUpperCase()}
                                                            {isWalkIn && (
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 dark:bg-purple-700 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                                    <User className="w-2 h-2 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                {displayName}
                                                                {isWalkIn && !isUrgent && (
                                                                    <span className="text-xs bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 font-bold">WALK-IN</span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    {isWalkIn ? <Phone className="w-3 h-3"/> : <Mail className="w-3 h-3" />}
                                                                    {displayContact || 'No contact'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {isUrgent ? (
                                                        <div className="inline-flex flex-col gap-1">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-100 to-red-50 dark:from-rose-900/30 dark:to-red-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                                                                <Siren className="w-4 h-4" /> URGENT
                                                            </span>
                                                            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">Immediate attention</span>
                                                        </div>
                                                    ) : isMedium ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                            <Activity className="w-4 h-4" /> MEDIUM
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                            <CheckCircle className="w-4 h-4" /> STABLE
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${statusColors[appt.status] || 'bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
                                                            {statusIcons[appt.status]}
                                                            {appt.status.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                        {appt.status === 'in_progress' && (
                                                            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium animate-pulse">Currently with patient</span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="max-w-[200px]">
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2" title={appt.reason}>
                                                            {appt.reason || <span className="text-gray-400 dark:text-gray-500 italic">No reason provided</span>}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* CALL PATIENT BUTTON */}
                                                        {appt.status !== 'in_progress' && appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                                            <button
                                                                onClick={() => updateStatus(appt.id, 'in_progress')}
                                                                className="group relative flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-700 dark:to-purple-600 hover:from-violet-700 hover:to-purple-600 dark:hover:from-violet-800 dark:hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-violet-200 dark:shadow-violet-900/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                                            >
                                                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity"></div>
                                                                <Volume2 className="w-4 h-4" />
                                                                CALL TV
                                                            </button>
                                                        )}

                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setShowQuickActions(showQuickActions === appt.id ? null : appt.id)}
                                                                className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl transition-colors"
                                                            >
                                                                <MoreVertical className="w-5 h-5" />
                                                            </button>

                                                            {showQuickActions === appt.id && (
                                                                <>
                                                                    <div className="fixed inset-0 z-10" onClick={() => setShowQuickActions(null)} />
                                                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                                                                        <button className="w-full px-4 py-3.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600 flex items-center gap-3">
                                                                            <Eye className="w-4 h-4" />
                                                                            View Details
                                                                        </button>

                                                                        <button
                                                                            onClick={() => openWhatsApp(
                                                                                appt.guest_phone || appt.patient_user?.phone,
                                                                                appt.guest_name || appt.patient_user?.name,
                                                                                new Date(appt.slot.start_at).toLocaleDateString('fr-FR'),
                                                                                new Date(appt.slot.start_at).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})
                                                                            )}
                                                                            className="w-full px-4 py-3.5 text-left text-sm text-emerald-700 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 flex items-center gap-3 font-medium"
                                                                        >
                                                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="w-4 h-4 text-emerald-600 dark:text-emerald-400">
                                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                                            </svg>
                                                                            WhatsApp Reminder
                                                                        </button>

                                                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                                                        <button onClick={() => updateStatus(appt.id, 'completed')} className="w-full px-4 py-3.5 text-left text-sm text-emerald-700 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 flex items-center gap-3">
                                                                            <CheckCircle className="w-4 h-4" />
                                                                            Mark Complete
                                                                        </button>
                                                                        <button onClick={() => updateStatus(appt.id, 'no_show')} className="w-full px-4 py-3.5 text-left text-sm text-amber-700 dark:text-amber-400 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 flex items-center gap-3">
                                                                            <UserX className="w-4 h-4" />
                                                                            Mark No-Show
                                                                        </button>
                                                                        <button onClick={() => updateStatus(appt.id, 'cancelled')} className="w-full px-4 py-3.5 text-left text-sm text-rose-700 dark:text-rose-400 hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 dark:hover:from-rose-900/30 dark:hover:to-red-900/30 flex items-center gap-3">
                                                                            <XCircle className="w-4 h-4" />
                                                                            Cancel Appointment
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {appointments.links && appointments.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Showing {appointments.from} to {appointments.to} of {appointments.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {appointments.links.map((link: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-700 dark:to-purple-600 text-white shadow-md'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
