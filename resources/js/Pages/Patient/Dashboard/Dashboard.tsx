import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import PatientAgenda from '@/Components/PatientAgenda';
import {
    CalendarPlus,
    FileText,
    Activity,
    ShieldCheck,
    Clock,
    User,
    Bell,
    Stethoscope,
    Pill,
    Heart,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    CalendarDays,
    Download,
    QrCode as QrCodeIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardProps extends PageProps {
    qrCode: string;
    events: any[];
    stats?: {
        upcomingAppointments: number;
        pendingResults: number;
        upcomingImaging: number;
        unreadMessages: number;
    };
}

export default function Dashboard({
    auth,
    qrCode,
    events,
    stats = {
        upcomingAppointments: 0,
        pendingResults: 0,
        upcomingImaging: 0,
        unreadMessages: 0
    }
}: DashboardProps) {

    // Debugging: Check if events exist in console
    useEffect(() => {
        console.log("Calendar Events Passed to Component:", events);
    }, [events]);

    const [currentTime, setCurrentTime] = useState('');
    const [greeting, setGreeting] = useState('');

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

            const hour = now.getHours();
            if (hour < 12) setGreeting('Good morning');
            else if (hour < 18) setGreeting('Good afternoon');
            else setGreeting('Good evening');
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const downloadQrCode = () => {
        const qrContainer = document.querySelector('.qr-code-container');
        if (qrContainer) {
            const svgElement = qrContainer.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    canvas.width = img.width + 40;
                    canvas.height = img.height + 40;
                    if (ctx) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 20, 20);

                        const pngFile = canvas.toDataURL('image/png');
                        const downloadLink = document.createElement('a');
                        downloadLink.download = `dz-doctor-patient-qr-${auth.user.uuid.substring(0, 8)}.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                    }
                };

                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Health Dashboard</h2>
                        <p className="text-sm text-gray-500">Welcome to your personalized health portal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                            <Bell className="w-5 h-5" />
                            {stats.unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {stats.unreadMessages}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="My Health Dashboard" />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 pb-12 pt-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* --- HEADER SECTION --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 1. Welcome & Stats Card */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Welcome Banner */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-900/20">
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl"></div>
                                <div className="absolute top-6 right-6 opacity-20">
                                    <Heart className="w-24 h-24" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-blue-100 text-sm font-medium mb-2">
                                                <Clock className="w-4 h-4" />
                                                {currentDate} • {currentTime}
                                            </div>
                                            <h1 className="text-3xl font-bold mb-2">{greeting}, {auth.user.name.split(' ')[0]}!</h1>
                                            <p className="text-blue-100 max-w-lg leading-relaxed">
                                                Your health is our priority. Track your appointments, results, and treatments in one place.
                                            </p>
                                        </div>
                                        <div className="hidden lg:block">
                                            <div className="text-right">
                                                <div className="text-blue-200 text-sm">Patient ID</div>
                                                <div className="font-mono text-white font-bold tracking-wider">{auth.user.uuid.substring(0, 12)}...</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <CalendarDays className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
                                                    <div className="text-blue-100 text-xs">Upcoming</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <FileText className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold">{stats.pendingResults}</div>
                                                    <div className="text-blue-100 text-xs">Pending Results</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Activity className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold">{stats.upcomingImaging}</div>
                                                    <div className="text-blue-100 text-xs">Imaging</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/20 rounded-lg">
                                                    <Bell className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                                                    <div className="text-blue-100 text-xs">Messages</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    href={route('patient.appointments.index')}
                                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                                                <CalendarPlus className="w-6 h-6" />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">Book Appointment</h3>
                                        <p className="text-xs text-gray-500">Schedule with your doctor</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('patient.analyses.index')}
                                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-colors">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">Lab Results</h3>
                                        <p className="text-xs text-gray-500">View your test results</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('patient.imaging.requests.index')}
                                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-violet-300 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 flex items-center justify-center group-hover:from-violet-100 group-hover:to-violet-200 transition-colors">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-violet-500 transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">Imaging</h3>
                                        <p className="text-xs text-gray-500">Scans & Radiology</p>
                                    </div>
                                </Link>

                                <Link
                                    href="#"
                                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all duration-300 overflow-hidden cursor-pointer"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center group-hover:from-orange-100 group-hover:to-orange-200 transition-colors">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">My Profile</h3>
                                        <p className="text-xs text-gray-500">Update your information</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* 2. Digital ID Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-full flex flex-col">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 flex justify-between items-center text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                                            <ShieldCheck className="w-5 h-5 text-emerald-300" />
                                        </div>
                                        <div>
                                            <span className="font-bold tracking-wide uppercase text-sm block">Medical ID Card</span>
                                            <span className="text-emerald-300 text-xs">Active</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={downloadQrCode}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        title="Download QR Code"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* QR Content */}
                                <div className="p-6 flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-white to-blue-50/50">
                                    <div className="relative group mb-6 qr-code-container">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                        <div className="relative bg-white p-5 rounded-xl shadow-lg border-2 border-dashed border-blue-100">
                                            <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <div className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                    <Heart className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-3">
                                            <Stethoscope className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Patient</span>
                                        </div>
                                        <p className="text-xl font-bold text-gray-900 mb-1">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500 font-mono tracking-wide">{auth.user.uuid}</p>
                                    </div>

                                    {/* Medical Info */}
                                    <div className="w-full space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-600">Blood Type</span>
                                            <span className="font-bold text-gray-900">--</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-600">Allergies</span>
                                            <span className="font-bold text-gray-900">None</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 w-full">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-sm font-medium py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2">
                                            <QrCodeIcon className="w-4 h-4" />
                                            <span>Present at reception for check-in</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- UPCOMING EVENTS & HEALTH OVERVIEW --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Agenda */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <CalendarDays className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Medical Schedule</h3>
                                            <p className="text-sm text-gray-500">Your full medical timeline</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('patient.appointments.index')}
                                        className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline flex items-center gap-1"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="p-2 h-[600px]">
                                    {/* ✅ FIX: Passing ALL events (removed slicing logic) */}
                                    <PatientAgenda events={events} />
                                </div>
                            </div>
                        </div>

                        {/* Right: Health Tips & Alerts */}
                        <div className="space-y-6">
                            {/* Health Tips */}
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl border border-emerald-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <Heart className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Health Tip</h4>
                                        <p className="text-sm text-emerald-700">Stay hydrated today</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-4">
                                    Drinking enough water helps maintain your body's fluid balance and supports overall health.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-emerald-600">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Updated daily</span>
                                </div>
                            </div>

                            {/* Medication Reminder */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Pill className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Medication</h4>
                                        <p className="text-sm text-blue-700">Next dose: 8:00 PM</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                                        <span className="text-sm text-gray-700">Metformin</span>
                                        <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">500mg</span>
                                    </div>
                                    <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 py-2">
                                        View Medication Schedule
                                    </button>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl border border-amber-200 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/20 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Important</h4>
                                        <p className="text-sm text-amber-700">Fasting required for tomorrow's test</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
