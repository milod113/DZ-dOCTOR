import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    FlaskConical, Search, MapPin, CheckCircle, User,
    Plus, X, FileText, Send, Clock, Calendar, AlertCircle,
    Building, ArrowRight, ChevronRight,
    Sparkles, Heart,
    UserCheck, Activity, Droplets,
    Thermometer, Syringe, Microscope, Dna, ClipboardCheck,
    Car, Info, Scan // Added Car and Info
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function CreatePrescription({ patient, commonTests, stats }: any) {
    // --- STATE ---
    const [labQuery, setLabQuery] = useState('');
    const [foundLabs, setFoundLabs] = useState<any[]>([]);
    const [selectedLabDetails, setSelectedLabDetails] = useState<any>(null); // New state to persist selected lab info
    const [isSearching, setIsSearching] = useState(false);
    const [customTestInput, setCustomTestInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [recommendedLabs, setRecommendedLabs] = useState<any[]>([]);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        patient_user_id: patient?.id || '',
        guest_name: patient?.name || '',
        laboratory_id: '',
        tests: [] as string[],
        note: '',
        priority: 'normal', // high, normal, low
        urgency_level: 'routine', // emergency, urgent, routine
        sample_type: 'blood', // blood, urine, other
        fasting_required: false,
        instructions: '',
        // --- NEW FIELDS ---
        is_home_visit: false,
        home_visit_address: patient?.address || '', // Pre-fill if available
        _method: 'POST'
    });

    // Test categories with icons and colors
    const testCategories = [
        { id: 'all', name: 'All Tests', icon: <FlaskConical className="w-4 h-4" />, color: 'bg-gray-100 text-gray-700' },
        { id: 'hematology', name: 'Hematology', icon: <Activity className="w-4 h-4" />, color: 'bg-rose-100 text-rose-700' },
        { id: 'biochemistry', name: 'Biochemistry', icon: <Droplets className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
        { id: 'hormonology', name: 'Hormonology', icon: <Thermometer className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-700' },
        { id: 'serology', name: 'Serology', icon: <Syringe className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
        { id: 'microbiology', name: 'Microbiology', icon: <Microscope className="w-4 h-4" />, color: 'bg-violet-100 text-violet-700' },
        { id: 'genetics', name: 'Genetics', icon: <Dna className="w-4 h-4" />, color: 'bg-pink-100 text-pink-700' },
    ];

    // Priority options
    const priorityOptions = [
        { value: 'high', label: 'High Priority', color: 'bg-rose-100 text-rose-700', icon: <AlertCircle className="w-4 h-4" /> },
        { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-4 h-4" /> },
        { value: 'low', label: 'Low Priority', color: 'bg-emerald-100 text-emerald-700', icon: <Calendar className="w-4 h-4" /> },
    ];

    // Urgency levels
    const urgencyOptions = [
        { value: 'emergency', label: 'Emergency', description: 'Results needed immediately', color: 'bg-rose-500' },
        { value: 'urgent', label: 'Urgent', description: 'Results within 4 hours', color: 'bg-amber-500' },
        { value: 'routine', label: 'Routine', description: 'Standard processing time', color: 'bg-emerald-500' },
    ];

    // Sample types
    const sampleTypes = [
        { value: 'blood', label: 'Blood Sample', icon: <Droplets className="w-4 h-4" /> },
        { value: 'urine', label: 'Urine Sample', icon: <Activity className="w-4 h-4" /> },
        { value: 'saliva', label: 'Saliva Sample', icon: <User className="w-4 h-4" /> },
        { value: 'tissue', label: 'Tissue Sample', icon: <Scan className="w-4 h-4" /> },
        { value: 'other', label: 'Other', icon: <FlaskConical className="w-4 h-4" /> },
    ];

    // --- EFFECTS ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (labQuery.length > 1) {
                setIsSearching(true);
                axios.get(route('doctor.api.labs.search'), { params: { query: labQuery } })
                    .then(response => {
                        setFoundLabs(response.data);
                        setIsSearching(false);

                        // Set recommended labs from search results
                        if (response.data.length > 0) {
                            setRecommendedLabs(response.data.slice(0, 3));
                        }
                    })
                    .catch(() => setIsSearching(false));
            } else {
                setFoundLabs([]);
                setRecommendedLabs([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [labQuery]);

    // Load recommended labs on mount (Mock or API)
    useEffect(() => {
        // TEMPORARY: Empty or you can uncomment if route exists
        setRecommendedLabs([]);
    }, []);

    // Focus search input when showing advanced search
    useEffect(() => {
        if (showAdvancedSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showAdvancedSearch]);

    // --- HANDLERS ---
    const toggleTest = (test: string) => {
        if (data.tests.includes(test)) {
            setData('tests', data.tests.filter(t => t !== test));
        } else {
            setData('tests', [...data.tests, test]);
        }
    };

    const addCustomTest = (e: React.FormEvent) => {
        e.preventDefault();
        if (customTestInput.trim() && !data.tests.includes(customTestInput)) {
            setData('tests', [...data.tests, customTestInput]);
            setCustomTestInput('');
        }
    };

    const selectLab = (lab: any) => {
        setData('laboratory_id', lab.id);
        setSelectedLabDetails(lab); // Store full object so we can check home_visit capabilities
        setLabQuery(lab.name);
        setFoundLabs([]);
        // Reset home visit if new lab doesn't support it
        if (!lab.offers_home_visit) {
            setData('is_home_visit', false);
        }
    };

    const clearLabSelection = () => {
        setData('laboratory_id', '');
        setSelectedLabDetails(null);
        setLabQuery('');
        setData('is_home_visit', false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('doctor.prescriptions.store'));
    };

    const filteredTests = commonTests.filter((test: string) => {
        const matchesSearch = test.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            test.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    // Stats for header
    const prescriptionStats = stats || {
        total: 0,
        pending: 0,
        completed: 0,
        avgResponseTime: '2h',
    };

    return (
        <AppLayout>
            <Head title="Create New Prescription" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
                {/* Background Elements */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/20"></div>
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">Create New Prescription</h1>
                                        <p className="text-gray-600">Send digital test requests directly to laboratories</p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-gray-600">Avg. Response: {prescriptionStats.avgResponseTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="text-gray-600">{prescriptionStats.pending} Pending</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {showAdvancedSearch ? 'Simple Mode' : 'Advanced Search'}
                                    <ChevronRight className={`w-4 h-4 transition-transform ${showAdvancedSearch ? 'rotate-90' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-between mb-8 relative">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className="relative z-10">
                                    <button
                                        onClick={() => setActiveStep(step)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            step === activeStep
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-110 shadow-lg'
                                                : step < activeStep
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {step < activeStep ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <span className="font-bold">{step}</span>
                                        )}
                                    </button>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-medium whitespace-nowrap">
                                        {[
                                            'Patient',
                                            'Laboratory',
                                            'Tests',
                                            'Details',
                                            'Review'
                                        ][step - 1]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={submit} className="space-y-8">
                                {/* STEP 1: PATIENT INFO */}
                                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 ${
                                    activeStep >= 1 ? 'opacity-100' : 'opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                                                <p className="text-gray-600">Select or enter patient details</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                            Required
                                        </span>
                                    </div>

                                    {patient ? (
                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                                                        {patient.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                                                                <p className="text-sm text-blue-600">ID: #{patient.id}</p>
                                                            </div>
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                                                                <UserCheck className="w-3 h-3" />
                                                                Registered Patient
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm text-gray-600">Age: {patient.age || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Heart className="w-4 h-4 text-gray-400" />
                                                                <span className="text-sm text-gray-600">Blood Type: {patient.blood_type || 'Unknown'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="hidden" name="patient_user_id" value={patient.id} />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                                    <h3 className="font-bold text-gray-900">Guest Patient</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <InputLabel value="Full Name *" className="text-gray-900 font-semibold" />
                                                        <TextInput
                                                            className="w-full py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                                            placeholder="Enter patient's full name"
                                                            value={data.guest_name}
                                                            onChange={e => setData('guest_name', e.target.value)}
                                                        />
                                                        <InputError message={errors.guest_name} />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <InputLabel value="Age" className="text-gray-900 font-medium" />
                                                            <TextInput
                                                                type="number"
                                                                className="w-full py-2.5"
                                                                placeholder="Age"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <InputLabel value="Gender" className="text-gray-900 font-medium" />
                                                            <select className="w-full border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500">
                                                                <option>Select</option>
                                                                <option>Male</option>
                                                                <option>Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <AlertCircle className="w-4 h-4" />
                                                Guest patients will receive results via SMS/Email
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* STEP 2: LABORATORY SELECTION */}
                                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 ${
                                    activeStep >= 2 ? 'opacity-100' : 'opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                                                <Building className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Laboratory Selection</h2>
                                                <p className="text-gray-600">Choose where to send the tests</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                            Required
                                        </span>
                                    </div>

                                    {/* Selected Lab Preview */}
                                    {data.laboratory_id && selectedLabDetails && (
                                        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                                        <FlaskConical className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{selectedLabDetails.name}</h3>
                                                        <p className="text-sm text-emerald-600 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {selectedLabDetails.address || selectedLabDetails.city}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearLabSelection}
                                                    className="p-2 hover:bg-white rounded-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-gray-400 hover:text-rose-500" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    <span>Avg. Response: 2h</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    <span>Verified</span>
                                                </div>
                                                {selectedLabDetails.offers_home_visit && (
                                                    <div className="flex items-center gap-2">
                                                        <Car className="w-4 h-4 text-blue-500" />
                                                        <span className="text-blue-600 font-medium">Home Visit</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Search Box */}
                                    <div className="relative mb-6">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            className="pl-10 pr-10 block w-full py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all"
                                            placeholder="Search laboratories by name, city, or specialty..."
                                            value={labQuery}
                                            onChange={e => setLabQuery(e.target.value)}
                                            disabled={!!data.laboratory_id}
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin h-4 w-4 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.laboratory_id} className="mt-2" />

                                    {/* Search Results or Recommended */}
                                    {!data.laboratory_id && (
                                        <div className="space-y-4">
                                            {foundLabs.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {foundLabs.slice(0, 6).map((lab) => (
                                                        <div
                                                            key={lab.id}
                                                            onClick={() => selectLab(lab)}
                                                            className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0">
                                                                    <FlaskConical className="w-6 h-6 text-blue-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                                        {lab.name}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {lab.city}
                                                                    </p>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                                        <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                                                                            {lab.specialty || 'General'}
                                                                        </span>
                                                                        {lab.offers_home_visit && (
                                                                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                                                                                <Car className="w-3 h-3" /> Home Visit
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : recommendedLabs.length > 0 && labQuery.length < 2 && (
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                                        Recommended Laboratories
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {recommendedLabs.map((lab) => (
                                                            <div
                                                                key={lab.id}
                                                                onClick={() => selectLab(lab)}
                                                                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
                                                            >
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                                                                        <FlaskConical className="w-5 h-5 text-emerald-600" />
                                                                    </div>
                                                                    {lab.offers_home_visit && (
                                                                         <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                                                                             <Car className="w-3 h-3" /> Visit
                                                                         </span>
                                                                    )}
                                                                </div>
                                                                <h5 className="font-bold text-gray-900 mb-1">{lab.name}</h5>
                                                                <p className="text-xs text-gray-500 mb-3">{lab.city}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* STEP 3: TEST SELECTION */}
                                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 ${
                                    activeStep >= 3 ? 'opacity-100' : 'opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-100 to-purple-100 flex items-center justify-center">
                                                <FlaskConical className="w-5 h-5 text-violet-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Test Selection</h2>
                                                <p className="text-gray-600">Choose required laboratory tests</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                                            Required
                                        </span>
                                    </div>

                                    {/* Filters and Search */}
                                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search tests..."
                                                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex overflow-x-auto gap-2 pb-2">
                                            {testCategories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(category.id)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                                                        selectedCategory === category.id
                                                            ? `${category.color} border ${category.color.replace('bg-', 'border-').replace('100', '200')}`
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {category.icon}
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Common Tests Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                                        {filteredTests.slice(0, 16).map((test: string) => (
                                            <button
                                                key={test}
                                                type="button"
                                                onClick={() => toggleTest(test)}
                                                className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                                                    data.tests.includes(test)
                                                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm'
                                                        : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {test}
                                                    </span>
                                                    {data.tests.includes(test) && (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {test.toLowerCase().includes('blood') ? 'Blood Sample' :
                                                     test.toLowerCase().includes('urine') ? 'Urine Sample' : 'Various'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Test Input */}
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <TextInput
                                                className="flex-1 py-3"
                                                placeholder="Add custom test (e.g., 'Vitamin D Level')"
                                                value={customTestInput}
                                                onChange={e => setCustomTestInput(e.target.value)}
                                                onKeyPress={e => e.key === 'Enter' && addCustomTest(e)}
                                            />
                                            <button
                                                type="button"
                                                onClick={addCustomTest}
                                                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Press Enter or click + to add custom test
                                        </p>
                                    </div>

                                    {/* Selected Tests */}
                                    {data.tests.length > 0 ? (
                                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                                                    <h4 className="font-bold text-gray-900">Selected Tests ({data.tests.length})</h4>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('tests', [])}
                                                    className="text-sm text-rose-600 hover:text-rose-800 font-medium"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {data.tests.map((test, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                                <FlaskConical className="w-4 h-4 text-emerald-600" />
                                                            </div>
                                                            <span className="font-medium text-gray-900">{test}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleTest(test)}
                                                            className="p-1 hover:bg-rose-50 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4 text-rose-400 hover:text-rose-600" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p>No tests selected yet</p>
                                            <p className="text-sm">Select tests from above or add custom ones</p>
                                        </div>
                                    )}
                                    <InputError message={errors.tests} className="mt-2" />
                                </div>

                                {/* STEP 4: ADDITIONAL DETAILS */}
                                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6 transition-all duration-300 ${
                                    activeStep >= 4 ? 'opacity-100' : 'opacity-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">Additional Details</h2>
                                                <p className="text-gray-600">Specify requirements and instructions</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                            Optional
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Priority and Urgency */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <InputLabel value="Priority Level" className="font-semibold" />
                                                <div className="space-y-2">
                                                    {priorityOptions.map((option) => (
                                                        <label
                                                            key={option.value}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                                data.priority === option.value
                                                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                                                                    : 'border-gray-200 hover:border-emerald-300'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="priority"
                                                                value={option.value}
                                                                checked={data.priority === option.value}
                                                                onChange={(e) => setData('priority', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${option.color.split(' ')[0]}`}>
                                                                {option.icon}
                                                            </div>
                                                            <span className="font-medium">{option.label}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <InputLabel value="Urgency Level" className="font-semibold" />
                                                <div className="space-y-2">
                                                    {urgencyOptions.map((option) => (
                                                        <label
                                                            key={option.value}
                                                            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                                data.urgency_level === option.value
                                                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50'
                                                                    : 'border-gray-200 hover:border-emerald-300'
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="urgency_level"
                                                                value={option.value}
                                                                checked={data.urgency_level === option.value}
                                                                onChange={(e) => setData('urgency_level', e.target.value)}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                                                                <div>
                                                                    <div className="font-medium">{option.label}</div>
                                                                    <div className="text-sm text-gray-500">{option.description}</div>
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sample Type and Fasting */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <InputLabel value="Sample Type" className="font-semibold" />
                                                <select
                                                    className="w-full border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-emerald-500 py-3"
                                                    value={data.sample_type}
                                                    onChange={(e) => setData('sample_type', e.target.value)}
                                                >
                                                    {sampleTypes.map((type) => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <InputLabel value="Additional Requirements" className="font-semibold" />
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.fasting_required}
                                                        onChange={(e) => setData('fasting_required', e.target.checked)}
                                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                                    />
                                                    <div>
                                                        <div className="font-medium">Fasting Required</div>
                                                        <div className="text-sm text-gray-500">Patient must fast for 8-12 hours</div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* HOME VISIT SECTION */}
                                        {selectedLabDetails?.offers_home_visit ? (
                                            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <label className="flex items-start gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_home_visit}
                                                        onChange={e => setData('is_home_visit', e.target.checked)}
                                                        className="mt-1 w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-bold text-gray-900 flex items-center gap-2">
                                                            <Car className="w-4 h-4" /> Request Home Visit (Prélèvement à domicile)
                                                        </span>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            The laboratory will come to the patient's address.
                                                            {selectedLabDetails.home_visit_price && (
                                                                <span className="ml-1 font-semibold text-emerald-700">
                                                                    (Extra Fee: +{selectedLabDetails.home_visit_price} DA)
                                                                </span>
                                                            )}
                                                        </p>

                                                        {data.is_home_visit && (
                                                            <div className="mt-3">
                                                                <InputLabel value="Home Address for Collection" />
                                                                <TextInput
                                                                    className="w-full mt-1"
                                                                    placeholder="Enter full address for the visit..."
                                                                    value={data.home_visit_address}
                                                                    onChange={e => setData('home_visit_address', e.target.value)}
                                                                />
                                                                <InputError message={errors.home_visit_address} className="mt-1" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                        ) : data.laboratory_id && (
                                            <div className="mt-4 text-sm text-gray-500 italic flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <Info className="w-4 h-4" /> This laboratory does not offer home visit services.
                                            </div>
                                        )}

                                        {/* Instructions */}
                                        <div className="space-y-3">
                                            <InputLabel value="Special Instructions for Laboratory" className="font-semibold" />
                                            <textarea
                                                className="w-full border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3 min-h-[100px]"
                                                placeholder="Enter any specific instructions, clinical context, or special handling requirements..."
                                                value={data.instructions}
                                                onChange={(e) => setData('instructions', e.target.value)}
                                            />
                                            <p className="text-sm text-gray-500">
                                                These instructions will be visible to the laboratory staff
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h3 className="font-bold text-emerald-800 text-lg mb-2">Ready to Send Prescription</h3>
                                            <p className="text-emerald-700">
                                                {data.tests.length} tests • {selectedLabDetails ? selectedLabDetails.name : 'No lab selected'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Link
                                                href={route('doctor.prescriptions.index')}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </Link>
                                            <PrimaryButton
                                                disabled={processing || data.tests.length === 0 || !data.laboratory_id}
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-bold"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {processing ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>Sending...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5" />
                                                            <span>Send Prescription</span>
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </div>
                                            </PrimaryButton>
                                        </div>
                                    </div>

                                    {recentlySuccessful && (
                                        <div className="mt-4 p-3 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Prescription sent successfully! Redirecting...
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Sidebar Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                                {/* Prescription Summary */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                        Prescription Summary
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Status</span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                Draft
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Tests Selected</span>
                                            <span className="font-bold text-gray-900">{data.tests.length}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Laboratory</span>
                                            <span className="font-medium text-gray-900 truncate max-w-[120px]">
                                                {selectedLabDetails ? selectedLabDetails.name : 'Not selected'}
                                            </span>
                                        </div>

                                        {data.is_home_visit && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Service</span>
                                                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Car className="w-3 h-3" /> Home Visit
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Priority</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                data.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                                                data.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                                                'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)}
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="text-sm text-gray-500 mb-2">Estimated Timeline</div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">Sample Collection</div>
                                                <div className="font-medium">Within 24h</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">Results Ready</div>
                                                <div className="font-medium">24-48h</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Tips */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
                                    <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-blue-600" />
                                        Quick Tips
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                                            <p className="text-sm text-blue-700">Select laboratories with fast response times for urgent cases</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                                            <p className="text-sm text-blue-700">Add clear instructions for accurate results</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                                            <p className="text-sm text-blue-700">Use custom tests for specialized requirements</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-4">Recent Activity</h3>
                                    <div className="space-y-3">
                                        {[
                                            { lab: 'BioLab Center', time: '2 hours ago', status: 'Completed' },
                                            { lab: 'MediTest Lab', time: 'Yesterday', status: 'In Progress' },
                                            { lab: 'HealthCare Labs', time: '2 days ago', status: 'Completed' },
                                        ].map((activity, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <FlaskConical className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{activity.lab}</div>
                                                    <div className="text-xs text-gray-500">{activity.time}</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    activity.status === 'Completed'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
