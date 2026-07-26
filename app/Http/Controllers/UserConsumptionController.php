<?php

namespace App\Http\Controllers;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Support\ConsumptionReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserConsumptionController extends Controller
{
    public function dashboard(): Response
    {
        $thisMonth = ConsumptionRecord::approved()
            ->whereBetween('reading_date', [now()->startOfMonth(), now()->endOfMonth()])
            ->with('meter:id,type')
            ->get();

        $trendRecords = ConsumptionRecord::approved()
            ->where('reading_date', '>=', now()->subDays(29)->startOfDay())
            ->with('meter:id,type')
            ->get();

        $daily = collect(range(29, 0))
            ->map(fn (int $daysAgo) => now()->subDays($daysAgo)->format('Y-m-d'))
            ->map(function (string $date) use ($trendRecords) {
                $records = $trendRecords->filter(fn ($r) => $r->reading_date->format('Y-m-d') === $date);

                return [
                    'date' => $date,
                    'electricity' => round($records->filter(fn ($r) => $r->meter->type === Meter::TYPE_ELECTRICITY)->sum('calculated_value'), 2),
                    'water' => round($records->filter(fn ($r) => $r->meter->type === Meter::TYPE_WATER)->sum('calculated_value'), 2),
                ];
            })
            ->values();

        return Inertia::render('user/dashboard', [
            'stats' => [
                'meters' => Meter::active()->count(),
                'monthElectricity' => round($thisMonth->filter(fn ($r) => $r->meter->type === Meter::TYPE_ELECTRICITY)->sum('calculated_value'), 2),
                'monthWater' => round($thisMonth->filter(fn ($r) => $r->meter->type === Meter::TYPE_WATER)->sum('calculated_value'), 2),
                'monthAmount' => round($thisMonth->sum('total_amount'), 2),
            ],
            'daily' => $daily,
            'recentEntries' => ConsumptionRecord::approved()
                ->with(['meter', 'period'])
                ->orderByDesc('reading_date')
                ->take(8)
                ->get(),
        ]);
    }

    public function index(Request $request): Response
    {
        // Electricity and water each get their own page.
        $type = in_array($request->input('type'), Meter::TYPES, true)
            ? $request->input('type')
            : Meter::TYPE_ELECTRICITY;

        $query = \App\Support\RecordSort::apply(
            ConsumptionRecord::approved()
                ->with(['meter', 'period'])
                ->whereHas('meter', fn ($m) => $m->where('type', $type)),
            $request,
        );

        if ($search = $request->input('search')) {
            $query->whereHas('meter', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('period_id') && $request->input('period_id') !== 'all') {
            $query->where('period_id', $request->input('period_id'));
        }

        return Inertia::render('user/history', [
            'records' => $query->paginate(10)->withQueryString(),
            'filters' => array_merge(
                $request->only(['search', 'period_id', 'sort', 'dir']),
                ['type' => $type],
            ),
            'periods' => Period::forType($type)->orderBy('start_time')->get(['id', 'name']),
        ]);
    }

    public function show(ConsumptionRecord $record): Response
    {
        // Viewers only ever see validated data.
        abort_unless($record->status === ConsumptionRecord::STATUS_APPROVED, 404);

        return Inertia::render('user/show', [
            'record' => $record->load(['meter', 'period', 'user']),
        ]);
    }

    public function reports(Request $request): Response
    {
        return Inertia::render('user/reports', ConsumptionReport::build($request));
    }
}
