import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { FlaskConical, MapPin, Phone, Building } from 'lucide-react';

export default function CreateProfile() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        address: '',
        city: '',
        wilaya: '',
        license_number: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('laboratory.setup.store'));
    };

    return (
        <AppLayout>
            <Head title="Laboratory Setup" />

            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FlaskConical className="w-10 h-10 text-purple-600" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Configurez votre Laboratoire
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Entrez les informations commerciales de votre établissement
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={submit}>

                            {/* Commercial Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom du Laboratoire</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        placeholder="Ex: Laboratoire El Amel"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Numéro d'Agrément</label>
                                <input
                                    type="text"
                                    value={data.license_number}
                                    onChange={e => setData('license_number', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                                {errors.license_number && <p className="mt-1 text-sm text-red-600">{errors.license_number}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Location Group */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Wilaya</label>
                                    <input
                                        type="text"
                                        value={data.wilaya}
                                        onChange={e => setData('wilaya', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                    {errors.wilaya && <p className="mt-1 text-sm text-red-600">{errors.wilaya}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ville / Commune</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Adresse Complète</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    {processing ? 'Enregistrement...' : 'Continuer vers la Vérification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
