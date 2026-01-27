<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaboratoryRequest extends Model
{
    protected $fillable = [
        'user_id',
        'laboratory_id',
        'family_member_id',
        'status',
        'notes',
        'prescription_path',
        'test_ids','is_home_visit',
    ];

    protected $casts = [
        'test_ids' => 'array',
        'is_home_visit' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function laboratory(): BelongsTo
    {
        return $this->belongsTo(Laboratory::class);
    }

    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class);
    }
}
