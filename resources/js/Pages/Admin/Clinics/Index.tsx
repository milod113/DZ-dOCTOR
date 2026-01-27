import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

export default function ClinicsIndex({ clinics }: any) {
  const { t } = useI18n();
  const items = clinics.data ?? [];

  const destroy = (id: number) => {
    if (!confirm("Delete?")) return;
    router.delete(route("admin.clinics.destroy", { clinic: id }));
  };

  return (
    <AppLayout>
      <Head title={t("clinics")} />

      <div className="rounded bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{t("clinics")}</div>
          <Link
            href={route("admin.clinics.create")}
            className="rounded bg-gray-900 px-3 py-2 text-sm text-white"
          >
            {t("create")}
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">{t("name")}</th>
                <th className="py-2">{t("city")}</th>
                <th className="py-2">{t("active")}</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c: any) => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.city}</td>
                  <td className="py-2">{c.is_active ? t("active") : t("inactive")}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      <Link className="underline" href={route("admin.clinics.edit", { clinic: c.id })}>
                        {t("edit")}
                      </Link>
                      <button className="underline" onClick={() => destroy(c.id)}>
                        Delete
                      </button>
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
