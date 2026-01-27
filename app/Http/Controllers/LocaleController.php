<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    public const SUPPORTED = ['fr', 'ar', 'en'];
    public const DEFAULT = 'fr';

    /**
     * GET /lang/{locale}
     */
    public function set(string $locale, Request $request)
    {
        if (!in_array($locale, self::SUPPORTED, true)) {
            $locale = self::DEFAULT;
        }

        // store in session
        $request->session()->put('locale', $locale);

        // store in cookie (1 year)
        $cookie = cookie('locale', $locale, 60 * 24 * 365);

        // apply immediately for this request cycle
        App::setLocale($locale);

        return redirect()->back()->withCookie($cookie);
    }

    /**
     * POST /language  { locale: fr|ar|en }
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'locale' => ['required', 'in:fr,ar,en'],
        ]);

        return $this->set($data['locale'], $request);
    }
}
