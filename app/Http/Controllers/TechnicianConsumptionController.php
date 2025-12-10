<?php

namespace App\Http\Controllers;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TechnicianConsumptionController extends Controller
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

    public function destroy(ConsumptionRecord $record)
    {
        if ($record->user_id !== auth()->id()) {
            return redirect()
                ->back()
                ->withErrors('You are not authorized to delete this record.');
        }

        $record->delete();

        return back();
    }

    public function edit(ConsumptionRecord $record)
    {
        return Inertia::render('technician/editConsumption', [
            'entry'   => $record,
            'meters'  => Meter::all(),
            'periods' => Period::all(),
        ]);
    }

    public function update(Request $request, ConsumptionRecord $record)
    {
        // Authorization check
        if ($record->user_id !== auth()->id()) {
            return redirect()
                ->back()
                ->withErrors('You are not authorized to update this record.');
        }

        // Validate input
        $data = $request->validate([
            'meter_id' => 'required|exists:meters,id',
            'period_id' => 'required|exists:periods,id',
            'consumption_current' => 'required|numeric|min:0',
        ]);

        $meter = Meter::findOrFail($data['meter_id']);
        $period = Period::findOrFail($data['period_id']);

        // === GET PREVIOUS APPROVED RECORD ===
        $previous = ConsumptionRecord::where('meter_id', $meter->id)
            ->where('status', 'approved')
            ->where('id', '!=', $record->id)
            ->latest('created_at')
            ->first();

        $previousValue = $previous->current_value ?? 0;


        if ($data['consumption_current'] <= $previousValue) {
            return back()->withErrors([
                'consumption_current' =>
                    'Current consumption must be greater than the previous value (' . $previousValue . ' Kw).'
            ])->withInput();
        }

        if ($previousValue > 0 && $data['consumption_current'] > $previousValue + 300) {
            return back()->withErrors([
                'consumption_current' =>
                    'Current consumption exceeds the allowed maximum increment of 300 from previous value (' . $previousValue . ' Kw).'
            ])->withInput();
        }

        // Calculate the difference
        $calc = $data['consumption_current'] - $previousValue;

        if ($calc < 0) {
            return back()->withErrors([
                'consumption_current' => 'Calculated consumption cannot be negative.'
            ])->withInput();
        }

        $record->update([
            'meter_id'          => $meter->id,
            'period_id'         => $period->id,
            'current_value'     => $data['consumption_current'],
            'previous_value'    => $previousValue,
            'calculated_value'  => $calc,
            'unit_price'        => $period->unit_price,
            'total_amount'      => $calc * $meter->unit_price,
        ]);

        return redirect()
            ->route('technician.consumptions.mine')
            ->with('message', 'Consumption updated successfully.');
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
        $previous = ConsumptionRecord::where([
            'meter_id' => $meter->id,
            "status" => 'approved'
        ])
            ->latest('created_at')
            ->first();

        $previousValue = $previous->current_value ?? 0;

        if ($data['consumption_current'] <= $previousValue) {
            return back()->withErrors([
                'consumption_current' => 'Current consumption must be greater than the previous consumption value (' . $previousValue . 'Kw ).'
            ])->withInput();
        }

        if ($previousValue > 0 && $data["consumption_current"] > $previousValue + 300) {
            return back()->withErrors([
                'consumption_current' => 'Current consumption exceeds the maximum allowed increment of ' . 300 . ' from the previous value (' . $previousValue . 'Kw ).'
            ])->withInput();
        }

        // Calculate the difference
        $calc = $data['consumption_current'] - $previousValue;

        if ($calc < 0) {
            return back()->withErrors([
                'consumption_current' => 'Calculated consumption cannot be negative.'
            ])->withInput();
        }

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
            ->route('technician.consumptions.mine')
            ->with('message', 'Consumption recorded successfully.');
    }

    public function myEntries(Request $request)
    {
        $query = ConsumptionRecord::with(['meter', 'period'])
            ->where('user_id', auth()->id())
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->whereHas('meter', function ($q) use ($search) {
                $q->where('serial_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('period_id')) {
            $query->where('period_id', $request->period_id);
        }

        $records = $query->paginate(10)->onEachSide(1);

        return Inertia::render('technician/myEntries', [
            'records' => $records,
            'filters' => $request->only(['search', 'status', 'period_id']),
            'periods' => Period::all(),
        ]);
    }
}
