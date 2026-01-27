import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Upload, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function VerificationShow({ status, rejection_reason, lab_name }: any) {
    const { data, setData, post, processing, errors } = useForm({
        document: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('laboratory.verification.store'));
    };

    return (
        <AppLayout>
            <Head title="Laboratory Verification" />

            <div className="py-12 max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* Header Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full ${
                            status === 'verified' ? 'bg-green-100 text-green-600' :
                            status === 'rejected' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {status === 'verified' ? <CheckCircle className="w-12 h-12" /> :
                             status === 'rejected' ? <AlertTriangle className="w-12 h-12" /> :
                             <Clock className="w-12 h-12" />}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                        {lab_name}
                    </h1>
                    <p className="text-center text-gray-500 mb-8 capitalize">
                        Status: <span className="font-bold">{status}</span>
                    </p>

                    {/* 1. VERIFIED STATE */}
                    {status === 'verified' && (
                        <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                            <h3 className="text-lg font-bold text-green-800">Compte Vérifié</h3>
                            <p className="text-green-700 mt-2">
                                Votre laboratoire est approuvé. Vous avez accès à toutes les fonctionnalités.
                            </p>
                            <a href={route('laboratory.dashboard')} className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
                                Aller au Dashboard
                            </a>
                        </div>
                    )}

                    {/* 2. PENDING STATE */}
                    {status === 'pending' && (
                        <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                            <h3 className="text-lg font-bold text-blue-800">En attente d'approbation</h3>
                            <p className="text-blue-700 mt-2">
                                Nos administrateurs examinent vos documents (Agrément / Registre de Commerce).<br/>
                                Cela prend généralement 24h à 48h.
                            </p>
                        </div>
                    )}

                    {/* 3. REJECTED OR UNSUBMITTED STATE */}
                    {(status === 'unsubmitted' || status === 'rejected') && (
                        <form onSubmit={submit} className="space-y-6">
                            {status === 'rejected' && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                                    <p className="font-bold text-red-700">Documents Rejetés</p>
                                    <p className="text-red-600 text-sm mt-1">{rejection_reason}</p>
                                </div>
                            )}

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Télécharger votre Agrément ou Registre de Commerce
                                </label>
                                <p className="text-xs text-gray-500 mb-4">Format PDF, JPG ou PNG (Max 5MB)</p>

                                <input
                                    type="file"
                                    onChange={e => setData('document', e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-blue-50 file:text-blue-700
                                      hover:file:bg-blue-100"
                                />
                                {errors.document && <div className="text-red-500 text-sm mt-2">{errors.document}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2"
                            >
                                <Upload className="w-5 h-5" />
                                Soumettre pour Vérification
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
