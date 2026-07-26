<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Meter extends Model
{
    use HasFactory;

    public const TYPE_ELECTRICITY = 'electricity';
    public const TYPE_WATER = 'water';

    public const TYPES = [self::TYPE_ELECTRICITY, self::TYPE_WATER];

    protected $fillable = [
        'name',
        'serial_number',
        'type',
        'location',
        'status',
    ];

    protected $appends = ['unit'];

    public function consumptionRecords(): HasMany
    {
        return $this->hasMany(ConsumptionRecord::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function getUnitAttribute(): string
    {
        return $this->type === self::TYPE_WATER ? 'm³' : 'kWh';
    }

    /**
     * The latest approved reading for this meter (used as the "previous value"
     * when a technician records a new reading).
     */
    public function latestApprovedRecord(): ?ConsumptionRecord
    {
        return $this->consumptionRecords()
            ->where('status', ConsumptionRecord::STATUS_APPROVED)
            ->orderByDesc('reading_date')
            ->orderByDesc('id')
            ->first();
    }
}
