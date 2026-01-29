<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- General Controllers ---
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TvDisplayController;

// --- Booking & Availability ---
use App\Http\Controllers\Booking\AvailabilityController;
use App\Http\Controllers\Booking\AppointmentController;

// --- Marketplace / Search ---
use App\Http\Controllers\Marketplace\DoctorSearchController;
use App\Http\Controllers\Marketplace\LaboratorySearchController;
use App\Http\Controllers\Marketplace\ImagingSearchController;
use App\Http\Controllers\Marketplace\ImagingProfileController;
use App\Http\Controllers\Public\LaboratoryController as PublicLaboratoryController;

// --- Admin Controllers ---
use App\Http\Controllers\Admin\ClinicController as AdminClinicController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\ScheduleController as AdminScheduleController;
use App\Http\Controllers\Admin\DoctorVerificationController as AdminDoctorVerificationController;
use App\Http\Controllers\Admin\LaboratoryVerificationController as AdminLaboratoryVerificationController;
use App\Http\Controllers\Admin\ImagingVerificationController as AdminImagingVerificationController;

// --- Doctor Controllers ---
use App\Http\Controllers\Doctor\DashboardController as DoctorDashboardController;
use App\Http\Controllers\Doctor\ProfileController as DoctorProfileController;
use App\Http\Controllers\Doctor\ScheduleController as DoctorScheduleController;
use App\Http\Controllers\Doctor\AppointmentController as DoctorAppointmentController;
use App\Http\Controllers\Doctor\VerificationController as DoctorVerificationController;
use App\Http\Controllers\Doctor\TeamController;
use App\Http\Controllers\Doctor\SlotController;
use App\Http\Controllers\Doctor\SlotGeneratorController;
use App\Http\Controllers\Doctor\AnalysisRequestController;

use App\Http\Controllers\Doctor\Secretary\CheckInController;

// --- Patient Controllers ---
// ✅ FIX 1: Renamed to avoid conflict
use App\Http\Controllers\Patient\ImagingRequestController as PatientImagingRequestController;
use App\Http\Controllers\Patient\HealthRecordController;
use App\Http\Controllers\Patient\AppointmentController as PatientAppointmentController;
use App\Http\Controllers\Patient\FamilyController;

use App\Http\Controllers\Patient\DashboardController; // Don't forget to import this at the top!
use App\Http\Controllers\Patient\QrCodeController; // We will create this


// --- Laboratory Controllers ---


use App\Http\Controllers\Laboratory\AnalysisRequestController as LaboratoryAnalysisRequestController;
use App\Http\Controllers\Laboratory\SetupController as LaboratorySetupController;
use App\Http\Controllers\Laboratory\VerificationController as LaboratoryVerificationController;
use App\Http\Controllers\Laboratory\DashboardController as LaboratoryDashboardController;
use App\Http\Controllers\Laboratory\SettingsController as LaboratorySettingsController;
use App\Http\Controllers\Laboratory\RequestController as LaboratoryRequestController;
use App\Http\Controllers\Laboratory\BookingController as LabBookingController;
// --- Imaging Center Controllers ---
use App\Http\Controllers\Imaging\ImagingSetupController;
use App\Http\Controllers\Imaging\ImagingDashboardController;
use App\Http\Controllers\Imaging\SettingsController as ImagingSettingsController;
use App\Http\Controllers\Imaging\AppointmentController as ImagingAppointmentController;

// ✅ FIX 1: Renamed to avoid conflict
use App\Http\Controllers\Imaging\RequestController as ImagingCenterRequestController;

// --- Middleware ---
use App\Http\Middleware\EnsureDoctorIsVerified;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// ======================================================================
// 1) PUBLIC ROUTES (Guests)
// ======================================================================

// Locale
Route::get('/lang/{locale}', [LocaleController::class, 'set'])->name('lang.set');
Route::post('/language', [LocaleController::class, 'store'])->name('language.store');

// Landing + Marketplace Search
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/search', [DoctorSearchController::class, 'index'])->name('search');

// Public Doctor Profile + TV
Route::get('/doctor/{doctor}', [DoctorSearchController::class, 'show'])
    ->whereNumber('doctor')
    ->name('doctor.show');

