<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsClinicalTeam
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // 1. Allow if User is a Doctor
        if ($user->role === 'doctor') {
            return $next($request);
        }

        // 2. Allow if User is a Secretary AND has an employer
        if ($user->role === 'secretary' && $user->employer_id) {
            return $next($request);
        }

        // 3. Block everyone else (Patients, Admins, Unemployed Secretaries)
        abort(403, 'Access Restricted to Clinical Staff.');
    }
}
