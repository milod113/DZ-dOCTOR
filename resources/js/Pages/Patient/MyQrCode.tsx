import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
  User,
  Shield,
  Scan,
  Smartphone,
  Download,
  QrCode as QrCodeIcon
} from 'lucide-react';

interface QrCodeProps extends PageProps {
    qrCode: string;
}

export default function MyQrCode({ auth, qrCode }: QrCodeProps) {
    const downloadQrCode = () => {
        const qrContainer = document.querySelector('.qr-container');
        if (qrContainer) {
            const svgElement = qrContainer.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);

                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = `dz-doctor-qr-${auth.user.uuid}.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                };

                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <QrCodeIcon className="h-6 w-6" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My QR Code</h2>
                </div>
            }
        >
            <Head title="My QR Code" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                            <Scan className="h-8 w-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Medical QR Code</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Present this QR code at the reception for quick check-in and access to your medical records
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: QR Code Card */}
                        <div className="lg:w-2/5">
                            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-blue-100">
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className="font-semibold text-blue-700">Medical ID</span>
                                    </div>
                                    <button
                                        onClick={downloadQrCode}
                                        className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Save
                                    </button>
                                </div>

                                {/* QR Code Container */}
                                <div className="relative">
                                    <div className="qr-container p-6 bg-white rounded-xl border-2 border-dashed border-blue-200 flex justify-center">
                                        <div
                                            className="qr-content transform hover:scale-105 transition-transform duration-300"
                                            dangerouslySetInnerHTML={{ __html: qrCode }}
                                        />
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-300 rounded-tl-lg"></div>
                                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-blue-300 rounded-tr-lg"></div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-300 rounded-bl-lg"></div>
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-blue-300 rounded-br-lg"></div>
                                </div>

                                {/* Instructions */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div className="text-left">
                                            <p className="font-medium text-blue-800 text-sm">How to use:</p>
                                            <p className="text-blue-600 text-xs mt-1">
                                                Show this code at the reception desk or scan it using clinic's scanner
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: User Info & Details */}
                        <div className="lg:w-3/5">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-full">
                                {/* User Profile Section */}
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-2xl font-bold text-gray-900">{auth.user.name}</h3>
                                        <p className="text-gray-500">Patient</p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Patient ID</p>
                                            <div className="flex items-center gap-2">
                                                <div className="font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                                    {auth.user.uuid}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">QR Code Valid Until</p>
                                            <p className="text-gray-900">Indefinite</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                                            <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Tips */}
                                <div className="mt-10 pt-8 border-t border-gray-100">
                                    <h4 className="font-semibold text-gray-900 mb-4">Important Information</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <p className="text-sm text-gray-600">This QR code is linked to your medical records</p>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <p className="text-sm text-gray-600">Keep this code secure and only share with authorized medical staff</p>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <p className="text-sm text-gray-600">Scanning may be required for prescription access and appointments</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Note */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact clinic support at +213 XXX XX XX XX
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
