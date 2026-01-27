import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    UserPlus,
    ArrowLeft,
    Mail,
    User,
    CheckCircle,
    Shield,
    Lock,
    Sparkles,
    Users,
    BadgeCheck,
    Key,
    Building,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CreateSecretary() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Password strength calculator
    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        setPasswordChecks(checks);

        Object.values(checks).forEach(check => {
            if (check) strength += 20;
        });

        return Math.min(strength, 100);
    };

    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(data.password));
    }, [data.password]);

    const getStrengthColor = (strength: number) => {
        if (strength < 40) return 'bg-red-500';
        if (strength < 70) return 'bg-orange-500';
        if (strength < 90) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    const getStrengthText = (strength: number) => {
        if (strength < 40) return 'Faible';
        if (strength < 70) return 'Moyenne';
        if (strength < 90) return 'Bonne';
        return 'Excellente';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        post(route('doctor.team.add'), {
            onSuccess: () => {
                setSuccessMessage("Le compte a été créé avec succès ! Un email de confirmation a été envoyé.");
                setTimeout(() => setSuccessMessage(null), 5000);
                // Reset form
                setData({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Ajouter un Collaborateur | Cabinet" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href={route('doctor.team.index')}
                                className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-x-1 text-gray-600 hover:text-gray-900 group"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                                <span className="font-medium">Retour à l'équipe</span>
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">Équipe médicale</span>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="animate-in slide-in-from-top fade-in duration-300">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <BadgeCheck className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">Collaborateur ajouté !</h3>
                                    <p className="text-emerald-100 text-sm">{successMessage}</p>
                                </div>
                                <button
                                    onClick={() => setSuccessMessage(null)}
                                    className="text-white/80 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Top Gradient Header */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                            <UserPlus className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold">Nouveau Collaborateur</h1>
                                            <p className="text-blue-100 mt-2 text-lg">Ajoutez un membre à votre équipe médicale</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-sm font-medium">Accès sécurisé</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-8 md:p-10">
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Left Side - Form */}
                                <div className="md:col-span-2">
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-3">Informations du collaborateur</h2>
                                        <p className="text-gray-600">Saisissez les informations du nouveau membre de votre équipe</p>
                                    </div>

                                    <form onSubmit={submit} className="space-y-8">
                                        {/* Name Input */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" />
                                                Nom Complet
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    placeholder="Ex: Amine Benali"
                                                    required
                                                />
                                            </div>
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email Input */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-blue-500" />
                                                Adresse Email
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    placeholder="Ex: amine.secretaire@gmail.com"
                                                    required
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Input */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-blue-500" />
                                                Mot de passe
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Key className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    placeholder="Créez un mot de passe sécurisé"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>

                                            {/* Password Strength Indicator */}
                                            {data.password && (
                                                <div className="space-y-3 mt-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">Force du mot de passe</span>
                                                        <span className="text-sm font-bold" style={{ color: getStrengthColor(passwordStrength) }}>
                                                            {getStrengthText(passwordStrength)}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                                                            style={{ width: `${passwordStrength}%` }}
                                                        ></div>
                                                    </div>

                                                    {/* Password Requirements */}
                                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                                        <div className="flex items-center gap-2">
                                                            {passwordChecks.length ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordChecks.length ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                8 caractères minimum
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordChecks.uppercase ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordChecks.uppercase ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                Majuscule
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordChecks.lowercase ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordChecks.lowercase ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                Minuscule
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordChecks.number ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordChecks.number ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                Chiffre
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {passwordChecks.special ? (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            ) : (
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className={`text-xs ${passwordChecks.special ? 'text-emerald-600' : 'text-gray-500'}`}>
                                                                Caractère spécial
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {errors.password && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password Input */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-blue-500" />
                                                Confirmer le mot de passe
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Key className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    placeholder="Confirmez le mot de passe"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>

                                            {/* Password Match Indicator */}
                                            {data.password_confirmation && (
                                                <div className="mt-2">
                                                    {data.password === data.password_confirmation ? (
                                                        <div className="flex items-center gap-2 text-emerald-600 text-sm">
                                                            <Check className="w-4 h-4" />
                                                            Les mots de passe correspondent
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                                            <X className="w-4 h-4" />
                                                            Les mots de passe ne correspondent pas
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {errors.password_confirmation && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" />
                                                    {errors.password_confirmation}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing || (data.password !== data.password_confirmation)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 group relative overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                            {processing ? (
                                                <>
                                                    <div className="relative z-10 w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="relative z-10">Création en cours...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
                                                    <span className="relative z-10">Ajouter le Collaborateur</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Right Side - Info Panel */}
                                <div className="md:col-span-1">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                                                <Shield className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-gray-900">Accès Sécurisé</h3>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Lock className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">Sécurité renforcée</h4>
                                                    <p className="text-gray-600 text-xs mt-1">
                                                        Mot de passe sécurisé requis pour l'accès initial
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Key className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">Réinitialisation</h4>
                                                    <p className="text-gray-600 text-xs mt-1">
                                                        Possibilité de réinitialiser le mot de passe à tout moment
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Building className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm">Rattachement automatique</h4>
                                                    <p className="text-gray-600 text-xs mt-1">
                                                        Si l'email existe déjà, l'utilisateur sera rattaché à votre cabinet
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Security Tips */}
                                        <div className="bg-white/80 rounded-xl p-4 border border-blue-100">
                                            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium mb-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Conseil de sécurité</span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                Utilisez un mot de passe unique contenant au moins 12 caractères, incluant des majuscules, minuscules, chiffres et symboles.
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="pt-6 border-t border-blue-100">
                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <div className="text-xl font-bold text-gray-900">99.9%</div>
                                                    <div className="text-xs text-gray-500">Sécurité</div>
                                                </div>
                                                <div>
                                                    <div className="text-xl font-bold text-gray-900">5 min</div>
                                                    <div className="text-xs text-gray-500">Activation</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Decorative Bar */}
                        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Rôle Secrétaire
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                                    Gestion des rendez-vous
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                                    Accès aux plannings
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                                    Consultation du calendrier
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                Politique de Sécurité
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                                    Chiffrement SSL/TLS
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                                    Sessions sécurisées
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
                                    Audit de connexion
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                Support & Assistance
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full"></div>
                                    Guide d'accès sécurisé
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full"></div>
                                    Support technique dédié
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-200 rounded-full"></div>
                                    Assistance 24h/24
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
