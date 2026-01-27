import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    MapPin, Phone, Clock, Globe, ShieldCheck,
    Scan, Activity, Users, Zap,
    Sparkles, Heart, Shield, Info, X,
    ChevronDown, ChevronUp, ChevronRight, Upload,
    Mail, Navigation, Thermometer,
    TrendingUp, Eye, Share2,
    CheckCircle, Star, AlertCircle,
    Calendar // ✅ Add this missing import
} from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PatientSelector from '@/Components/Booking/PatientSelector'; // ✅ 1. Import

// ✅ 2. Add family_members to props with default empty array
export default function ImagingProfile({ center, groupedExams, family_members = [] }: any) {
    const { auth } = usePage().props as any;

    // --- STATE ---
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [isFavorited, setIsFavorited] = useState(false);
    const [showAllEquipment, setShowAllEquipment] = useState(false);
    const [activeTab, setActiveTab] = useState<'exams' | 'reviews' | 'gallery'>('exams');

    // Modals
    const [selectedExamDetails, setSelectedExamDetails] = useState<any>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [bookingExam, setBookingExam] = useState<any>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // --- FORM HANDLING ---
    const { data, setData, post, processing, errors, reset } = useForm({
        imaging_center_id: center.id,
        imaging_exam_id: '',
        family_member_id: null as number | null, // ✅ 3. Add to form state
        requested_date: '',
        prescription: null as File | null,
        notes: ''
    });

    // --- HANDLERS ---
    const openBookingModal = (exam: any = null) => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        setBookingExam(exam);
        setData(data => ({
            ...data,
            imaging_exam_id: exam ? exam.id : '',
            family_member_id: null // Reset to "Me"
        }));

        if (selectedExamDetails) setSelectedExamDetails(null);
        setIsBookingModalOpen(true);
    };

    const submitBooking = (e: any) => {
        e.preventDefault();

        post(route('patient.imaging.request'), {
            forceFormData: true, // Important for file uploads
            onSuccess: () => {
                setIsBookingModalOpen(false);
                reset();
            }
        });
    };

    const shareCenter = () => {
        if (navigator.share) {
            navigator.share({
                title: center.name,
                text: `Découvrez ${center.name} sur DzDoctor`,
                url: window.location.href,
            });
        } else {
            setIsShareModalOpen(true); // You can implement a simple modal for copy link here
        }
    };

    // --- DATA PREP ---
    const categories = Object.keys(groupedExams);
    const averageRating = center.reviews_avg_rating ? parseFloat(center.reviews_avg_rating).toFixed(1) : '4.8';
    const reviewsCount = center.reviews_count || 120;
    const displayedEquipment = showAllEquipment
        ? center.equipment_list
        : (center.equipment_list || []).slice(0, 6);

    // Stats calculations
    const stats = {
        satisfaction: '98%',
        responseTime: '≤2h',
        patientsPerDay: '45',
        accuracy: '99.5%'
    };

    return (
        <AppLayout>
            <Head title={`${center.name} - Imagerie Médicale`} />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                {/* Hero Background */}
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-blue-900/20 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                    {/* --- 1. HEADER SECTION --- */}
                    <div className="relative mb-10">
                        <Link
                            href={route('imaging.search')}
                            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium mb-6 group transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Retour aux centres d'imagerie
                        </Link>

                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                                    {/* Logo & Stats */}
                                    <div className="relative flex-shrink-0">
                                        <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-xl overflow-hidden group">
                                            {center.logo_path ? (
                                                <img
                                                    src={`/storage/${center.logo_path}`}
                                                    alt={center.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="relative">
                                                    <Scan className="w-16 h-16 lg:w-20 lg:h-20 text-indigo-400 dark:text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 dark:from-indigo-600/20 dark:to-purple-600/20 blur-xl"></div>
                                                </div>
                                            )}
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                <ShieldCheck className="w-4 h-4 text-white" />
                                            </div>
                                        </div>

                                        {/* Rating & Stats */}
                                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[200%]">
                                            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-around">
                                                <div className="text-center">
                                                    <div className="flex items-center gap-1 justify-center mb-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-bold text-gray-900 dark:text-white">{averageRating}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{reviewsCount} avis</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{stats.patientsPerDay}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Patients/jour</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{stats.satisfaction}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{center.name}</h1>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                                                            <ShieldCheck className="w-3 h-3" /> Certifié
                                                        </span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => setIsFavorited(!isFavorited)}
                                                                className={`p-2 rounded-full transition-all duration-300 ${isFavorited ? 'bg-red-50 dark:bg-red-900/30 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-400 dark:hover:text-red-400'}`}
                                                            >
                                                                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                                                            </button>
                                                            <button
                                                                onClick={shareCenter}
                                                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                            >
                                                                <Share2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                                                    <MapPin className="w-5 h-5 text-indigo-400 dark:text-indigo-500" />
                                                    <span className="font-medium">{center.address}, {center.city}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            {center.phone && (
                                                <a href={`tel:${center.phone}`} className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all group">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                                        <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Téléphone</div>
                                                        <div className="font-bold text-gray-900 dark:text-white truncate">{center.phone}</div>
                                                    </div>
                                                </a>
                                            )}
                                            {center.website && (
                                                <a href={center.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all group">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                                        <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Site Web</div>
                                                        <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{center.website.replace(/^https?:\/\//, '')}</div>
                                                    </div>
                                                </a>
                                            )}
                                            {center.email && (
                                                <a href={`mailto:${center.email}`} className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md transition-all group">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg group-hover:scale-110 transition-transform">
                                                        <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                                                        <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{center.email}</div>
                                                    </div>
                                                </a>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-3">
                                            {center.has_parking && <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Parking</span>}
                                            {center.has_wheelchair_access && <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Accès PMR</span>}
                                            {center.has_emergency && <span className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"><Zap className="w-4 h-4" /> Urgences</span>}
                                            {center.has_online_payment && <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"><CreditCard className="w-4 h-4" /> Paiement en ligne</span>}
                                        </div>
                                    </div>

                                    {/* CTA Box */}
                                    <div className="lg:w-80">
                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden border border-indigo-500/30">
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="relative">
                                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                                        <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></div>
                                                    </div>
                                                    <span className="text-emerald-100 font-medium">Ouvert aujourd'hui</span>
                                                </div>

                                                <button
                                                    onClick={() => openBookingModal()}
                                                    className="w-full bg-white text-indigo-700 hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
                                                >
                                                    <Calendar className="w-5 h-5" />
                                                    Prendre RDV
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </button>

                                                <div className="mt-4 text-center text-indigo-200 text-sm flex items-center justify-center gap-2">
                                                    <Sparkles className="w-4 h-4" />
                                                    Réservation instantanée
                                                </div>
                                            </div>
                                            <div className="bg-indigo-800/50 backdrop-blur-sm border-t border-indigo-500/30 px-6 py-3">
                                                <div className="grid grid-cols-2 gap-4 text-xs text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        <span>≤48h</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="w-3 h-3" />
                                                        <span>100% sécurisé</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                            <button onClick={() => setActiveTab('exams')} className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'exams' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Examens</div>
                            </button>
                            <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                <div className="flex items-center gap-2"><Star className="w-4 h-4" /> Avis ({reviewsCount})</div>
                            </button>
                            <button onClick={() => setActiveTab('gallery')} className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'gallery' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> Galerie</div>
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Navigation className="w-4 h-4" /> Itinéraire
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- 2. LEFT CONTENT --- */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description Card */}
                            {center.description && (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                                                <Info className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">À propos du centre</h2>
                                        </div>
                                        <div className="prose prose-lg max-w-none dark:prose-invert">
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{center.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Exam Catalog */}
                            {activeTab === 'exams' && (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-8 py-6 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md">
                                                        <Activity className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Examens Disponibles</h2>
                                                        <p className="text-gray-500 dark:text-gray-400">Choisissez votre examen et réservez en ligne</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <button onClick={() => setSelectedCategory('All')} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${selectedCategory === 'All' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'}`}>Tout voir</button>
                                                    {categories.map(cat => (
                                                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${selectedCategory === cat ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'}`}>{cat}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {Object.keys(groupedExams).map((modality) => {
                                                if (selectedCategory !== 'All' && selectedCategory !== modality) return null;
                                                return (
                                                    <div key={modality} className="group/modality">
                                                        <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 px-8 py-4 border-b border-gray-100 dark:border-gray-700">
                                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-3">
                                                                <Scan className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                                                {modality}
                                                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">{groupedExams[modality].length} examens</span>
                                                            </h3>
                                                        </div>
                                                        {groupedExams[modality].map((exam: any) => (
                                                            <div key={exam.id} className="p-6 hover:bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group/exam cursor-pointer" onClick={() => setSelectedExamDetails(exam)}>
                                                                <div className="flex justify-between items-start gap-6">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="flex-shrink-0">
                                                                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center group-hover/exam:scale-110 transition-transform duration-300">
                                                                                    <Scan className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover/exam:text-indigo-600 dark:group-hover/exam:text-indigo-400 transition-colors">{exam.name}</h3>
                                                                                {exam.description && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{exam.description}</p>}
                                                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                                                                                    {exam.duration && <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-lg"><Clock className="w-4 h-4 text-indigo-400 dark:text-indigo-500" /> {exam.duration}</span>}
                                                                                    {exam.preparation_notes && <span className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg"><AlertCircle className="w-4 h-4" /> {exam.preparation_notes}</span>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right flex-shrink-0">
                                                                        {exam.price ? (
                                                                            <div className="mb-3">
                                                                                <div className="text-xs text-gray-500 dark:text-gray-400">À partir de</div>
                                                                                <div className="font-bold text-2xl text-emerald-600 dark:text-emerald-400 mb-1">{exam.price} DA</div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-sm text-gray-400 dark:text-gray-500 mb-3">Sur devis</div>
                                                                        )}
                                                                        <button onClick={(e) => { e.stopPropagation(); openBookingModal(exam); }} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md flex items-center gap-2">
                                                                            Réserver <ChevronRight className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                                            <Star className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Avis des Patients</h2>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-gray-900 dark:text-white">{averageRating}</span>
                                                </div>
                                                <span className="text-gray-500 dark:text-gray-400">({reviewsCount} avis)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center py-8 text-gray-500">Les avis seront bientôt disponibles.</div>
                                </div>
                            )}
                        </div>

                        {/* --- 3. RIGHT SIDEBAR --- */}
                        <div className="space-y-8">
                            {/* Opening Hours */}
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 transition-colors">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">Horaires</h3>
                                </div>
                                <div className="space-y-4">
                                    {center.opening_hours ? Object.entries(center.opening_hours).map(([day, hours]: any) => (
                                        <div key={day} className={`flex justify-between items-center p-3 rounded-xl transition-colors ${hours.isOpen ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                                            <span className={`font-medium ${hours.isOpen ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{day}</span>
                                            {hours.isOpen ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 dark:text-white">{hours.start} - {hours.end}</span>
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                </div>
                                            ) : (
                                                <span className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-lg">Fermé</span>
                                            )}
                                        </div>
                                    )) : <div className="text-center py-4 text-gray-500 dark:text-gray-400">Non renseigné</div>}
                                </div>
                            </div>

                            {/* Equipment Card */}
                            {center.equipment_list && center.equipment_list.length > 0 && (
                                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl overflow-hidden border border-indigo-500/30 p-8 text-white">
                                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"><Thermometer className="w-6 h-6" /></div>
                                        Équipements
                                    </h3>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {displayedEquipment.map((item: string, idx: number) => (
                                            <span key={idx} className="bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors cursor-pointer">{item}</span>
                                        ))}
                                    </div>
                                    {center.equipment_list.length > 6 && (
                                        <button onClick={() => setShowAllEquipment(!showAllEquipment)} className="w-full bg-white/10 backdrop-blur-sm py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center gap-2 font-medium">
                                            {showAllEquipment ? <><ChevronUp className="w-4 h-4" /> Voir moins</> : <><ChevronDown className="w-4 h-4" /> Voir tous</>}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Stats Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg"><TrendingUp className="w-6 h-6 text-white" /></div>
                                    Statistiques
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">Précision des résultats</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{stats.accuracy}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">Temps de réponse</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{stats.responseTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">Satisfaction patients</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{stats.satisfaction}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 4. DETAILS MODAL (View Only) --- */}
                {selectedExamDetails && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center">
                                <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{selectedExamDetails.name}</h3>
                                <button onClick={() => setSelectedExamDetails(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Détails</h4>
                                        <div className="space-y-4">
                                            {selectedExamDetails.description && (
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</div>
                                                    <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.description}</p>
                                                </div>
                                            )}
                                            {selectedExamDetails.duration && (
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Durée</div>
                                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                        <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                                        {selectedExamDetails.duration}
                                                    </div>
                                                </div>
                                            )}
                                            {selectedExamDetails.preparation_notes && (
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Préparation</div>
                                                    <div className="flex items-start gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
                                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                        {selectedExamDetails.preparation_notes}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Réservation</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Prix</div>
                                                {selectedExamDetails.price ? (
                                                    <div className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                                                        {selectedExamDetails.price} DA
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500 dark:text-gray-400">Sur devis</div>
                                                )}
                                            </div>
                                            <button onClick={() => openBookingModal(selectedExamDetails)} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all shadow-md">
                                                Réserver cet examen
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- 5. BOOKING MODAL (UPDATED WITH FAMILY SELECTOR) --- */}
                <Modal show={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} maxWidth="2xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-colors">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Demande de Rendez-vous</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{center.name}</p>
                                </div>
                                <button onClick={() => setIsBookingModalOpen(false)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {bookingExam && (
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Examen sélectionné</div>
                                        <div className="font-bold text-gray-900 dark:text-white">{bookingExam.name}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submitBooking} className="p-6 space-y-5">

                            {/* ✅ 4. FAMILY MEMBER SELECTOR */}
                            {family_members.length > 0 && (
                                <div className="pb-5 border-b border-gray-100 dark:border-gray-700">
                                    <PatientSelector
                                        members={family_members}
                                        selectedId={data.family_member_id}
                                        onSelect={(id: number | null) => setData('family_member_id', id)}
                                    />
                                </div>
                            )}

                            <div>
                                <InputLabel htmlFor="requested_date" value="Date souhaitée" className="dark:text-gray-300" />
                                <TextInput
                                    id="requested_date"
                                    type="datetime-local"
                                    className="mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                    value={data.requested_date}
                                    onChange={(e) => setData('requested_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.requested_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="prescription" value="Ordonnance (Photo/PDF)" className="dark:text-gray-300" />
                                <label htmlFor="prescription-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer relative group w-full">
                                    <div className="space-y-2 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 transition-colors flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">Télécharger un fichier</span>
                                            <input id="prescription-upload" name="prescription" type="file" className="sr-only" accept="image/*,application/pdf" onChange={(e) => setData('prescription', e.target.files ? e.target.files[0] : null)} />
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF jusqu'à 10MB</p>
                                    </div>
                                    {data.prescription && (
                                        <div className="absolute inset-0 bg-green-50 dark:bg-emerald-900/30 flex flex-col items-center justify-center rounded-xl border border-green-200 dark:border-emerald-800 z-10">
                                            <CheckCircle className="w-8 h-8 text-green-500 dark:text-emerald-400 mb-2" />
                                            <p className="text-green-700 dark:text-emerald-300 font-medium text-sm">Fichier sélectionné</p>
                                            <p className="text-green-600 dark:text-emerald-400 text-xs px-2 text-center truncate w-full">{data.prescription.name}</p>
                                        </div>
                                    )}
                                </label>
                                <InputError message={errors.prescription} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="Notes additionnelles (Optionnel)" className="dark:text-gray-300" />
                                <textarea
                                    id="notes"
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                                    rows={3}
                                    placeholder="Précisions sur votre état, allergies, etc."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <SecondaryButton onClick={() => setIsBookingModalOpen(false)} className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Annuler</SecondaryButton>
                                <PrimaryButton disabled={processing} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-transparent">
                                    {processing ? 'Envoi en cours...' : 'Confirmer le Rendez-vous'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </AppLayout>
    );
}
