<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Period;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/periods/index', [
            'periods' => Period::withCount('consumptionRecords')
                ->orderBy('type')
                ->orderBy('start_time')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/periods/create', [
            'hasWaterPeriod' => Period::forType(Period::TYPE_WATER)->exists(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        // Water is billed with one flat daily tariff — a single period.
        if ($data['type'] === Period::TYPE_WATER && Period::forType(Period::TYPE_WATER)->exists()) {
            return back()
                ->withErrors(['type' => __('Water already has its daily tariff period. Edit the existing one instead.')])
                ->withInput();
        }

        Period::create($data);

        return redirect()
            ->route('admin.periods.index')
            ->with('success', __('Tariff period created.'));
    }

    public function edit(Period $period): Response
    {
        return Inertia::render('admin/periods/edit', [
            'period' => $period,
            'hasWaterPeriod' => Period::forType(Period::TYPE_WATER)
                ->where('id', '!=', $period->id)
                ->exists(),
        ]);
    }

    public function update(Request $request, Period $period): RedirectResponse
    {
        $data = $this->validated($request);

        if (
            $data['type'] === Period::TYPE_WATER
            && Period::forType(Period::TYPE_WATER)->where('id', '!=', $period->id)->exists()
        ) {
            return back()
                ->withErrors(['type' => __('Water already has its daily tariff period. Edit the existing one instead.')])
                ->withInput();
        }

        $period->update($data);

        return redirect()
            ->route('admin.periods.index')
            ->with('success', __('Tariff period updated.'));
    }

    public function destroy(Period $period): RedirectResponse
    {
        if ($period->consumptionRecords()->exists()) {
            return back()->with('error', __('This period is used by existing readings and cannot be deleted.'));
        }

        $period->delete();

        return back()->with('success', __('Tariff period deleted.'));
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in([Period::TYPE_ELECTRICITY, Period::TYPE_WATER])],
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'unit_price' => 'required|numeric|min:0|max:1000',
        ]);

        // The water tariff covers the whole day regardless of what was typed.
        if ($data['type'] === Period::TYPE_WATER) {
            $data['start_time'] = '00:00';
            $data['end_time'] = '23:59';
        }

        return $data;
    }
}
