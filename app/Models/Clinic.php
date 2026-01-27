<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Clinic extends Model
{
    protected $fillable = [
        'name','slug','address','city','phone','is_active',
    ];

    public function doctorProfiles(): BelongsToMany
    {
        return $this->belongsToMany(DoctorProfile::class, 'doctor_clinic');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(DoctorSchedule::class);
    }

    public function slots(): HasMany
    {
        return $this->hasMany(Slot::class);
    }
}
