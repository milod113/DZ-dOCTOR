import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Check, X } from 'lucide-react';

export default function VerificationIndex({ doctors }: any) {

    const updateStatus = (id: number, status: string) => {
        if(!confirm(`Are you sure you want to ${status} this doctor?`)) return;

        router.patch(route('admin.verifications.update', id), { status });
    };

    return (
        <AppLayout>
            <Head title="Pending Verifications" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6">Doctor Verifications</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Doctor</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Document</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {doctors.data.length === 0 ? (
                                <tr><td colSpan={4} className="p-6 text-center text-gray-500">No pending verifications.</td></tr>
                            ) : doctors.data.map((doc: any) => (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{doc.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{doc.email}</td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={route('admin.verifications.download', doc.id)}
                                            target="_blank"
                                            className="flex items-center gap-2 text-blue-600 hover:underline"
                                        >
                                            <FileText className="w-4 h-4" />
                                            View License
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => updateStatus(doc.id, 'approved')}
                                            className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 transition"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(doc.id, 'rejected')}
                                            className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
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
