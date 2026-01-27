import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react'; // 1. Importez 'router'
import { useState } from 'react';
import {
    Scan,
    Stethoscope,
    FlaskConical,
    CheckCircle,
    XCircle,
    FileText,
    Download,
    MapPin,
    Phone,
    Clock,
    AlertTriangle,
    ShieldCheck
} from 'lucide-react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function ImagingCenters({ centers }: any) {
    const [selectedCenter, setSelectedCenter] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    // État local pour le chargement (puisqu'on n'utilise plus useForm pour l'action)
    const [processing, setProcessing] = useState(false);

    // --- CORRECTION : UTILISATION DE ROUTER.PATCH ---
    const handleApprove = () => {
        if (!selectedCenter) return;

        if (confirm(`Êtes-vous sûr de vouloir vérifier ${selectedCenter.name} ?`)) {
            setProcessing(true);
            router.patch(route('admin.verifications.imaging.update', { imagingCenter: selectedCenter.id }), {
                status: 'verified' // Les données sont passées ici en 2ème argument
            }, {
                onSuccess: () => {
                    setSelectedCenter(null);
                    setProcessing(false);
                },
                onError: () => setProcessing(false),
                onFinish: () => setProcessing(false)
            });
        }
    };

    const handleReject = () => {
        if (!selectedCenter) return;

        setProcessing(true);
        router.patch(route('admin.verifications.imaging.update', { imagingCenter: selectedCenter.id }), {
            status: 'rejected',
            reason: rejectionReason
        }, {
            onSuccess: () => {
                setSelectedCenter(null);
                setShowRejectModal(false);
                setRejectionReason('');
                setProcessing(false);
            },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false)
        });
    };

    return (
        <AppLayout>
            <Head title="Vérification Centres Imagerie" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Page Header */}
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Centre de Vérification
                            </h2>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <Link
                                href={route('admin.verifications.index')}
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                <Stethoscope className="-ml-0.5 mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Médecins
                            </Link>
                            <Link
                                href={route('admin.verifications.labs.index')}
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                            >
                                <FlaskConical className="-ml-0.5 mr-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                Laboratoires
                            </Link>
                            <Link
                                href={route('admin.verifications.imaging.index')}
                                className="border-indigo-500 text-indigo-600 group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                                aria-current="page"
                            >
                                <Scan className="-ml-0.5 mr-2 h-5 w-5 text-indigo-500" />
                                Imagerie
                                {centers.total > 0 && (
                                    <span className="ml-3 hidden rounded-full bg-indigo-100 py-0.5 px-2.5 text-xs font-medium text-indigo-600 md:inline-block">
                                        {centers.total}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>

                    {/* Imaging Centers Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        {centers.data.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-3" />
                                <h3 className="text-lg font-medium text-gray-900">Tout est à jour !</h3>
                                <p>Aucune demande de vérification en attente.</p>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-100">
                                {centers.data.map((center: any) => (
                                    <li key={center.id} className="flex flex-col sm:flex-row justify-between gap-x-6 py-5 px-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex min-w-0 gap-x-4">
                                            <div className="h-12 w-12 flex-none rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <Scan className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {center.name}
                                                </p>
                                                <div className="mt-1 flex text-xs leading-5 text-gray-500">
                                                    <p className="truncate">Agrément : {center.license_number}</p>
                                                    <span className="mx-2">•</span>
                                                    <p>{center.city}</p>
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    Reçu le : {new Date(center.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-none items-center gap-x-4 mt-4 sm:mt-0">
                                            <button
                                                onClick={() => setSelectedCenter(center)}
                                                className="hidden rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                                            >
                                                Voir Détails
                                            </button>
                                            <div className="flex flex-col items-end min-w-[100px]">
                                                <p className="text-sm leading-6 text-gray-900 font-medium">{center.user?.name}</p>
                                                <p className="text-xs leading-5 text-gray-500">Propriétaire</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* REVIEW MODAL */}
            <Modal show={!!selectedCenter} onClose={() => setSelectedCenter(null)}>
                {selectedCenter && (
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <Scan className="w-5 h-5 text-indigo-600" />
                                Révision : {selectedCenter.name}
                            </h2>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded border border-yellow-200">
                                En attente
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Coordonnées</h3>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-900">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {selectedCenter.phone}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-900">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {selectedCenter.address}, {selectedCenter.city}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Licence</h3>
                                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-gray-400" />
                                        {selectedCenter.license_number}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Documents Justificatifs
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Vérifiez le Registre de Commerce ou l'Agrément du Ministère.
                                </p>
                                <a
                                    href={route('admin.verifications.imaging.download', selectedCenter.id)}
                                    target="_blank"
                                    className="flex items-center justify-center w-full gap-2 bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Télécharger Document
                                </a>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <SecondaryButton onClick={() => setSelectedCenter(null)}>
                                Annuler
                            </SecondaryButton>
                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                            </button>
                            <PrimaryButton
                                onClick={handleApprove}
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {processing ? 'Validation...' : 'Approuver & Vérifier'}
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </Modal>

            {/* REJECTION REASON MODAL */}
            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-red-600 flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        Rejeter la demande
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="reason" value="Motif du rejet" />
                        <TextInput
                            id="reason"
                            className="mt-1 block w-full"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Ex: Document illisible, Licence expirée..."
                        />
                        <p className="mt-1 text-sm text-gray-500">Ce motif sera visible par l'utilisateur.</p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowRejectModal(false)}>
                            Retour
                        </SecondaryButton>
                        <button
                            onClick={handleReject}
                            disabled={!rejectionReason || processing}
                            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 disabled:opacity-50 transition ease-in-out duration-150"
                        >
                            {processing ? 'En cours...' : 'Confirmer le Rejet'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}
