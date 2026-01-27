import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FlaskConical, Calendar, FileText, CheckCircle,
    Clock, AlertCircle, MapPin, Download, ArrowRight
} from 'lucide-react';

export default function AnalysesIndex({ analyses }: any) {

    // Helper for Status Styles
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'completed':
                return {
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-100 dark:border-emerald-800',
                    label: 'Résultat Disponible',
                    icon: CheckCircle
                };
            case 'pending':
                return {
                    color: 'text-amber-600 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-100 dark:border-amber-800',
                    label: 'En attente',
                    icon: Clock
                };
            case 'rejected':
                return {
                    color: 'text-rose-600 dark:text-rose-400',
                    bg: 'bg-rose-50 dark:bg-rose-900/20',
                    border: 'border-rose-100 dark:border-rose-800',
                    label: 'Refusé',
                    icon: AlertCircle
                };
            default:
                return {
                    color: 'text-blue-600 dark:text-blue-400',
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-blue-100 dark:border-blue-800',
                    label: status,
                    icon: FlaskConical
                };
        }
    };

    return (
        <AppLayout>
            <Head title="Mes Analyses" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FlaskConical className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                Mes Analyses Médicales
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Historique de vos prélèvements et résultats de laboratoire.
                            </p>
                        </div>

                        <Link
                            href={route('laboratories.search')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                        >
                            <Calendar className="w-4 h-4" />
                            Nouveau RDV Labo
                        </Link>
                    </div>

                    {/* Content List */}
                    <div className="space-y-4">
                        {analyses.data.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FlaskConical className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucune analyse</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-6">
                                    Vos résultats de laboratoire apparaîtront ici une fois disponibles.
                                </p>
                            </div>
                        ) : (
                            analyses.data.map((analysis: any) => {
                                const status = getStatusStyle(analysis.status);
                                const StatusIcon = status.icon;

                                return (
                                    <div
                                        key={analysis.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                            {/* Left: Info */}
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${status.bg} ${status.color}`}>
                                                    <FlaskConical className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                            {analysis.test_type ? analysis.test_type.name : 'Analyse Générale'}
                                                        </h3>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.bg} ${status.color} ${status.border} flex items-center gap-1`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {status.label}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                {analysis.laboratory ? analysis.laboratory.name : 'Laboratoire'}
                                                            </span>
                                                        </div>
                                                        <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
                                                                day: 'numeric', month: 'long', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center gap-3">
                                                {analysis.status === 'completed' && analysis.result_path ? (
                                                    <a
                                                        href={route('patient.analyses.download', analysis.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Résultats
                                                    </a>
                                                ) : (
                                                    <div className="text-sm text-gray-400 italic flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        En cours de traitement
                                                    </div>
                                                )}

                                                {/* Details Button (Optional, if you have a detail page) */}
                                                {/* <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {analyses.links && analyses.data.length > 0 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {analyses.links.map((link: any, key: number) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={key}
                                        className="px-3 py-1 rounded-md text-sm text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