Route::get('/tv/{doctor}', [TvDisplayController::class, 'show'])->name('tv.show');

// Public Laboratory Profile
Route::get('/laboratoire/{id}', [PublicLaboratoryController::class, 'show'])->name('lab.show');
Route::get('/laboratories/search', [LaboratorySearchController::class, 'index'])->name('laboratories.search');

// Public Imaging Profile
Route::get('/imagerie/search', [ImagingSearchController::class, 'index'])->name('imaging.search');

// ❌ MOVED TO BOTTOM: Route::get('/imagerie/{slug}'...) was here, causing the 404 error.


// ======================================================================
// 2) AUTH ROUTES (All logged-in users)
// ======================================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // General Dashboard
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    // User profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Booking (patient side)
    Route::get('/api/availability', [AppointmentController::class, 'availability'])->name('api.availability');
    Route::get('/booking/availability/{doctor}', [AvailabilityController::class, 'page'])->name('booking.availability');
    Route::post('/booking', [AppointmentController::class, 'store'])->name('booking.store');

    // ✅ Uses the PATIENT alias
    Route::post('/patient/imaging/request', [PatientImagingRequestController::class, 'store'])->name('patient.imaging.request');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');

    Route::get('/laboratory/{laboratory}/book', [LabBookingController::class, 'create'])->name('laboratory.booking.create');

    // Save the request
    Route::post('/laboratory/book', [LabBookingController::class, 'store'])->name('laboratory.booking.store');
    });


// ======================================================================
// 3) IMAGING CENTER AREA
// ======================================================================

Route::middleware(['imaging'])->prefix('imagerie')->name('imaging.')->group(function () {

    Route::get('/dashboard', [ImagingDashboardController::class, 'index'])->name('dashboard');

    // Setup
    Route::get('/setup', [ImagingSetupController::class, 'create'])->name('setup');
    Route::post('/setup', [ImagingSetupController::class, 'store'])->name('setup.store');

    // Settings & Profile
    Route::get('/settings', [ImagingSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [ImagingSettingsController::class, 'updateProfile'])->name('settings.update');

    // Exam Management
    Route::post('/exams', [ImagingSettingsController::class, 'storeExam'])->name('exams.store');
    Route::delete('/exams/{exam}', [ImagingSettingsController::class, 'destroyExam'])->name('exams.destroy');

    // --- REQUEST MANAGEMENT ---
    // ✅ Uses the CENTER alias
    Route::get('/requests', [ImagingCenterRequestController::class, 'index'])->name('requests.index');
    Route::patch('/requests/{imagingRequest}', [ImagingCenterRequestController::class, 'update'])->name('requests.update');
    Route::get('/requests/{imagingRequest}/download', [ImagingCenterRequestController::class, 'downloadPrescription'])->name('requests.download');
    Route::get('/appointments', [ImagingAppointmentController::class, 'index'])->name('appointments.index');
    Route::post('/appointments', [ImagingAppointmentController::class, 'store'])->name('appointments.store');
    Route::patch('/appointments/{id}', [ImagingAppointmentController::class, 'update'])->name('appointments.update');
    });


// ======================================================================
// 4) ADMIN AREA
// ======================================================================

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'admin'])
    ->group(function () {

        // Clinics
        Route::resource('clinics', AdminClinicController::class);

        // Doctors
        Route::resource('doctors', AdminDoctorController::class)->except(['show', 'destroy']);

        // Doctor Scheduling
        Route::get('doctors/{doctor}/schedule', [AdminScheduleController::class, 'edit'])->name('doctors.schedule.edit');
        Route::post('doctors/{doctor}/schedule/weekly', [AdminScheduleController::class, 'upsertWeekly'])->name('doctors.schedule.weekly');
        Route::post('doctors/{doctor}/schedule/exceptions', [AdminScheduleController::class, 'addException'])->name('doctors.schedule.exceptions.add');
        Route::delete('doctors/{doctor}/schedule/exceptions/{exception}', [AdminScheduleController::class, 'deleteException'])->name('doctors.schedule.exceptions.delete');

        // Doctor verifications
        Route::get('/verifications', [AdminDoctorVerificationController::class, 'index'])->name('verifications.index');
        Route::get('/verifications/{doctor}/download', [AdminDoctorVerificationController::class, 'downloadDocument'])->name('verifications.download');
        Route::patch('/verifications/{doctor}', [AdminDoctorVerificationController::class, 'update'])->name('verifications.update');

        // Laboratory verifications
        Route::get('/verifications/labs', [AdminLaboratoryVerificationController::class, 'index'])->name('verifications.labs.index');
        Route::get('/verifications/labs/{laboratory}/download', [AdminLaboratoryVerificationController::class, 'downloadDocument'])->name('verifications.labs.download');
        Route::patch('/verifications/labs/{laboratory}', [AdminLaboratoryVerificationController::class, 'update'])->name('verifications.labs.update');

        // Imaging Verification
        Route::get('/verifications/imaging', [AdminImagingVerificationController::class, 'index'])->name('verifications.imaging.index');
        Route::get('/verifications/imaging/{imagingCenter}/document', [AdminImagingVerificationController::class, 'downloadDocument'])->name('verifications.imaging.download');
        Route::patch('/verifications/imaging/{imagingCenter}', [AdminImagingVerificationController::class, 'update'])->name('verifications.imaging.update');
    });


