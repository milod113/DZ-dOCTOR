<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagingCenter extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'equipment_list' => 'array',
        'opening_hours' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exams()
    {
        return $this->hasMany(ImagingExam::class);
    }
// Add this method
public function requests()
{
    return $this->hasMany(ImagingRequest::class);
}

}
