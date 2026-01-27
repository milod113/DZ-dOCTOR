import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Trash2,
    User,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Clock,
    Users,
    Shield,
    Zap,
    CalendarDays,
    Lock,
    Unlock,
    Bell,
    TrendingUp,
    BarChart3,
    Download,
    Filter,
    MoreVertical,
    Edit,
    Copy,
    Eye,
    AlertCircle,
    CheckCircle,
    XCircle,
    Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function SlotIndex({ slots, filters, stats }: any) {
    const [date, setDate] = useState(filters.date);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [expandedSlots, setExpandedSlots] = useState<number[]>([]);

    // Calculate stats if not provided
    const calculatedStats = stats || {
        total: slots.length,
        available: slots.filter((s: any) => !s.is_booked).length,
        booked: slots.filter((s: any) => s.is_booked).length,
        upcoming: slots.filter((s: any) => new Date(s.start_at) > new Date()).length
    };

    // Handle Date Change
    const changeDate = (newDate: string) => {
        setDate(newDate);
        router.get(route('doctor.slots.index'), { date: newDate }, { preserveState: true });
    };

    const shiftDate = (days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        changeDate(d.toISOString().split('T')[0]);
    };

    const confirmDelete = (id: number) => {
        setSlotToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (slotToDelete) {
            router.delete(route('doctor.slots.destroy', slotToDelete), {
                preserveScroll: true,
                onSuccess: () => setSlotToDelete(null)
            });
        }
    };

    const toggleSlotExpand = (id: number) => {
        setExpandedSlots(prev =>
            prev.includes(id)
                ? prev.filter(slotId => slotId !== id)
                : [...prev, id]
        );
    };

    const getTimeOfDay = (time: string) => {
        const hour = parseInt(time.split(':')[0]);
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    };

    const getStatusColor = (slot: any) => {
        if (slot.is_booked) {
            return {
                bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
                accent: 'bg-blue-500',
                badge: 'bg-gradient-to-r from-blue-500 to-cyan-400'
            };
        }
        return {
            bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            accent: 'bg-emerald-500',
            badge: 'bg-gradient-to-r from-emerald-500 to-green-400'
        };
    };

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const filteredSlots = slots.filter((slot: any) => {
        if (selectedStatus === 'booked' && !slot.is_booked) return false;
        if (selectedStatus === 'available' && slot.is_booked) return false;
        if (timeFilter !== 'all' && getTimeOfDay(slot.start_time) !== timeFilter) return false;
        return true;
    });

    return (
        <AppLayout>
            <Head title="Schedule Management - Doctor" />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Availability Slot?"
                message="Are you sure you want to remove this slot? This action cannot be undone."
                confirmText="Yes, Delete it"
                type="danger"
            />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                                <CalendarDays className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
                                <p className="text-gray-600">View and manage your daily availability and appointments</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <Link
                            href={route('doctor.slots.generator')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Generate Slots
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Total Slots</div>
                                <div className="text-3xl font-bold text-gray-900 mt-2">{calculatedStats.total}</div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Available</div>
                                <div className="text-3xl font-bold text-emerald-600 mt-2">{calculatedStats.available}</div>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <Unlock className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Booked</div>
                                <div className="text-3xl font-bold text-blue-600 mt-2">{calculatedStats.booked}</div>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Lock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                                <div className="text-3xl font-bold text-amber-600 mt-2">{calculatedStats.upcoming}</div>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Navigation & Filters */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        {/* Date Picker */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => shiftDate(-1)}
                                className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => changeDate(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-gray-700 text-lg w-full lg:w-64"
                                />
                            </div>
                            <button
                                onClick={() => shiftDate(1)}
                                className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                <div className="text-sm font-semibold text-blue-700">{formatDateDisplay(date)}</div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 focus:outline-none"
                                >
                                    <option value="all">All Slots</option>
                                    <option value="available">Available Only</option>
                                    <option value="booked">Booked Only</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <select
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 focus:outline-none"
                                >
                                    <option value="all">All Day</option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Slots List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Time Slots</h3>
                                <p className="text-gray-600 mt-1">{filteredSlots.length} slots available for booking</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600">Booked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredSlots.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                                <Calendar className="w-12 h-12 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">No slots found</h4>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                There are no time slots available for {formatDateDisplay(date)}. Generate new slots or try a different date.
                            </p>
                            <Link
                                href={route('doctor.slots.generator')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
                            >
                                <PlusCircle className="w-5 h-5" />
                                Create Slots
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredSlots.map((slot: any) => {
                                const statusColor = getStatusColor(slot);
                                const timeOfDay = getTimeOfDay(slot.start_time);

                                return (
                                    <div
                                        key={slot.id}
                                        className={`p-6 transition-all duration-300 hover:shadow-sm ${statusColor.bg} ${statusColor.border} border-l-4`}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            {/* Time Slot */}
                                            <div className="flex items-center gap-4">
                                                <div className={`relative w-20 h-20 rounded-2xl ${slot.is_booked ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gradient-to-br from-emerald-500 to-green-400'} flex flex-col items-center justify-center text-white shadow-lg`}>
                                                    <span className="text-xl font-bold">{slot.start_time}</span>
                                                    <span className="text-xs opacity-90">to {slot.end_time}</span>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center">
                                                        {timeOfDay === 'morning' && <span className="text-xs font-bold text-amber-600">☀️</span>}
                                                        {timeOfDay === 'afternoon' && <span className="text-xs font-bold text-blue-600">⛅</span>}
                                                        {timeOfDay === 'evening' && <span className="text-xs font-bold text-purple-600">🌙</span>}
                                                    </div>
                                                </div>

                                                {/* Slot Info */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColor.badge} text-white shadow-sm`}>
                                                            {slot.is_booked ? 'BOOKED' : 'AVAILABLE'}
                                                        </span>
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {slot.clinic_name}
                                                        </span>
                                                    </div>

                                                    {slot.is_booked ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-semibold text-gray-900">{slot.patient_name}</div>
                                                                    <div className="text-xs text-gray-500">Patient appointment</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-600 flex items-center gap-2">
                                                            <Unlock className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-medium">Open for booking</span>
                                                        </div>
                                                    )}

                                                    {/* Additional Info */}
                                                    {expandedSlots.includes(slot.id) && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200/50 animate-in slide-in-from-top">
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <div className="text-gray-500 text-xs">Duration</div>
                                                                    <div className="font-medium">30 minutes</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-gray-500 text-xs">Slot Type</div>
                                                                    <div className="font-medium">Regular Consultation</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 self-start sm:self-center">
                                                {!slot.is_booked ? (
                                                    <>
                                                        <button
                                                            onClick={() => confirmDelete(slot.id)}
                                                            className="px-4 py-2.5 bg-gradient-to-r from-white to-gray-50 text-red-600 hover:text-white hover:from-red-500 hover:to-red-600 rounded-xl font-medium text-sm border border-gray-200 hover:border-red-500 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-red-100"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => toggleSlotExpand(slot.id)}
                                                            className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                     <Link
    href="#"
    className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-blue-100"
>
    <Eye className="w-4 h-4" />
    View Details
</Link>
                                                        <button
                                                            onClick={() => toggleSlotExpand(slot.id)}
                                                            className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Stats */}
                    {filteredSlots.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing {filteredSlots.length} of {slots.length} slots • Last updated: Just now
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm">
                                        <span className="font-semibold text-emerald-600">{calculatedStats.available}</span> available
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold text-blue-600">{calculatedStats.booked}</span> booked
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideInFromTop {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-in {
                    animation: slideInFromTop 0.2s ease-out;
                }
            `}</style>
        </AppLayout>
    );
}
