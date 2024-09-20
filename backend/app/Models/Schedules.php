<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedules extends Model
{
    use HasFactory;

    protected $fillable = [
        'day_start',
        'day_end',
        'hour_start',
        'hour_end',
        'user_id',  
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
