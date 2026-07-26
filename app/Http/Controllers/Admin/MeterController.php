<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeterController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Meter::withCount('consumptionRecords')->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if (in_array($request->input('type'), Meter::TYPES, true)) {
            $query->where('type', $request->input('type'));
        }

        $sortColumn = match ($request->input('sort')) {
            'name' => 'name',
            'serial' => 'serial_number',
            'type' => 'type',
            'location' => 'location',
            'readings' => 'consumption_records_count',
            'status' => 'status',
            default => null,
        };

        if ($sortColumn) {
            $query->reorder($sortColumn, $request->input('dir') === 'asc' ? 'asc' : 'desc');
        }

        return Inertia::render('admin/meters/index', [
            'meters' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'type', 'sort', 'dir']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/meters/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Meter::create($this->validated($request));

        return redirect()
            ->route('admin.meters.index')
            ->with('success', __('Meter created.'));
    }

    public function edit(Meter $meter): Response
    {
        return Inertia::render('admin/meters/edit', [
            'meter' => $meter,
        ]);
    }

    public function update(Request $request, Meter $meter): RedirectResponse
    {
        $meter->update($this->validated($request, $meter));

        return redirect()
            ->route('admin.meters.index')
            ->with('success', __('Meter updated.'));
    }

    public function destroy(Meter $meter): RedirectResponse
    {
        if ($meter->consumptionRecords()->exists()) {
            return back()->with('error', __('This meter has readings attached. Set it to inactive instead of deleting it.'));
        }

        $meter->delete();

        return back()->with('success', __('Meter deleted.'));
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Meter $meter = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => [
                'required', 'string', 'max:255',
                Rule::unique('meters', 'serial_number')->ignore($meter?->id),
            ],
            'type' => ['required', Rule::in(Meter::TYPES)],
            'location' => 'nullable|string|max:255',
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
