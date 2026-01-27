import { User, Users, Baby, Heart } from 'lucide-react';

export default function PatientSelector({ members, selectedId, onSelect }: any) {

    // Helper to get icon
    const getIcon = (rel: string) => {
        if (rel === 'child') return <Baby className="w-5 h-5" />;
        if (rel === 'spouse') return <Heart className="w-5 h-5" />;
        return <User className="w-5 h-5" />;
    };

    return (
        <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pour qui est ce rendez-vous ?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Myself */}
                <button
                    type="button"
                    onClick={() => onSelect(null)} // Null means "Me"
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedId === null
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                            : 'border-gray-200 hover:border-indigo-300 bg-white dark:bg-gray-800 dark:border-gray-700'
                    }`}
                >
                    <div className={`p-2 rounded-full ${selectedId === null ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <User className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Moi-même</span>
                </button>

                {/* Option 2: Family Members */}
                {members.map((member: any) => (
                    <button
                        key={member.id}
                        type="button"
                        onClick={() => onSelect(member.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            selectedId === member.id
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
                                : 'border-gray-200 hover:border-indigo-300 bg-white dark:bg-gray-800 dark:border-gray-700'
                        }`}
                    >
                        <div className={`p-2 rounded-full ${selectedId === member.id ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            {getIcon(member.relationship)}
                        </div>
                        <div className="text-left">
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs opacity-70 capitalize">{member.relationship}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
