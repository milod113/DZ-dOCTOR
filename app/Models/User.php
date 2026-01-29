<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\ImagingCenter;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name','email',
        'password','role',
        'verification_status',
        'verification_document_path',
        'employer_id',
    ];

    protected $hidden = [
        'password','remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function doctorProfile(): HasOne
    {
        return $this->hasOne(DoctorProfile::class);
    }
    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

// In User.php

    public function laboratory()
    {
        return $this->hasOne(Laboratory::class);
    }

    // Helper to check role
    public function isLaboratory()
    {
        return $this->role === 'laboratory';
    }
public function imaging_center()
    {
        return $this->hasOne(ImagingCenter::class);
    }
    // Add this relation to your User model
public function familyMembers()
{
    return $this->hasMany(FamilyMember::class);
}

protected static function booted()
    {
        static::creating(function ($user) {
            // Automatically generate a UUID when a new user is created
            if (empty($user->uuid)) {
                $user->uuid = (string) Str::uuid();
            }
        });
    }

}
