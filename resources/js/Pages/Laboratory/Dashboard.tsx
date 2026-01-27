import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FlaskConical,
    Clock,
    CheckCircle,
    Activity,
    ArrowRight,
    User,
    Calendar
} from 'lucide-react';

export default function LaboratoryDashboard({ stats, recentRequests }: any) {
    return (
        <AppLayout>
            <Head title="Tableau de bord Laboratoire" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bonjour, {activeUser().name}
                    </h1>
                    <p className="text-gray-500">Voici l'activité de votre laboratoire pour aujourd'hui.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="En Attente"
                        value={stats.pending}
                        icon={Clock}
                        color="bg-yellow-100 text-yellow-600"
                    />
                    <StatCard
                        title="En Cours"
                        value={stats.processing}
                        icon={FlaskConical}
                        color="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        title="Terminés (Auj.)"
                        value={stats.completed_today}
                        icon={CheckCircle}
                        color="bg-green-100 text-green-600"
                    />
                    <StatCard
                        title="Total Reçu"
                        value={stats.total_requests}
                        icon={Activity}
                        color="bg-purple-100 text-purple-600"
                    />
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Demandes Récentes</h2>
                        <Link
                            href={route('laboratory.requests.index')}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                        >
                            Voir tout <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Médecin Prescripteur</th>
                                    <th className="px-6 py-3">Analyses</th>
                                    <th className="px-6 py-3">Statut</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Aucune activité récente.
                                        </td>
                                    </tr>
                                ) : (
                                    recentRequests.map((req: any) => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {req.guest_name || req.patient_user?.name || 'Anonyme'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                                <User className="w-3 h-3" /> Dr. {req.doctor_profile?.user?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {req.tests_requested.slice(0, 2).map((t: string, i: number) => (
                                                        <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {req.tests_requested.length > 2 && (
                                                        <span className="text-xs text-gray-400">+{req.tests_requested.length - 2}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={req.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={route('laboratory.requests.show', req.id)}
                                                    className="text-purple-600 hover:text-purple-900 font-medium"
                                                >
                                                    Gérer
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
}

function activeUser() {
    // Simple helper to mock accessing auth user if not passed directly props
    // In real app usePage().props.auth.user
    return { name: 'Laboratoire' };
}
