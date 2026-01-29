<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrCodeController extends Controller
{
  public function show()
{
    $user = auth()->user();

    // 🔴 OLD (Causes [object Object])
    // $qrCode = QrCode::size(250)->generate($user->uuid);

    // 🟢 NEW (Fixes it by forcing it to be a string)
    $qrCode = (string) QrCode::size(250)
        ->color(34, 40, 49)
        ->generate($user->uuid);

    return Inertia::render('Patient/MyQrCode', [
        'qrCode' => $qrCode,
    ]);
}
}
