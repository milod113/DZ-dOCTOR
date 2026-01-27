import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { FileText, AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react';

export default function VerificationShow({ status }: { status: string }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        document: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.verification.store'));
    };

    return (
        <AppLayout>
            <Head title="Account Verification" />

            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100">

                    {/* --- STATUS ICONS --- */}
                    <div className="flex justify-center mb-6">
                        {status === 'approved' && <CheckCircle className="w-20 h-20 text-green-500" />}
                        {status === 'rejected' && <XCircle className="w-20 h-20 text-red-500" />}
                        {status === 'pending' && <ClockIcon className="w-20 h-20 text-orange-500" />}
                        {status === 'unverified' && <ShieldIcon className="w-20 h-20 text-blue-500" />}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {status === 'approved' && 'Account Verified'}
                        {status === 'pending' && 'Under Review'}
                        {status === 'rejected' && 'Verification Failed'}
                        {status === 'unverified' && 'Verification Required'}
                    </h1>

                    <p className="text-gray-500 mb-8">
                        {status === 'approved' && 'You have full access to the doctor dashboard.'}
                        {status === 'pending' && 'Our team is reviewing your document. This usually takes 24 hours.'}
                        {status === 'rejected' && 'Your document was rejected. Please upload a clear, valid medical license.'}
                        {status === 'unverified' && 'To accept patients, you must upload your medical license or ID.'}
                    </p>

                    {/* --- UPLOAD FORM (Only if not pending/approved) --- */}
                    {(status === 'unverified' || status === 'rejected') && (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setData('document', e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {data.document ? data.document.name : 'Click to select document'}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">PDF, JPG or PNG (Max 4MB)</span>
                                </div>
                            </div>

                            {progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                </div>
                            )}

                            {errors.document && <div className="text-red-500 text-sm">{errors.document}</div>}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                            >
                                {processing ? 'Uploading...' : 'Submit for Review'}
                            </button>
                        </form>
                    )}

                    {status === 'approved' && (
                         <a href={route('doctor.dashboard')} className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
                             Go to Dashboard
                         </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

// Simple Icon Components for cleaner code above
function ShieldIcon(props: any) { return <AlertTriangle {...props} /> }
function ClockIcon(props: any) { return <div className="bg-orange-100 p-4 rounded-full"><div className="w-4 h-4 bg-orange-500 rounded-full animate-ping"></div></div> }
