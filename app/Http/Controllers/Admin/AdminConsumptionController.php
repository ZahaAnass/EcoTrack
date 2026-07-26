<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Notifications\ReadingReviewed;
use App\Support\ExcelExport;
use App\Support\RecordSort;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminConsumptionController extends Controller
{
    public function index(Request $request): Response
    {
        // Electricity and water each get their own page.
        $type = in_array($request->input('type'), Meter::TYPES, true)
            ? $request->input('type')
            : Meter::TYPE_ELECTRICITY;

        $query = RecordSort::apply($this->filtered($request, $type), $request);

        $byType = fn (string $t) => ConsumptionRecord::whereHas('meter', fn ($m) => $m->where('type', $t));

        return Inertia::render('admin/consumptions/index', [
            'records' => $query->paginate(10)->withQueryString(),
            'filters' => array_merge(
                $request->only(['search', 'status', 'meter_id', 'period_id', 'sort', 'dir']),
                ['type' => $type],
            ),
            'statusCounts' => [
                'all' => $byType($type)->count(),
                'pending' => $byType($type)->where('status', ConsumptionRecord::STATUS_PENDING)->count(),
                'approved' => $byType($type)->where('status', ConsumptionRecord::STATUS_APPROVED)->count(),
                'rejected' => $byType($type)->where('status', ConsumptionRecord::STATUS_REJECTED)->count(),
            ],
            'meters' => Meter::where('type', $type)->orderBy('name')->get(['id', 'name', 'type']),
            'periods' => Period::forType($type)->orderBy('start_time')->get(['id', 'name']),
        ]);
    }

    public function show(ConsumptionRecord $consumption): Response
    {
        return Inertia::render('admin/consumptions/show', [
            'record' => $consumption->load(['meter', 'period', 'user', 'approver']),
        ]);
    }

    public function approve(ConsumptionRecord $consumption): RedirectResponse
    {
        if ($consumption->status === ConsumptionRecord::STATUS_APPROVED) {
            return back()->with('error', __('This reading is already approved.'));
        }

        $consumption->update([
            'status' => ConsumptionRecord::STATUS_APPROVED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => null,
        ]);

        $consumption->user?->notify(new ReadingReviewed($consumption->load('meter')));

        return back()->with('success', __('Reading approved.'));
    }

    public function reject(Request $request, ConsumptionRecord $consumption): RedirectResponse
    {
        $data = $request->validate([
            'reason' => 'nullable|string|max:255',
        ]);

        $consumption->update([
            'status' => ConsumptionRecord::STATUS_REJECTED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => $data['reason'] ?? null,
        ]);

        $consumption->user?->notify(new ReadingReviewed($consumption->load('meter')));

        return back()->with('success', __('Reading rejected.'));
    }

    public function destroy(ConsumptionRecord $consumption): RedirectResponse
    {
        $consumption->delete();

        return redirect()
            ->route('admin.consumptions.index')
            ->with('success', __('Reading deleted.'));
    }

    public function export(Request $request): StreamedResponse
    {
        $type = in_array($request->input('type'), Meter::TYPES, true)
            ? $request->input('type')
            : Meter::TYPE_ELECTRICITY;

        $query = $this->filtered($request, $type)->latest('reading_date');

        return ExcelExport::consumptionRecords(
            $query,
            'ecotrack-'.$type.'-'.now()->format('Y-m-d-His').'.xls',
        );
    }

    private function filtered(Request $request, string $type)
    {
        $query = ConsumptionRecord::with(['meter', 'period', 'user'])
            ->whereHas('meter', fn ($m) => $m->where('type', $type));

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('meter', fn ($m) => $m->where('name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        if (in_array($request->input('status'), ConsumptionRecord::STATUSES, true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('meter_id') && $request->input('meter_id') !== 'all') {
            $query->where('meter_id', $request->input('meter_id'));
        }

        if ($request->filled('period_id') && $request->input('period_id') !== 'all') {
            $query->where('period_id', $request->input('period_id'));
        }

        return $query;
    }
}
