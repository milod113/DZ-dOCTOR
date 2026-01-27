<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laboratory extends Model
{
    use HasFactory;

    // Allows mass assignment for all columns defined in your migrations
    // (name, license_number, city, wilaya, verification_status, document_path, etc.)
    protected $guarded = [];

    // Optional: Casts for specific data types
protected $casts = [
        'verification_status' => 'string',
        'offers_home_visit' => 'boolean',
        'opening_hours' => 'array', // <--- Auto-convert JSON to Array
    ];

    // --- RELATIONSHIPS ---

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the analysis requests (prescriptions) sent to this laboratory.
     */


    // --- HELPER METHODS ---

    /**
     * Check if the laboratory is verified and allowed to operate.
     * Replaces the old 'is_verified' boolean check.
     */
    public function isVerified()
    {
        return $this->verification_status === 'verified';
    }

    /**
     * Check if the laboratory is currently pending approval.
     */
    public function isPending()
    {
        return $this->verification_status === 'pending';
    }

    public function tests()
    {
        return $this->hasMany(LaboratoryTest::class);
    }
public function analysisRequests()
    {
        return $this->hasMany(AnalysisRequest::class);
    }

}
