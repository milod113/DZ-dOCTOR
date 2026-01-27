<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'relationship',
        'date_of_birth',
        'gender',
        'blood_type'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
