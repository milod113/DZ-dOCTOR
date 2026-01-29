import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Activity, Stethoscope, Scan, Clock, AlertCircle } from 'lucide-react';

export default function PatientAgenda({ events }: { events: any[] }) {

    // Custom render for event content (modern "pill" look)
    const renderEventContent = (eventInfo: any) => {
        const { type } = eventInfo.event.extendedProps;

        // Dynamic styling based on event type
        let icon = <Stethoscope className="w-3 h-3" />;
        let bgClass = "bg-blue-100 text-blue-700 border-blue-200"; // Default (Doctor)
        let iconBg = "bg-blue-500/20";

        if (type === 'laboratory') {
            icon = <Activity className="w-3 h-3" />;
            bgClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
            iconBg = "bg-emerald-500/20";
        } else if (type === 'imaging') {
            icon = <Scan className="w-3 h-3" />;
            bgClass = "bg-violet-100 text-violet-700 border-violet-200";
            iconBg = "bg-violet-500/20";
        }

        return (
            <div className={`flex items-center gap-2 px-1.5 py-1 w-full h-full overflow-hidden rounded-md border ${bgClass} shadow-sm`}>
                <div className={`p-1 rounded-full ${iconBg} flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex flex-col leading-none min-w-0">
                    <span className="text-xs font-bold truncate">
                        {eventInfo.event.title}
                    </span>
                    {eventInfo.timeText && (
                        <span className="text-[10px] opacity-80 truncate mt-0.5 font-medium">
                            {eventInfo.timeText}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">

            {/* --- Modern Header & Legend --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" />
                    Medical Schedule
                </h3>

                {/* Styled Legend Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Doctor
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lab
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-50 text-violet-700 border border-violet-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span> Imaging
                    </div>
                </div>
            </div>

            {/* --- The Calendar --- */}
            <div className="flex-1 min-h-[500px] agenda-calendar-wrapper font-sans text-sm relative">
                {events.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/50 z-10 rounded-xl">
                        <AlertCircle className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No events scheduled</p>
                    </div>
                )}

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,listWeek'
                    }}
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        list: 'List'
                    }}
                    events={events}
                    eventContent={renderEventContent}
                    height="100%"
                    slotMinTime="08:00:00"
                    slotMaxTime="18:00:00"
                    allDaySlot={false}
                    navLinks={true}
                    dayMaxEvents={2}
                    eventClick={(info) => {
                        alert(`Details:\n\n${info.event.title}\n${info.event.start?.toLocaleString()}`);
                    }}
                    // Force events to display cleanly without borders
                    eventClassNames="!bg-transparent !border-0 !shadow-none"
                />
            </div>
        </div>
    );
}