// ======================================================================
// 5) DOCTOR AREA
// ======================================================================

Route::prefix('doctor')
    ->name('doctor.')
    ->middleware(['auth'])
    ->group(function () {

        // Verification
        Route::get('/verification', [DoctorVerificationController::class, 'show'])->name('verification.show');
        Route::post('/verification', [DoctorVerificationController::class, 'store'])->name('verification.store');

        // Doctor-only
        Route::middleware(['doctor', EnsureDoctorIsVerified::class])->group(function () {

            // Prescriptions
            Route::get('/prescriptions/create', [AnalysisRequestController::class, 'create'])->name('prescriptions.create');
            Route::post('/prescriptions', [AnalysisRequestController::class, 'store'])->name('prescriptions.store');
            Route::get('/api/labs/search', [AnalysisRequestController::class, 'searchLabs'])->name('api.labs.search');
            Route::get('/prescriptions', [AnalysisRequestController::class, 'index'])->name('prescriptions.index');
            Route::get('/prescriptions/{analysisRequest}/download', [AnalysisRequestController::class, 'downloadResult'])->name('prescriptions.download');

            // Profile
            Route::get('/profile/edit', [DoctorProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [DoctorProfileController::class, 'update'])->name('profile.update');

            // Schedule
            Route::get('/schedule', [DoctorScheduleController::class, 'edit'])->name('schedule.edit');
            Route::post('/schedule', [DoctorScheduleController::class, 'update'])->name('schedule.update');

            // Slots
            Route::get('/slots', [SlotController::class, 'index'])->name('slots.index');
            Route::delete('/slots/{slot}', [SlotController::class, 'destroy'])->name('slots.destroy');

            Route::get('/slots/generate', function () {
                return Inertia::render('Doctor/Slots/Generator', [
                    'clinics' => auth()->user()->doctorProfile->clinics
                ]);
            })->name('slots.generator');

            Route::post('/slots/generate', [SlotGeneratorController::class, 'store'])->name('slots.generate');

            // Team
            Route::get('/team', [TeamController::class, 'index'])->name('team.index');
            Route::post('/team/add', [TeamController::class, 'store'])->name('team.add');
            Route::delete('/team/{secretary}', [TeamController::class, 'removeSecretary'])->name('team.remove');

            Route::get('/secretary/create', [TeamController::class, 'create'])->name('secretary.create');
            Route::post('/secretary', [TeamController::class, 'store'])->name('secretary.store');
        });

        // Clinical (shared)
        Route::middleware(['clinical', EnsureDoctorIsVerified::class])->group(function () {
            Route::get('/dashboard', [DoctorDashboardController::class, 'index'])->name('dashboard');

            // Appointments
            Route::get('/appointments', [DoctorAppointmentController::class, 'index'])->name('appointments.index');
            Route::post('/appointments/walk-in', [DoctorAppointmentController::class, 'storeWalkIn'])->name('appointments.store-walk-in');
            Route::post('/appointments/urgent', [DoctorAppointmentController::class, 'storeUrgent'])->name('appointments.store-urgent');

            Route::get('/appointments/{appointment}', [DoctorAppointmentController::class, 'show'])->name('appointments.show');
            Route::patch('/appointments/{appointment}/status', [DoctorAppointmentController::class, 'updateStatus'])->name('appointments.update-status');
            Route::post('/appointments/{appointment}/reschedule', [DoctorAppointmentController::class, 'reschedule'])->name('appointments.reschedule');
            Route::get('/appointments/upcoming', [DoctorAppointmentController::class, 'fetchUpcoming'])->name('appointments.upcoming');

            // The Scanner Page
            Route::get('/scan', [CheckInController::class, 'create'])->name('secretary.scan');

             // The Action (When scan happens)
            Route::post('/check-in', [CheckInController::class, 'store'])->name('secretary.checkin');

        });
    });


// ======================================================================
// 6) PATIENT AREA - HEALTH RECORDS
// ======================================================================

Route::middleware(['auth', 'verified'])->prefix('my-health')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('patient.dashboard');

    Route::get('/my-qr-code', [QrCodeController::class, 'show'])->name('patient.qr-code');
    Route::get('/analyses', [HealthRecordController::class, 'index'])->name('patient.analyses.index');
    Route::get('/analyses/{analysisRequest}/download', [HealthRecordController::class, 'download'])->name('patient.analyses.download');
    Route::get('/imaging-requests', [PatientImagingRequestController::class, 'index'])->name('patient.imaging.requests.index');
    Route::get('/appointments', [PatientAppointmentController::class, 'index'])->name('patient.appointments.index');

    // ✅ Family Management
    Route::get('/family', [FamilyController::class, 'index'])->name('patient.family.index');
    Route::post('/family', [FamilyController::class, 'store'])->name('patient.family.store');
    Route::delete('/family/{familyMember}', [FamilyController::class, 'destroy'])->name('patient.family.destroy');
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show'])
        ->name('patient.appointments.show');

    });


