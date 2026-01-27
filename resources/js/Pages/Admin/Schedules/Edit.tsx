import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";

const DOW = [
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
];

export default function ScheduleEdit({ doctor, clinics, schedules, exceptions }: any) {
  const { t } = useI18n();

  const weekly = useForm({
    items: (clinics.flatMap((c: any) =>
      DOW.map((d) => {
        const existing = (schedules ?? []).find(
          (s: any) => s.clinic_id === c.id && s.day_of_week === d.id
        );
        return {
          clinic_id: c.id,
          day_of_week: d.id,
          start_time: existing?.start_time ?? "09:00",
          end_time: existing?.end_time ?? "17:00",
          slot_duration_min: existing?.slot_duration_min ?? 15,
          is_active: existing?.is_active ?? true,
        };
      })
    ) as any[],
  });

  const ex = useForm({
    clinic_id: clinics?.[0]?.id ?? null,
    date: "",
    is_closed: true,
    start_time: "",
    end_time: "",
    note: "",
  });

  const saveWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    weekly.post(route("admin.doctors.schedule.weekly", { doctor: doctor.id }));
  };

  const addException = (e: React.FormEvent) => {
    e.preventDefault();
    ex.post(route("admin.doctors.schedule.exceptions.add", { doctor: doctor.id }));
  };

  return (
    <AppLayout>
      <Head title="Schedule" />

      <div className="space-y-4">
        <div className="rounded bg-white p-4 shadow-sm">
          <div className="text-lg font-semibold">
            Schedule — {doctor.full_name}
          </div>

          <form onSubmit={saveWeekly} className="mt-4 space-y-4">
            {clinics.map((c: any) => (
              <div key={c.id} className="rounded border p-3">
                <div className="font-semibold">{c.name} ({c.city})</div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {DOW.map((d) => {
                    const idx = weekly.data.items.findIndex(
                      (it: any) => it.clinic_id === c.id && it.day_of_week === d.id
                    );
                    const item = weekly.data.items[idx];

                    return (
                      <div key={d.id} className="rounded border p-3">
                        <div className="mb-2 font-medium">{d.label}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="time"
                            className="rounded border-gray-300"
                            value={item.start_time}
                            onChange={(e) => {
                              const items = [...weekly.data.items];
                              items[idx] = { ...items[idx], start_time: e.target.value };
                              weekly.setData("items", items);
                            }}
                          />
                          <input
                            type="time"
                            className="rounded border-gray-300"
                            value={item.end_time}
                            onChange={(e) => {
                              const items = [...weekly.data.items];
                              items[idx] = { ...items[idx], end_time: e.target.value };
                              weekly.setData("items", items);
                            }}
                          />
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            className="rounded border-gray-300"
                            value={item.slot_duration_min}
                            onChange={(e) => {
                              const items = [...weekly.data.items];
                              items[idx] = { ...items[idx], slot_duration_min: Number(e.target.value) };
                              weekly.setData("items", items);
                            }}
                          />
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={!!item.is_active}
                              onChange={(e) => {
                                const items = [...weekly.data.items];
                                items[idx] = { ...items[idx], is_active: e.target.checked };
                                weekly.setData("items", items);
                              }}
                            />
                            {t("active")}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <button className="rounded bg-gray-900 px-4 py-2 text-white">
              {t("save")}
            </button>
          </form>
        </div>

        <div className="rounded bg-white p-4 shadow-sm">
          <div className="text-lg font-semibold">Exceptions</div>

          <form onSubmit={addException} className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-5">
            <select className="rounded border-gray-300" value={ex.data.clinic_id ?? ""} onChange={(e)=>ex.setData("clinic_id", Number(e.target.value))}>
              {clinics.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input type="date" className="rounded border-gray-300" value={ex.data.date} onChange={(e)=>ex.setData("date", e.target.value)} />

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!ex.data.is_closed} onChange={(e)=>ex.setData("is_closed", e.target.checked)} />
              Closed
            </label>

            <input type="time" className="rounded border-gray-300" placeholder="start" value={ex.data.start_time} onChange={(e)=>ex.setData("start_time", e.target.value)} />
            <input type="time" className="rounded border-gray-300" placeholder="end" value={ex.data.end_time} onChange={(e)=>ex.setData("end_time", e.target.value)} />

            <input className="rounded border-gray-300 md:col-span-5" placeholder="note" value={ex.data.note} onChange={(e)=>ex.setData("note", e.target.value)} />

            <button className="rounded bg-gray-900 px-4 py-2 text-white md:col-span-2">
              {t("save")}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {(exceptions ?? []).map((e: any) => (
              <div key={e.id} className="rounded border p-3 text-sm">
                <div>
                  {e.date} — clinic #{e.clinic_id} — {e.is_closed ? "Closed" : `Open ${e.start_time}-${e.end_time}`}
                </div>
                <div className="text-gray-600">{e.note}</div>
              </div>
            ))}
            {(exceptions ?? []).length === 0 && <div className="text-sm text-gray-600">—</div>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
