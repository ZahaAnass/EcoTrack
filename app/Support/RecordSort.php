<?php

namespace App\Support;

use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

/**
 * Whitelisted, server-side sorting for consumption record lists, so a sort
 * covers the whole filtered dataset — not just the page on screen.
 */
class RecordSort
{
    /** Sort keys exposed to the frontend. */
    public const KEYS = ['date', 'meter', 'period', 'technician', 'reading', 'used', 'amount', 'status'];

    public static function apply(Builder $query, Request $request): Builder
    {
        $sort = $request->input('sort');
        $dir = $request->input('dir') === 'asc' ? 'asc' : 'desc';

        if (! in_array($sort, self::KEYS, true)) {
            return $query->orderByDesc('reading_date')->orderByDesc('id');
        }

        match ($sort) {
            'date' => $query->orderBy('reading_date', $dir),
            'reading' => $query->orderBy('current_value', $dir),
            'used' => $query->orderBy('calculated_value', $dir),
            'amount' => $query->orderBy('total_amount', $dir),
            'status' => $query->orderBy('status', $dir),
            'meter' => $query->orderBy(
                Meter::select('name')->whereColumn('meters.id', 'consumption_records.meter_id'),
                $dir,
            ),
            'period' => $query->orderBy(
                Period::select('name')->whereColumn('periods.id', 'consumption_records.period_id'),
                $dir,
            ),
            'technician' => $query->orderBy(
                User::select('name')->whereColumn('users.id', 'consumption_records.user_id'),
                $dir,
            ),
        };

        return $query->orderByDesc('id');
    }
}
