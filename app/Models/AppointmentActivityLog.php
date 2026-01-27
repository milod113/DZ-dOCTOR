<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'user_id',
        'doctor_id_snapshot',
        'action', // 'confirmed', 'cancelled', etc.
    ];

    /**
     * Get the appointment that was modified.
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the user (Doctor or Secretary) who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
