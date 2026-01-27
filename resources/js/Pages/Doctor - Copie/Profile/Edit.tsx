import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { User, DollarSign, Clock, FileText, Save, Info, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import { useI18n } from "@/lib/i18n"; // Ensure this matches your Sidebar import

export default function Edit({ profile }: any) {
    const { auth } = usePage().props as any;
    const { t } = useI18n(); // Use the translation hook

    // --- Photo Upload State ---
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(profile.photo_url);

    // --- Form Handling ---
    const { data, setData, errors, processing, recentlySuccessful } = useForm({
        bio: profile.bio || '',
        price_cents: profile.price_cents || 0,
        consultation_duration_min: profile.consultation_duration_min || 30,
        photo: null as File | null,
        _method: 'PATCH', // Required for file uploads in Laravel via PUT/PATCH
    });

    // Handle File Selection
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            // Create local preview
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: any) => {
        e.preventDefault();
        // Use router.post with forceFormData for file uploads
        router.post(route('doctor.profile.update'), data as any, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title={t('Edit Profile')} />

            <div className="max-w-4xl mx-auto py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{t('Professional Profile')}</h1>
                    <p className="text-gray-500 mt-1">{t('Manage your public information, consultation fees, and session durations.')}</p>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* --- PHOTO SECTION --- */}
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            {/* Photo Preview */}
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                <img
                                    src={preview || `https://ui-avatars.com/api/?name=${auth.user.name}&color=7F9CF5&background=EBF4FF`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Upload Button */}
                            <button
                                type="button"
                                onClick={() => fileInput.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                                title={t('Change Photo')}
                            >
                                <Camera className="w-4 h-4" />
                            </button>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInput}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-gray-900">Dr. {auth.user.name}</h3>
                            <p className="text-gray-500 text-sm mb-3">{t('Allowed JPG, GIF or PNG. Max size of 1MB.')}</p>
                            {errors.photo && <div className="text-red-500 text-sm font-medium">{errors.photo}</div>}
                        </div>
                    </div>

                    {/* --- INFO SECTION (Read Only) --- */}
                    <div className="bg-gray-50/50 p-6 border-b border-gray-100">
                        <div className="flex items-start gap-3 mb-4">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">{t('Account Information')}</h3>
                                <p className="text-sm text-gray-500">{t('Contact support to change these details.')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('Doctor Name')}</label>
                                <div className="flex items-center gap-2 font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg">
                                    <User className="w-4 h-4 text-gray-400" />
                                    Dr. {auth.user.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('Email Address')}</label>
                                <div className="flex items-center gap-2 font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg">
                                    <div className="w-4 h-4 flex items-center justify-center text-gray-400">@</div>
                                    {auth.user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- EDITABLE FIELDS --- */}
                    <div className="p-8 space-y-8">

                        {/* Bio Field */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                <FileText className="w-4 h-4 text-gray-500" />
                                {t('Professional Bio')}
                            </label>
                            <textarea
                                rows={5}
                                className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                placeholder={t('Describe your experience, specialties, and medical approach...')}
                                value={data.bio}
                                onChange={e => setData('bio', e.target.value)}
                            />
                            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                            <p className="text-xs text-gray-500">{t('This will be displayed on your public booking page.')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Price Field */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    {t('Consultation Fee (DA)')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-full pl-4 pr-12 py-2.5 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                        value={data.price_cents / 100}
                                        onChange={e => setData('price_cents', Number(e.target.value) * 100)}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-medium sm:text-sm">DZD</span>
                                    </div>
                                </div>
                                {errors.price_cents && <p className="text-red-500 text-sm mt-1">{errors.price_cents}</p>}
                            </div>

                            {/* Duration Field */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    {t('Session Duration')}
                                </label>
                                <select
                                    className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm py-2.5"
                                    value={data.consultation_duration_min}
                                    onChange={e => setData('consultation_duration_min', Number(e.target.value))}
                                >
                                    <option value="15">{t('15 Minutes')}</option>
                                    <option value="20">{t('20 Minutes')}</option>
                                    <option value="30">{t('30 Minutes')}</option>
                                    <option value="45">{t('45 Minutes')}</option>
                                    <option value="60">{t('1 Hour')}</option>
                                </select>
                                {errors.consultation_duration_min && <p className="text-red-500 text-sm mt-1">{errors.consultation_duration_min}</p>}
                            </div>
                        </div>
                    </div>

                    {/* --- FOOTER ACTIONS --- */}
                    <div className="bg-gray-50 p-6 border-t border-gray-200 flex items-center justify-between">
                        <div>
                            {recentlySuccessful && (
                                <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                                    <Save className="w-4 h-4" />
                                    {t('Changes saved successfully!')}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm"
                        >
                            {processing ? t('Saving...') : t('Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
