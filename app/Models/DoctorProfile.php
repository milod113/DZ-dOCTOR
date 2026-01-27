<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id','first_name','last_name','phone','bio',
        'consultation_duration_min','price_cents','is_active','profile_photo_path'
    ];

       protected $appends = ['full_name', 'photo_url'];


// Helper to get the full URL of the photo


    public function getPhotoUrlAttribute()
    {
        return $this->profile_photo_path
            ? Storage::url($this->profile_photo_path)
            : 'https://ui-avatars.com/api/?name=' . urlencode($this->user->name ?? 'Doctor') . '&color=7F9CF5&background=EBF4FF';
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name.' '.$this->last_name);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function clinics(): BelongsToMany
    {
        return $this->belongsToMany(Clinic::class, 'doctor_clinic');
    }

    public function specialties(): BelongsToMany
    {
        return $this->belongsToMany(Specialty::class, 'doctor_specialty');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(DoctorSchedule::class);
    }

    public function exceptions(): HasMany
    {
        return $this->hasMany(ScheduleException::class);
    }

    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
