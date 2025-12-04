<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
//    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'unit_price',
    ];

    public function consumptionRecords()
    {
        return $this->hasMany(ConsumptionRecord::class);
    }
}

