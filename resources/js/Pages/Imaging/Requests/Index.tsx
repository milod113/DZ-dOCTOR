import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import {
    Calendar, CheckCircle, XCircle, Clock,
    FileText, Search, Filter, X,
    User, Mail, Phone, Download,
    ChevronDown, ChevronUp, CheckSquare,
    RefreshCw, LayoutDashboard, SlidersHorizontal,
    AlertCircle, BarChart3, FileCheck, CalendarClock,
    Building, Users, Image as ImageIcon,
    TrendingUp, PieChart, ShieldAlert,
    FileX,
    Activity, Radio, Scan, MapPin, UserPlus
} from 'lucide-react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function RequestsIndex({ requests }: any) {
    // --- STATE ---
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // --- FORMS ---
    const rejectionForm = useForm({ action: 'cancel', rejection_reason: '' });
    const rescheduleForm = useForm({ action: 'reschedule', new_date: '' });

    // --- ACTIONS ---
    const handleConfirm = (id: number) => {
        router.patch(route('imaging.requests.update', id), { action: 'confirm' }, {
            preserveScroll: true,
            onSuccess: () => setExpandedRow(null)
        });
    };

    const handleComplete = (id: number) => {
        router.patch(route('imaging.requests.update', id), { action: 'complete' }, {
            preserveScroll: true
        });
    };

    const openRejectModal = (req: any) => {
        setSelectedRequest(req);
        rejectionForm.setData('rejection_reason', '');
        setRejectModalOpen(true);
    };

    const submitRejection = (e: any) => {
        e.preventDefault();
        rejectionForm.patch(route('imaging.requests.update', selectedRequest.id), {
            onSuccess: () => {
                setRejectModalOpen(false);
                setSelectedRequest(null);
                setExpandedRow(null);
                rejectionForm.reset();
            }
        });
    };

    const openRescheduleModal = (req: any) => {
        setSelectedRequest(req);
        rescheduleForm.setData('new_date', req.requested_date ? req.requested_date.substring(0, 16) : '');
        setRescheduleModalOpen(true);
    };

    const submitReschedule = (e: any) => {
        e.preventDefault();
        rescheduleForm.patch(route('imaging.requests.update', selectedRequest.id), {
            onSuccess: () => {
                setRescheduleModalOpen(false);
                setSelectedRequest(null);
                setExpandedRow(null);
                rescheduleForm.reset();
            }
        });
    };

    // --- HELPERS ---
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', icon: CheckCircle, label: 'Confirmé', dot: 'bg-emerald-500' };
            case 'pending': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', icon: Clock, label: 'En attente', dot: 'bg-amber-500' };
            case 'rejected': return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', icon: XCircle, label: 'Refusé', dot: 'bg-rose-500' };
            case 'completed': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', icon: CheckSquare, label: 'Terminé', dot: 'bg-blue-500' };
            default: return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700', icon: Clock, label: status, dot: 'bg-gray-500' };
        }
    };

    // ✅ HELPER: Extract Patient Info Safely (Prevents Crash on Null User)
    const getPatientDetails = (req: any) => {
        // 1. Check if Walk-in (No User ID)
        if (req.is_walkin) {
            return {
                name: req.guest_name || 'Patient Externe',
                email: req.guest_email || 'Non renseigné',
                phone: req.guest_phone || 'Non renseigné',
                type: 'walkin',
                icon: UserPlus,
                badgeColor: 'bg-orange-500',
                badgeText: 'Externe'
            };
        }

        // 2. Check if Registered User
        const user = req.user || {}; // Safety fallback
        const family = req.family_member;

        if (family) {
            return {
                name: family.name,
                email: user.email || '', // Email belongs to parent account
                phone: user.phone || '',
                type: 'family',
                icon: Users,
                badgeColor: 'bg-purple-500',
                badgeText: 'Famille'
            };
        }

        return {
            name: user.name || 'Utilisateur inconnu',
            email: user.email || '',
            phone: user.phone || '',
            type: 'user',
            icon: User,
            badgeColor: 'bg-indigo-500',
            badgeText: null // Standard users don't need a badge
        };
    };

    // --- FILTERING ---
    const filteredRequests = requests.data.filter((req: any) => {
        const searchLower = searchQuery.toLowerCase();

        // ✅ Fix: Use the helper to get name/email safely
        const { name, email } = getPatientDetails(req);

        const matchesSearch = searchQuery === '' ||
            name.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            (req.exam?.name || '').toLowerCase().includes(searchLower);

        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout>
            <Head title="Gestion des Rendez-vous" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-all duration-300 font-sans pb-12">

                {/* --- HEADER --- */}
                <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-b border-gray-200 dark:border-gray-700 pt-8 pb-8 relative overflow-hidden">
                    <div
                        className="absolute inset-0 dark:opacity-10 opacity-5"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }}
                    ></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg">
                                        <LayoutDashboard className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Tableau de bord Imagerie
                                    </h1>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 ml-12">
                                    Gérez les demandes d'examens et supervisez le planning.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
                                    <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total des demandes</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{requests.total}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">

                    {/* Filters Bar */}
                    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between backdrop-blur-sm">
                        <div className="relative w-full lg:w-96 group">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                    placeholder="Rechercher patient, email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status Filters */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                            {['all', 'pending', 'confirmed', 'rejected', 'completed'].map((status) => {
                                const statusStyle = getStatusStyle(status);
                                const Icon = statusStyle.icon;
                                return (
                                    <button key={status} onClick={() => setStatusFilter(status)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${statusFilter === status ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                        <Icon className="w-4 h-4" /> {status === 'all' ? 'Tout' : statusStyle.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Request List */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {filteredRequests.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <FileX className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aucune demande trouvée</h3>
                                <p className="text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900/80">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Examen</th>
                                            <th className="px-8 py-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-8 py-5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                            <th className="px-8 py-5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {filteredRequests.map((req: any) => {
                                            const statusStyle = getStatusStyle(req.status);
                                            const StatusIcon = statusStyle.icon;
                                            const appointmentDate = new Date(req.requested_date);
                                            const isToday = appointmentDate.toDateString() === new Date().toDateString();

                                            // ✅ Safe Data Access
                                            const patient = getPatientDetails(req);
                                            const PatientIcon = patient.icon;

                                            return (
                                                <Fragment key={req.id}>
                                                    <tr className={`group transition-all duration-200 cursor-pointer ${expandedRow === req.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'} ${isToday ? 'ring-1 ring-indigo-200 dark:ring-indigo-800' : ''}`} onClick={() => setExpandedRow(expandedRow === req.id ? null : req.id)}>
                                                        {/* Patient Info */}
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`relative h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${patient.badgeColor}`}>
                                                                    {patient.name.charAt(0).toUpperCase()}
                                                                    {/* Small Badge Icon */}
                                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                                                                        <PatientIcon className="w-3 h-3 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                        {patient.name}
                                                                        {/* Badge Text (Famille / Externe) */}
                                                                        {patient.badgeText && <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm">{patient.badgeText}</span>}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                                                                        <Mail className="w-3.5 h-3.5" /> {patient.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Exam */}
                                                        <td className="px-8 py-5">
                                                            <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                <ImageIcon className="w-4 h-4 text-indigo-500" /> {req.exam?.name || 'Non spécifié'}
                                                            </div>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="px-8 py-5 whitespace-nowrap">
                                                            <div className="space-y-1">
                                                                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4 text-amber-500" /> {appointmentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                                                </div>
                                                                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                                    <Clock className="w-4 h-4" /> {appointmentDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-8 py-5 text-center">
                                                            <span className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                                                                <StatusIcon className="w-4 h-4" /> {statusStyle.label}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-8 py-5 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {req.status === 'pending' && (
                                                                    <>
                                                                        <button onClick={(e) => {e.stopPropagation(); handleConfirm(req.id)}} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors shadow-sm" title="Confirmer"><CheckCircle className="w-5 h-5" /></button>
                                                                        <button onClick={(e) => {e.stopPropagation(); openRescheduleModal(req)}} className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors shadow-sm" title="Reporter"><RefreshCw className="w-5 h-5" /></button>
                                                                        <button onClick={(e) => {e.stopPropagation(); openRejectModal(req)}} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors shadow-sm" title="Refuser"><XCircle className="w-5 h-5" /></button>
                                                                    </>
                                                                )}
                                                                {req.status === 'confirmed' && (
                                                                    <button onClick={(e) => {e.stopPropagation(); handleComplete(req.id)}} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors shadow-sm">Terminer</button>
                                                                )}
                                                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">{expandedRow === req.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded Details */}
                                                    {expandedRow === req.id && (
                                                        <tr>
                                                            <td colSpan={5} className="px-0 py-0">
                                                                <div className="p-8 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
                                                                    {/* Contact View */}
                                                                    <div className="space-y-2">
                                                                        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Contact</h4>
                                                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                                                            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-indigo-500" /> {patient.name}</p>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {patient.email}</p>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {patient.phone}</p>
                                                                        </div>
                                                                    </div>
                                                                    {/* Notes View */}
                                                                    <div className="space-y-2">
                                                                        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Notes & Statut</h4>
                                                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[100px]">
                                                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{req.notes || "Aucune note."}"</p>
                                                                            {req.status === 'rejected' && <div className="mt-3 p-2 bg-rose-50 rounded border border-rose-100"><p className="text-rose-600 text-sm font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Motif du refus :</p><p className="text-rose-800 text-sm">{req.rejection_reason}</p></div>}
                                                                        </div>
                                                                    </div>
                                                                    {/* Files View */}
                                                                    <div className="space-y-2">
                                                                        <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Fichiers</h4>
                                                                        {req.prescription_path ? (
                                                                            <a href={route('imaging.requests.download', req.id)} target="_blank" className="block p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors text-center text-indigo-700 dark:text-indigo-300 font-medium">
                                                                                <FileText className="w-6 h-6 mx-auto mb-2" /> Voir Ordonnance (PDF)
                                                                            </a>
                                                                        ) : (
                                                                            <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-center text-gray-400 text-sm">Aucun fichier joint</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MODALS --- */}
                {/* Rejection Modal */}
                <Modal show={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="md">
                    <form onSubmit={submitRejection} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-rose-50 dark:bg-rose-900/20">
                            <h2 className="text-lg font-bold text-rose-800 dark:text-rose-200">Refuser la demande</h2>
                            <button type="button" onClick={() => setRejectModalOpen(false)}><X className="w-5 h-5 text-rose-400" /></button>
                        </div>
                        <div className="p-6">
                            <InputLabel value="Motif" className="mb-2" />
                            <TextInput autoFocus className="w-full" placeholder="Raison..." value={rejectionForm.data.rejection_reason} onChange={(e) => rejectionForm.setData('rejection_reason', e.target.value)} required />
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2">
                            <SecondaryButton onClick={() => setRejectModalOpen(false)}>Annuler</SecondaryButton>
                            <PrimaryButton disabled={rejectionForm.processing} className="bg-rose-600">Confirmer</PrimaryButton>
                        </div>
                    </form>
                </Modal>

                {/* Reschedule Modal */}
                <Modal show={rescheduleModalOpen} onClose={() => setRescheduleModalOpen(false)} maxWidth="md">
                    <form onSubmit={submitReschedule} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-amber-50 dark:bg-amber-900/20">
                            <h2 className="text-lg font-bold text-amber-800 dark:text-amber-200">Reporter le rendez-vous</h2>
                            <button type="button" onClick={() => setRescheduleModalOpen(false)}><X className="w-5 h-5 text-amber-400" /></button>
                        </div>
                        <div className="p-6">
                            <InputLabel value="Nouvelle Date" className="mb-2" />
                            <TextInput type="datetime-local" className="w-full" value={rescheduleForm.data.new_date} onChange={(e) => rescheduleForm.setData('new_date', e.target.value)} required />
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2">
                            <SecondaryButton onClick={() => setRescheduleModalOpen(false)}>Annuler</SecondaryButton>
                            <PrimaryButton disabled={rescheduleForm.processing} className="bg-amber-600">Valider</PrimaryButton>
                        </div>
                    </form>
                </Modal>

            </div>
        </AppLayout>
    );
}
