import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import useTrans from "@/Hooks/useTrans";
import {
  MapPin,
  Stethoscope,
  Star,
  CheckCircle,
  Calendar,
  Shield,
  Award,
  Phone,
  Info,
  User
} from "lucide-react";

export default function DoctorShow({ doctor }: any) {
  const { t } = useTrans();
  const { locale } = usePage().props as any;
  const isRtl = locale === 'ar';

  // --- 1. DATA PREPARATION ---

  // Fallbacks for missing data
  const rating = doctor.rating || 5.0;
  const reviewCount = doctor.reviews_count || 0;
  const experience = doctor.experience || 5;

  // Image Logic:
  // 1. Check 'photo_url' (from our Laravel Accessor)
  // 2. Check 'profile_photo_url' (Standard Jetstream)
  // 3. Fallback to UI Avatars
  const doctorImage = doctor.photo_url ||
                      doctor.profile_photo_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.first_name + ' ' + doctor.last_name)}&background=EFF6FF&color=2563EB&size=256`;

  return (
    <AppLayout>
      <Head title={`Dr. ${doctor.first_name} ${doctor.last_name}`} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white py-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- LEFT COLUMN: Main Profile Info --- */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. Doctor Profile Header Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Cover Background */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-teal-500"></div>

                <div className="px-8 pb-8">
                  <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                      {/* --- PROFILE IMAGE --- */}
                      <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white shadow-md overflow-hidden">
                        <img
                          src={doctorImage}
                          alt={doctor.last_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${doctor.first_name}&background=eee&color=999`;
                          }}
                        />
                      </div>

                      {/* Verified Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white" title="Verified Doctor">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="hidden sm:flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-2xl border border-yellow-100">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">{rating}</span>
                      <span className="text-gray-500 text-sm">({reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </h1>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doctor.specialties && doctor.specialties.map((s: any, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <Stethoscope className="w-4 h-4" />
                          {s.name}
                        </span>
                      ))}
                      {(!doctor.specialties || doctor.specialties.length === 0) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            General Practitioner
                          </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-100 pt-6 mt-6">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{experience}+ Years</p>
                          <p>Experience</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Medical Reg.</p>
                          <p>Verified</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Languages</p>
                          <p>En, Fr, Ar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Biography */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-teal-500 rounded-full"></span>
                  {t('About Doctor')}
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {doctor.bio || `Dr. ${doctor.last_name} is a dedicated specialist with a focus on patient-centered care. Committed to providing the highest standard of medical treatment and ensuring patient comfort.`}
                </p>
              </div>

              {/* 3. Clinics Locations */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-teal-500 rounded-full"></span>
                  {t('Clinic Locations')}
                </h3>

                <div className="space-y-4">
                  {doctor.clinics && doctor.clinics.length > 0 ? (
                      doctor.clinics.map((c: any) => (
                        <div key={c.id} className="group relative border border-gray-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <div className="shrink-0">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <MapPin className="w-6 h-6" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-1">{c.name}</h4>
                              <p className="text-gray-600 text-sm mb-2">{c.address}, {c.city}</p>
                              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1">
                                   <Phone className="w-3 h-3" /> {c.phone}
                                </span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">Open Now</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-500">
                          <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                          <p>No clinic locations listed.</p>
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Sticky Booking Card --- */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 overflow-hidden relative">
                  {/* Decorative blur */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                  <h3 className="text-xl font-bold text-gray-900 mb-6">{t('Book Appointment')}</h3>

                  {/* Price Info */}
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Consultation Fee</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {doctor.price_cents ? (doctor.price_cents / 100).toFixed(2) : "2000"} DZD
                    </span>
                  </div>

                  {/* Booking Link */}
                  <Link
                    href={route("booking.availability", { doctor: doctor.id })}
                    className="block w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
                      <Calendar className="w-5 h-5" />
                      <span>{t('Check Availability')}</span>
                    </button>
                  </Link>

                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Instant confirmation • No booking fees
                  </p>
                </div>

                {/* Additional Info Box */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                   <h4 className="font-bold text-blue-900 mb-2">Need Help?</h4>
                   <p className="text-sm text-blue-700 mb-4">
                     Call our support team for assistance with booking.
                   </p>
                   <a href="tel:+21300000000" className="text-sm font-bold text-blue-700 hover:underline flex items-center gap-2">
                     <Phone className="w-4 h-4" />
                     +213 (0) 555 000 000
                   </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
