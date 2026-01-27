import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    MapPin, Phone, Globe, Clock, Search, FlaskConical,
    CheckCircle, Car, Star, ShieldCheck, Calendar, Users,
    Award, Zap, Sparkles, ChevronRight, Filter, Download,
    Share2, Heart, MessageSquare, Bookmark, Home, Building,
    Droplets, Activity, Thermometer, Syringe, Microscope,
    Dna, Pill, Brain, Stethoscope, AlertCircle, Info,
    ArrowRight, Eye, FileText, Printer, Mail, Map,
    Navigation, Compass, Target, TrendingUp, BarChart3,
    Shield, Lock, Bell, CreditCard, Wallet, User,
    BookOpen, ClipboardCheck, BadgeCheck, Sparkle,
    CalendarDays, PhoneCall, Mailbox, ExternalLink,
    MoreVertical, X, Plus, Minus, Maximize2, Minimize2
} from 'lucide-react';

export default function LabProfile({ lab, tests, stats }: any) {
    const [searchTest, setSearchTest] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedTest, setExpandedTest] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('catalog');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showAllTests, setShowAllTests] = useState(false);
    const [testCount, setTestCount] = useState(8);

    // Stats for the lab
    const labStats = stats || {
        rating: 4.8,
        totalReviews: 120,
        monthlyPatients: 450,
        avgResponseTime: '2.4h',
        satisfactionRate: '96%',
        verifiedSince: '2022',
    };

    // Test categories
    const categories = [
        { id: 'all', name: 'All Tests', icon: <FlaskConical className="w-4 h-4" />, count: tests.length },
        { id: 'biochemistry', name: 'Biochemistry', icon: <Droplets className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'biochemistry').length },
        { id: 'hematology', name: 'Hematology', icon: <Activity className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'hematology').length },
        { id: 'hormonology', name: 'Hormonology', icon: <Thermometer className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'hormonology').length },
        { id: 'serology', name: 'Serology', icon: <Syringe className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'serology').length },
        { id: 'microbiology', name: 'Microbiology', icon: <Microscope className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'microbiology').length },
        { id: 'genetics', name: 'Genetics', icon: <Dna className="w-4 h-4" />, count: tests.filter((t: any) => t.category === 'genetics').length },
    ];

    // Filter tests based on search and category
    const filteredTests = tests.filter((test: any) => {
        const matchesSearch = test.name.toLowerCase().includes(searchTest.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }).slice(0, showAllTests ? undefined : testCount);

    const tabs = [
        { id: 'catalog', label: 'Test Catalog', icon: <FlaskConical className="w-4 h-4" /> },
        { id: 'info', label: 'Information', icon: <Info className="w-4 h-4" /> },
        { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
        { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
    ];

    const getTestIcon = (category: string) => {
        switch (category) {
            case 'biochemistry': return <Droplets className="w-4 h-4 text-blue-500" />;
            case 'hematology': return <Activity className="w-4 h-4 text-rose-500" />;
            case 'hormonology': return <Thermometer className="w-4 h-4 text-emerald-500" />;
            case 'serology': return <Syringe className="w-4 h-4 text-amber-500" />;
            case 'microbiology': return <Microscope className="w-4 h-4 text-violet-500" />;
            case 'genetics': return <Dna className="w-4 h-4 text-pink-500" />;
            default: return <FlaskConical className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatOpeningHours = (hours: any) => {
        if (!hours) return null;
        return Object.entries(hours).map(([day, data]: [string, any]) => (
            <div key={day} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 capitalize">{day}</span>
                <span className={`font-medium ${data.closed ? 'text-rose-500' : 'text-gray-900'}`}>
                    {data.closed ? 'Closed' : `${data.open} - ${data.close}`}
                </span>
            </div>
        ));
    };

    return (
        <AppLayout>
            <Head title={`${lab.name} - Medical Laboratory`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
                {/* Background Elements */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/20"></div>
                    <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10">
                    {/* Hero Header */}
                    <div className="relative overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                        {/* Floating Elements */}
                        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Logo */}
                                <div className="relative group">
                                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-4 border-white/30 shadow-2xl overflow-hidden flex items-center justify-center">
                                        {lab.logo_path ? (
                                            <img
                                                src={`/storage/${lab.logo_path}`}
                                                alt={lab.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <Building className="w-16 h-16 text-white/80 mx-auto" />
                                                <span className="text-white/60 text-sm mt-2 block">{lab.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-white">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <h1 className="text-4xl font-bold">{lab.name}</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> Verified
                                            </span>
                                            {lab.offers_home_visit && (
                                                <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-white text-sm font-bold rounded-full flex items-center gap-1">
                                                    <Car className="w-3 h-3" /> Home Collection
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-lg text-blue-100 mb-6 max-w-3xl leading-relaxed">
                                        {lab.description || "Comprehensive medical laboratory offering a wide range of diagnostic tests with advanced technology and expert medical staff."}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-blue-200" />
                                            <span className="font-medium">{lab.address}, {lab.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-5 h-5 text-blue-200" />
                                            <span className="font-medium">{lab.phone || "Contact not provided"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-200">
                                            <Clock className="w-5 h-5" />
                                            <span className="font-medium">Open Today • 08:00 - 17:00</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <span className="font-bold text-xl">{labStats.rating}</span>
                                            <span className="text-blue-200">({labStats.totalReviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-200" />
                                            <span>{labStats.monthlyPatients.toLocaleString()}+ patients/month</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-emerald-300" />
                                            <span>Avg. response: {labStats.avgResponseTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Box */}
                                <div className="w-full lg:w-auto">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-yellow-300" />
                                                <span className="text-white font-bold">Premium Laboratory</span>
                                            </div>
                                            <button
                                                onClick={() => setIsBookmarked(!isBookmarked)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-white/60'}`} />
                                            </button>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-2xl font-bold text-white mb-1">Book Your Test</div>
                                            <div className="text-blue-100 text-sm">Fast & reliable results</div>
                                        </div>
<div className="space-y-3">
    {/* Option 1: Standard Appointment */}
    <Link
        href={route('laboratory.booking.create', lab.id)}
        className="block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
    >
        <div className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Book Appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
    </Link>

    {/* Option 2: Home Visit */}
    {lab.offers_home_visit && (
        <Link
            href={route('laboratory.booking.create', { laboratory: lab.id, type: 'home_visit' })}
            className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
        >
            <div className="flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Request Home Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    )}
</div>

                                        <div className="mt-4 pt-4 border-t border-white/20">
                                            <div className="text-sm text-blue-100 flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                HIPAA Compliant • Secure Results
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left Content - 2/3 width */}
                            <div className="lg:w-2/3">
                                {/* Tabs */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
                                    <div className="border-b border-gray-100">
                                        <div className="flex overflow-x-auto">
                                            {tabs.map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                                                        activeTab === tab.id
                                                            ? 'border-emerald-500 text-emerald-700 bg-emerald-50/50'
                                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {tab.icon}
                                                        {tab.label}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Test Catalog Tab */}
                                        {activeTab === 'catalog' && (
                                            <div className="space-y-6">
                                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                                            <FlaskConical className="w-6 h-6 text-emerald-600" />
                                                            Test Catalog
                                                        </h2>
                                                        <p className="text-gray-600 mt-1">
                                                            Browse our comprehensive range of diagnostic tests
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search tests..."
                                                                className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                                                value={searchTest}
                                                                onChange={(e) => setSearchTest(e.target.value)}
                                                            />
                                                        </div>
                                                        <button className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                                            <Filter className="w-5 h-5 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Categories */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {categories.map((category) => (
                                                        <button
                                                            key={category.id}
                                                            onClick={() => setSelectedCategory(category.id)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                                                                selectedCategory === category.id
                                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {category.icon}
                                                            {category.name}
                                                            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                                                                {category.count}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Tests Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {filteredTests.length > 0 ? (
                                                        filteredTests.map((test: any) => (
                                                            <div
                                                                key={test.id}
                                                                className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 ${
                                                                    expandedTest === test.id
                                                                        ? 'border-emerald-500 shadow-md'
                                                                        : 'border-gray-100 hover:border-emerald-300'
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                            {getTestIcon(test.category)}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-bold text-gray-900">{test.name}</h3>
                                                                            <div className="text-xs text-gray-500">
                                                                                {test.category ? test.category.charAt(0).toUpperCase() + test.category.slice(1) : 'General'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                                                                        className="p-1 hover:bg-gray-100 rounded-lg"
                                                                    >
                                                                        {expandedTest === test.id ? (
                                                                            <Minus2 className="w-4 h-4 text-gray-400" />
                                                                        ) : (
                                                                            <Plus className="w-4 h-4 text-gray-400" />
                                                                        )}
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                            <Clock className="w-4 h-4" />
                                                                            {test.duration || 24}h
                                                                        </div>
                                                                        {test.fasting_required && (
                                                                            <div className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                                                                                Fasting Required
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xl font-bold text-gray-900">
                                                                        {test.price ? `${test.price} DA` : 'Price on request'}
                                                                    </div>
                                                                </div>

                                                                {expandedTest === test.id && (
                                                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                                                        {test.description && (
                                                                            <p className="text-sm text-gray-600">{test.description}</p>
                                                                        )}
                                                                        {test.conditions && (
                                                                            <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                                                                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                                                                <span>{test.conditions}</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                            <ClipboardCheck className="w-4 h-4" />
                                                                            <span>Sample: {test.sample_type || 'Blood'}</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-span-2 text-center py-12">
                                                            <FlaskConical className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Tests Found</h3>
                                                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {tests.length > testCount && !showAllTests && (
                                                    <div className="text-center pt-6">
                                                        <button
                                                            onClick={() => setShowAllTests(true)}
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
                                                        >
                                                            <Plus className="w-5 h-5" />
                                                            Show All {tests.length} Tests
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Info Tab */}
                                        {activeTab === 'info' && (
                                            <div className="space-y-6">
                                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                                                    <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center gap-2">
                                                        <Building className="w-5 h-5" />
                                                        About Our Laboratory
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <p className="text-blue-700 leading-relaxed">
                                                                {lab.description || "We are a state-of-the-art medical laboratory dedicated to providing accurate and timely diagnostic services. Our facility is equipped with the latest technology and staffed by experienced medical professionals committed to excellence in healthcare."}
                                                            </p>
                                                            <div className="mt-4 space-y-3">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    <span className="text-sm text-blue-700">ISO 15189 Certified</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    <span className="text-sm text-blue-700">Advanced Equipment</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                                    <span className="text-sm text-blue-700">Expert Medical Staff</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                                                <div className="text-sm text-blue-500 mb-1">License Number</div>
                                                                <div className="font-bold text-gray-900">{lab.license_number || 'LAB-2024-001'}</div>
                                                            </div>
                                                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                                                <div className="text-sm text-blue-500 mb-1">Founded</div>
                                                                <div className="font-bold text-gray-900">{lab.founded_year || '2018'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Services */}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg mb-4">Our Services</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {[
                                                            { icon: <Droplets className="w-6 h-6" />, label: 'Blood Tests' },
                                                            { icon: <Activity className="w-6 h-6" />, label: 'Urine Analysis' },
                                                            { icon: <Dna className="w-6 h-6" />, label: 'Genetic Testing' },
                                                            { icon: <Microscope className="w-6 h-6" />, label: 'Microbiology' },
                                                            { icon: <Car className="w-6 h-6" />, label: 'Home Collection' },
                                                            { icon: <FileText className="w-6 h-6" />, label: 'Online Reports' },
                                                            { icon: <Shield className="w-6 h-6" />, label: 'Corporate Health' },
                                                            { icon: <Users className="w-6 h-6" />, label: 'Family Packages' },
                                                        ].map((service, idx) => (
                                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-emerald-300 hover:shadow-md transition-all">
                                                                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-2">
                                                                    {service.icon}
                                                                </div>
                                                                <div className="font-medium text-gray-900">{service.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Insurance & Payment Info */}
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-emerald-800 text-lg">Insurance & Payments</h3>
                                            <p className="text-emerald-700">Accepted payment methods and insurance coverage</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="w-5 h-5 text-emerald-600" />
                                                <span className="font-bold text-gray-900">Payment Methods</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-600">• Cash</div>
                                                <div className="text-sm text-gray-600">• Credit/Debit Cards</div>
                                                <div className="text-sm text-gray-600">• Mobile Payment</div>
                                                <div className="text-sm text-gray-600">• Bank Transfer</div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield className="w-5 h-5 text-emerald-600" />
                                                <span className="font-bold text-gray-900">Insurance Accepted</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-600">• CHIFA Card</div>
                                                <div className="text-sm text-gray-600">• Major Insurance Companies</div>
                                                <div className="text-sm text-gray-600">• Corporate Health Plans</div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl p-4 border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                <span className="font-bold text-gray-900">Digital Services</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-600">• Online Results</div>
                                                <div className="text-sm text-gray-600">• Mobile App Access</div>
                                                <div className="text-sm text-gray-600">• Email Reports</div>
                                                <div className="text-sm text-gray-600">• SMS Notifications</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar - 1/3 width */}
                            <div className="lg:w-1/3">
                                <div className="space-y-6">
                                    {/* Opening Hours */}
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Opening Hours</h3>
                                                <p className="text-sm text-gray-500">Check our working hours</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            {lab.opening_hours ? (
                                                formatOpeningHours(lab.opening_hours)
                                            ) : (
                                                <>
                                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                                        <div key={day} className="flex justify-between text-sm py-2 border-b border-gray-100">
                                                            <span className="text-gray-600">{day}</span>
                                                            <span className="font-medium text-gray-900">08:00 - 17:00</span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between text-sm py-2">
                                                        <span className="text-gray-600">Saturday</span>
                                                        <span className="font-medium text-gray-900">08:00 - 12:00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm py-2 text-rose-500 font-medium">
                                                        <span>Sunday</span>
                                                        <span>Closed</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm text-emerald-600">
                                                <Clock className="w-4 h-4" />
                                                <span>Emergency services available 24/7</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location & Contact */}
                                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-teal-100 flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Location & Contact</h3>
                                                <p className="text-sm text-gray-500">Get in touch with us</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Address</div>
                                                    <div className="text-sm text-gray-600">{lab.address || 'Address not specified'}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Phone</div>
                                                    <div className="text-sm text-gray-600">{lab.phone || 'Contact not provided'}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Mail className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Email</div>
                                                    <div className="text-sm text-gray-600">{lab.email || 'Email not provided'}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <Globe className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Website</div>
                                                    <a
                                                        href={lab.website || '#'}
                                                        className="text-sm text-blue-600 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {lab.website || 'Website not available'}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                                <div className="text-center">
                                                    <Navigation className="w-8 h-8 text-gray-400 mb-2" />
                                                    <span className="text-gray-500 font-medium">View on Map</span>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6">
                                        <h3 className="font-bold text-violet-800 mb-4">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-white/80 rounded-xl border border-violet-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-5 h-5 text-violet-600" />
                                                    <span className="font-medium text-gray-900">Download Price List</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-white/80 rounded-xl border border-violet-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Share2 className="w-5 h-5 text-violet-600" />
                                                    <span className="font-medium text-gray-900">Share Laboratory</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-3 bg-white hover:bg-white/80 rounded-xl border border-violet-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Printer className="w-5 h-5 text-violet-600" />
                                                    <span className="font-medium text-gray-900">Print Information</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Verified Badge */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <BadgeCheck className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <div className="font-bold text-blue-800">Verified Laboratory</div>
                                                <div className="text-sm text-blue-600">Verified since {labStats.verifiedSince}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm text-blue-700">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4" />
                                                <span>License verified by DzDoctor</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Quality standards maintained</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4" />
                                                <span>Regular audits conducted</span>
                                            </div>
                                        </div>
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
