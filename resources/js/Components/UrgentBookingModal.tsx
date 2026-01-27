import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import {
  Siren,
  X,
  Clock,
  User,
  FileText,
  Calendar as CalendarIcon,
  Activity,
  AlertTriangle,
  Shield,
  Heart,
  Thermometer,
  Stethoscope,
  Zap,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Ambulance,
  Bell
} from 'lucide-react';

export default function UrgentBookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
    const [selectedCondition, setSelectedCondition] = useState<'stable' | 'moyen' | 'grave'>('grave');

    const { data, setData, post, processing, reset, errors } = useForm({
        date: todayStr,
        time: currentTime,
        duration: 15,
        patient_name: '',
        reason: '',
        patient_condition: 'grave',
        vital_signs: '',
        triage_notes: ''
    });

    useEffect(() => {
        setData('patient_condition', selectedCondition);
    }, [selectedCondition]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.appointments.store-urgent'), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    const conditions = [
        {
            id: 'stable',
            label: 'Stable',
            description: 'Non-urgent',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            hoverColor: 'hover:bg-emerald-100',
            icon: <CheckCircle2 className="w-5 h-5" />,
            urgency: 'Low'
        },
        {
            id: 'moyen',
            label: 'Moderate',
            description: 'Needs attention',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            hoverColor: 'hover:bg-amber-100',
            icon: <AlertCircle className="w-5 h-5" />,
            urgency: 'Medium'
        },
        {
            id: 'grave',
            label: 'Critical',
            description: 'Emergency',
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            hoverColor: 'hover:bg-rose-100',
            icon: <Siren className="w-5 h-5" />,
            urgency: 'High'
        }
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gradient-to-br from-rose-900/20 via-red-900/10 to-orange-900/10 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-0 text-left align-middle shadow-2xl transition-all border border-gray-100/50">
                                {/* Header with Emergency Banner */}
                                <div className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                                <Siren className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <Dialog.Title className="text-2xl font-bold">
                                                    Emergency Patient Booking
                                                </Dialog.Title>
                                                <p className="text-rose-100 text-sm mt-1">
                                                    Immediate medical attention required
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Emergency Alert */}
                                    <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
                                            <div className="text-sm font-medium">
                                                <span className="font-bold">PRIORITY:</span> This booking will override existing schedule
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-6 space-y-6">
                                    {/* Patient Information */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4 text-gray-500" />
                                            Patient Information
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-lg placeholder-gray-400 bg-white shadow-sm"
                                                placeholder="Enter patient's full name"
                                                value={data.patient_name}
                                                onChange={e => setData('patient_name', e.target.value)}
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                        {errors.patient_name && (
                                            <p className="text-rose-500 text-sm mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.patient_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                                Date
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-lg text-gray-600 bg-white shadow-sm"
                                                    value={data.date}
                                                    onChange={e => setData('date', e.target.value)}
                                                />
                                                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                Time
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all text-lg text-gray-600 bg-white shadow-sm"
                                                    value={data.time}
                                                    onChange={e => setData('time', e.target.value)}
                                                />
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Triage Condition */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-gray-500" />
                                                Triage Assessment
                                            </label>
                                            <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-rose-700 rounded-full">
                                                SELECT PRIORITY LEVEL
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {conditions.map((condition) => (
                                                <button
                                                    key={condition.id}
                                                    type="button"
                                                    onClick={() => setSelectedCondition(condition.id as any)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                                                        selectedCondition === condition.id
                                                            ? `${condition.bgColor} ${condition.borderColor} border-2 ring-2 ring-offset-2 ${condition.id === 'grave' ? 'ring-rose-200' : condition.id === 'moyen' ? 'ring-amber-200' : 'ring-emerald-200'}`
                                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`p-2 rounded-lg ${condition.bgColor}`}>
                                                            {condition.icon}
                                                        </div>
                                                        {selectedCondition === condition.id && (
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className={`font-bold text-lg ${condition.color}`}>
                                                        {condition.label}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {condition.description}
                                                    </p>
                                                    <div className="mt-3">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                                            condition.id === 'grave' ? 'bg-rose-100 text-rose-700' :
                                                            condition.id === 'moyen' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {condition.urgency} URGENCY
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Critical Warning */}
                                        {selectedCondition === 'grave' && (
                                            <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl p-4 animate-pulse-slow">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                                        <Ambulance className="w-5 h-5 text-rose-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-rose-700">CRITICAL ALERT</div>
                                                        <div className="text-sm text-rose-600">
                                                            Patient requires immediate medical attention. TV alert will be triggered.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                Reason for Visit
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all placeholder-gray-400 bg-white shadow-sm min-h-[80px]"
                                                    placeholder="Brief description of symptoms or reason for emergency..."
                                                    value={data.reason}
                                                    onChange={e => setData('reason', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Thermometer className="w-4 h-4 text-gray-500" />
                                                Vital Signs (Optional)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all placeholder-gray-400 bg-white shadow-sm"
                                                    placeholder="BP, HR, Temp, etc."
                                                    value={data.vital_signs}
                                                    onChange={e => setData('vital_signs', e.target.value)}
                                                />
                                                <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center justify-center gap-3 flex-1 px-6 py-3.5 bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-rose-200 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Processing Emergency...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-5 h-5" />
                                                        CONFIRM EMERGENCY BOOKING
                                                        <ChevronRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Footer Info */}
                                <div className="px-6 pb-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-blue-700 text-sm">Emergency Protocol Activated</div>
                                                <div className="text-xs text-blue-600 mt-1">
                                                    • Patient will appear on TV display immediately<br />
                                                    • SMS alert sent to emergency contacts<br />
                                                    • Medical team will be notified
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Animation */}
                                <style jsx>{`
                                    @keyframes pulse-slow {
                                        0%, 100% { opacity: 1; }
                                        50% { opacity: 0.8; }
                                    }
                                    .animate-pulse-slow {
                                        animation: pulse-slow 2s infinite;
                                    }
                                `}</style>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
