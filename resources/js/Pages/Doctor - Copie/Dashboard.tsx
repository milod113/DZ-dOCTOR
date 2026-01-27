import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, Calendar, Clock, DollarSign } from 'lucide-react';

export default function Dashboard({ stats, recent_appointments }: any) {
    return (
        <AppLayout>
            <Head title="Doctor Dashboard" />

            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.today}</div>
                            <div className="text-sm text-gray-500">Appointments Today</div>
                        </div>
                    </div>
                    {/* Add more cards for upcoming, revenue, etc. */}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-6 text-white">
                        <h3 className="font-bold text-lg mb-2">Manage Schedule</h3>
                        <p className="text-blue-100 mb-4 text-sm">Update your weekly availability slots.</p>
                        <Link href={route('doctor.schedule.edit')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                            Edit Schedule
                        </Link>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="font-bold text-lg mb-2 text-gray-900">Staff Management</h3>
                        <p className="text-gray-500 mb-4 text-sm">Create accounts for your secretaries.</p>
                        <Link href={route('doctor.secretary.create')} className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm">
                            Add Secretary
                        </Link>
                    </div>
                </div>

                {/* Recent Appointments Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 font-bold">Recent Appointments</div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Patient</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_appointments.map((appt: any) => (
                                <tr key={appt.id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{appt.patient_user?.name}</td>
                                    <td className="px-6 py-4">{new Date(appt.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                            {appt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
