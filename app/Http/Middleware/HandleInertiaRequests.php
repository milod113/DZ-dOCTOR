<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $locale = app()->getLocale();

        return array_merge(parent::share($request), [
            // User Auth Data
            'auth' => [
                'user' => $request->user() ? $request->user()->loadMissing([
                    'doctorProfile',
                    'laboratory',
                    'imaging_center' // <--- Added this relationship
                ]) : null,
            ],

            // Internationalization
            'i18n' => [
                'locale' => $locale,
                'dir' => $locale === 'ar' ? 'rtl' : 'ltr',
                'translations' => __('ui'), // Ensure lang/{locale}/ui.php exists
                'displayTimezone' => 'Africa/Algiers',
            ],

            // Flash Messages (Success/Error)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
