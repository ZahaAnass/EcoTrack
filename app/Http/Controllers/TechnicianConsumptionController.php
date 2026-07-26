<?php

namespace App\Http\Controllers;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use App\Notifications\ReadingSubmitted;
use App\Support\RecordSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class TechnicianConsumptionController extends Controller
{
    public function dashboard(): Response
    {
        $mine = ConsumptionRecord::where('user_id', auth()->id());

        return Inertia::render('technician/dashboard', [
            'stats' => [
                'total' => (clone $mine)->count(),
                'pending' => (clone $mine)->where('status', ConsumptionRecord::STATUS_PENDING)->count(),
                'approved' => (clone $mine)->where('status', ConsumptionRecord::STATUS_APPROVED)->count(),
                'rejected' => (clone $mine)->where('status', ConsumptionRecord::STATUS_REJECTED)->count(),
                'meters' => Meter::active()->count(),
            ],
            'recentEntries' => (clone $mine)
                ->with(['meter', 'period'])
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('technician/create', [
            'meters' => $this->metersWithLastReading(),
            'periods' => Period::orderBy('start_time')->get(),
            'maxIncrement' => (float) config('ecotrack.max_reading_increment'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'meter_id' => 'required|exists:meters,id',
            'period_id' => 'nullable|exists:periods,id',
            'current_value' => 'required|numeric|min:0',
            'reading_date' => 'nullable|date|before_or_equal:now',
        ]);

        $meter = Meter::findOrFail($data['meter_id']);
        $period = $this->resolvePeriod($meter, $data['period_id'] ?? null);

        if (! $period) {
            return back()->withErrors(['period_id' => __('No tariff period exists for this utility yet. Ask an admin to create one.')])->withInput();
        }

        $previousValue = $meter->latestApprovedRecord()?->current_value ?? 0.0;

        if ($error = $this->validateReading((float) $data['current_value'], $previousValue, $meter)) {
            return back()->withErrors(['current_value' => $error])->withInput();
        }

        $record = ConsumptionRecord::create([
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'user_id' => auth()->id(),
            'reading_date' => $data['reading_date'] ?? now(),
            'current_value' => $data['current_value'],
            'previous_value' => $previousValue,
            'unit_price' => $period->unit_price,
            'status' => ConsumptionRecord::STATUS_PENDING,
        ]);

        $this->notifyAdmins($record);

        return redirect()
            ->route('technician.consumptions.index', ['type' => $meter->type])
            ->with('success', __('Reading recorded. It is now waiting for admin approval.'));
    }

    public function edit(ConsumptionRecord $record): Response
    {
        $this->authorizeRecord($record);

        return Inertia::render('technician/edit', [
            'entry' => $record->load(['meter', 'period']),
            'meters' => $this->metersWithLastReading(),
            'periods' => Period::orderBy('start_time')->get(),
            'maxIncrement' => (float) config('ecotrack.max_reading_increment'),
        ]);
    }

    public function update(Request $request, ConsumptionRecord $record): RedirectResponse
    {
        $this->authorizeRecord($record);

        $data = $request->validate([
            'meter_id' => 'required|exists:meters,id',
            'period_id' => 'nullable|exists:periods,id',
            'current_value' => 'required|numeric|min:0',
            'reading_date' => 'nullable|date|before_or_equal:now',
        ]);

        $meter = Meter::findOrFail($data['meter_id']);
        $period = $this->resolvePeriod($meter, $data['period_id'] ?? null);

        if (! $period) {
            return back()->withErrors(['period_id' => __('No tariff period exists for this utility yet. Ask an admin to create one.')])->withInput();
        }

        $previous = $meter->consumptionRecords()
            ->where('status', ConsumptionRecord::STATUS_APPROVED)
            ->where('id', '!=', $record->id)
            ->orderByDesc('reading_date')
            ->orderByDesc('id')
            ->first();
        $previousValue = $previous?->current_value ?? 0.0;

        if ($error = $this->validateReading((float) $data['current_value'], $previousValue, $meter)) {
            return back()->withErrors(['current_value' => $error])->withInput();
        }

        $record->update([
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'reading_date' => $data['reading_date'] ?? $record->reading_date,
            'current_value' => $data['current_value'],
            'previous_value' => $previousValue,
            'unit_price' => $period->unit_price,
            // An edited reading goes back through the approval workflow.
            'status' => ConsumptionRecord::STATUS_PENDING,
            'approved_by' => null,
            'approved_at' => null,
            'rejection_reason' => null,
        ]);

        $this->notifyAdmins($record, resubmitted: true);

        return redirect()
            ->route('technician.consumptions.index', ['type' => $meter->type])
            ->with('success', __('Reading updated. It has been resubmitted for approval.'));
    }

    public function destroy(ConsumptionRecord $record): RedirectResponse
    {
        $this->authorizeRecord($record);

        $record->delete();

        return back()->with('success', __('Reading deleted.'));
    }

    public function myEntries(Request $request): Response
    {
        // Electricity and water each get their own page.
        $type = in_array($request->input('type'), Meter::TYPES, true)
            ? $request->input('type')
            : Meter::TYPE_ELECTRICITY;

        $query = ConsumptionRecord::with(['meter', 'period'])
            ->where('user_id', auth()->id())
            ->whereHas('meter', fn ($m) => $m->where('type', $type));

        if ($search = $request->input('search')) {
            $query->whereHas('meter', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if (in_array($request->input('status'), ConsumptionRecord::STATUSES, true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('period_id') && $request->input('period_id') !== 'all') {
            $query->where('period_id', $request->input('period_id'));
        }

        return Inertia::render('technician/entries', [
            'records' => RecordSort::apply($query, $request)->paginate(10)->withQueryString(),
            'filters' => array_merge(
                $request->only(['search', 'status', 'period_id', 'sort', 'dir']),
                ['type' => $type],
            ),
            'periods' => Period::forType($type)->orderBy('start_time')->get(['id', 'name']),
        ]);
    }

    /**
     * Water has a single daily tariff, so the period is resolved server-side;
     * electricity requires the technician to pick the time-of-day window.
     */
    private function resolvePeriod(Meter $meter, ?int $periodId): ?Period
    {
        if ($meter->type === Meter::TYPE_WATER) {
            return Period::forType(Period::TYPE_WATER)->first();
        }

        if (! $periodId) {
            return null;
        }

        $period = Period::find($periodId);

        return $period && $period->type === Period::TYPE_ELECTRICITY ? $period : null;
    }

    private function notifyAdmins(ConsumptionRecord $record, bool $resubmitted = false): void
    {
        $record->load(['meter', 'user']);

        Notification::send(
            User::role(User::ROLE_ADMIN)->get(),
            new ReadingSubmitted($record, $resubmitted),
        );
    }

    /**
     * Technicians may only touch their own entries, and never an approved one —
     * approved readings are part of the billing history.
     */
    private function authorizeRecord(ConsumptionRecord $record): void
    {
        abort_unless($record->user_id === auth()->id(), 403, __('This reading belongs to another technician.'));
        abort_unless($record->isEditable(), 403, __('Approved readings can no longer be changed.'));
    }

    private function validateReading(float $current, float $previous, Meter $meter): ?string
    {
        $maxIncrement = (float) config('ecotrack.max_reading_increment');

        if ($current <= $previous) {
            return __('The reading must be greater than the previous approved value (:previous :unit).', [
                'previous' => $previous,
                'unit' => $meter->unit,
            ]);
        }

        if ($previous > 0 && ($current - $previous) > $maxIncrement) {
            return __('This reading jumps more than :max :unit from the previous value (:previous :unit). Double-check the meter.', [
                'max' => $maxIncrement,
                'previous' => $previous,
                'unit' => $meter->unit,
            ]);
        }

        return null;
    }

    /**
     * Active meters plus their latest approved reading, so the form can show
     * the technician the previous value before they type the new one.
     */
    private function metersWithLastReading()
    {
        return Meter::active()
            ->orderBy('name')
            ->get()
            ->map(function (Meter $meter) {
                $last = $meter->latestApprovedRecord();

                return [
                    'id' => $meter->id,
                    'name' => $meter->name,
                    'serial_number' => $meter->serial_number,
                    'type' => $meter->type,
                    'unit' => $meter->unit,
                    'location' => $meter->location,
                    'last_value' => $last?->current_value ?? 0,
                    'last_reading_at' => $last?->reading_date?->toDateTimeString(),
                ];
            });
    }
}
