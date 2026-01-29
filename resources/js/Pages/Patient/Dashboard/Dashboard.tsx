import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, qrCode }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Health ID</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* ID Card Container */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col items-center p-8 text-center">

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {auth.user.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Scan this code at the reception
                        </p>

                        {/* QR Code Display */}
                        {/* We use dangerouslySetInnerHTML because the library returns raw SVG string */}
                        <div
                            className="border-4 border-gray-200 rounded-lg p-4 bg-white"
                            dangerouslySetInnerHTML={{ __html: qrCode }}
                        />

                        <div className="mt-6 text-xs text-gray-400">
                            ID: {auth.user.uuid}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
