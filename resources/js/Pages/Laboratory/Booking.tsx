import AppLayout from '@/Layouts/AppLayout';
import PatientSelector from '@/Components/Booking/PatientSelector';
import { useForm, Head } from '@inertiajs/react';
import { FlaskConical, Upload, FileText, Send, AlertCircle } from 'lucide-react';

export default function LaboratoryBooking({ laboratory, family_members, is_home_visit }: any) {

    // On initialise le formulaire
    const { data, setData, post, processing, errors } = useForm({
        laboratory_id: laboratory.id,
        family_member_id: null as number | null,
        notes: '',
        is_home_visit: is_home_visit || false, // Pré-cocher si l'URL l'a demandé
        prescription_file: null as File | null,
    });

    const submit = (e: any) => {
        e.preventDefault();
        // Utilisation de post normal (avec gestion fichiers auto par Inertia)
        post(route('laboratory.booking.store'), {
            forceFormData: true, // Important pour l'upload de fichiers
        });
    };

    return (
        <AppLayout>
            <Head title={`Demande - ${laboratory.name || 'Laboratoire'}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* En-tête */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {data.is_home_visit ? 'Demande de prélèvement à domicile' : 'Envoyer une ordonnance'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Pour le laboratoire <span className="font-semibold text-purple-600">{laboratory.name || laboratory.user?.name}</span>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* 1. Sélecteur de Patient (Famille) */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">1</span>
                                Pour qui est cette demande ?
                            </h3>

                            {family_members.length > 0 ? (
                                <PatientSelector
                                    members={family_members}
                                    selectedId={data.family_member_id}
                                    onSelect={(id: number | null) => setData('family_member_id', id)}
                                />
                            ) : (
                                <div className="text-gray-500 italic text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    Vous effectuez cette demande pour <span className="font-bold text-gray-700 dark:text-gray-300">vous-même</span>.
                                    <br />
                                    <span className="text-xs text-gray-400">Ajoutez des proches dans votre profil pour faire des demandes pour eux.</span>
                                </div>
                            )}
                        </div>

                        {/* 2. Upload Ordonnance */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span>
                                Ordonnance
                            </h3>

                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.prescription_file ? 'border-red-300 bg-red-50' : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 bg-gray-50 dark:bg-gray-900/50'}`}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setData('prescription_file', e.target.files ? e.target.files[0] : null)}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block">
                                    <Upload className={`w-10 h-10 mx-auto mb-3 ${data.prescription_file ? 'text-green-500' : 'text-gray-400'}`} />
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white">
                                        {data.prescription_file ? (
                                            <span className="text-green-600 font-bold">{data.prescription_file.name}</span>
                                        ) : (
                                            "Cliquez pour ajouter une photo ou un PDF"
                                        )}
                                    </span>
                                    <span className="block text-xs text-gray-500 mt-1">PNG, JPG, PDF jusqu'à 5MB</span>
                                </label>
                            </div>
                            {errors.prescription_file && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {errors.prescription_file}
                                </p>
                            )}
                        </div>

                        {/* 3. Notes & Options */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</span>
                                Informations complémentaires
                            </h3>

                            <textarea
                                className="w-full rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500 shadow-sm"
                                rows={3}
                                placeholder="Instructions spéciales (ex: je suis à jeun, adresse précise pour domicile...)"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />

                            {/* Case à cocher domicile (au cas où l'utilisateur change d'avis) */}
                            {laboratory.offers_home_visit && (
                                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <input
                                        type="checkbox"
                                        id="home_visit"
                                        className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                                        checked={data.is_home_visit}
                                        onChange={(e) => setData('is_home_visit', e.target.checked)}
                                    />
                                    <label htmlFor="home_visit" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                        Je souhaite un prélèvement à domicile (+ frais déplacement)
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Bouton Envoyer */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Envoi en cours...' : 'Envoyer la demande'}
                            <Send className="w-5 h-5" />
                        </button>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