// ======================================================================
// 7) LABORATORY AREA
// ======================================================================

Route::prefix('laboratory')
    ->name('laboratory.')
    ->middleware(['auth', 'laboratory'])
    ->group(function () {

        Route::get('/setup', [LaboratorySetupController::class, 'create'])->name('setup.create');
        Route::post('/setup', [LaboratorySetupController::class, 'store'])->name('setup.store');

        Route::get('/verification', [LaboratoryVerificationController::class, 'show'])->name('verification.show');
        Route::post('/verification', [LaboratoryVerificationController::class, 'store'])->name('verification.store');

        Route::middleware(['lab.verified'])->group(function () {
            Route::get('/dashboard', [LaboratoryDashboardController::class, 'index'])->name('dashboard');

            // Settings
            Route::get('/settings', [LaboratorySettingsController::class, 'index'])->name('settings.index');
            Route::post('/settings/profile', [LaboratorySettingsController::class, 'updateProfile'])->name('settings.update');
            Route::post('/settings/tests', [LaboratorySettingsController::class, 'storeTest'])->name('settings.tests.store');
            Route::delete('/settings/tests/{test}', [LaboratorySettingsController::class, 'destroyTest'])->name('settings.tests.destroy');

            // Requests
            Route::get('/requests', [LaboratoryRequestController::class, 'index'])->name('requests.index');
            Route::get('/requests/{request}', [LaboratoryRequestController::class, 'show'])->name('requests.show');
            Route::patch('/requests/{analysisRequest}/status', [LaboratoryRequestController::class, 'updateStatus'])->name('requests.update-status');
            Route::post('/requests/{analysisRequest}/result', [LaboratoryRequestController::class, 'uploadResult'])->name('requests.upload-result');
        });
    });

// ✅ FIX 2: Wildcard Route MUST be last
// This catches /imagerie/anything-else, so it must be after /imagerie/dashboard, etc.
Route::get('/imagerie/{slug}', [ImagingProfileController::class, 'show'])->name('imaging.show');

require __DIR__ . '/auth.php';
