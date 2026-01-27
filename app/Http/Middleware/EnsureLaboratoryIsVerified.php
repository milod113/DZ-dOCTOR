<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureLaboratoryIsVerified
{
 public function handle(Request $request, Closure $next): Response
{
    $user = $request->user();

    // 1. If NO PROFILE exists -> Redirect to Setup
    if (!$user->laboratory) {
        // Prevent loop if already on setup page
        if ($request->routeIs('laboratory.setup.*')) {
            return $next($request);
        }
        return redirect()->route('laboratory.setup.create');
    }

    // 2. If VERIFIED -> Allow access
    if ($user->laboratory->verification_status === 'verified') {
        return $next($request);
    }

    // 3. If NOT VERIFIED -> Redirect to Verification Page
    if (!$request->routeIs('laboratory.verification.*')) {
        return redirect()->route('laboratory.verification.show');
    }

    return $next($request);
}
}
