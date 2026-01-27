import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    Mail,
    Plus // <--- Added Icon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import WalkInModal from '@/Components/WalkInModal'; // <--- 1. Import Modal

// Add 'slots' to props
export default function AppointmentIndex({ appointments, filters, slots = [] }: any) {

    // --- EXISTING STATE ---
    const [search, setSearch] = useState(filters.search || '');
    const [date, setDate] = useState(filters.date || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [debouncedSearch] = useDebounce(search, 500);

    // --- NEW STATE FOR WALK-IN ---
    const [isWalkInOpen, setIsWalkInOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

    // --- NEW HELPER ---
    const openBookingModal = (slotId: number) => {
        setSelectedSlotId(slotId);
        setIsWalkInOpen(true);
    };

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

    const updateStatus = (id: number, status: string) => {
        if (!confirm(`Mark this appointment as ${status}?`)) return;
        router.patch(route('doctor.appointments.update-status', id), { status }, { preserveScroll: true });
    };

    const statusColors: any = {
        confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
        completed: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-red-50 text-red-700 border-red-200',
        no_show: 'bg-orange-50 text-orange-700 border-orange-200',
    };

    const tabs = [
        { id: 'all', label: 'All Appointments' },
        { id: 'confirmed', label: 'Upcoming' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <AppLayout>
            <Head title="Patient Appointments" />

            {/* --- 2. ADD MODAL COMPONENT --- */}
            <WalkInModal
                isOpen={isWalkInOpen}
                onClose={() => setIsWalkInOpen(false)}
                slotId={selectedSlotId}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your patient schedule and status.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                            Total: {appointments.total}
                        </span>
                    </div>
                </div>

                {/* Filters & Search Bar ... (No Changes Here) ... */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search patient name or email..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-auto">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="date"
                                    className="w-full md:w-48 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 text-sm text-gray-600"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            {(search || date || statusFilter !== 'all') && (
                                <button
                                    onClick={() => { setSearch(''); setDate(''); setStatusFilter('all'); }}
                                    className="text-gray-500 hover:text-red-600 text-sm font-medium whitespace-nowrap px-2 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex overflow-x-auto pb-1 md:pb-0 gap-2 border-b border-gray-100 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`pb-3 px-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${statusFilter === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 w-40">Time & Date</th>
                                    <th className="px-6 py-4">Patient Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">

                                {/* 3. SECTION: AVAILABLE SLOTS (For Walk-ins) */}
                                {slots.length > 0 && slots.map((slot: any) => (
                                    <tr key={`slot-${slot.id}`} className="bg-blue-50/30 border-b border-blue-100/50 border-dashed hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col text-blue-800/70">
                                                <span className="font-bold text-base">
                                                    {new Date(slot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-xs uppercase font-semibold">
                                                    {new Date(slot.start_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 italic">
                                            Available Slot
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                                Open
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">-</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openBookingModal(slot.id)}
                                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all transform active:scale-95"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Book Walk-in
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* 4. EXISTING APPOINTMENTS */}
                                {appointments.data.length === 0 && slots.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                    <Calendar className="h-8 w-8 text-gray-300" />
                                                </div>
                                                <p className="text-gray-900 font-medium">No appointments or slots found</p>
                                                <p className="text-sm">Try adjusting your filters or search terms.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.data.map((appt: any) => (
                                        <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors group">
                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-base">
                                                        {new Date(appt.slot.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-gray-500 text-xs uppercase tracking-wide font-semibold mt-0.5">
                                                        {new Date(appt.slot.start_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Patient */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Handle Walk-ins (No User Object) vs Online (User Object) */}
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${appt.type === 'walk_in' ? 'bg-purple-100 text-purple-700' : 'bg-gradient-to-br from-blue-100 to-teal-100 text-blue-700'}`}>
                                                        {appt.patient_name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {appt.patient_name}
                                                            {appt.type === 'walk_in' && <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">WALK-IN</span>}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {appt.patient_contact}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[appt.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${appt.status === 'confirmed' ? 'bg-blue-500' : appt.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1).replace('_', ' ')}
                                                </span>
                                            </td>

                                            {/* Reason */}
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600 truncate max-w-[200px]" title={appt.reason}>
                                                    {appt.reason || <span className="text-gray-400 italic">No reason provided</span>}
                                                </p>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                {appt.status === 'confirmed' ? (
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => updateStatus(appt.id, 'completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Mark Completed">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => updateStatus(appt.id, 'no_show')} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-200" title="Mark No Show">
                                                            <AlertCircle className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => updateStatus(appt.id, 'cancelled')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Cancel Appointment">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs font-medium px-2">Archived</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination (No Changes) */}
                    {appointments.links && appointments.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                            {/* ... existing pagination code ... */}
                             <div className="hidden sm:block text-sm text-gray-500">
                                Showing <span className="font-medium">{appointments.from}</span> to <span className="font-medium">{appointments.to}</span> of <span className="font-medium">{appointments.total}</span> results
                            </div>
                            <div className="flex gap-1">
                                {appointments.links.map((link: any, i: number) => {
                                    const label = link.label.includes('Previous') ? <ChevronLeft className="w-4 h-4" /> :
                                                  link.label.includes('Next') ? <ChevronRight className="w-4 h-4" /> : link.label;

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`
                                                relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                                ${link.active
                                                    ? 'z-10 bg-blue-600 text-white shadow-sm'
                                                    : link.url
                                                        ? 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                                            `}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
