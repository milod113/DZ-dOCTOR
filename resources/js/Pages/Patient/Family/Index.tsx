import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal'; // Ensure you have a Modal component
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    Users, Plus, Baby, Heart, User, Trash2,
    Calendar, Droplet
} from 'lucide-react';

export default function FamilyIndex({ members }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        relationship: 'child',
        date_of_birth: '',
        gender: 'male',
        blood_type: ''
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('patient.family.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const deleteMember = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
            router.delete(route('patient.family.destroy', id));
        }
    };

    // Icons based on relationship
    const getIcon = (rel: string, gender: string) => {
        if (rel === 'child') return <Baby className="w-8 h-8 text-indigo-500" />;
        if (rel === 'spouse') return <Heart className="w-8 h-8 text-rose-500" />;
        return <User className="w-8 h-8 text-blue-500" />;
    };

    // Translations
    const relationshipLabels: any = {
        child: 'Enfant',
        spouse: 'Conjoint(e)',
        parent: 'Parent',
        other: 'Autre'
    };

    return (
        <AppLayout>
            <Head title="Mes Proches" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                                Mes Proches
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Gérez les profils de votre famille pour faciliter la prise de rendez-vous.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/30"
                        >
                            <Plus className="w-5 h-5" />
                            Ajouter un membre
                        </button>
                    </div>

                    {/* Members Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Main User Card (Always visible) */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">Moi-même</h3>
                                    <p className="text-indigo-100 text-sm">Compte Principal</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm text-indigo-100">
                                Ce profil est utilisé par défaut pour vos rendez-vous.
                            </div>
                        </div>

                        {/* Family Members */}
                        {members.map((member: any) => (
                            <div key={member.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all relative group">
                                <button
                                    onClick={() => deleteMember(member.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`p-3 rounded-full ${member.gender === 'female' ? 'bg-pink-50 dark:bg-pink-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                        {getIcon(member.relationship, member.gender)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">{member.name}</h3>
                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mt-1">
                                            {relationshipLabels[member.relationship]}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {member.date_of_birth && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span>Né(e) le {new Date(member.date_of_birth).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    )}
                                    {member.blood_type && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Droplet className="w-4 h-4 text-red-500" />
                                            <span>Groupe sanguin: <span className="font-bold">{member.blood_type}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ADD MEMBER MODAL */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Ajouter un proche
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <InputLabel value="Nom complet" />
                                <TextInput
                                    className="w-full mt-1"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Relationship & Gender */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Lien de parenté" />
                                    <select
                                        className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.relationship}
                                        onChange={(e) => setData('relationship', e.target.value)}
                                    >
                                        <option value="child">Enfant</option>
                                        <option value="spouse">Conjoint(e)</option>
                                        <option value="parent">Parent</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Genre" />
                                    <select
                                        className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.gender}
                                        onChange={(e) => setData('gender', e.target.value)}
                                    >
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                    </select>
                                </div>
                            </div>

                            {/* DOB & Blood */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Date de naissance" />
                                    <TextInput
                                        type="date"
                                        className="w-full mt-1"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Groupe Sanguin (Optionnel)" />
                                    <select
                                        className="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.blood_type}
                                        onChange={(e) => setData('blood_type', e.target.value)}
                                    >
                                        <option value="">--</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <SecondaryButton onClick={() => setIsModalOpen(false)}>
                                    Annuler
                                </SecondaryButton>
                                <PrimaryButton disabled={processing}>
                                    Ajouter
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </AppLayout>
    );
}
