import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    UserPlus,
    Trash2,
    Shield,
    UserCheck,
    AlertCircle,
    Users,
    Mail,
    Phone,
    Calendar,
    Zap,
    Star,
    TrendingUp,
    MoreVertical,
    Key,
    Clock,
    CheckCircle,
    XCircle,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';

export default function TeamIndex({ secretaries }: any) {
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [secretaryToRemove, setSecretaryToRemove] = useState<any>(null);
    const [expandedMember, setExpandedMember] = useState<number | null>(null);

    const confirmRemove = (secretary: any) => {
        setSecretaryToRemove(secretary);
        setIsRemoveModalOpen(true);
    };

    const executeRemove = () => {
        if (!secretaryToRemove) return;
        router.delete(route('doctor.team.remove', secretaryToRemove.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsRemoveModalOpen(false);
                setSecretaryToRemove(null);
            }
        });
    };

    const toggleExpand = (id: number) => {
        setExpandedMember(prev => prev === id ? null : id);
    };

    // Stats calculation
    const stats = {
        total: secretaries.length,
        active: secretaries.filter((s: any) => s.is_active).length,
        recent: secretaries.filter((s: any) => {
            const created = new Date(s.created_at);
            const now = new Date();
            const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
            return diffDays < 30;
        }).length
    };

    return (
        <AppLayout>
            <Head title="Gestion de l'équipe" />

            <ConfirmationModal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={executeRemove}
                title="Retirer ce secrétaire ?"
                message={`Êtes-vous sûr de vouloir retirer ${secretaryToRemove?.name} ? Il n'aura plus accès à votre planning ni aux fonctionnalités de gestion.`}
                confirmText="Oui, retirer"
                type="danger"
                icon={XCircle}
            />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header with Stats */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Mon Équipe</h1>
                                <p className="text-gray-600">Gérez les accès et permissions de vos secrétaires</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={route('doctor.secretary.create')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 shadow-sm"
                    >
                        <UserPlus className="w-5 h-5" />
                        Ajouter un Secrétaire
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Membres Totaux</div>
                                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Actifs</div>
                                <div className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                                <UserCheck className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Ajoutés Récemment</div>
                                <div className="text-3xl font-bold text-amber-600 mt-2">{stats.recent}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Secrétaires</h3>
                                <p className="text-gray-600 mt-1">Gérez les accès à votre planning et aux fonctionnalités</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-sm text-gray-600">Actif</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600">Accès limité</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    {secretaries.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
                                <Users className="w-12 h-12 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Aucun secrétaire</h4>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Vous n'avez pas encore ajouté de secrétaire. Ajoutez-en un pour vous aider à gérer votre planning.
                            </p>
                            <Link
                                href={route('doctor.secretary.create')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all"
                            >
                                <UserPlus className="w-5 h-5" />
                                Ajouter un Secrétaire
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {secretaries.map((sec: any) => {
                                const isExpanded = expandedMember === sec.id;
                                const isActive = sec.is_active !== false;

                                return (
                                    <div
                                        key={sec.id}
                                        className={`p-6 transition-all duration-300 hover:shadow-sm ${isActive ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            {/* Profile & Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                                        {sec.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {isActive && (
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                                            <CheckCircle className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-xl font-bold text-gray-900">{sec.name}</h4>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'} text-white shadow-sm`}>
                                                            {isActive ? 'ACTIF' : 'EN ATTENTE'}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1.5">
                                                            <Mail className="w-4 h-4" />
                                                            <span>{sec.email}</span>
                                                        </div>
                                                        {sec.phone && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{sec.phone}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Ajouté le {new Date(sec.created_at).toLocaleDateString('fr-FR')}</span>
                                                        </div>
                                                    </div>

                                                    {/* Expanded Details */}
                                                    {isExpanded && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200/50 animate-in slide-in-from-top">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                                <div className="space-y-2">
                                                                    <div className="text-gray-500 text-xs">Permissions</div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                                                                            Gestion planning
                                                                        </span>
                                                                        <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                                                                            Voir patients
                                                                        </span>
                                                                        <span className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                                                                            Prise de RDV
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-gray-500 text-xs">Statistiques</div>
                                                                    <div className="font-medium flex items-center gap-2 mt-1">
                                                                        <Star className="w-4 h-4 text-amber-500" />
                                                                        <span>98% disponibilité</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 self-start sm:self-center">
                                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg border border-indigo-100">
                                                    <Shield className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Secrétaire</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => confirmRemove(sec)}
                                                        className="px-4 py-2.5 bg-gradient-to-r from-white to-gray-50 text-red-600 hover:text-white hover:from-red-500 hover:to-red-600 rounded-xl font-medium text-sm border border-gray-200 hover:border-red-500 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-red-100"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Retirer
                                                    </button>
                                                    <button
                                                        onClick={() => toggleExpand(sec.id)}
                                                        className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Stats */}
                    {secretaries.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white/50">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    {secretaries.length} secrétaire{secretaries.length > 1 ? 's' : ''} • Dernière mise à jour: Aujourd'hui
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="font-semibold text-emerald-600">{stats.active}</span> actifs
                                    </div>
                                    <div className="text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="font-semibold text-blue-600">{secretaries.length - stats.active}</span> en attente
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">Conseil d'équipe</h4>
                            <p className="text-gray-700 text-sm">
                                Vos secrétaires peuvent gérer votre planning, prendre des rendez-vous et voir les informations patients.
                                Vous pouvez à tout moment ajuster leurs permissions depuis les paramètres avancés.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animation */}
            <style jsx>{`
                @keyframes slideInFromTop {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-in {
                    animation: slideInFromTop 0.2s ease-out;
                }
            `}</style>
        </AppLayout>
    );
}
