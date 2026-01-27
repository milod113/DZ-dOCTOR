<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'clinical' => \App\Http\Middleware\EnsureUserIsClinicalTeam::class,
            'admin'          => \App\Http\Middleware\EnsureAdmin::class,
            'doctor'         => \App\Http\Middleware\EnsureDoctor::class,
            'doctor.verified'=> \App\Http\Middleware\EnsureDoctorIsVerified::class, // ✅ ADD THIS
            'laboratory' => \App\Http\Middleware\EnsureUserIsLaboratory::class,
            'lab.verified' => \App\Http\Middleware\EnsureLaboratoryIsVerified::class,
           'imaging' => \App\Http\Middleware\EnsureImagingCenter::class,            ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
