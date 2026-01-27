import AppLayout from "@/Layouts/AppLayout";
import PatientSelector from '@/Components/Booking/PatientSelector';
import { Head, router, useForm, Link } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Stethoscope,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

export default function Availability(props: any) {
  const { t, locale } = useI18n();
  const doctor = props.doctor || {};
  const selected = props.selected || {};
  const slots = (props.slots || []) as any[];
  const family_members = props.family_members || [];
  const isRtl = locale === 'ar';

  // We only use useForm for 'data' storage (family/reason) and 'processing' state
  // We will NOT use the 'post' method from useForm for the final submit
  const { data, setData, processing } = useForm({
    family_member_id: null as number | null,
    reason: "",
  });

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const changeClinic = (clinic_id: number) => {
    router.get(
      route("booking.availability", { doctor: doctor.id }),
      { clinic_id, date: selected.date },
      { preserveState: true, replace: true }
    );
  };

  const changeDate = (date: string) => {
    router.get(
      route("booking.availability", { doctor: doctor.id }),
      { clinic_id: selected.clinic_id, date },
      { preserveState: true, replace: true }
    );
  };

  // ✅ CORRECTED FUNCTION
  const confirmBooking = () => {
    if (!selectedSlotId) return;

    // Use router.post to explicitly send the data we have in our state
    router.post(route("booking.store"), {
      slot_id: selectedSlotId,              // Explicitly send the selected ID
      family_member_id: data.family_member_id, // Send the selected family member
      reason: data.reason                   // Send the reason
    }, {
      preserveScroll: true
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatDateHeader = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const firstName = doctor.first_name || '';
  const lastName = doctor.last_name || '';
  const initials = (firstName[0] || '') + (lastName[0] || '');
  const specialtyName = doctor.specialties?.[0]?.name || 'Specialist';
  const clinicList = doctor.clinics || [];

  return (
    <AppLayout>
      <Head title={`${t("Book Appointment")} - ${doctor.full_name || 'Doctor'}`} />

      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white py-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <Link
              href={route('doctor.show', doctor.id)}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
            >
              <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              {t("Back to Profile")}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("Book Appointment")}
            </h1>
            <p className="text-gray-500 mt-1">Select a time slot to consult with Dr. {lastName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
                     {initials}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">{doctor.full_name}</h2>
                    <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {specialtyName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">
                {/* 1. Patient Selector */}
                {family_members.length > 0 && (
                    <div className="pb-5 border-b border-gray-100">
                        <PatientSelector
                            members={family_members}
                            selectedId={data.family_member_id}
                            onSelect={(id: number | null) => setData('family_member_id', id)}
                        />
                    </div>
                )}

                {/* 2. Clinic Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {t("Select Clinic")}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                      value={selected.clinic_id ?? ""}
                      onChange={(e) => changeClinic(Number(e.target.value))}
                    >
                      {clinicList.map((c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Date Selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {t("Select Date")}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={selected.date || ''}
                    onChange={(e) => changeDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* 4. Reason Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {t("Reason for Visit")} <span className="text-gray-400 font-normal">({t("Optional")})</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder={t("Briefly describe your symptoms...") || "Briefly describe your symptoms..."}
                    value={data.reason}
                    onChange={(e) => setData("reason", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Slots */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      {t("Available Slots")}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">
                      {formatDateHeader(selected.date)}
                    </p>
                  </div>
                  {slots.length > 0 && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      {slots.length} {t("Slots")}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  {slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-gray-900 font-medium mb-1">{t("No slots available")}</h4>
                      <p className="text-gray-500 text-sm max-w-xs">
                        {t("Please try selecting a different date or another clinic location.")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {slots.map((s) => {
                        const isSelected = selectedSlotId === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSlotId(s.id)}
                            disabled={processing}
                            className={`
                              relative group flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-200
                              ${isSelected
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg ring-2 ring-blue-200'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                              }
                            `}
                          >
                            <span className="text-sm font-bold">
                              {formatTime(s.start_at)}
                            </span>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 bg-white text-blue-600 rounded-full p-0.5 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 fill-current" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    {selectedSlotId
                      ? <span className="text-blue-600 font-medium">{t("Slot selected. Click confirm to proceed.")}</span>
                      : t("Please select a time slot above.")}
                  </div>

                  <button
                    onClick={confirmBooking}
                    disabled={!selectedSlotId || processing}
                    className={`
                      px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-md flex items-center gap-2
                      ${!selectedSlotId || processing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 hover:shadow-lg hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {processing ? t("Processing...") : t("Confirm Booking")}
                    {!processing && <ChevronLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
