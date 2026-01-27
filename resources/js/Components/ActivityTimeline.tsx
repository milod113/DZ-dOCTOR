import { History, User, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ActivityTimeline({ logs }: { logs: any[] }) {
    if (!logs || logs.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" />
                Historique d'activité
            </h3>

            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                {logs.map((log: any) => (
                    <div key={log.id} className="relative">
                        {/* Dot on timeline */}
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                            log.action === 'confirmed' ? 'bg-green-500' :
                            log.action === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                                {log.action === 'confirmed' && 'Rendez-vous confirmé'}
                                {log.action === 'cancelled' && 'Rendez-vous annulé'}
                                {log.action === 'completed' && 'Consultation terminée'}
                            </span>

                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {log.user.name}
                                    {/* Show role based on snapshot if available, or just generic */}
                                    <span className="text-gray-400">
                                        ({log.user.id === log.doctor_id_snapshot ? 'Médecin' : 'Secrétaire'})
                                    </span>
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
