import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateSecretary() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post(route('doctor.secretary.store'));
    };

    return (
        <AppLayout>
            <Head title="Add Secretary" />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg mx-auto">
                <h2 className="text-xl font-bold mb-6">Create Secretary Account</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border-gray-300"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className="mt-1 w-full rounded-lg border-gray-300"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border-gray-300"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg border-gray-300"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
