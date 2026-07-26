<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
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

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'meters' => Meter::count(),
                'electricityMeters' => Meter::where('type', Meter::TYPE_ELECTRICITY)->count(),
                'waterMeters' => Meter::where('type', Meter::TYPE_WATER)->count(),
                'periods' => Period::count(),
                'records' => ConsumptionRecord::count(),
                'pending' => ConsumptionRecord::pending()->count(),
                'technicians' => User::role(User::ROLE_TECHNICIAN)->count(),
                'users' => User::count(),
                'monthConsumptionElectricity' => round($thisMonth->filter(fn ($r) => $r->meter->type === Meter::TYPE_ELECTRICITY)->sum('calculated_value'), 2),
                'monthConsumptionWater' => round($thisMonth->filter(fn ($r) => $r->meter->type === Meter::TYPE_WATER)->sum('calculated_value'), 2),
                'monthAmount' => round($thisMonth->sum('total_amount'), 2),
                'gasoilStock' => \App\Models\GasoilTransaction::stockLiters(),
                'gasoilLow' => \App\Models\GasoilTransaction::stockLiters()
                    <= \App\Models\GasoilTransaction::alertThresholdLiters(),
            ],
            'daily' => $daily,
            'pendingRecords' => ConsumptionRecord::pending()
                ->with(['meter', 'period', 'user'])
                ->latest()
                ->take(6)
                ->get(),
            'recentRecords' => ConsumptionRecord::with(['meter', 'period', 'user'])
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }
}
