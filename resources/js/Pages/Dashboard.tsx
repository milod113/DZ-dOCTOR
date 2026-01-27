import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
  return (
    <AppLayout>
      <Head title="Dashboard" />
      <div className="rounded bg-white p-4 shadow-sm">
        <div className="text-lg font-semibold">Dashboard</div>
        <div className="mt-2 text-sm text-gray-600">It works ✅</div>
      </div>
    </AppLayout>
  );
}
