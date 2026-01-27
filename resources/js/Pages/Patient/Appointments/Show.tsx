import AppLayout from '@/Layouts/AppLayout';

export default function AppointmentShow({ appointment }: any) {
    return (
        <AppLayout>
            <div className="p-12">
                <h1>Détails du rendez-vous #{appointment.id}</h1>
                {/* You can build the full UI later */}
            </div>
        </AppLayout>
    );
}
