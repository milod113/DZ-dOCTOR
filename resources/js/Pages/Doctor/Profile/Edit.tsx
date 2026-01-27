import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    User,
    DollarSign,
    Clock,
    FileText,
    Save,
    Info,
    Camera,
    Mail,
    Shield,
    Sparkles,
    CheckCircle,
    TrendingUp,
    Award,
    Star,
    Zap,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from "@/lib/i18n";

export default function Edit({ profile }: any) {
    const { auth } = usePage().props as any;
    const { t } = useI18n();

    // Photo Upload State
    const fileInput = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(profile.photo_url);
    const [isDragging, setIsDragging] = useState(false);

    // Form Handling
    const { data, setData, errors, processing, recentlySuccessful } = useForm({
        bio: profile.bio || '',
        price_cents: profile.price_cents || 3000, // Default 3000 DA
        consultation_duration_min: profile.consultation_duration_min || 30,
        photo: null as File | null,
        _method: 'PATCH',
    });

    // Calculate stats
    const [stats, setStats] = useState({
        completion: 75,
        views: 1248,
        rating: 4.8
    });

    // Handle File Selection
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: any) => {
        e.preventDefault();
        router.post(route('doctor.profile.update'), data as any, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Update completion percentage
    useEffect(() => {
        let completion = 40; // Base
        if (data.bio && data.bio.length > 50) completion += 30;
        if (data.price_cents > 0) completion += 15;
        if (data.consultation_duration_min) completion += 15;
        setStats(prev => ({ ...prev, completion: Math.min(completion, 100) }));
    }, [data.bio, data.price_cents, data.consultation_duration_min]);

    return (
        <AppLayout>
            <Head title={t('Edit Profile')} />

            <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
                {/* Header with Stats */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{t('Professional Profile')}</h1>
                                <p className="text-gray-600">Manage your public information, consultation settings, and professional image</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-xl border border-emerald-100">
                            <div className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Profile Completion: {stats.completion}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Profile Views</div>
                                <div className="text-3xl font-bold text-gray-900 mt-2">{stats.views.toLocaleString()}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Average Rating</div>
                                <div className="text-3xl font-bold text-amber-600 mt-2">{stats.rating}</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                                <Star className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Consultation Fee</div>
                                <div className="text-3xl font-bold text-emerald-600 mt-2">{data.price_cents / 100} DA</div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                                <p className="text-gray-600 mt-1">Update your professional information and preferences</p>
                            </div>
                            <div className="w-full sm:w-auto">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-green-400 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.completion}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">{stats.completion}% Complete</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit}>
                        {/* Photo Upload Section */}
                        <div className="p-8 border-b border-gray-100">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                <div className="relative group">
                                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200">
                                        <img
                                            src={preview || `https://ui-avatars.com/api/?name=${auth.user.name}&background=8B5CF6&color=ffffff&bold=true&size=256`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    {/* Upload Overlay */}
                                    <div
                                        className={`absolute inset-0 rounded-2xl flex items-center justify-center ${isDragging ? 'bg-blue-500/20 border-2 border-blue-400 border-dashed' : ''} transition-all`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInput.current?.click()}
                                    >
                                        <div className={`${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex flex-col items-center`}>
                                            <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                                            <span className="text-white text-sm font-medium mt-1">Drop or click</span>
                                        </div>
                                    </div>

                                    {/* Upload Button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInput.current?.click()}
                                        className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                        title={t('Change Photo')}
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInput}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">Dr. {auth.user.name}</h3>
                                        <p className="text-gray-500 text-sm mb-3">Upload a professional photo for your profile</p>
                                        {errors.photo && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">{errors.photo}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                                            <div className="text-xs font-semibold text-blue-700 uppercase">Format</div>
                                            <div className="text-sm font-medium text-gray-700">JPG, PNG, GIF</div>
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-100">
                                            <div className="text-xs font-semibold text-blue-700 uppercase">Max Size</div>
                                            <div className="text-sm font-medium text-gray-700">5 MB</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Read-only Info Section */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-8 border-b border-gray-200">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Account Information</h3>
                                    <p className="text-gray-600 text-sm">Contact support to change these verified details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor Name</label>
                                    <div className="flex items-center gap-3 font-medium text-gray-700 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold">Dr. {auth.user.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center gap-3 font-medium text-gray-700 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold">{auth.user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Editable Fields Section */}
                        <div className="p-8 space-y-8">
                            {/* Bio Field */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <label className="text-lg font-bold text-gray-900">Professional Bio</label>
                                            <p className="text-sm text-gray-500">Describe your expertise and approach</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">{data.bio.length}/500 characters</div>
                                </div>
                                <textarea
                                    rows={6}
                                    className="w-full rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all duration-300 resize-none"
                                    placeholder="Describe your medical experience, specialties, treatment philosophy, and what patients can expect from your care..."
                                    value={data.bio}
                                    onChange={e => setData('bio', e.target.value)}
                                    maxLength={500}
                                />
                                {errors.bio && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.bio}
                                    </div>
                                )}
                            </div>

                            {/* Price & Duration Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Price Field */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <label className="text-lg font-bold text-gray-900">Consultation Fee</label>
                                            <p className="text-sm text-gray-500">Standard fee for new patients</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            className="w-full pl-14 pr-16 py-3.5 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm group-hover:shadow-md transition-all"
                                            value={data.price_cents / 100}
                                            onChange={e => setData('price_cents', Number(e.target.value) * 100)}
                                            placeholder="0.00"
                                            step="100"
                                            min="0"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <span className="text-gray-500 font-bold">DA</span>
                                        </div>
                                    </div>
                                    {errors.price_cents && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.price_cents}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Recommended range: 2000 - 5000 DA</span>
                                        <span className="font-medium text-emerald-600">Popular choice</span>
                                    </div>
                                </div>

                                {/* Duration Field */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <label className="text-lg font-bold text-gray-900">Session Duration</label>
                                            <p className="text-sm text-gray-500">Standard consultation time</p>
                                        </div>
                                    </div>
                                    <select
                                        className="w-full py-3.5 pl-14 pr-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm hover:shadow-md transition-all appearance-none bg-white"
                                        value={data.consultation_duration_min}
                                        onChange={e => setData('consultation_duration_min', Number(e.target.value))}
                                    >
                                        <option value="15">15 Minutes</option>
                                        <option value="20">20 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="45">45 Minutes</option>
                                        <option value="60">60 Minutes</option>
                                    </select>
                                    {errors.consultation_duration_min && (
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.consultation_duration_min}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        Most doctors choose 30 minutes for standard consultations
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {recentlySuccessful && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 animate-in slide-in-from-left">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                            <span className="text-emerald-700 font-medium">Profile updated successfully!</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => router.visit(route('doctor.dashboard'))}
                                        className="px-6 py-2.5 bg-gradient-to-r from-white to-gray-50 text-gray-700 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            {processing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-5 h-5" />
                                                    <span>Save Changes</span>
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tips Card */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">Profile Optimization Tips</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Professional Photo</div>
                                        <div className="text-xs text-gray-600">Increases profile views by 40%</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Detailed Bio</div>
                                        <div className="text-xs text-gray-600">Boosts patient confidence and bookings</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for Eye icon (since it wasn't imported) */}
            <style jsx>{`
                @keyframes slideInFromLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-in {
                    animation: slideInFromLeft 0.3s ease-out;
                }
            `}</style>
        </AppLayout>
    );
}

// Eye icon component since it wasn't imported
function Eye(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
