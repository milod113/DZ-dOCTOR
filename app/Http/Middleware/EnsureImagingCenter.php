<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureImagingCenter
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check if user is logged in
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // 2. Check if user role is 'imagerie'
        if (Auth::user()->role !== 'imagerie') {
            // If they are a doctor/lab trying to access imaging pages, redirect them back
            return abort(403, 'Unauthorized access. This area is for Imaging Centers only.');
        }

        return $next($request);
    }
}
