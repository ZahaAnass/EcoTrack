<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Meter;
use App\Models\Period;
use App\Models\ConsumptionRecord;
use Illuminate\Http\Request;

class ConsumptionController extends Controller
{
    // Dashboard for technician
    public function dashboard()
    {
        return Inertia::render('technician/dashboard', [
            'metersCount' => Meter::count(),
            'myEntriesCount' => ConsumptionRecord::where('user_id', auth()->id())->count(),
            'recentEntries' => ConsumptionRecord::where('user_id', auth()->id())
                ->with(['meter', 'period'])
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }


    // Show form to add consumption
    public function create()
    {
        $meters = Meter::all();
        $periods = Period::all();

        return Inertia::render('technician/addConsumption', [
            'meters' => $meters,
            'periods' => $periods
        ]);
    }


    // Store consumption
    public function store(Request $request)
    {
        // Validate user input
        $data = $request->validate([
            'meter_id' => 'required|exists:meters,id',
            'period_id' => 'required|exists:periods,id',
            'consumption_current' => 'required|numeric|min:0',
        ]);

        $meter = Meter::findOrFail($data['meter_id']);
        $period = Period::findOrFail($data['period_id']);

        // Get previous record for this meter
        $previous = ConsumptionRecord::where('meter_id', $meter->id)
            ->latest('created_at')
            ->first();

        $previousValue = $previous->consumption_current ?? 0;

        if ($data['consumption_current'] <= $previousValue) {
            return back()->withErrors([
                'consumption_current' => 'Current consumption must be greater than the previous consumption value (' . $previousValue . ').'
            ])->withInput();
        }

        // Calculate the difference
        $calc = $data['consumption_current'] - $previousValue;

        // Create record
        ConsumptionRecord::create([
            'meter_id' => $meter->id,
            'user_id' => auth()->id(),
            'period_id' => $period->id,
            'current_value' => $data['consumption_current'],
            'previous_value' => $previousValue,
            'calculated_value' => $calc,
            'unit_price' => $period->unit_price,
            'total_amount' => $calc * $meter->unit_price,
            'reading_date' => now(),
        ]);

        return redirect()
            ->route('consumptions.mine')
            ->with('message', 'Consumption recorded successfully.');
    }

    // List own entries
    public function myEntries()
    {
//        $records = ConsumptionRecord::where('user_id', auth()->id())
//            ->with('meter', 'period')
//            ->paginate(10)
//            ->onEachSide(1);

        $records = ConsumptionRecord::with(['meter','period'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10)
        ->onEachSide(1);


        return Inertia::render('technician/myEntries', [
            'records' => $records,
        ]);

    }

}
