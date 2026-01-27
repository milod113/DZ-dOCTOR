<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImagingRequest extends Model
{
    // protected $guarded = []; allows all fields, including 'family_member_id'
    protected $guarded = [];

    protected $casts = [
        'requested_date' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function center(): BelongsTo
    {
        return $this->belongsTo(ImagingCenter::class, 'imaging_center_id');
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(ImagingExam::class, 'imaging_exam_id');
    }

    // ✅ ADDED: Relationship to FamilyMember
    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class);
    }
}
