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
        $consumptionRecords = ConsumptionRecord::with(['meter', 'period'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $meters = Meter::all();
        $periods = Period::all();

        return Inertia::render('user/dashboard', [
            'consumptionRecords' => $consumptionRecords,
            'meters' => $meters,
            'periods' => $periods,
        ]);
    }

    public function index() {
        $consumptionRecords = ConsumptionRecord::with(['meter', 'period'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('user/index', [
            'consumptionRecords' => $consumptionRecords,
        ]);
    }

    public function show(ConsumptionRecord $record) {
        $record->load(['meter', 'period']);

        return Inertia::render('user/show', [
            'consumptionRecord' => $record,
        ]);
    }
}
