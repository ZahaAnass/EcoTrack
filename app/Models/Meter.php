<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meter extends Model
{
//    use HasFactory;

    protected $fillable = [
        "name",
        "location",
    ];

    public function consumptionRecords() {
        return $this->hasMany(ConsumptionRecord::class);
    }
}
