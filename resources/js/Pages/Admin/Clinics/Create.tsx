import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

export default function ClinicsCreate() {
  const { t } = useI18n();

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    slug: "",
    address: "",
    city: "",
    phone: "",
    is_active: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.clinics.store"));
  };

  return (
    <AppLayout>
      <Head title={t("create")} />

      <form onSubmit={submit} className="rounded bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">{t("create")} — {t("clinics")}</div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="rounded border-gray-300" placeholder={t("name")} value={data.name} onChange={(e)=>setData("name", e.target.value)} />
          <input className="rounded border-gray-300" placeholder={t("slug")} value={data.slug} onChange={(e)=>setData("slug", e.target.value)} />

          <input className="rounded border-gray-300 md:col-span-2" placeholder={t("address")} value={data.address} onChange={(e)=>setData("address", e.target.value)} />
          <input className="rounded border-gray-300" placeholder={t("city")} value={data.city} onChange={(e)=>setData("city", e.target.value)} />
          <input className="rounded border-gray-300" placeholder={t("phone")} value={data.phone} onChange={(e)=>setData("phone", e.target.value)} />
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mt-3 text-sm text-red-600">
            {Object.values(errors).join(" | ")}
          </div>
        )}

        <button disabled={processing} className="mt-4 rounded bg-gray-900 px-4 py-2 text-white">
          {t("save")}
        </button>
      </form>
    </AppLayout>
  );
}
