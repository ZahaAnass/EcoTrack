<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Period extends Model
{
    use HasFactory;

    public const TYPE_ELECTRICITY = 'electricity';
    public const TYPE_WATER = 'water';

    protected $fillable = [
        'name',
        'type',
        'start_time',
        'end_time',
        'unit_price',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'float',
        ];
    }

    public function consumptionRecords(): HasMany
    {
        return $this->hasMany(ConsumptionRecord::class);
    }

    public function scopeForType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }
}
