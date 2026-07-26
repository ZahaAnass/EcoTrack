<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumptionRecord extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    public const STATUSES = [self::STATUS_PENDING, self::STATUS_APPROVED, self::STATUS_REJECTED];

    protected $fillable = [
        'meter_id',
        'period_id',
        'user_id',
        'reading_date',
        'current_value',
        'previous_value',
        'calculated_value',
        'unit_price',
        'total_amount',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'reading_date' => 'datetime',
            'approved_at' => 'datetime',
            'current_value' => 'float',
            'previous_value' => 'float',
            'calculated_value' => 'float',
            'unit_price' => 'float',
            'total_amount' => 'float',
        ];
    }

    protected static function booted(): void
    {
        // Keep the derived columns consistent no matter where a record is
        // created or updated from.
        static::saving(function (self $record) {
            $record->calculated_value = round($record->current_value - $record->previous_value, 2);
            $record->total_amount = round($record->calculated_value * $record->unit_price, 2);
        });
    }

    public function meter(): BelongsTo
    {
        return $this->belongsTo(Meter::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    /** The technician who recorded the reading. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** The admin who approved or rejected the reading. */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function isEditable(): bool
    {
        return $this->status !== self::STATUS_APPROVED;
    }
}
