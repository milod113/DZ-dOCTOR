import { useState, useEffect, Fragment } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Bell, Check } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import axios from 'axios';

// 1. Fix TypeScript errors for Echo
declare global {
    interface Window {
        Echo: any;
    }
}

export default function NotificationDropdown() {
    const { auth } = usePage().props as any;
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // 2. Fetch initial notifications from DB
    useEffect(() => {
        axios.get(route('notifications.index'))
            .then(res => {
                setNotifications(res.data);
                setUnreadCount(res.data.filter((n: any) => !n.read_at).length);
            })
            .catch(err => console.error("Failed to fetch notifications:", err));
    }, []);

    // 3. Listen for Real-Time Events (With Safety Checks)
    useEffect(() => {
        // Only try to listen if User exists AND Echo is initialized
        if (auth.user && window.Echo) {

            const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);

            channel.notification((notification: any) => {
                // Play sound (Safe version)
                const audio = new Audio('/sounds/notification.mp3');
                audio.play().catch(e => console.log("Audio skipped (File missing or interaction required)"));

                // Add new notification to top of list
                setNotifications((prev) => [
                    {
                        id: notification.id,
                        data: { message: notification.message, url: notification.url },
                        read_at: null,
                        created_at_human: 'Just now'
                    },
                    ...prev
                ]);

                // Increment badge count
                setUnreadCount((prev) => prev + 1);
            });

            // Cleanup listener on unmount
            return () => {
                window.Echo.leave(`App.Models.User.${auth.user.id}`);
            };
        }
    }, [auth.user]);

    const markAsRead = (id: string) => {
        // Optimistic UI update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Backend request
        axios.patch(route('notifications.read', id));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
        setUnreadCount(0);
        axios.patch(route('notifications.read-all'));
    };

    return (
        <Menu as="div" className="relative ml-3">
            <Menu.Button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100 focus:outline-none">
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center flex flex-col items-center">
                                <div className="bg-gray-50 p-3 rounded-full mb-3">
                                    <Bell className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500">No notifications yet.</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <Menu.Item key={n.id}>
                                    {({ active }) => (
                                        <div className={`
                                            relative px-4 py-3 border-b border-gray-50 flex gap-3 transition-colors
                                            ${active ? 'bg-gray-50' : ''}
                                            ${!n.read_at ? 'bg-blue-50/40' : 'bg-white'}
                                        `}>
                                            {/* Status Dot */}
                                            {!n.read_at && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={n.data.url || '#'}
                                                    className="text-sm text-gray-800 hover:text-blue-600 block font-medium leading-snug truncate-multiline"
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    {n.data.message}
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                                    {n.created_at_human || 'Recently'}
                                                </p>
                                            </div>

                                            {!n.read_at && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); markAsRead(n.id); }}
                                                    className="text-blue-400 hover:text-blue-600 self-center p-1"
                                                    title="Mark Read"
                                                >
                                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </Menu.Item>
                            ))
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
