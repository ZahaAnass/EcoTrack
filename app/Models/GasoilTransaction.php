<?php

namespace App\Models;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GasoilTransaction extends Model
{
    use HasFactory;

    public const TYPE_IMPORT = 'import';
    public const TYPE_CONSUMPTION = 'consumption';

    public const STATUS_APPROVED = 'approved';
    public const STATUS_PENDING = 'pending';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'type',
        'quantity_liters',
        'entry_date',
        'note',
        'status',
        'user_id',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'quantity_liters' => 'float',
            'entry_date' => 'date:Y-m-d',
            'approved_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * The tank level: approved imports minus approved consumptions.
     * Pending consumptions do not touch the stock until they are approved.
     */
    public static function stockLiters(): float
    {
        $imports = self::approved()->where('type', self::TYPE_IMPORT)->sum('quantity_liters');
        $consumed = self::approved()->where('type', self::TYPE_CONSUMPTION)->sum('quantity_liters');

        return round((float) $imports - (float) $consumed, 2);
    }

    /**
     * The configured alert level, resolved to liters. Either a fixed value
     * or a percentage of everything imported so far.
     */
    public static function alertThresholdLiters(): float
    {
        $mode = Setting::get('gasoil_alert_mode', 'liters');
        $value = (float) Setting::get(
            'gasoil_alert_value',
            (string) config('ecotrack.gasoil_alert_liters'),
        );

        if ($mode === 'percent') {
            $imported = (float) self::approved()
                ->where('type', self::TYPE_IMPORT)
                ->sum('quantity_liters');

            return round($imported * $value / 100, 2);
        }

        return $value;
    }

    /**
     * Burn-rate forecast from the last 30 days of approved consumption:
     * average daily liters, how many days the stock will last, and the
     * projected empty date.
     *
     * @return array{avgDaily: float, daysLeft: int|null, emptyDate: string|null, peakDay: array{date: string, liters: float}|null}
     */
    public static function forecast(): array
    {
        $recent = self::approved()
            ->where('type', self::TYPE_CONSUMPTION)
            ->where('entry_date', '>=', now()->subDays(29)->startOfDay())
            ->get();

        $avgDaily = round((float) $recent->sum('quantity_liters') / 30, 2);

        $stock = self::stockLiters();
        $daysLeft = $avgDaily > 0 ? (int) floor($stock / $avgDaily) : null;

        $peak = $recent
            ->groupBy(fn (self $t) => $t->entry_date->format('Y-m-d'))
            ->map(fn ($group, $date) => ['date' => $date, 'liters' => round($group->sum('quantity_liters'), 2)])
            ->sortByDesc('liters')
            ->first();

        return [
            'avgDaily' => $avgDaily,
            'daysLeft' => $daysLeft,
            'emptyDate' => $daysLeft !== null ? now()->addDays($daysLeft)->toDateString() : null,
            'peakDay' => $peak,
        ];
    }
}
