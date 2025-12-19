<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meter;
use App\Models\Period;
use App\Models\ConsumptionRecord;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('admin/dashboard', [
            'totalMeters'   => Meter::count(),
            'totalPeriods'  => Period::count(),
            'totalRecords'  => ConsumptionRecord::count(),
            'pendingCount'  => ConsumptionRecord::where('status', 'pending')->count(),

            'recentRecords' => ConsumptionRecord::with(['meter', 'period', 'user'])
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }
}
