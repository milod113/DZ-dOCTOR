<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // 1. Generate the QR Code based on the User's UUID
        // We use SVG format because it scales perfectly without pixelating
        $qrCode = QrCode::size(200)
            ->color(34, 40, 49) // Optional: Dark gray color
            ->generate($user->uuid);

        // 2. Return the view with the QR code
        return Inertia::render('Patient/Dashboard/Dashboard', [
            'qrCode' => $qrCode,
            'auth' => [
                'user' => $user
            ]
        ]);
    }
}
