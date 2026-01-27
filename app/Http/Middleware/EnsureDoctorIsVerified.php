<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureDoctorIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is a doctor and NOT approved
        if ($user && $user->role === 'doctor' && $user->verification_status !== 'approved') {

            // Allow them to access the verification page and logout, block everything else
            if ($request->routeIs('doctor.verification.*') || $request->routeIs('logout')) {
                return $next($request);
            }

            return redirect()->route('doctor.verification.show');
        }

        return $next($request);
    }
}
