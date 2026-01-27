<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public const SUPPORTED = ['fr', 'ar', 'en'];
    public const DEFAULT = 'fr';

    public function handle(Request $request, Closure $next)
    {
        $locale = null;

        // Highest priority: ?lang=ar|fr|en
        if ($request->filled('lang')) {
            $locale = $request->query('lang');
        }

        // Then: session
        if (!$locale) {
            $locale = $request->session()->get('locale');
        }

        // Then: cookie
        if (!$locale) {
            $locale = $request->cookie('locale');
        }

        if (!in_array($locale, self::SUPPORTED, true)) {
            $locale = config('app.locale', self::DEFAULT);
        }

        App::setLocale($locale);

        return $next($request);
    }
}
