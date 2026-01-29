import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { PageProps } from '@/types';
import {
  QrCode,
  UserCheck,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ScanLine,
  Type
} from 'lucide-react';

export default function Scan({ auth, flash }: PageProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [lastScanTime, setLastScanTime] = useState<string>('');

    const { data, setData, post, processing, reset } = useForm({
        uuid: '',
    });

    // 1. Auto-Focus Logic
    useEffect(() => {
        const focusInput = () => {
            inputRef.current?.focus();
            setScanStatus('idle');
        };

        focusInput();

        const handleBlur = () => setTimeout(focusInput, 50);

        const input = inputRef.current;
        input?.addEventListener('blur', handleBlur);

        return () => input?.removeEventListener('blur', handleBlur);
    }, []);

    // 2. Handle the Scan
    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!data.uuid.trim()) return;

        setScanStatus('scanning');

        post(route('doctor.secretary.checkin'), {
            onSuccess: () => {
                setScanStatus('success');
                setLastScanTime(new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }));
                reset('uuid');

                // Auto-reset success status after 3 seconds
                setTimeout(() => {
                    setScanStatus('idle');
                }, 3000);
            },
            onError: () => {
                setScanStatus('error');
                reset('uuid');

                // Auto-reset error status after 3 seconds
                setTimeout(() => {
                    setScanStatus('idle');
                }, 3000);
            }
        });
    };

    // Manual entry toggle
    const toggleManualEntry = () => {
        inputRef.current?.classList.toggle('manual-mode');
        if (inputRef.current?.classList.contains('manual-mode')) {
            inputRef.current.placeholder = "Enter Patient ID manually...";
        } else {
            inputRef.current!.placeholder = "";
            inputRef.current?.focus();
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <ScanLine className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Patient Check-In</h2>
                        <p className="text-sm text-gray-500">Quick and secure patient registration</p>
                    </div>
                </div>
            }
        >
            <Head title="Scanner - DZ Doctor" />

            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Dashboard Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Scan Patient QR Code</h1>
                                <p className="text-gray-600 mt-2">
                                    Scan patient QR codes for instant check-in and appointment management
                                </p>
                            </div>
                            {lastScanTime && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    Last scan: {lastScanTime}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Scanner Interface */}
                        <div className="lg:col-span-2">
                            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
                                {/* Scanner Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <QrCode className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">QR Code Scanner</h3>
                                                <p className="text-blue-100 text-sm">Active and ready</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-blue-200">Scanner ID</div>
                                            <div className="font-mono text-white font-bold">SCN-{auth.user.id.toString().padStart(3, '0')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Scanner Body */}
                                <div className="p-8">
                                    {/* Visual Feedback Area */}
                                    <div className="relative mb-10">
                                        {/* Animated Scanner Effect */}
                                        <div className="relative mx-auto w-64 h-64 border-4 border-blue-200 rounded-2xl overflow-hidden">
                                            {/* Scanner Grid Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent animate-[scan_2s_linear_infinite]"
                                                 style={{backgroundImage: 'linear-gradient(90deg, transparent 49.75%, #dbeafe 50%, #dbeafe 50.25%, transparent 50.5%)'}}>
                                            </div>

                                            {/* Center Target */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <div className="w-40 h-40 border-2 border-dashed border-blue-300 rounded-xl animate-pulse"></div>
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                    <ScanLine className="h-12 w-12 text-blue-400 animate-pulse" />
                                                </div>
                                            </div>

                                            {/* Corner Markers */}
                                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl"></div>
                                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr"></div>
                                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl"></div>
                                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br"></div>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${scanStatus === 'success' ? 'bg-green-100 text-green-800' :
                                                                                      scanStatus === 'error' ? 'bg-red-100 text-red-800' :
                                                                                      scanStatus === 'scanning' ? 'bg-blue-100 text-blue-800' :
                                                                                      'bg-gray-100 text-gray-800'}`}>
                                                {scanStatus === 'success' && <CheckCircle2 className="h-4 w-4 animate-bounce" />}
                                                {scanStatus === 'error' && <XCircle className="h-4 w-4" />}
                                                {scanStatus === 'scanning' && <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping"></div>}
                                                <span className="text-sm font-medium">
                                                    {scanStatus === 'success' ? 'Check-in successful!' :
                                                     scanStatus === 'error' ? 'Scan failed' :
                                                     scanStatus === 'scanning' ? 'Processing...' :
                                                     'Ready to scan'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hidden Input Form */}
                                    <form onSubmit={submit} className="relative">
                                        <div className="relative">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={data.uuid}
                                                onChange={(e) => {
                                                    setData('uuid', e.target.value);
                                                    if (e.target.value.length > 0) {
                                                        setScanStatus('scanning');
                                                    }
                                                }}
                                                disabled={processing}
                                                autoComplete="off"
                                                autoCapitalize="off"
                                                autoCorrect="off"
                                                spellCheck="false"
                                                className="w-full h-16 text-center text-2xl font-mono border-2 border-blue-200 bg-white rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                                                placeholder=""
                                            />
                                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                <span className="text-gray-300 font-medium text-lg">
                                                    {data.uuid ? 'Scanning...' : 'Point scanner here'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Flash Messages */}
                                        <div className="mt-6 space-y-3">
                                            {flash.success && (
                                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-slide-in">
                                                    <div className="flex items-center">
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                                                        <div>
                                                            <p className="font-medium text-green-800">{flash.success}</p>
                                                            <p className="text-sm text-green-600 mt-1">Patient has been checked in successfully</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {flash.error && (
                                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-slide-in">
                                                    <div className="flex items-center">
                                                        <XCircle className="h-5 w-5 text-red-500 mr-3" />
                                                        <div>
                                                            <p className="font-medium text-red-800">{flash.error}</p>
                                                            <p className="text-sm text-red-600 mt-1">Please try again or verify the QR code</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Manual Entry Button */}
                                        <div className="mt-8 pt-6 border-t border-blue-100">
                                            <button
                                                type="button"
                                                onClick={toggleManualEntry}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                <Type className="h-4 w-4" />
                                                Switch to Manual Entry
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Click above or press F2 to enter Patient ID manually
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Right: Instructions & Stats */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Today's Stats</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <UserCheck className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Checked In</p>
                                                <p className="text-lg font-bold text-gray-900">0</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Users className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Waiting</p>
                                                <p className="text-lg font-bold text-gray-900">0</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                                <h4 className="font-semibold text-gray-900 mb-4">Scanning Instructions</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm text-gray-600">Ensure good lighting for optimal scanning</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm text-gray-600">Position QR code within the scanner frame</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm text-gray-600">Hold steady for 1-2 seconds</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p className="text-sm text-gray-600">Listen for confirmation sound</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Troubleshooting */}
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-yellow-800 mb-2">Troubleshooting</h4>
                                        <p className="text-sm text-yellow-700">
                                            If scanner isn't working, ensure:
                                        </p>
                                        <ul className="text-xs text-yellow-600 mt-2 space-y-1">
                                            <li>• Camera has necessary permissions</li>
                                            <li>• QR code is not damaged or blurry</li>
                                            <li>• Patient's QR code is still valid</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global CSS for animations */}
            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes slide-in {
                    0% { transform: translateX(-10px); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }

                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }

                /* Manual mode styling */
                .manual-mode {
                    color: #374151 !important;
                    background: #fef3c7 !important;
                    border-color: #f59e0b !important;
                }

                .manual-mode::placeholder {
                    color: #92400e !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
