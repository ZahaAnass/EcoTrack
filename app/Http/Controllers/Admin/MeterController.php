<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeterController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/meters/index', [
            'meters' => Meter::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/meters/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255|unique:meters,serial_number',
            'unit_price' => 'required|numeric|min:0',
        ]);

        Meter::create($data);

        return redirect()
            ->route('admin.meters.index')
            ->with('message', 'Meter created successfully.');
    }

    public function edit(Meter $meter)
    {
        return Inertia::render('admin/meters/edit', [
            'meter' => $meter,
        ]);
    }

    public function update(Request $request, Meter $meter)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255|unique:meters,serial_number,' . $meter->id,
            'unit_price' => 'required|numeric|min:0',
        ]);

        $meter->update($data);

        return redirect()
            ->route('admin.meters.index')
            ->with('message', 'Meter updated successfully.');
    }

    public function destroy(Meter $meter)
    {
        $meter->delete();

        return back()->with('message', 'Meter deleted successfully.');
    }
}
