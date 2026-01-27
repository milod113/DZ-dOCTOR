import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function FlashMessage() {
    const { flash, errors } = usePage().props as any;
    const [visible, setVisible] = useState(true);

    // Reset visibility when flash messages change
    useEffect(() => {
        setVisible(true);
        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
    }, [flash, errors]);

    if (!visible) return null;

    // 1. Success Message
    if (flash.success) {
        return (
            <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white border-l-4 border-green-500 shadow-lg rounded-r-lg p-4 animate-in slide-in-from-right">
                <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">Succès</h3>
                        <p className="text-sm text-gray-500 mt-1">{flash.success}</p>
                    </div>
                    <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-500">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    // 2. Error Message (General or specific)
    const errorMessage = flash.error || (Object.keys(errors).length > 0 ? "Une erreur est survenue." : null);

    if (errorMessage) {
        return (
            <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white border-l-4 border-red-500 shadow-lg rounded-r-lg p-4 animate-in slide-in-from-right">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">Erreur</h3>
                        <p className="text-sm text-gray-500 mt-1">{errorMessage}</p>
                        {/* List specific validation errors if needed */}
                        {Object.keys(errors).length > 0 && (
                            <ul className="list-disc pl-5 mt-2 text-xs text-red-600">
                                {Object.values(errors).map((err: any, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-500">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
