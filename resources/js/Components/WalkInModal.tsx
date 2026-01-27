import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';
import {
  Activity,
  User,
  Phone,
  AlertCircle,
  Thermometer,
  Heart,
  Calendar,
  Clock,
  Stethoscope,
  PlusCircle,
  X,
  Check,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    slotId: number | null;
    slotTime?: string; // Optional: Time of the selected slot
}

export default function WalkInModal({ isOpen, onClose, slotId, slotTime }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        slot_id: slotId,
        guest_name: '',
        guest_phone: '',
        patient_condition: 'stable',
        notes: ''
    });

    const [selectedCondition, setSelectedCondition] = useState<'stable' | 'moyen' | 'grave'>('stable');
    const [step, setStep] = useState(1); // Multi-step form

    // Update form data when slotId changes
    useEffect(() => {
        setData('slot_id', slotId);
    }, [slotId]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.appointments.store-walk-in'), {
            onSuccess: () => {
                reset();
                setStep(1);
                onClose();
            },
        });
    };

    const conditions = [
        {
            id: 'stable',
            label: 'Stable',
            description: 'Routine consultation, non-urgent',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            hoverColor: 'hover:bg-emerald-100',
            icon: <Check className="w-5 h-5" />,
            details: ['Normal vital signs', 'No immediate risk', 'Scheduled follow-up']
        },
        {
            id: 'moyen',
            label: 'Moderate',
            description: 'Needs attention today',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            hoverColor: 'hover:bg-amber-100',
            icon: <AlertCircle className="w-5 h-5" />,
            details: ['Mild pain/discomfort', 'Chronic condition flare-up', 'Non-emergency']
        },
        {
            id: 'grave',
            label: 'Urgent',
            description: 'Immediate medical attention',
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            hoverColor: 'hover:bg-rose-100',
            icon: <AlertTriangle className="w-5 h-5" />,
            details: ['Severe pain', 'Difficulty breathing', 'High fever > 39°C']
        }
    ];

    const nextStep = () => {
        if (step === 1) {
            if (!data.guest_name.trim()) {
                alert('Please enter patient name');
                return;
            }
            setStep(2);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleConditionSelect = (condition: 'stable' | 'moyen' | 'grave') => {
        setSelectedCondition(condition);
        setData('patient_condition', condition);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-gray-900/40 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-0 text-left align-middle shadow-2xl transition-all border border-gray-100/50">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <Stethoscope className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <Dialog.Title className="text-2xl font-bold">
                                                    New Walk-in Patient
                                                </Dialog.Title>
                                                <p className="text-blue-100 text-sm mt-1">
                                                    Book an immediate appointment for present patient
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

                                    {/* Steps Indicator */}
                                    <div className="mt-6 flex items-center">
                                        {[1, 2].map((stepNum) => (
                                            <div key={stepNum} className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= stepNum ? 'bg-white text-blue-600' : 'bg-white/20 text-white'}`}>
                                                    {stepNum}
                                                </div>
                                                <div className={`text-xs font-medium ml-2 ${step >= stepNum ? 'text-white' : 'text-blue-200'}`}>
                                                    {stepNum === 1 ? 'Patient Info' : 'Medical Priority'}
                                                </div>
                                                {stepNum < 2 && (
                                                    <div className="w-12 h-0.5 bg-white/30 mx-2"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-8">
                                    {step === 1 ? (
                                        <div className="space-y-6">
                                            {/* Time Slot Info */}
                                            {slotTime && (
                                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                                <Clock className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm text-gray-600">Selected Time Slot</div>
                                                                <div className="font-bold text-blue-700">{slotTime}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-600">Duration</div>
                                                            <div className="font-bold text-gray-700">30 mins</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Name Field */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    Patient Full Name
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg placeholder-gray-400 bg-white shadow-sm"
                                                        value={data.guest_name}
                                                        onChange={(e) => setData('guest_name', e.target.value)}
                                                        placeholder="Enter patient's full name"
                                                    />
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                </div>
                                                {errors.guest_name && (
                                                    <div className="text-red-500 text-sm flex items-center gap-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {errors.guest_name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phone Field */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-500" />
                                                    Contact Number (Optional)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg placeholder-gray-400 bg-white shadow-sm"
                                                        value={data.guest_phone}
                                                        onChange={(e) => setData('guest_phone', e.target.value)}
                                                        placeholder="+212 6XX-XXX-XXX"
                                                    />
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-500">For appointment reminders only</p>
                                            </div>

                                            {/* Notes */}
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-gray-500" />
                                                    Additional Notes (Optional)
                                                </label>
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 bg-white shadow-sm min-h-[80px]"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    placeholder="Any additional information about the patient..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
                                                    <Thermometer className="w-8 h-8 text-blue-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">Medical Priority Assessment</h3>
                                                <p className="text-gray-600 mt-2">Select the patient's current condition for triage</p>
                                            </div>

                                            {/* Condition Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {conditions.map((condition) => (
                                                    <button
                                                        key={condition.id}
                                                        type="button"
                                                        onClick={() => handleConditionSelect(condition.id as any)}
                                                        className={`p-5 rounded-xl border-2 text-left transition-all duration-300 transform hover:-translate-y-1 ${
                                                            selectedCondition === condition.id
                                                                ? `${condition.bgColor} ${condition.borderColor} border-2 ring-2 ring-offset-2 ring-opacity-50 ${condition.id === 'stable' ? 'ring-emerald-200' : condition.id === 'moyen' ? 'ring-amber-200' : 'ring-rose-200'}`
                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className={`p-2 rounded-lg ${condition.bgColor}`}>
                                                                {condition.icon}
                                                            </div>
                                                            {selectedCondition === condition.id && (
                                                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                                    <Check className="w-3 h-3 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className={`font-bold text-lg ${condition.color}`}>
                                                            {condition.label}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {condition.description}
                                                        </p>
                                                        <div className="mt-3 space-y-1">
                                                            {condition.details.map((detail, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                                                                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                                    {detail}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Emergency Warning */}
                                            {selectedCondition === 'grave' && (
                                                <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl p-4 animate-pulse">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                                            <Shield className="w-5 h-5 text-rose-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-rose-700">URGENT ATTENTION REQUIRED</div>
                                                            <div className="text-sm text-rose-600">
                                                                Patient will be prioritized and seen immediately
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
                                        {step === 1 ? (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all hover:shadow"
                                                onClick={onClose}
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all hover:shadow"
                                                onClick={prevStep}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Back
                                            </button>
                                        )}

                                        <div className="flex gap-3">
                                            {step === 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                >
                                                    Continue
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-3.5 text-sm font-bold text-white hover:from-emerald-600 hover:to-green-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Booking Patient...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlusCircle className="w-4 h-4" />
                                                            Confirm Booking
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>

                                {/* Footer Info */}
                                <div className="px-8 pb-6">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span>All information is encrypted and secure</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span>Patient will appear on TV display after booking</span>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
