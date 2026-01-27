import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Building, Clock, FlaskConical, Save, Trash2, Plus,
    Upload, X, Image as ImageIcon // <--- Added Icons
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError'; // Assuming you have this component

export default function SettingsIndex({ lab, tests }: any) {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <AppLayout>
            <Head title="Paramètres Laboratoire" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Tabs Header */}
                <div className="flex space-x-4 border-b border-gray-200 mb-8">
                    {[
                        { id: 'general', label: 'Présentation & Contact', icon: Building },
                        { id: 'hours', label: 'Horaires d\'ouverture', icon: Clock },
                        { id: 'catalog', label: 'Catalogue des Analyses', icon: FlaskConical },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 pb-4 px-2 border-b-2 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    {/* --- TAB 1: GENERAL INFO --- */}
                    {activeTab === 'general' && <GeneralForm lab={lab} />}

                    {/* --- TAB 2: HOURS --- */}
                    {activeTab === 'hours' && <HoursForm lab={lab} />}

                    {/* --- TAB 3: CATALOG --- */}
                    {activeTab === 'catalog' && <CatalogManager tests={tests} />}

                </div>
            </div>
        </AppLayout>
    );
}

// --- SUB-COMPONENT: GENERAL FORM WITH LOGO UPLOAD ---
function GeneralForm({ lab }: any) {
    const { data, setData, post, processing, errors } = useForm({
        name: lab.name || '', // Added Name field if you want to edit it
        description: lab.description || '',
        address: lab.address || '',
        phone: lab.phone || '',
        website: lab.website || '',
        logo: null as File | null, // <--- New Logo Field
        _method: 'POST' // Changed to PATCH to match standard update routes (Laravel handles file uploads with POST + _method: PATCH)
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        lab.logo_path ? `/storage/${lab.logo_path}` : null
    );

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: any) => {
        e.preventDefault();
        // NOTE: Inertia automatically converts to FormData when a file is present
        post(route('laboratory.settings.update'));
    };

    return (
        <form onSubmit={submit} className="space-y-8 max-w-3xl">

            {/* --- LOGO UPLOAD SECTION --- */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <InputLabel value="Logo du Laboratoire" className="mb-4" />
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Preview Box */}
                    <div className="shrink-0">
                        <div className="w-32 h-32 rounded-xl border-4 border-white shadow-sm bg-white flex items-center justify-center overflow-hidden relative group">
                            {logoPreview ? (
                                <>
                                    <img
                                        src={logoPreview}
                                        alt="Logo Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay to remove (optional logic) */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">Modifier</span>
                                    </div>
                                </>
                            ) : (
                                <ImageIcon className="w-10 h-10 text-gray-300" />
                            )}
                        </div>
                    </div>

                    {/* Upload Input */}
                    <div className="flex-1 w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                id="logo-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleLogoChange}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Cliquez pour téléverser une image</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 2MB)</p>
                        </div>
                        {errors.logo && <div className="text-red-500 text-sm mt-2">{errors.logo}</div>}
                    </div>
                </div>
            </div>

            {/* --- EXISTING FIELDS --- */}
            <div className="space-y-6">
                <div>
                    <InputLabel value="Description du laboratoire (Bio)" />
                    <textarea
                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        rows={4}
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        placeholder="Ex: Laboratoire spécialisé en biologie moléculaire..."
                    />
                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputLabel value="Téléphone" />
                        <TextInput
                            className="w-full mt-1"
                            value={data.phone}
                            onChange={(e:any) => setData('phone', e.target.value)}
                        />
                         {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                    </div>
                    <div>
                        <InputLabel value="Site Web (Optionnel)" />
                        <TextInput
                            className="w-full mt-1"
                            value={data.website}
                            onChange={(e:any) => setData('website', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <InputLabel value="Adresse Complète" />
                    <TextInput
                        className="w-full mt-1"
                        value={data.address}
                        onChange={(e:any) => setData('address', e.target.value)}
                    />
                     {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <PrimaryButton disabled={processing}>
                    <Save className="w-4 h-4 mr-2" /> Enregistrer les modifications
                </PrimaryButton>
            </div>
        </form>
    );
}

// --- SUB-COMPONENT: HOURS FORM ---
function HoursForm({ lab }: any) {
    const defaultHours = { open: '08:00', close: '17:00', closed: false };
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const { data, setData, post, processing } = useForm({
        opening_hours: lab.opening_hours || days.reduce((acc:any, day) => {
            acc[day] = defaultHours;
            return acc;
        }, {})
    });

    const handleChange = (day: string, field: string, value: any) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: { ...data.opening_hours[day], [field]: value }
        });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); post(route('laboratory.settings.update')); }}>
            <div className="grid gap-4 max-w-3xl">
                {days.map((day) => (
                    <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-24 font-medium text-gray-700">{day}</div>

                        <div className={`flex items-center gap-2 transition-opacity ${data.opening_hours[day]?.closed ? 'opacity-40' : 'opacity-100'}`}>
                            <input
                                type="time"
                                value={data.opening_hours[day]?.open}
                                onChange={e => handleChange(day, 'open', e.target.value)}
                                disabled={data.opening_hours[day]?.closed}
                                className="rounded-md border-gray-300 shadow-sm focus:ring-purple-500"
                            />
                            <span className="text-gray-400">à</span>
                            <input
                                type="time"
                                value={data.opening_hours[day]?.close}
                                onChange={e => handleChange(day, 'close', e.target.value)}
                                disabled={data.opening_hours[day]?.closed}
                                className="rounded-md border-gray-300 shadow-sm focus:ring-purple-500"
                            />
                        </div>

                        <label className="flex items-center gap-2 ml-auto cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.opening_hours[day]?.closed}
                                onChange={e => handleChange(day, 'closed', e.target.checked)}
                                className="rounded text-purple-600 focus:ring-purple-500 border-gray-300"
                            />
                            <span className={`text-sm ${data.opening_hours[day]?.closed ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                Fermé
                            </span>
                        </label>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
                <PrimaryButton disabled={processing}>
                     <Save className="w-4 h-4 mr-2" /> Mettre à jour les horaires
                </PrimaryButton>
            </div>
        </form>
    );
}

// --- SUB-COMPONENT: CATALOG MANAGER ---
function CatalogManager({ tests }: any) {
    const { data, setData, post, reset, processing } = useForm({
        name: '',
        price: '',
        category: 'Biochimie',
        conditions: ''
    });

    const addTest = (e: any) => {
        e.preventDefault();
        post(route('laboratory.settings.tests.store'), {
            onSuccess: () => reset()
        });
    };

    return (
        <div>
            {/* Add New Test Form */}
            <div className="bg-purple-50 p-4 rounded-xl mb-6 border border-purple-100">
                <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Ajouter une analyse
                </h3>
                <form onSubmit={addTest} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <InputLabel value="Nom de l'analyse (ex: FNS)" />
                        <TextInput
                            className="w-full mt-1 bg-white"
                            placeholder="Nom..."
                            value={data.name}
                            onChange={(e:any) => setData('name', e.target.value)}
                        />
                    </div>
                    <div>
                        <InputLabel value="Catégorie" />
                        <select
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-white"
                            value={data.category}
                            onChange={(e:any) => setData('category', e.target.value)}
                        >
                            <option>Biochimie</option>
                            <option>Hématologie</option>
                            <option>Hormonologie</option>
                            <option>Sérologie</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Prix (DA)" />
                        <TextInput
                            type="number"
                            className="w-full mt-1 bg-white"
                            placeholder="0.00"
                            value={data.price}
                            onChange={(e:any) => setData('price', e.target.value)}
                        />
                    </div>
                    <PrimaryButton disabled={processing} className="w-full justify-center">Ajouter</PrimaryButton>
                </form>
                <div className="mt-2">
                    <InputLabel value="Conditions (Optionnel)" />
                    <TextInput
                        className="w-full mt-1 text-sm bg-white"
                        placeholder="Ex: À jeun, prélèvement avant 10h..."
                        value={data.conditions}
                        onChange={(e:any) => setData('conditions', e.target.value)}
                    />
                </div>
            </div>

            {/* Existing Tests List */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3">Nom</th>
                            <th className="px-4 py-3">Catégorie</th>
                            <th className="px-4 py-3">Conditions</th>
                            <th className="px-4 py-3">Prix</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Aucune analyse dans le catalogue.
                                </td>
                            </tr>
                        ) : (
                            tests.map((test: any) => (
                                <tr key={test.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{test.name}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                            {test.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{test.conditions || '-'}</td>
                                    <td className="px-4 py-3 font-bold text-gray-900">{test.price ? `${test.price} DA` : '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route('laboratory.settings.tests.destroy', test.id)}
                                            method="delete"
                                            as="button"
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
