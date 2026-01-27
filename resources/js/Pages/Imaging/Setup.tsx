import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building, MapPin, Phone, Shield, FileText,
    CheckCircle, Scan, ArrowRight, Activity
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function Setup() {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        city: '',
        phone: '',
        license_number: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('imaging.setup.store'));
    };

    return (
        <>
            <Head title="Configuration du Centre d'Imagerie" />

            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

                {/* --- LEFT SIDE: INFO & BRANDING --- */}
                <div className="bg-indigo-600 w-full md:w-1/3 lg:w-1/4 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Scan className="w-8 h-8 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-wide">DzDoctor Imagerie</span>
                        </div>

                        <h2 className="text-3xl font-bold mb-4">Bienvenue, {user.name} !</h2>
                        <p className="text-indigo-100 mb-8 leading-relaxed">
                            Finalisons la création de votre centre d'imagerie. Ces informations permettront aux patients de vous trouver et de réserver des examens.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="font-bold">1</span>
                                </div>
                                <span className="font-medium">Informations Générales</span>
                            </li>
                            <li className="flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                                    <span>2</span>
                                </div>
                                <span>Équipements & Examens</span>
                            </li>
                            <li className="flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
                                    <span>3</span>
                                </div>
                                <span>Validation</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 text-sm text-indigo-200 mt-8">
                        &copy; {new Date().getFullYear()} DzDoctor Pro
                    </div>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="flex-1 p-6 md:p-12 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuration du Profil</h1>
                            <p className="text-gray-500">Remplissez les détails officiels de votre centre.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">

                            {/* Section 1: Identity */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <Building className="w-5 h-5 text-indigo-500" />
                                    Identité du Centre
                                </h3>

                                <div>
                                    <InputLabel value="Nom du Centre *" />
                                    <TextInput
                                        className="w-full mt-1"
                                        placeholder="Ex: Centre d'Imagerie Ibn Sina"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <InputLabel value="Numéro d'Agrément / Licence *" />
                                    <div className="relative">
                                        <TextInput
                                            className="w-full mt-1 pl-10"
                                            placeholder="Ex: 12345/DSP/2024"
                                            value={data.license_number}
                                            onChange={e => setData('license_number', e.target.value)}
                                        />
                                        <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 mt-0.5" />
                                    </div>
                                    <InputError message={errors.license_number} />
                                </div>

                                <div>
                                    <InputLabel value="Description (Bio)" />
                                    <textarea
                                        className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder="Brève description de votre centre, vos spécialités..."
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* Section 2: Contact & Location */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-indigo-500" />
                                    Coordonnées
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Ville *" />
                                        <select
                                            className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                        >
                                            <option value="">Sélectionner une ville</option>
                                            <option value="Alger">Alger</option>
                                            <option value="Oran">Oran</option>
                                            <option value="Constantine">Constantine</option>
                                            <option value="Annaba">Annaba</option>
                                            <option value="Blida">Blida</option>
                                            <option value="Batna">Batna</option>
                                            {/* Add more cities as needed */}
                                        </select>
                                        <InputError message={errors.city} />
                                    </div>
                                    <div>
                                        <InputLabel value="Téléphone *" />
                                        <div className="relative">
                                            <TextInput
                                                className="w-full mt-1 pl-10"
                                                placeholder="05 50 ..."
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                            />
                                            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 mt-0.5" />
                                        </div>
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Adresse Complète *" />
                                    <TextInput
                                        className="w-full mt-1"
                                        placeholder="Cité, Rue, N°..."
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                    <InputError message={errors.address} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <PrimaryButton
                                    className="w-full justify-center py-4 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
                                    disabled={processing}
                                >
                                    {processing ? 'Création en cours...' : 'Créer mon Centre'} <ArrowRight className="ml-2 w-5 h-5" />
                                </PrimaryButton>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    En continuant, vous acceptez les conditions d'utilisation pour les professionnels de santé.
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
