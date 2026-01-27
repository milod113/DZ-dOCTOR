import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    AlertTriangle,
    X,
    Info,
    AlertCircle,
    CheckCircle,
    Loader2,
    ShieldAlert,
    Ban,
    AlertOctagon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'warning' | 'success';
    icon?: React.ReactNode; // Custom icon override
    destructive?: boolean; // For dangerous actions
    isLoading?: boolean; // Show loading state on confirm
    showCancel?: boolean; // Whether to show cancel button
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = 'danger',
    icon,
    destructive = true,
    isLoading = false,
    showCancel = true,
    onConfirm,
    onClose
}: Props) {
    const [isInternalLoading, setIsInternalLoading] = useState(false);

    // Determine colors and icons based on type
    const typeConfig = {
        danger: {
            bg: 'bg-gradient-to-r from-red-500 to-rose-600',
            icon: 'text-red-600 bg-gradient-to-br from-red-50 to-red-100 border border-red-100',
            iconComponent: <AlertTriangle className="w-6 h-6" />,
            confirmBtn: destructive
                ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 focus:ring-red-500/20'
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:ring-red-500/20',
            text: 'text-red-600'
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
            icon: 'text-amber-600 bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-100',
            iconComponent: <AlertCircle className="w-6 h-6" />,
            confirmBtn: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500/20',
            text: 'text-amber-600'
        },
        info: {
            bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            icon: 'text-blue-600 bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-100',
            iconComponent: <Info className="w-6 h-6" />,
            confirmBtn: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:ring-blue-500/20',
            text: 'text-blue-600'
        },
        success: {
            bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
            icon: 'text-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100',
            iconComponent: <CheckCircle className="w-6 h-6" />,
            confirmBtn: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500/20',
            text: 'text-emerald-600'
        },
    };

    const currentStyle = typeConfig[type];

    // Custom icon for destructive danger
    const getIcon = () => {
        if (icon) return icon;
        if (destructive && type === 'danger') {
            return <ShieldAlert className="w-6 h-6" />;
        }
        return currentStyle.iconComponent;
    };

    const handleConfirm = async () => {
        setIsInternalLoading(true);
        try {
            await onConfirm();
            if (!isLoading) {
                onClose();
            }
        } finally {
            setIsInternalLoading(false);
        }
    };

    // Reset loading state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsInternalLoading(false);
        }
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-black/80 backdrop-blur-lg" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-1 shadow-2xl transition-all">
                                {/* Top accent bar */}
                                <div className={`h-1 ${currentStyle.bg} rounded-t-2xl`} />

                                <div className="p-6 md:p-8">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${currentStyle.icon}`}>
                                                {getIcon()}
                                            </div>
                                            <div>
                                                <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 leading-tight">
                                                    {title}
                                                </Dialog.Title>
                                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">
                                                    Confirmation Required
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                                            disabled={isInternalLoading || isLoading}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Message */}
                                    <div className="mb-8">
                                        <div className="bg-white/80 rounded-xl border border-gray-200 p-5">
                                            <p className="text-gray-700 leading-relaxed">
                                                {message}
                                            </p>
                                        </div>

                                        {/* Warning note for destructive actions */}
                                        {destructive && type === 'danger' && (
                                            <div className="mt-4 flex items-start gap-3 p-4 bg-red-50/80 rounded-xl border border-red-100">
                                                <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <div className="text-sm font-medium text-red-700">This action cannot be undone</div>
                                                    <div className="text-xs text-red-600 mt-1">
                                                        This will permanently delete the data and remove all associated information.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                                        {showCancel && (
                                            <button
                                                type="button"
                                                className="inline-flex justify-center items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={onClose}
                                                disabled={isInternalLoading || isLoading}
                                            >
                                                <X className="w-4 h-4" />
                                                {cancelText}
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            disabled={isInternalLoading || isLoading}
                                            className={`inline-flex justify-center items-center gap-3 rounded-xl border border-transparent px-6 py-3.5 text-sm font-bold text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none ${currentStyle.confirmBtn}`}
                                            onClick={handleConfirm}
                                        >
                                            {(isInternalLoading || isLoading) ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {destructive && type === 'danger' ? (
                                                        <AlertOctagon className="w-4 h-4" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                    {confirmText}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Footer note */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="text-xs text-gray-500 text-center">
                                            You can press <kbd className="px-2 py-1 bg-gray-100 rounded-md font-mono">ESC</kbd> to cancel
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative dots */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 blur-sm opacity-50"></div>
                                <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-sm opacity-50"></div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
