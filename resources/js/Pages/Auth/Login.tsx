import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout'; // NOTE: Check if GuestLayout imposes padding/max-width
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import {
  Stethoscope, Shield, Eye, EyeOff, User, Lock, Heart, Activity,
  Smartphone, Clock, CheckCircle2, AlertCircle, Sparkles, Zap,
  TrendingUp, MessageSquare, Calendar, Star, ArrowRight
} from 'lucide-react';

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  useEffect(() => {
    const createParticles = () => {
      const particlesArray = [];
      const colors = ['#3b82f6', '#10b981', '#8b5cf6'];
      for (let i = 0; i < 20; i++) { // Increased particle count slightly
        particlesArray.push({
          id: i,
          size: Math.random() * 80 + 20,
          x: Math.random() * 100,
          duration: Math.random() * 30 + 20,
          delay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(particlesArray);
    };
    createParticles();
  }, []);

  const features = [
    { icon: <Shield className="w-5 h-5" />, title: 'Secure & Encrypted', desc: 'Bank-level security for health data' },
    { icon: <Zap className="w-5 h-5" />, title: 'Instant Access', desc: 'Book appointments in seconds' },
    { icon: <Activity className="w-5 h-5" />, title: 'Live Updates', desc: 'Real-time appointment tracking' },
    { icon: <MessageSquare className="w-5 h-5" />, title: '24/7 Support', desc: 'Always here to help you' },
  ];

  const stats = [
    { number: '5000+', label: 'Doctors' },
    { number: '100K+', label: 'Patients' },
    { number: '99.8%', label: 'Satisfaction' },
  ];

  // Note: If GuestLayout adds padding/margins, replace it with a plain <div> or update GuestLayout
  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans">
      <Head title="Connect to DzDoctor - Medical Platform" />

      {/* Animated Background Particles (Global) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              background: `radial-gradient(circle, ${particle.color}30, transparent 70%)`,
              animation: `float ${particle.duration}s infinite linear`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ---------------------------------------------------------------------------
       * MAIN FULL-WIDTH CONTAINER
       * Removed max-w-6xl, padding, and rounded corners
       * --------------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* ---------------------------------------------------------------------------
         * LEFT PANEL - HERO SECTION
         * Takes up 50% width on large screens, full height
         * --------------------------------------------------------------------------- */}
        <div className="lg:w-1/2 p-12 lg:p-20 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white relative overflow-hidden flex flex-col justify-center">

          {/* Animated Blobs (Background) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-soft-light blur-3xl animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full mix-blend-soft-light blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-soft-light blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full justify-between">
             {/* Header */}
             <div>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">DzDoctor</h1>
                    <p className="text-blue-100 font-medium">Healthcare Excellence Platform</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold tracking-wide">Trusted by Medical Professionals</span>
                </div>

                <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                  Your Health,
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                    Our Priority
                  </span>
                </h2>

                <p className="text-blue-50 text-xl max-w-lg leading-relaxed mb-12">
                  Connect to Algeria's leading healthcare platform. Access certified doctors, manage appointments, and receive quality medical care—all securely.
                </p>
             </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:translate-x-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-blue-100/80 text-sm leading-snug">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats & Testimonial Wrapper */}
            <div className="space-y-8">
               <div className="flex items-center justify-between border-t border-white/10 pt-8">
                 {stats.map((stat, index) => (
                   <div key={index} className="text-center px-4">
                     <div className="text-3xl lg:text-4xl font-bold mb-1 tracking-tighter">{stat.number}</div>
                     <div className="text-blue-200 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
                   </div>
                 ))}
               </div>

               <div className="p-6 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 flex items-center justify-center text-white font-bold shadow-md">AS</div>
                    <div>
                      <div className="flex items-center gap-2">
                         <h4 className="font-bold">Dr. Ahmed Said</h4>
                         <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                      </div>
                      <p className="text-blue-200 text-xs">Cardiologist • 15+ years</p>
                    </div>
                  </div>
                  <p className="text-blue-50/90 italic text-sm">
                    "DzDoctor revolutionized patient care in Algeria. The platform's efficiency has allowed me to focus more on my patients."
                  </p>
               </div>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------------------------------
         * RIGHT PANEL - LOGIN FORM
         * Takes up 50% width on large screens, full height, white background
         * --------------------------------------------------------------------------- */}
        <div className="lg:w-1/2 w-full bg-white flex items-center justify-center p-8 lg:p-20 relative">

          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                 <User className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-lg">
                Sign in to access your medical dashboard
              </p>
            </div>

            {status && (
              <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 animate-fade-in flex items-start gap-4 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-emerald-800 font-semibold">{status}</p>
                  <p className="text-emerald-600 text-sm mt-1">You can now proceed to sign in</p>
                </div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-8">
              {/* Email Input */}
              <div className="space-y-2">
                <InputLabel htmlFor="email" value="Email Address" className="text-gray-900 font-bold text-sm uppercase tracking-wide ml-1" />
                <div className="relative group">
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full pl-14 pr-4 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all duration-300 text-lg"
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-focus-within:border-blue-500 group-focus-within:text-blue-500 transition-colors shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                {errors.email && <InputError message={errors.email} className="ml-1" />}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <InputLabel htmlFor="password" value="Password" className="text-gray-900 font-bold text-sm uppercase tracking-wide" />
                  {canResetPassword && (
                    <Link href={route('password.request')} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5 hover:underline decoration-2 underline-offset-2">
                      <AlertCircle className="w-4 h-4" />
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative group">
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full pl-14 pr-14 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all duration-300 text-lg"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-focus-within:border-blue-500 group-focus-within:text-blue-500 transition-colors shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-xl hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <InputError message={errors.password} className="ml-1" />}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group select-none">
                  <Checkbox
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  />
                  <span className="ml-3 text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    Keep me signed in
                  </span>
                </label>
              </div>

              <PrimaryButton
                className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                disabled={processing}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
                }}
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -translate-x-full skew-x-12"></div>
                <div className="relative flex items-center justify-center gap-3">
                   {processing ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </>
                   ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                   )}
                </div>
              </PrimaryButton>
            </form>

            <div className="mt-12">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium tracking-wide uppercase text-xs">Or continue with</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-8">
                  <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button type="button" className="flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow">
                     <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                     </svg>
                     Facebook
                  </button>
               </div>
            </div>

            <p className="text-center mt-10 text-gray-600">
              New to DzDoctor?{' '}
              <Link href={route('register')} className="font-bold text-blue-600 hover:text-blue-700 transition-colors hover:underline decoration-2 underline-offset-2">
                Create an account
              </Link>
            </p>

          </div>

          <div className="absolute bottom-6 text-center text-xs text-gray-400">
             © {new Date().getFullYear()} DzDoctor. All rights reserved.
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
