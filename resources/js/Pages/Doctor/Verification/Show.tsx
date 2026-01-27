import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Upload,
    Shield,
    Clock,
    AlertCircle,
    FileCheck,
    BadgeCheck,
    Lock,
    Unlock,
    Sparkles,
    ArrowRight, Users
} from 'lucide-react';
import { useState } from 'react';

export default function VerificationShow({ status }: { status: string }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        document: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.verification.store'));
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
            setData('document', file);
        }
    };

    // Status configurations
    const statusConfig = {
        approved: {
            title: 'Account Verified',
            description: 'Your account has been successfully verified. You now have full access to all platform features.',
            icon: BadgeCheck,
            gradient: 'from-emerald-500 to-green-400',
            bgGradient: 'from-emerald-50/80 to-green-50/80',
            border: 'border-emerald-200',
            buttonGradient: 'from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600',
            badgeText: 'VERIFIED',
            features: [
                { text: 'Full dashboard access', icon: CheckCircle },
                { text: 'Patient booking enabled', icon: Users },
                { text: 'Premium features unlocked', icon: Sparkles }
            ]
        },
        pending: {
            title: 'Under Review',
            description: 'Our verification team is reviewing your documents. This process typically takes 24-48 hours.',
            icon: Clock,
            gradient: 'from-amber-500 to-orange-400',
            bgGradient: 'from-amber-50/80 to-orange-50/80',
            border: 'border-amber-200',
            badgeText: 'PENDING REVIEW',
            progress: 'Estimated completion: 24 hours'
        },
        rejected: {
            title: 'Verification Required',
            description: 'Please upload a valid document for verification to unlock full platform access.',
            icon: AlertCircle,
            gradient: 'from-rose-500 to-pink-400',
            bgGradient: 'from-rose-50/80 to-pink-50/80',
            border: 'border-rose-200',
            buttonGradient: 'from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600',
            badgeText: 'ACTION REQUIRED',
            requirements: [
                'Clear, legible document',
                'Valid medical license or ID',
                'PDF, JPG, or PNG format',
                'Maximum file size: 5MB'
            ]
        },
        unverified: {
            title: 'Get Verified',
            description: 'Complete your verification to start accepting patients and access premium features.',
            icon: Shield,
            gradient: 'from-blue-500 to-cyan-400',
            bgGradient: 'from-blue-50/80 to-cyan-50/80',
            border: 'border-blue-200',
            buttonGradient: 'from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600',
            badgeText: 'VERIFICATION REQUIRED',
            benefits: [
                'Accept patient appointments',
                'Build your professional profile',
                'Access analytics dashboard',
                'Receive patient reviews'
            ]
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
        <AppLayout>
            <Head title="Account Verification" />

            <div className="min-h-[80vh] flex items-center justify-center p-4 py-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-4 shadow-sm">
                            <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg`}>
                                <IconComponent className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Verification</h1>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Secure your professional identity and unlock full platform capabilities
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl shadow-xl border ${config.border} overflow-hidden backdrop-blur-sm`}>
                        <div className="p-8">
                            {/* Status Badge */}
                            <div className="flex justify-center mb-6">
                                <div className={`px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-full shadow-lg`}>
                                    <span className="text-sm font-bold text-white tracking-wider">
                                        {config.badgeText}
                                    </span>
                                </div>
                            </div>

                            {/* Status Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className={`w-32 h-32 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                                        <IconComponent className="w-16 h-16 text-white" />
                                    </div>
                                    {status === 'pending' && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-amber-200 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Message */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    {config.title}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {config.description}
                                </p>

                                {/* Features/Benefits List */}
                                {('features' in config || 'benefits' in config) && (
                                    <div className="max-w-md mx-auto mb-6">
                                        <div className="grid grid-cols-2 gap-3">
                                            {(config.features || config.benefits)?.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-sm text-gray-700">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements List */}
                                {'requirements' in config && (
                                    <div className="max-w-md mx-auto mb-6 bg-white/60 rounded-xl p-4">
                                        <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-rose-500" />
                                            Upload Requirements:
                                        </div>
                                        <ul className="text-left space-y-2">
                                            {config.requirements?.map((req: string, index: number) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Upload Form (Only if not pending/approved) */}
                            {(status === 'unverified' || status === 'rejected') && (
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div
                                            className={`border-3 border-dashed ${isDragging ? 'border-blue-400 bg-blue-50/50' : 'border-gray-300'} rounded-2xl p-8 transition-all duration-300 cursor-pointer relative ${isDragging ? 'scale-[1.02]' : ''}`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={e => setData('document', e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <div className={`p-4 ${isDragging ? 'bg-gradient-to-br from-blue-100 to-cyan-100' : 'bg-gray-100'} rounded-xl`}>
                                                    {data.document ? (
                                                        <FileCheck className="w-12 h-12 text-blue-500" />
                                                    ) : (
                                                        <Upload className={`w-12 h-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <span className="text-lg font-semibold text-gray-900 block">
                                                        {data.document ? data.document.name : 'Drop your document here'}
                                                    </span>
                                                    <span className="text-sm text-gray-500 block">
                                                        {data.document ?
                                                            'Click or drag to replace file' :
                                                            'Click to browse or drag & drop'
                                                        }
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-1">
                                                        Supported: PDF, JPG, PNG (Max 5MB)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        {progress && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Uploading...</span>
                                                    <span>{progress.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                                                        style={{ width: `${progress.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Error Message */}
                                        {errors.document && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
                                                <AlertCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">{errors.document}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !data.document}
                                        className={`w-full bg-gradient-to-r ${config.buttonGradient} text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-200 ${processing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {processing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-5 h-5" />
                                                    <span>Submit for Verification</span>
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>
                            )}

                            {/* Dashboard Button (Approved status) */}
                            {status === 'approved' && (
                                <div className="space-y-6">
                                    <div className="flex justify-center">
                                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 max-w-md w-full border border-emerald-100">
                                            <div className="text-center space-y-3">
                                                <div className="flex items-center justify-center gap-2 text-emerald-600">
                                                    <Sparkles className="w-5 h-5" />
                                                    <span className="font-semibold">Premium Access Granted</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Your account is now fully verified. Start managing your schedule and appointments.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <a
                                        href={route('doctor.dashboard')}
                                        className={`block w-full bg-gradient-to-r ${config.buttonGradient} text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-emerald-200 hover:scale-[1.02] text-center`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Go to Dashboard</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Pending Progress */}
                            {status === 'pending' && config.progress && (
                                <div className="bg-white/60 rounded-xl p-6 border border-amber-100">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-amber-700">Review Progress</span>
                                            <span className="text-sm text-amber-600">{config.progress}</span>
                                        </div>
                                        <div className="w-full bg-amber-100 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                                        </div>
                                        <p className="text-xs text-amber-600 text-center">
                                            You'll receive a notification once your verification is complete
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className="bg-gradient-to-r from-white/80 to-transparent p-4 border-t border-gray-200/50">
                            <div className="flex items-center justify-center text-sm text-gray-500">
                                <Lock className="w-4 h-4 mr-2" />
                                Your documents are securely encrypted and stored
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Need help with verification?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
