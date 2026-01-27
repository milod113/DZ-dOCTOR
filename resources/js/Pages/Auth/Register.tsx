import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import {
  Stethoscope, Shield, Eye, EyeOff, User, Lock, Activity,
  MessageSquare, Star, ArrowRight, Sparkles, CheckCircle2,
  Mail, Zap, UserPlus, Check, Heart, Clock, Calendar,
  Award, ShieldCheck, Brain, Pill, ChartBar, Microscope,
  XCircle, ChevronRight, PlayCircle, BadgeCheck,
  // NEW ICONS
  FlaskConical, Truck, Scan, UserCog
} from 'lucide-react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    role: 'patient',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  // --- CONFIGURATION: ROLES ---
  const roles = [
    {
      id: 'patient',
      label: 'Patient',
      desc: 'Seeking care',
      icon: <User className="w-6 h-6" />
    },
    {
      id: 'doctor',
      label: 'Doctor',
      desc: 'Medical MD',
      icon: <Stethoscope className="w-6 h-6" />
    },
    {
      id: 'laboratory',
      label: 'Laboratory',
      desc: 'Analysis',
      icon: <FlaskConical className="w-6 h-6" />
    },
    {
      id: 'imagerie',
      label: 'Imaging',
      desc: 'Radio/MRI',
      icon: <Scan className="w-6 h-6" />
    },
    {
      id: 'nurse',
      label: 'Nurse',
      desc: 'Caregiver',
      icon: <UserCog className="w-6 h-6" />
    },
    {
      id: 'ambulance',
      label: 'Ambulance',
      desc: 'Transport',
      icon: <Truck className="w-6 h-6" />
    },
  ];

  // Helper to distinguish between Patients and Professionals (everyone else)
  const isProfessional = selectedRole !== 'patient';

  // --- STYLE HELPER (Prevents Tailwind Purge Issues) ---
  const getRoleStyles = (roleId: string, isSelected: boolean) => {
    // Base style for unselected items
    if (!isSelected) {
        return {
            container: 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm',
            iconBg: 'bg-gray-100 text-gray-400 group-hover:bg-gray-200',
            checkBg: ''
        };
    }

    // Specific styles for selected items
    switch (roleId) {
        case 'patient':
            return {
                container: 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10',
                iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30',
                checkBg: 'bg-emerald-500'
            };
        case 'doctor':
            return {
                container: 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10',
                iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-blue-500/30',
                checkBg: 'bg-blue-500'
            };
        case 'laboratory':
            return {
                container: 'border-purple-500 bg-purple-50/50 shadow-md shadow-purple-500/10',
                iconBg: 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-purple-500/30',
                checkBg: 'bg-purple-500'
            };
        case 'imagerie':
            return {
                container: 'border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10',
                iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-orange-500/30',
                checkBg: 'bg-orange-500'
            };
        case 'nurse':
            return {
                container: 'border-rose-500 bg-rose-50/50 shadow-md shadow-rose-500/10',
                iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-rose-500/30',
                checkBg: 'bg-rose-500'
            };
        case 'ambulance':
            return {
                container: 'border-red-500 bg-red-50/50 shadow-md shadow-red-500/10',
                iconBg: 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-red-500/30',
                checkBg: 'bg-red-500'
            };
        default:
            return { container: '', iconBg: '', checkBg: '' };
    }
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    post(route('register'), {
      onFinish: () => {
        reset('password', 'password_confirmation');
        setIsSubmitting(false);
      },
      onError: () => setIsSubmitting(false),
    });
  };

  useEffect(() => {
    const createParticles = () => {
      const particlesArray = [];
      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b'];
      for (let i = 0; i < 30; i++) {
        particlesArray.push({
          id: i,
          size: Math.random() * 100 + 20,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 40 + 30,
          delay: Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          blur: Math.random() * 20 + 10,
        });
      }
      setParticles(particlesArray);
    };
    createParticles();
  }, []);

  const features = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: 'Easy Sign Up',
      desc: 'Create your profile in less than 2 minutes',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Verified Pros',
      desc: '100% certified professionals with background checks',
      color: 'from-emerald-400 to-green-400'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Booking',
      desc: 'No waiting on hold, book appointments 24/7',
      color: 'from-violet-400 to-purple-400'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Health Tracking',
      desc: 'Secure medical history and real-time monitoring',
      color: 'from-rose-400 to-pink-400'
    },
  ];

  const professionalBenefits = [
    { icon: <ChartBar className="w-5 h-5" />, text: 'Advanced Analytics Dashboard' },
    { icon: <Calendar className="w-5 h-5" />, text: 'Smart Scheduling System' },
    { icon: <BadgeCheck className="w-5 h-5" />, text: 'Professional Verification Badge' },
    { icon: <MessageSquare className="w-5 h-5" />, text: 'Secure Patient Communication' },
  ];

  const patientBenefits = [
    { icon: <Heart className="w-5 h-5" />, text: 'Personal Health Profile' },
    { icon: <Clock className="w-5 h-5" />, text: '24/7 Virtual Consultations' },
    { icon: <Pill className="w-5 h-5" />, text: 'Digital Prescription Management' },
    { icon: <Brain className="w-5 h-5" />, text: 'AI-Powered Health Insights' },
  ];

  const stats = [
    { number: '50k+', label: 'Active Patients', icon: <User className="w-4 h-4" /> },
    { number: '2.5k+', label: 'Verified Pros', icon: <Stethoscope className="w-4 h-4" /> },
    { number: '98%', label: 'Satisfaction Rate', icon: <Star className="w-4 h-4" /> },
    { number: '24/7', label: 'Support Available', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans antialiased">
      <Head title="Join DzDoctor - Create Your Account" />

      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/20"></div>

        {/* Animated Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full mix-blend-multiply"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: `radial-gradient(circle at 30% 30%, ${particle.color}40, transparent 70%)`,
              filter: `blur(${particle.blur}px)`,
              animation: `float ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">

        {/* LEFT PANEL - ENHANCED HERO SECTION */}
        <div className="lg:w-1/2 p-8 lg:p-16 xl:p-24 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-900 text-white relative overflow-hidden order-last lg:order-first">

          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer"></div>

          {/* Floating Icons */}
          <div className="absolute top-1/4 left-1/4 animate-float">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-400" />
            </div>
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-float delay-1000">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Pill className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full justify-between py-8">

            {/* Enhanced Header */}
            <div>
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 border-4 border-gray-900"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      DzDoctor
                    </h1>
                    <p className="text-emerald-300/80 font-medium text-sm">Healthcare Reimagined</p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-medium">Live Support</span>
                </div>
              </div>

              {/* Role-based Dynamic Content */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-emerald-500/30 group hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <Sparkles className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-semibold tracking-wide">
                    {isProfessional ? 'Join as a Partner' : 'Join the Future of Healthcare'}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="block text-white">Transform Your</span>
                  <span className="block bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent animate-gradient">
                    {isProfessional ? 'Professional Career' : 'Health Journey'}
                  </span>
                </h2>

                <p className="text-gray-300 text-lg max-w-xl leading-relaxed mb-10">
                  {isProfessional
                    ? 'Join our integrated medical network. Connect with patients, doctors, and labs in one unified ecosystem.'
                    : 'Take control of your health with personalized care. Access top doctors, labs, and services 24/7.'
                  }
                </p>
              </div>
            </div>

            {/* Features Grid with Hover Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 from-emerald-500 to-cyan-500"></div>
                  <div className="relative flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {feature.title}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-gray-300/80 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Role Benefits Preview */}
            <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                {isProfessional ? '⚡ Professional Benefits' : '❤️ Patient-First Features'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(isProfessional ? professionalBenefits : patientBenefits).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      {benefit.icon}
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="border-t border-white/10 pt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-2xl lg:text-3xl font-bold mb-2 flex items-center justify-center gap-2 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {stat.icon}
                      </div>
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs font-medium uppercase tracking-wider group-hover:text-emerald-300 transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - ENHANCED REGISTER FORM */}
        <div className="lg:w-1/2 w-full bg-white/80 backdrop-blur-sm flex items-center justify-center p-8 lg:p-16 xl:p-24 relative">

          {/* Form Container with Glass Effect */}
          <div className="w-full max-w-md mx-auto relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <UserPlus className="w-10 h-10 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl shadow-emerald-500/10 border border-gray-100 mt-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Join DzDoctor in 60 seconds
                </p>
              </div>

              <form onSubmit={submit} className="space-y-6">

                {/* Enhanced Role Selection - COMPACT GRID */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map((role) => {
                        const isSelected = data.role === role.id;
                        const styles = getRoleStyles(role.id, isSelected);

                        return (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => {
                                    setData('role', role.id);
                                    setSelectedRole(role.id);
                                }}
                                className={`relative p-3 rounded-xl border-2 transition-all duration-200 group text-left ${styles.container}`}
                            >
                                {/* Active indicator ring */}
                                {isSelected && (
                                    <div className={`absolute inset-0 border-2 rounded-xl pointer-events-none border-current opacity-50`}></div>
                                )}

                                <div className="flex items-center gap-3">
                                    {/* Icon Box */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm ${styles.iconBg}`}>
                                        {role.icon}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {role.label}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide truncate">
                                            {role.desc}
                                        </div>
                                    </div>

                                    {/* Checkmark for active state */}
                                    {isSelected && (
                                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${styles.checkBg}`}>
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                  </div>
                </div>

                {/* Form Fields with Enhanced Design */}
                <div className="space-y-6">
                  {[
                    {
                      id: 'name',
                      label: isProfessional ? 'Establishment / Professional Name' : 'Full Name',
                      icon: <User className="w-5 h-5" />,
                      type: 'text',
                      placeholder: isProfessional ? 'e.g. Dr. Smith / Labo El Shifa' : 'John Doe',
                      value: data.name,
                      onChange: (e: any) => setData('name', e.target.value),
                      error: errors.name,
                    },
                    {
                      id: 'email',
                      label: 'Email Address',
                      icon: <Mail className="w-5 h-5" />,
                      type: 'email',
                      placeholder: 'you@example.com',
                      value: data.email,
                      onChange: (e: any) => setData('email', e.target.value),
                      error: errors.email,
                    },
                    {
                      id: 'password',
                      label: 'Password',
                      icon: <Lock className="w-5 h-5" />,
                      type: showPassword ? 'text' : 'password',
                      placeholder: '••••••••',
                      value: data.password,
                      onChange: (e: any) => setData('password', e.target.value),
                      error: errors.password,
                      action: (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      ),
                    },
                    {
                      id: 'password_confirmation',
                      label: 'Confirm Password',
                      icon: <CheckCircle2 className="w-5 h-5" />,
                      type: showConfirmPassword ? 'text' : 'password',
                      placeholder: '••••••••',
                      value: data.password_confirmation,
                      onChange: (e: any) => setData('password_confirmation', e.target.value),
                      error: errors.password_confirmation,
                      action: (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      ),
                    },
                  ].map((field) => (
                    <div key={field.id} className="group">
                      <InputLabel
                        htmlFor={field.id}
                        value={field.label}
                        className="text-gray-700 font-semibold text-sm mb-2 ml-1"
                      />
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                          {field.icon}
                        </div>
                        <TextInput
                          id={field.id}
                          type={field.type}
                          name={field.id}
                          value={field.value}
                          className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all duration-300 text-base group-hover:border-gray-300"
                          autoComplete={field.id.includes('password') ? 'new-password' : 'off'}
                          onChange={field.onChange}
                          placeholder={field.placeholder}
                          required
                        />
                        {field.action && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            {field.action}
                          </div>
                        )}
                      </div>
                      {field.error && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-rose-600 ml-1">
                          <XCircle className="w-4 h-4" />
                          {field.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <PrimaryButton
                  className="w-full py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden mt-2"
                  disabled={processing || isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {processing || isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Your Journey</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </PrimaryButton>

                {/* Terms Agreement */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </form>

              {/* Social Login */}
              <div className="mt-10">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-gray-500 text-sm font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    { name: 'Google', color: 'hover:bg-red-50 hover:border-red-200', iconColor: '#EA4335' },
                    { name: 'Facebook', color: 'hover:bg-blue-50 hover:border-blue-200', iconColor: '#1877F2' },
                  ].map((social) => (
                    <button
                      key={social.name}
                      type="button"
                      className={`flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 ${social.color} hover:shadow-sm active:scale-95`}
                    >
                      {social.name === 'Google' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill={social.iconColor} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill={social.iconColor} viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      )}
                      {social.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Link */}
              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href={route('login')}
                    className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1 group"
                  >
                    Sign in here
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mb-2">
                <Link href="/security" className="hover:text-emerald-600 transition-colors">
                  🔒 Security
                </Link>
                <Link href="/help" className="hover:text-emerald-600 transition-colors">
                  ❓ Help Center
                </Link>
                <Link href="/contact" className="hover:text-emerald-600 transition-colors">
                  📞 Contact
                </Link>
              </div>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} DzDoctor. All rights reserved. HIPAA Compliant
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
