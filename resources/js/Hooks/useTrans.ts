import { usePage } from '@inertiajs/react';

export default function useTrans() {
    // Retrieve translations shared from the HandleInertiaRequests middleware
    const { translations } = usePage().props as any;

    /**
     * Translate a key.
     * Usage: t('Welcome')
     */
    const t = (key: string) => {
        return translations?.[key] || key;
    };

    return { t };
}
