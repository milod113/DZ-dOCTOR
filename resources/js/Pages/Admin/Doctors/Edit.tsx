import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

export default function DoctorsEdit({ doctor, clinics, specialties }: any) {
  const { t } = useI18n();

  const { data, setData, put, processing, errors } = useForm({
    first_name: doctor.first_name ?? "",
    last_name: doctor.last_name ?? "",
    phone: doctor.phone ?? "",
    bio: doctor.bio ?? "",
    consultation_duration_min: doctor.consultation_duration_min ?? 15,
    price_cents: doctor.price_cents ?? 0,
    is_active: !!doctor.is_active,
    clinic_ids: (doctor.clinics ?? []).map((c: any) => c.id) as number[],
    specialty_ids: (doctor.specialties ?? []).map((s: any) => s.id) as number[],
  });

  const toggle = (key: "clinic_ids" | "specialty_ids", id: number) => {
    const arr = new Set<number>(data[key]);
    if (arr.has(id)) arr.delete(id); else arr.add(id);
    setData(key, Array.from(arr));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("admin.doctors.update", { doctor: doctor.id }));
  };

  return (
    <AppLayout>
      <Head title={t("edit")} />
      <form onSubmit={submit} className="rounded bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">{t("edit")} — {t("doctors")}</div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded border-gray-300" placeholder="First name" value={data.first_name} onChange={(e)=>setData("first_name", e.target.value)} />
          <input className="rounded border-gray-300" placeholder="Last name" value={data.last_name} onChange={(e)=>setData("last_name", e.target.value)} />

          <input className="rounded border-gray-300" placeholder={t("phone")} value={data.phone} onChange={(e)=>setData("phone", e.target.value)} />
          <input className="rounded border-gray-300" placeholder="Price (cents)" value={data.price_cents} onChange={(e)=>setData("price_cents", Number(e.target.value))} />

          <textarea className="rounded border-gray-300 md:col-span-2" placeholder="Bio" value={data.bio} onChange={(e)=>setData("bio", e.target.value)} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="font-semibold">{t("clinic")}</div>
            <div className="mt-2 space-y-2">
              {clinics.map((c: any) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={data.clinic_ids.includes(c.id)} onChange={()=>toggle("clinic_ids", c.id)} />
                  <span>{c.name} ({c.city})</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold">{t("specialty")}</div>
            <div className="mt-2 space-y-2">
              {specialties.map((s: any) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={data.specialty_ids.includes(s.id)} onChange={()=>toggle("specialty_ids", s.id)} />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mt-3 text-sm text-red-600">{Object.values(errors).join(" | ")}</div>
        )}

        <button disabled={processing} className="mt-4 rounded bg-gray-900 px-4 py-2 text-white">
          {t("save")}
        </button>
      </form>
    </AppLayout>
  );
}
