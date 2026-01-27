<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalysisRequest extends Model
{
    use HasFactory;

    /**
     * Allow mass assignment.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     * 'tests_requested' is stored as JSON but accessed as an Array.
     */
 protected $casts = [
        'tests_requested' => 'array',
        'fasting_required' => 'boolean', // <--- Add this cast
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_home_visit' => 'boolean',
        'home_visit_date' => 'datetime',
    ];

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    /**
     * The Doctor who sent the request.
     */
    public function doctorProfile()
    {
        return $this->belongsTo(DoctorProfile::class);
    }

    /**
     * The Laboratory receiving the request.
     */
    public function laboratory()
    {
        return $this->belongsTo(Laboratory::class);
    }

    /**
     * The Patient (if they are a registered user).
     * Returns null for Guest/Walk-in patients.
     */
    public function patientUser()
    {
        return $this->belongsTo(User::class, 'patient_user_id');
    }
}
