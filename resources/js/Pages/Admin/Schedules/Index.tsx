import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

export default function DoctorsIndex({ doctors }: any) {
  const { t } = useI18n();
  const items = doctors.data ?? [];

  return (
    <AppLayout>
      <Head title={t("doctors")} />

      <div className="rounded bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{t("doctors")}</div>
          <Link href={route("admin.doctors.create")} className="rounded bg-gray-900 px-3 py-2 text-sm text-white">
            {t("create")}
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">{t("name")}</th>
                <th className="py-2">{t("clinic")}</th>
                <th className="py-2">{t("specialty")}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((d: any) => (
                <tr key={d.id} className="border-b">
                  <td className="py-2">{d.full_name}</td>
                  <td className="py-2">{(d.clinics ?? []).map((c: any) => c.name).join(", ")}</td>
                  <td className="py-2">{(d.specialties ?? []).map((s: any) => s.name).join(", ")}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link className="underline" href={route("admin.doctors.edit", { doctor: d.id })}>{t("edit")}</Link>
                      <Link className="underline" href={route("admin.doctors.schedule.edit", { doctor: d.id })}>Schedule</Link>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-600" colSpan={4}>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
