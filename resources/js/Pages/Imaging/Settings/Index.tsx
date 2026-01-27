import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Settings, Clock, List, Save, Plus, Trash2,
    Upload, Scan, X, DollarSign, Clock3, FileText,
    CheckCircle, AlertCircle
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

// --- MAIN COMPONENT ---
export default function SettingsIndex({ center, exams }: any) {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Profil & Équipements', icon: Settings },
        { id: 'exams', label: 'Catalogue Examens', icon: List },
        { id: 'hours', label: 'Horaires', icon: Clock },
    ];

    return (
        <AppLayout>
            <Head title="Paramètres du Centre" />

            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Configuration du Centre</h1>
                        <p className="text-gray-500">Gérez vos informations, vos équipements et vos tarifs.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Tabs */}
                        <div className="lg:w-64 flex-shrink-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                                        }`}
                                    >
                                        <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            {activeTab === 'general' && <GeneralSettings center={center} />}
                            {activeTab === 'exams' && <ExamManager exams={exams} />}
                            {activeTab === 'hours' && <HoursManager center={center} />}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- TAB 1: GENERAL SETTINGS ---
function GeneralSettings({ center }: any) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'POST', // Trick for file upload with Inertia
        description: center.description || '',
        phone: center.phone || '',
        address: center.address || '',
        equipment_list: center.equipment_list || [],
        logo: null as File | null,
    });

    const [equipmentInput, setEquipmentInput] = useState('');

    const handleAddEquipment = (e: any) => {
        e.preventDefault();
        if (equipmentInput.trim() && !data.equipment_list.includes(equipmentInput.trim())) {
            setData('equipment_list', [...data.equipment_list, equipmentInput.trim()]);
            setEquipmentInput('');
        }
    };

    const removeEquipment = (item: string) => {
        setData('equipment_list', data.equipment_list.filter((i: string) => i !== item));
    };

    const submit = (e: any) => {
        e.preventDefault();
        post(route('imaging.settings.update'));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Informations Générales</h2>

            <form onSubmit={submit} className="space-y-6">

                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative group">
                        {data.logo ? (
                            <img src={URL.createObjectURL(data.logo)} className="w-full h-full object-cover" />
                        ) : center.logo_path ? (
                            <img src={`/storage/${center.logo_path}`} className="w-full h-full object-cover" />
                        ) : (
                            <Scan className="w-10 h-10 text-gray-400" />
                        )}
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold">
                            Modifier
                            <input type="file" className="hidden" onChange={e => e.target.files && setData('logo', e.target.files[0])} />
                        </label>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{center.name}</h3>
                        <p className="text-sm text-gray-500">Formats: JPG, PNG. Max 2MB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel value="Téléphone" />
                        <TextInput
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className="w-full mt-1"
                        />
                        <InputError message={errors.phone} />
                    </div>
                    <div>
                        <InputLabel value="Adresse Complète" />
                        <TextInput
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            className="w-full mt-1"
                        />
                        <InputError message={errors.address} />
                    </div>
                </div>

                <div>
                    <InputLabel value="À propos du centre" />
                    <textarea
                        className="w-full mt-1 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500"
                        rows={4}
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                    ></textarea>
                    <InputError message={errors.description} />
                </div>

                {/* Equipment List Management */}
                <div>
                    <InputLabel value="Parc d'Équipements (Machines Disponibles)" />
                    <div className="mt-1 flex gap-2">
                        <TextInput
                            placeholder="Ajouter une machine (ex: IRM 3T, Scanner 64 Barrettes...)"
                            className="flex-1"
                            value={equipmentInput}
                            onChange={e => setEquipmentInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddEquipment(e)}
                        />
                        <button
                            type="button"
                            onClick={handleAddEquipment}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold"
                        >
                            Ajouter
                        </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {data.equipment_list.map((item: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-2">
                                {item}
                                <button type="button" onClick={() => removeEquipment(item)} className="hover:text-red-500">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                    {recentlySuccessful && <span className="text-green-600 text-sm font-medium">Sauvegardé !</span>}
                    <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                        <Save className="w-4 h-4 mr-2" /> Enregistrer
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}

// --- TAB 2: EXAM MANAGER ---
function ExamManager({ exams }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form for Adding Exams
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        modality: 'IRM',
        price: '',
        duration: '',
        preparation_notes: '',
    });

    const modalities = ['IRM', 'Scanner (TDM)', 'Radiographie', 'Échographie', 'Mammographie', 'Scintigraphie', 'Panoramique Dentaire', 'Ostéodensitométrie'];

    const submit = (e: any) => {
        e.preventDefault();
        post(route('imaging.exams.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteExam = (id: number) => {
        if (confirm('Supprimer cet examen ?')) {
            router.delete(route('imaging.exams.destroy', id));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Catalogue des Examens</h2>
                <PrimaryButton onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" /> Nouvel Examen
                </PrimaryButton>
            </div>

            {exams.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun examen configuré.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Examen</th>
                                <th className="px-4 py-3">Modalité</th>
                                <th className="px-4 py-3">Durée / Prep</th>
                                <th className="px-4 py-3">Prix</th>
                                <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {exams.map((exam: any) => (
                                <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 font-bold text-gray-900">{exam.name}</td>
                                    <td className="px-4 py-4">
                                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold uppercase">
                                            {exam.modality}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> {exam.duration || '--'}</span>
                                            {exam.preparation_notes && <span className="flex items-center gap-1 text-amber-600"><AlertCircle className="w-3 h-3" /> {exam.preparation_notes}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-emerald-600">
                                        {exam.price ? `${exam.price} DA` : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => deleteExam(exam.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ADD EXAM MODAL */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Ajouter un Examen</h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nom de l'examen *" />
                            <TextInput
                                placeholder="ex: IRM Cérébrale sans injection"
                                className="w-full mt-1"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Modalité *" />
                                <select
                                    className="w-full mt-1 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.modality}
                                    onChange={e => setData('modality', e.target.value)}
                                >
                                    {modalities.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Prix (DA)" />
                                <div className="relative">
                                    <TextInput
                                        type="number"
                                        className="w-full mt-1 pl-8"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                    />
                                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 mt-0.5" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Durée estimée" />
                                <TextInput
                                    placeholder="ex: 30 min"
                                    className="w-full mt-1"
                                    value={data.duration}
                                    onChange={e => setData('duration', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel value="Préparation" />
                                <TextInput
                                    placeholder="ex: À jeun, Vessie pleine..."
                                    className="w-full mt-1"
                                    value={data.preparation_notes}
                                    onChange={e => setData('preparation_notes', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Annuler</SecondaryButton>
                        <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">Ajouter</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

// --- TAB 3: HOURS MANAGER ---
function HoursManager({ center }: any) {
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Initialize with existing hours or default structure
    const initialHours = center.opening_hours || weekDays.reduce((acc: any, day) => {
        acc[day] = { isOpen: true, start: '08:00', end: '17:00' };
        return acc;
    }, {});

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        _method: 'POST', // Reusing updateProfile endpoint
        opening_hours: initialHours,
        // Need to send other required fields to pass validation or ensure backend handles partial updates
        phone: center.phone,
        address: center.address
    });

    const handleChange = (day: string, field: string, value: any) => {
        setData('opening_hours', {
            ...data.opening_hours,
            [day]: { ...data.opening_hours[day], [field]: value }
        });
    };

    const submit = (e: any) => {
        e.preventDefault();
        post(route('imaging.settings.update'));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Horaires d'Ouverture</h2>

            <form onSubmit={submit} className="space-y-4">
                {weekDays.map((day) => (
                    <div key={day} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div className="w-32 font-medium text-gray-900">{day}</div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={data.opening_hours[day]?.isOpen}
                                        onChange={e => handleChange(day, 'isOpen', e.target.checked)}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${data.opening_hours[day]?.isOpen ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.opening_hours[day]?.isOpen ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">{data.opening_hours[day]?.isOpen ? 'Ouvert' : 'Fermé'}</span>
                            </label>

                            {data.opening_hours[day]?.isOpen && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        className="border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.opening_hours[day]?.start}
                                        onChange={e => handleChange(day, 'start', e.target.value)}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="time"
                                        className="border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.opening_hours[day]?.end}
                                        onChange={e => handleChange(day, 'end', e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-end gap-4 pt-6">
                    {recentlySuccessful && <span className="text-green-600 text-sm font-medium">Horaires mis à jour !</span>}
                    <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                        Enregistrer Horaires
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
