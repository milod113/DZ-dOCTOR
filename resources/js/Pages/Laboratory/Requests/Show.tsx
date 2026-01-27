import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    FileText, Upload, CheckCircle, Clock, User,
    Stethoscope, AlertCircle, Calendar, Phone,
    Activity, Droplets, Thermometer, AlertTriangle,
    Printer, Car, MapPin // <--- Added Car and MapPin
} from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function RequestShow({ analysisRequest }: any) {
    const { data, setData, post, processing, errors } = useForm({
        result_file: null as File | null,
        comment: '',
    });

    const submitResult = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('laboratory.requests.upload-result', analysisRequest.id));
    };

    // Helper for badges
    const getPriorityBadge = (priority: string) => {
        switch(priority) {
            case 'high': return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High Priority</span>;
            case 'low': return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Low Priority</span>;
            default: return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">Normal Priority</span>;
        }
    };

    const getUrgencyBadge = (urgency: string) => {
        if (urgency === 'emergency') return <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">EMERGENCY</span>;
        if (urgency === 'urgent') return <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">Urgent (4h)</span>;
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Routine</span>;
    };

    return (
        <AppLayout>
            <Head title={`Demande #${analysisRequest.id}`} />

            <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Card */}
                <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {analysisRequest.guest_name || analysisRequest.patient_user?.name}
                                </h1>
                                {getPriorityBadge(analysisRequest.priority || 'normal')}
                                {getUrgencyBadge(analysisRequest.urgency_level || 'routine')}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {analysisRequest.patient_user ? `Patient ID: #${analysisRequest.patient_user.id}` : 'Patient Invité'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(analysisRequest.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                <Printer className="w-4 h-4" /> Imprimer Étiquette
                            </button>
                            <div className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide ${
                                analysisRequest.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {analysisRequest.status}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: Clinical Info */}
                    <div className="md:col-span-2 space-y-6">

                        {/* --- NEW: HOME VISIT ALERT --- */}
                        {analysisRequest.is_home_visit && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-blue-900 text-lg">Prélèvement à Domicile Requis</h3>
                                    <p className="text-blue-700 mt-1 mb-2">
                                        Ce patient a demandé un déplacement à domicile pour le prélèvement.
                                    </p>
                                    <div className="flex items-center gap-2 text-blue-800 bg-blue-100/50 px-3 py-2 rounded-lg border border-blue-200">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="font-medium text-sm">
                                            {analysisRequest.home_visit_address || analysisRequest.patient_user?.address || 'Adresse non spécifiée'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sample & Conditions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
                                    <Droplets className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Type d'échantillon</p>
                                    <p className="text-lg font-semibold text-gray-900 capitalize">{analysisRequest.sample_type || 'Sang'}</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                                analysisRequest.fasting_required
                                ? 'bg-orange-50 border-orange-100'
                                : 'bg-gray-50 border-gray-100'
                            }`}>
                                <div className={`p-2 rounded-full shadow-sm ${analysisRequest.fasting_required ? 'bg-white text-orange-600' : 'bg-white text-gray-400'}`}>
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-xs uppercase font-bold ${analysisRequest.fasting_required ? 'text-orange-600' : 'text-gray-500'}`}>Condition</p>
                                    <p className={`text-lg font-semibold ${analysisRequest.fasting_required ? 'text-orange-900' : 'text-gray-700'}`}>
                                        {analysisRequest.fasting_required ? 'À JEUN REQUIS' : 'Pas de restriction'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Analysis List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                Analyses Demandées
                            </h3>
                            <div className="space-y-2">
                                {analysisRequest.tests_requested?.map((test: string, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                        <span className="font-medium text-gray-700">{test}</span>
                                        <input type="checkbox" className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 border-gray-300" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctor Notes & Instructions */}
                        {(analysisRequest.doctor_notes || analysisRequest.instructions) && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                {analysisRequest.instructions && (
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                        <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-1">
                                            <AlertTriangle className="w-4 h-4" /> Instructions Spéciales
                                        </h4>
                                        <p className="text-sm text-amber-900">{analysisRequest.instructions}</p>
                                    </div>
                                )}
                                {analysisRequest.doctor_notes && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4" /> Note du Médecin
                                        </h4>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                            "{analysisRequest.doctor_notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Actions */}
                    <div className="space-y-6">

                        {/* Prescribing Doctor Card */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Prescripteur</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                    Dr
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Dr. {analysisRequest.doctor_profile?.user?.name}</p>
                                    <p className="text-xs text-gray-500">{analysisRequest.doctor_profile?.specialty || 'Médecin Généraliste'}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                <button className="flex-1 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center gap-2 border border-gray-200 transition-colors">
                                    <Phone className="w-3 h-3" /> Appeler
                                </button>
                            </div>
                        </div>

                        {/* Result Upload Section */}
                        {analysisRequest.status === 'completed' ? (
                            <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                <h3 className="font-bold text-green-800">Résultats Envoyés</h3>
                                <p className="text-sm text-green-600 mt-1 mb-4">Le patient a été notifié.</p>
                                <button
                                    onClick={() => alert("Fonctionnalité de modification à venir")}
                                    className="text-xs text-green-700 hover:underline font-medium"
                                >
                                    Modifier le fichier
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-purple-600" />
                                    Envoyer les Résultats
                                </h3>
                                <form onSubmit={submitResult} className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".pdf,.jpg,.png"
                                            onChange={e => setData('result_file', e.target.files ? e.target.files[0] : null)}
                                        />
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2 transition-colors" />
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                                            {data.result_file ? data.result_file.name : "Cliquez pour upload le PDF"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG (Max 5MB)</p>
                                    </div>
                                    {errors.result_file && <p className="text-red-500 text-xs">{errors.result_file}</p>}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire (Optionnel)</label>
                                        <textarea
                                            className="w-full text-sm border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                            rows={2}
                                            placeholder="Ex: Hémolyse légère..."
                                            value={data.comment}
                                            onChange={e => setData('comment', e.target.value)}
                                        />
                                    </div>

                                    <PrimaryButton className="w-full justify-center py-3 bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg transition-all" disabled={processing || !data.result_file}>
                                        {processing ? 'Envoi...' : 'Valider & Envoyer'}
                                    </PrimaryButton>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
