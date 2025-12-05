<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Meter;
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
        ]);
    }

    // Show form to add consumption
    public function create()
    {
        $meters = Meter::all();
        return Inertia::render('technician/addConsumption', compact('meters'));
    }

    // Store consumption
    public function store(Request $request)
    {
        $data = $request->validate([
            'meter_id' => 'required|exists:meters,id',
            'consumption_current' => 'required|numeric|min:0',
        ]);

        $meter = Meter::findOrFail($data['meter_id']);
        $previous = ConsumptionRecord::where('meter_id', $meter->id)
            ->latest('created_at')
            ->first();

        $calc = $data['consumption_current'] - ($previous->consumption_current ?? 0);

        ConsumptionRecord::create([
            'meter_id' => $meter->id,
            'user_id' => auth()->id(),
            'consumption_current' => $data['consumption_current'],
            'consumption_previous' => $previous->consumption_current ?? 0,
            'consumption_calculated' => $calc,
            'period_id' => 1, // later calculate based on time
            'unit_price' => 1, // fetch from period
            'total_amount' => $calc * 1,
        ]);

        return redirect()->route('consumptions.mine')->with('success', 'Consumption recorded.');
    }

    // List own entries
    public function myEntries()
    {
        $records = ConsumptionRecord::where('user_id', auth()->id())->with('meter', 'period')->get();
        return Inertia::render('technician/myEntries', compact('records'));
    }
}
