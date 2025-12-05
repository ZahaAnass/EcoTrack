<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumptionRecord extends Model
{
//    use HasFactory;

    protected $fillable = [
        'meter_id',
        'technician_id',
        'period_id',
        'reading_date',
        'current_value',
        'previous_value',
        'calculated_value',
        'unit_price',
        'total_amount',
        'user_id',
    ];

    protected array $dates = ['reading_date'];

    public function meter() : BelongsTo
    {
        return $this->belongsTo(Meter::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function period() : BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    protected static function booted(): void
    {
        static::creating(function ($record) {
            $record->calculated_value = $record->current_value - $record->previous_value;
            $record->total_amount = $record->calculated_value * $record->unit_price;
        });
    }
}
