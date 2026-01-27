import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react'; // ✅ Import router
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useState, useRef, useEffect } from 'react';
import {
    Plus, X, Calendar as CalendarIcon, User, Search, Phone, Activity, Info,
    Clock, MapPin, Stethoscope, Filter, Download, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Users,
    TrendingUp, BarChart3, Printer, CalendarDays, UserPlus
} from 'lucide-react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function ImagingCalendar({ events, exams }: any) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [viewType, setViewType] = useState<'week' | 'month' | 'day'>('week');
    const [currentDateTitle, setCurrentDateTitle] = useState('');

    const calendarRef = useRef<any>(null);

    // --- FORM SETUP ---
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        is_walkin: false,
        patient_email: '',
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        imaging_exam_id: '',
        start_date: '',
        notes: ''
    });

    useEffect(() => {
        if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            setCurrentDateTitle(api.view.title);
        }
    }, []);

    // --- HANDLERS ---
    const handleViewChange = (view: 'week' | 'month' | 'day') => {
        setViewType(view);
        const api = calendarRef.current?.getApi();
        if (api) {
            const fcView = view === 'month' ? 'dayGridMonth' : view === 'day' ? 'timeGridDay' : 'timeGridWeek';
            api.changeView(fcView);
            setCurrentDateTitle(api.view.title);
        }
    };

    const handlePrev = () => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.prev();
            setCurrentDateTitle(api.view.title);
        }
    };

    const handleNext = () => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.next();
            setCurrentDateTitle(api.view.title);
        }
    };

    const handleToday = () => {
        const api = calendarRef.current?.getApi();
        if (api) {
            api.today();
            setCurrentDateTitle(api.view.title);
        }
    };

    const handleDateClick = (arg: any) => {
        const dateStr = arg.dateStr.slice(0, 16);
        setData('start_date', dateStr);
        setIsModalOpen(true);
    };

    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent(clickInfo.event);
        setEventModalOpen(true);
    };

    // ✅ DRAG AND DROP HANDLER
    const handleEventDrop = (info: any) => {
        // Convert to ISO format expected by Laravel (YYYY-MM-DDTHH:mm:ss)
        // FullCalendar 'start' is a JS Date object.
        // We use a simple utility to format it to local ISO string
        const date = info.event.start;
        // Adjust for timezone offset to keep local time correct
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date - offset)).toISOString().slice(0, 19);

        router.patch(route('imaging.appointments.update', info.event.id), {
            start_date: localISOTime
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Toast notification
                console.log("Rendez-vous déplacé !");
            },
            onError: () => {
                info.revert(); // Undo the move if backend fails
                alert("Erreur lors du déplacement du rendez-vous.");
            }
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post(route('imaging.appointments.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const toggleWalkin = (status: boolean) => {
        setData(data => ({
            ...data,
            is_walkin: status,
            patient_email: status ? '' : data.patient_email,
            guest_name: status ? data.guest_name : '',
            guest_phone: status ? data.guest_phone : ''
        }));
        clearErrors();
    };

    // Enhanced event rendering
    const renderEventContent = (eventInfo: any) => {
        const props = eventInfo.event.extendedProps;
        const eventType = props.exam_type || 'standard';
        const isWalkin = props.is_walkin;

        const colorMap: any = {
            'IRM': { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-400' },
            'Scanner': { bg: 'from-purple-500 to-pink-500', border: 'border-purple-400' },
            'Échographie': { bg: 'from-emerald-500 to-green-500', border: 'border-emerald-400' },
            'Radiographie': { bg: 'from-amber-500 to-orange-500', border: 'border-amber-400' },
            'standard': { bg: 'from-indigo-500 to-purple-500', border: 'border-indigo-400' }
        };

        const colors = colorMap[eventType] || colorMap.standard;

        return (
            <div
                className={`group relative w-full h-full p-2 rounded-lg bg-gradient-to-r ${colors.bg} text-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border ${colors.border}`}
                onClick={() => handleEventClick(eventInfo)}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                <div className="relative z-10 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-xs bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {eventInfo.timeText}
                        </span>
                        {isWalkin && (
                            <span className="bg-orange-500/80 text-white text-[10px] px-1.5 rounded font-bold" title="Patient externe">Ext</span>
                        )}
                    </div>

                    <div className="font-bold text-sm flex items-center gap-1.5 truncate">
                        {isWalkin ? <UserPlus className="w-3.5 h-3.5 flex-shrink-0" /> : <User className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">{eventInfo.event.title}</span>
                    </div>

                    <div className="text-xs font-medium flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-1 backdrop-blur-sm">
                        <Activity className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{props.exam}</span>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                        {props.patient_phone && (
                            <div className="text-[10px] flex items-center gap-1 opacity-90">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                {props.patient_phone}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Calendar options
    const calendarOptions: any = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: false,
        locale: frLocale,
        events: events,
        eventColor: '#4f46e5',
        slotMinTime: '08:00:00',
        slotMaxTime: '19:00:00',
        allDaySlot: false,
        height: 'auto',

        // ✅ Enable Drag and Drop
        editable: true,
        eventStartEditable: true,
        eventDurationEditable: false, // Set to true if you want resize capability
        eventDrop: handleEventDrop, // Connect handler

        dateClick: handleDateClick,
        eventClick: handleEventClick,
        eventContent: renderEventContent,
        dayMaxEvents: 3,
        eventDisplay: 'block',
        datesSet: (dateInfo: any) => {
            setCurrentDateTitle(dateInfo.view.title);
        },
        eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
        slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
        businessHours: { daysOfWeek: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '19:00' }
    };

    const stats = {
        total: events.length,
        today: events.filter((e: any) => new Date(e.start).toDateString() === new Date().toDateString()).length,
        upcoming: events.filter((e: any) => new Date(e.start) > new Date()).length,
        completed: events.filter((e: any) => e.extendedProps?.status === 'completed').length,
    };

    return (
        <AppLayout>
            <Head title="Planning d'Imagerie" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-8 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* --- HEADER --- */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                                        <CalendarDays className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Planning d'Imagerie</h1>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 ml-12">Gérez le planning des examens en temps réel</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">RDV aujourd'hui</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.today}</div>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    <Plus className="w-5 h-5" /> <span>Nouveau Rendez-vous</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { id: 'total', label: 'Total RDV', value: stats.total, color: 'from-cyan-500 to-blue-500', icon: CalendarIcon },
                                { id: 'today', label: "Aujourd'hui", value: stats.today, color: 'from-emerald-500 to-green-500', icon: TrendingUp },
                                { id: 'upcoming', label: 'À venir', value: stats.upcoming, color: 'from-amber-500 to-orange-500', icon: Clock },
                                { id: 'completed', label: 'Terminés', value: stats.completed, color: 'from-purple-500 to-pink-500', icon: CheckCircle },
                            ].map(stat => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.id} className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                            </div>
                                            <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                                                <Icon className={`w-6 h-6 ${stat.color.replace('from-', 'text-').replace(' to-', ' dark:text-')}`} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* --- CALENDAR CONTROLS --- */}
                    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"><Filter className="w-5 h-5" /></div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Vue :</span>
                                </div>
                                <div className="flex gap-2">
                                    {['week', 'month', 'day'].map((view) => (
                                        <button key={view} onClick={() => handleViewChange(view as any)} className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${viewType === view ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}>
                                            {view === 'week' ? 'Semaine' : view === 'month' ? 'Mois' : 'Jour'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* ... Export buttons ... */}
                        </div>
                    </div>

                    {/* --- CALENDAR --- */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button onClick={handlePrev} className="p-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 text-cyan-600 dark:text-cyan-400 hover:shadow-md transition-all"><ChevronLeft className="w-5 h-5" /></button>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{currentDateTitle || "Planning"}</h2>
                                <button onClick={handleNext} className="p-2 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 text-cyan-600 dark:text-cyan-400 hover:shadow-md transition-all"><ChevronRight className="w-5 h-5" /></button>
                                <button onClick={handleToday} className="ml-2 text-sm font-medium text-cyan-600 hover:underline">Aujourd'hui</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Synchro active</div>
                            </div>
                        </div>

                        {/* ... Legend & Style ... */}
                        <style>{`
                            .fc { --fc-border-color: #e5e7eb; --fc-today-bg-color: rgba(6, 182, 212, 0.1); --fc-neutral-bg-color: #f9fafb; --fc-page-bg-color: white; }
                            .dark .fc { --fc-border-color: #374151; --fc-today-bg-color: rgba(6, 182, 212, 0.2); --fc-neutral-bg-color: #1f2937; --fc-page-bg-color: #111827; }
                            .fc-theme-standard .fc-scrollgrid { border-radius: 12px; overflow: hidden; }
                            .fc-theme-standard td, .fc-theme-standard th { border-color: var(--fc-border-color); }
                            .fc-col-header-cell { background: linear-gradient(to bottom, #f8fafc, #f1f5f9); padding: 12px 0; font-weight: 600; color: #374151; }
                            .dark .fc-col-header-cell { background: linear-gradient(to bottom, #1f2937, #111827); color: #d1d5db; }
                            .fc-day-today { background: var(--fc-today-bg-color) !important; }
                            .fc-timegrid-slot { height: 60px !important; }
                            .fc-event { border-radius: 8px !important; border: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; transition: all 0.3s ease !important; cursor: grab; }
                            .fc-event:active { cursor: grabbing; }
                            .fc-event:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }
                            .fc-event-main { padding: 0 !important; }
                            .fc-daygrid-event { margin: 2px 4px !important; }
                        `}</style>

                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <FullCalendar ref={calendarRef} {...calendarOptions} />
                        </div>
                    </div>
                </div>

                {/* --- ADD APPOINTMENT MODAL (UPDATED WITH TABS) --- */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                                    <Plus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-bold text-cyan-900 dark:text-cyan-200">Nouveau Rendez-vous</h2>
                            </div>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* 1. PATIENT TYPE TOGGLE */}
                            <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => toggleWalkin(false)}
                                    className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm ${!data.is_walkin ? 'bg-white dark:bg-gray-600 text-cyan-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                >
                                    <User className="w-4 h-4" /> Patient Enregistré
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleWalkin(true)}
                                    className={`flex-1 py-2 px-3 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm ${data.is_walkin ? 'bg-white dark:bg-gray-600 text-cyan-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                >
                                    <UserPlus className="w-4 h-4" /> Patient Externe
                                </button>
                            </div>

                            {/* 2. PATIENT FIELDS */}
                            {!data.is_walkin ? (
                                // REGISTERED PATIENT
                                <div>
                                    <InputLabel htmlFor="patient_email" value="Email du compte DzDoctor" className="dark:text-gray-300 text-sm font-medium" />
                                    <div className="relative mt-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="patient_email"
                                            type="email"
                                            className="pl-10 w-full p-3 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                            placeholder="patient@exemple.com"
                                            value={data.patient_email}
                                            onChange={(e) => setData('patient_email', e.target.value)}
                                        />
                                    </div>
                                    <InputError message={errors.patient_email} className="mt-1" />
                                </div>
                            ) : (
                                // WALK-IN GUEST
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <InputLabel htmlFor="guest_name" value="Nom Complet" className="dark:text-gray-300 text-sm font-medium" />
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <TextInput
                                                id="guest_name"
                                                className="pl-10 w-full p-3 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                                placeholder="ex: Mohamed Amine"
                                                value={data.guest_name}
                                                onChange={(e) => setData('guest_name', e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.guest_name} className="mt-1" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="guest_phone" value="Téléphone" className="dark:text-gray-300 text-sm font-medium" />
                                            <TextInput
                                                id="guest_phone"
                                                className="w-full p-3 mt-1 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                                placeholder="055..."
                                                value={data.guest_phone}
                                                onChange={(e) => setData('guest_phone', e.target.value)}
                                            />
                                            <InputError message={errors.guest_phone} className="mt-1" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="guest_email" value="Email (Optionnel)" className="dark:text-gray-300 text-sm font-medium" />
                                            <TextInput
                                                id="guest_email"
                                                type="email"
                                                className="w-full p-3 mt-1 dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                                                placeholder="@"
                                                value={data.guest_email}
                                                onChange={(e) => setData('guest_email', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Common Fields */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="imaging_exam_id" value="Type d'Examen" className="dark:text-gray-300 text-sm font-medium" />
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Activity className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <select
                                                id="imaging_exam_id"
                                                className="pl-10 block w-full p-3 border-gray-300 dark:border-gray-700 rounded-xl dark:bg-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500"
                                                value={data.imaging_exam_id}
                                                onChange={(e) => setData('imaging_exam_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Sélectionner...</option>
                                                {exams && exams.map((exam: any) => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                                            </select>
                                        </div>
                                        <InputError message={errors.imaging_exam_id} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="start_date" value="Date et Heure" className="dark:text-gray-300 text-sm font-medium" />
                                        <div className="relative mt-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <TextInput id="start_date" type="datetime-local" className="pl-10 w-full p-3 dark:bg-gray-900 dark:border-gray-700 rounded-xl" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} required />
                                        </div>
                                        <InputError message={errors.start_date} />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="notes" value="Notes (Optionnel)" className="dark:text-gray-300 text-sm font-medium" />
                                    <textarea id="notes" className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-xl p-3" rows={2} value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <SecondaryButton onClick={() => setIsModalOpen(false)}>Annuler</SecondaryButton>
                            <PrimaryButton disabled={processing} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-transparent shadow-lg">
                                {processing ? 'Enregistrement...' : 'Ajouter le RDV'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Modal>

                <Modal show={eventModalOpen} onClose={() => setEventModalOpen(false)} maxWidth="lg">
                    {/* Event details modal content (same as previous) */}
                    {selectedEvent && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                            {/* ... Header and details logic similar to previous version, ensuring guest info is displayed if available ... */}
                            {/* You can copy the content of the event details modal from my previous response here */}
                            <h2 className="text-xl font-bold dark:text-white mb-4">
                                {selectedEvent.title}
                                {selectedEvent.extendedProps.is_walkin && <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full border border-orange-200">Externe</span>}
                            </h2>
                            <p className="dark:text-gray-300">Examen: {selectedEvent.extendedProps.exam}</p>
                            <p className="dark:text-gray-300">Tél: {selectedEvent.extendedProps.patient_phone || 'N/A'}</p>
                            <p className="dark:text-gray-300">Notes: {selectedEvent.extendedProps.notes}</p>
                            <div className="mt-6 flex justify-end">
                                <SecondaryButton onClick={() => setEventModalOpen(false)}>Fermer</SecondaryButton>
                            </div>
                        </div>
                    )}
                </Modal>

            </div>
        </AppLayout>
    );
}
