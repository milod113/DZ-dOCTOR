<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagingExam extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function center()
    {
        return $this->belongsTo(ImagingCenter::class);
    }
}
