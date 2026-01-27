<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Appointment extends Model
{
    protected $fillable = [
        'doctor_profile_id',
        'clinic_id',
        'patient_user_id',
        'slot_id',
        'status',
        'family_member_id',
        'patient_condition',
        'reason','notes',
        'guest_name',
        'guest_phone',
        'type' // 'online' or 'walk_in'
    ];
// Helper to get the patient name (User OR Guest)
public function getPatientNameAttribute()
{
    if ($this->patientUser) {
        return $this->patientUser->name;
    }
    return $this->guest_name . ' (Walk-in)';
}

public function patientUser()
    {
        return $this->belongsTo(User::class, 'patient_user_id');
    }
    public function doctorProfile(): BelongsTo
    {
        return $this->belongsTo(DoctorProfile::class);
    }

    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }
public function activityLogs(): HasMany
    {
        return $this->hasMany(AppointmentActivityLog::class)->orderByDesc('created_at');
    }
    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_user_id');
    }

    public function slot(): BelongsTo
    {
        return $this->belongsTo(Slot::class);
    }
    public function familyMember()
{
    return $this->belongsTo(FamilyMember::class);
}
}
