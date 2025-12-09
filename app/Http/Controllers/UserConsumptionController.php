<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Meter;
use App\Models\Period;
use App\Models\ConsumptionRecord;
use Illuminate\Http\Request;

class UserConsumptionController extends Controller
{
    public function dashboard()
    {
        $totalMeters = Meter::count();

        $totalRecords = ConsumptionRecord::count();

        $pending = ConsumptionRecord::where('status', 'pending')->count();
        $approved = ConsumptionRecord::where('status', 'approved')->count();

        $recentEntries = ConsumptionRecord::with(['meter', 'period'])
            ->where("status", "approved")
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('user/dashboard', [
            'totalMeters'     => $totalMeters,
            'totalRecords'    => $totalRecords,
            'pending'         => $pending,
            'approved'        => $approved,
            'recentEntries'   => $recentEntries,
        ]);
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'period_id']);

        $records = ConsumptionRecord::with(['meter', 'period'])
            ->where('status', 'approved')
            // SEARCH (meter name OR period name OR value)
            ->when($request->search, function ($query, $search) {
                $query->whereHas('meter', fn($q) =>
                $q->where('name', 'like', "%{$search}%")
                )
                    ->orWhereHas('period', fn($q) =>
                    $q->where('name', 'like', "%{$search}%")
                    )
                    ->orWhere('current_value', 'like', "%{$search}%")
                    ->orWhere('total_amount', 'like', "%{$search}%");
            })

            // PERIOD FILTER
            ->when($request->period_id && $request->period_id !== 'all', function ($query) use ($request) {
                $query->where('period_id', $request->period_id);
            })

            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('user/index', [
            'consumptionRecords' => $records,
            'filters' => $filters,
            'periods' => Period::all(),
        ]);
    }

    public function show(ConsumptionRecord $record) {
        $record->load(['meter', 'period', 'user']);

        $user = $record->user;

        return Inertia::render('user/show', [
            'consumptionRecord' => $record,
            'user' => $user,
        ]);
    }

    public function reports(Request $request)
    {
        $filters = $request->only(['period_id', 'meter_id', 'date', 'range_start', 'range_end']);

        $query = ConsumptionRecord::with(['meter', 'period'])
            ->where('status', 'approved');

        // DATE FILTERS
        if ($request->date === 'day') {
            $query->whereDate('created_at', today());
        }

        if ($request->date === 'week') {
            $query->whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek(),
            ]);
        }

        if ($request->date === 'month') {
            $query->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year);
        }

        // CUSTOM RANGE
        if ($request->filled('range_start') && $request->filled('range_end')) {
            $query->whereBetween('created_at', [
                $request->range_start . " 00:00:00",
                $request->range_end . " 23:59:59"
            ]);
        }

        // PERIOD FILTER
        if (!empty($request->period_id) && $request->period_id !== 'all') {
            $query->where('period_id', $request->period_id);
        }

        // METER FILTER
        if (!empty($request->meter_id) && $request->meter_id !== 'all') {
            $query->where('meter_id', $request->meter_id);
        }

        $totals = (clone $query)
            ->selectRaw('SUM(current_value) as total_value, SUM(total_amount) as total_amount')
            ->first();

        $records = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('user/reports', [
            'records' => $records,
            'filters' => $filters,
            'periods' => Period::all(),
            'meters' => Meter::all(),
            'totals' => $totals,
        ]);
    }

}
