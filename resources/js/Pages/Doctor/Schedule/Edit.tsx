import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EditSchedule({ schedules }: any) {
    // Initialize form with existing schedules or defaults
    const { data, setData, post, processing } = useForm({
        schedules: DAYS.map((day, index) => {
            const existing = schedules.find((s: any) => s.day_of_week === index);
            return {
                day_of_week: index,
                start_time: existing?.start_time || '09:00',
                end_time: existing?.end_time || '17:00',
                is_active: existing ? Boolean(existing.is_active) : false, // Default false
            };
        })
    });

    const handleChange = (index: number, field: string, value: any) => {
        const newSchedules = [...data.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setData('schedules', newSchedules);
    };

    const submit = (e: any) => {
        e.preventDefault();
        post(route('doctor.schedule.update'));
    };

    return (
        <AppLayout>
            <Head title="Manage Schedule" />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-xl font-bold">Weekly Schedule</h2>
                    <p className="text-gray-500 text-sm">Define your standard working hours. Changes will generate slots for the next 30 days.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {data.schedules.map((day, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-32">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={day.is_active}
                                        onChange={(e) => handleChange(index, 'is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`font-medium ${day.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {DAYS[index]}
                                    </span>
                                </label>
                            </div>

                            {day.is_active && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={day.start_time}
                                        onChange={(e) => handleChange(index, 'start_time', e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="time"
                                        value={day.end_time}
                                        onChange={(e) => handleChange(index, 'end_time', e.target.value)}
                                        className="rounded-lg border-gray-300 text-sm"
                                    />
                                </div>
                            )}
                            {!day.is_active && <span className="text-sm text-gray-400 italic">Day Off</span>}
                        </div>
                    ))}

                    <div className="pt-4 text-right">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
