import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FileText, FlaskConical, Calendar, Download, Clock,
    CheckCircle, Plus, Car, MapPin
} from 'lucide-react';

export default function PrescriptionsIndex({ requests }: any) {
    return (
        <AppLayout>
            <Head title="Mes Prescriptions" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            Historique des Prescriptions
                        </h1>
                        <p className="text-gray-500 mt-1">Suivez l'état de vos demandes d'analyses.</p>
                    </div>
                    <Link
                        href={route('doctor.prescriptions.create')}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvelle Prescription
                    </Link>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
                    <ul role="list" className="divide-y divide-gray-100">
                        {requests.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-gray-900">Aucune prescription</h3>
                                <p className="mb-6">Vous n'avez pas encore envoyé de demande d'analyse.</p>
                            </div>
                        ) : (
                            requests.data.map((req: any) => (
                                <li key={req.id} className="hover:bg-gray-50 transition-colors p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                        {/* Left Info */}
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                                                req.status === 'completed'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {req.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {req.guest_name || req.patient_user?.name || 'Patient Inconnu'}
                                                    </p>

                                                    {/* --- HOME VISIT BADGE --- */}
                                                    {req.is_home_visit && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                            <Car className="w-3 h-3" /> À Domicile
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <FlaskConical className="w-3.5 h-3.5" />
                                                        {req.laboratory?.name || 'Laboratoire'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Home Visit Address Details */}
                                                {req.is_home_visit && req.home_visit_address && (
                                                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {req.home_visit_address}
                                                    </div>
                                                )}

                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {req.tests_requested?.slice(0, 3).map((test: string, idx: number) => (
                                                        <span key={idx} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                            {test}
                                                        </span>
                                                    ))}
                                                    {req.tests_requested?.length > 3 && (
                                                        <span className="text-xs text-gray-400 self-center">+{req.tests_requested.length - 3}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Action */}
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                                req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                req.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {req.status}
                                            </div>

                                            {req.status === 'completed' && req.result_file_path && (
                                                <a
                                                    href={route('doctor.prescriptions.download', req.id)}
                                                    target="_blank"
                                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Résultats
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
