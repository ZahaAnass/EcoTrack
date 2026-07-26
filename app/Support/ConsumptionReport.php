<?php

namespace App\Support;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Support\ExcelExport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Builds the filtered, aggregated data behind the reports screens and the
 * CSV exports. Reports only ever look at approved records — pending and
 * rejected readings are workflow states, not billing data.
 */
class ConsumptionReport
{
    /**
     * @return array{filters: array<string, mixed>, query: Builder}
     */
    public static function query(Request $request): array
    {
        $filters = $request->only(['type', 'meter_id', 'period_id', 'date', 'range_start', 'range_end']);

        $query = ConsumptionRecord::query()
            ->approved()
            ->with(['meter', 'period', 'user']);

        match ($request->input('date')) {
            'day' => $query->whereDate('reading_date', today()),
            'week' => $query->whereBetween('reading_date', [now()->startOfWeek(), now()->endOfWeek()]),
            'month' => $query->whereBetween('reading_date', [now()->startOfMonth(), now()->endOfMonth()]),
            'year' => $query->whereBetween('reading_date', [now()->startOfYear(), now()->endOfYear()]),
            default => null,
        };

        if ($request->filled('range_start')) {
            $query->where('reading_date', '>=', $request->input('range_start').' 00:00:00');
        }

        if ($request->filled('range_end')) {
            $query->where('reading_date', '<=', $request->input('range_end').' 23:59:59');
        }

        if (in_array($request->input('type'), Meter::TYPES, true)) {
            $query->whereHas('meter', fn (Builder $q) => $q->where('type', $request->input('type')));
        }

        if ($request->filled('meter_id') && $request->input('meter_id') !== 'all') {
            $query->where('meter_id', $request->input('meter_id'));
        }

        if ($request->filled('period_id') && $request->input('period_id') !== 'all') {
            $query->where('period_id', $request->input('period_id'));
        }

        return ['filters' => $filters, 'query' => $query];
    }

    /**
     * Everything the reports page needs: paginated records, totals split by
     * meter type, a daily time series and a per-meter breakdown.
     *
     * @return array<string, mixed>
     */
    public static function build(Request $request): array
    {
        ['filters' => $filters, 'query' => $query] = self::query($request);

        $all = (clone $query)->get();

        $byType = $all
            ->groupBy(fn (ConsumptionRecord $r) => $r->meter->type)
            ->map(fn ($records, $type) => [
                'type' => $type,
                'consumption' => round($records->sum('calculated_value'), 2),
                'amount' => round($records->sum('total_amount'), 2),
                'count' => $records->count(),
            ])
            ->values();

        $daily = $all
            ->sortBy('reading_date')
            ->groupBy(fn (ConsumptionRecord $r) => $r->reading_date->format('Y-m-d'))
            ->map(fn ($records, $date) => [
                'date' => $date,
                'electricity' => round($records->filter(fn ($r) => $r->meter->type === Meter::TYPE_ELECTRICITY)->sum('calculated_value'), 2),
                'water' => round($records->filter(fn ($r) => $r->meter->type === Meter::TYPE_WATER)->sum('calculated_value'), 2),
                'amount' => round($records->sum('total_amount'), 2),
            ])
            ->values();

        $byMeter = $all
            ->groupBy('meter_id')
            ->map(fn ($records) => [
                'meter' => $records->first()->meter->only(['id', 'name', 'type', 'unit']),
                'consumption' => round($records->sum('calculated_value'), 2),
                'amount' => round($records->sum('total_amount'), 2),
                'count' => $records->count(),
            ])
            ->sortByDesc('amount')
            ->values();

        return [
            'records' => RecordSort::apply(clone $query, $request)->paginate(10)->withQueryString(),
            'filters' => $filters,
            'totals' => [
                'consumption' => round($all->sum('calculated_value'), 2),
                'amount' => round($all->sum('total_amount'), 2),
                'count' => $all->count(),
            ],
            'byType' => $byType,
            'daily' => $daily,
            'byMeter' => $byMeter,
            'meters' => Meter::orderBy('name')->get(['id', 'name', 'type']),
            'periods' => Period::orderBy('name')->get(['id', 'name']),
        ];
    }

    public static function exportExcel(Request $request): StreamedResponse
    {
        ['query' => $query] = self::query($request);

        return ExcelExport::consumptionRecords(
            $query->orderByDesc('reading_date'),
            'ecotrack-report-'.now()->format('Y-m-d-His').'.xls',
            includeStatus: false,
        );
    }
}
