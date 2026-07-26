<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GasoilTransaction;
use App\Models\Setting;
use App\Models\User;
use App\Notifications\GasoilLowStock;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GasoilController extends Controller
{
    public function index(): Response
    {
        $stock = GasoilTransaction::stockLiters();

        $consumedThisMonth = GasoilTransaction::approved()
            ->where('type', GasoilTransaction::TYPE_CONSUMPTION)
            ->whereBetween('entry_date', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('quantity_liters');

        // Daily approved consumption for the last 30 days.
        $recent = GasoilTransaction::approved()
            ->where('type', GasoilTransaction::TYPE_CONSUMPTION)
            ->where('entry_date', '>=', now()->subDays(29)->startOfDay())
            ->get();

        $daily = collect(range(29, 0))
            ->map(fn (int $daysAgo) => now()->subDays($daysAgo)->format('Y-m-d'))
            ->map(fn (string $date) => [
                'date' => $date,
                'liters' => round(
                    $recent->filter(fn ($t) => $t->entry_date->format('Y-m-d') === $date)
                        ->sum('quantity_liters'),
                    2,
                ),
            ])
            ->values();

        return Inertia::render('admin/gasoil', [
            'stock' => $stock,
            'threshold' => $this->thresholdLiters(),
            'alertMode' => Setting::get('gasoil_alert_mode', 'liters'),
            'alertValue' => (float) Setting::get(
                'gasoil_alert_value',
                (string) config('ecotrack.gasoil_alert_liters'),
            ),
            'litersPerTon' => (float) config('ecotrack.gasoil_liters_per_ton'),
            'totals' => [
                'imported' => (float) GasoilTransaction::approved()
                    ->where('type', GasoilTransaction::TYPE_IMPORT)->sum('quantity_liters'),
                'consumed' => (float) GasoilTransaction::approved()
                    ->where('type', GasoilTransaction::TYPE_CONSUMPTION)->sum('quantity_liters'),
                'consumedThisMonth' => (float) $consumedThisMonth,
                'pending' => GasoilTransaction::where('status', GasoilTransaction::STATUS_PENDING)->count(),
            ],
            'daily' => $daily,
            'forecast' => GasoilTransaction::forecast(),
            'transactions' => GasoilTransaction::with(['user:id,name', 'approver:id,name'])
                ->orderByDesc('entry_date')
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function export(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        return \App\Support\ExcelExport::gasoilTransactions(
            GasoilTransaction::with(['user:id,name'])
                ->orderByDesc('entry_date')
                ->orderByDesc('id'),
            'ecotrack-gasoil-'.now()->format('Y-m-d-His').'.xls',
        );
    }

    public function storeImport(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'unit' => ['required', Rule::in(['liters', 'tons'])],
            'entry_date' => 'required|date|before_or_equal:now',
            'note' => 'nullable|string|max:255',
        ]);

        $liters = $data['unit'] === 'tons'
            ? round($data['quantity'] * (float) config('ecotrack.gasoil_liters_per_ton'), 2)
            : round((float) $data['quantity'], 2);

        GasoilTransaction::create([
            'type' => GasoilTransaction::TYPE_IMPORT,
            'quantity_liters' => $liters,
            'entry_date' => $data['entry_date'],
            'note' => $data['note'] ?? null,
            // An import is a physical delivery — it is approved by definition.
            'status' => GasoilTransaction::STATUS_APPROVED,
            'user_id' => auth()->id(),
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', __('Gasoil import recorded: :liters L added to stock.', [
            'liters' => number_format($liters, 2),
        ]));
    }

    public function storeConsumption(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'entry_date' => 'required|date|before_or_equal:now',
            'note' => 'nullable|string|max:255',
        ]);

        $stock = GasoilTransaction::stockLiters();

        if ($data['quantity'] > $stock) {
            return back()->withErrors([
                'quantity' => __('Only :stock L are in stock — a consumption cannot exceed it.', [
                    'stock' => number_format($stock, 2),
                ]),
            ])->withInput();
        }

        GasoilTransaction::create([
            'type' => GasoilTransaction::TYPE_CONSUMPTION,
            'quantity_liters' => round((float) $data['quantity'], 2),
            'entry_date' => $data['entry_date'],
            'note' => $data['note'] ?? null,
            // Consumption only hits the stock once it is approved.
            'status' => GasoilTransaction::STATUS_PENDING,
            'user_id' => auth()->id(),
        ]);

        return back()->with('success', __('Gasoil consumption recorded — approve it to deduct it from stock.'));
    }

    public function approve(GasoilTransaction $transaction): RedirectResponse
    {
        if ($transaction->status !== GasoilTransaction::STATUS_PENDING) {
            return back()->with('error', __('This entry has already been processed.'));
        }

        $stockBefore = GasoilTransaction::stockLiters();

        if ($transaction->quantity_liters > $stockBefore) {
            return back()->with('error', __('Only :stock L are in stock — a consumption cannot exceed it.', [
                'stock' => number_format($stockBefore, 2),
            ]));
        }

        $transaction->update([
            'status' => GasoilTransaction::STATUS_APPROVED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $this->alertIfLow($stockBefore);

        return back()->with('success', __('Gasoil consumption approved and deducted from stock.'));
    }

    public function reject(GasoilTransaction $transaction): RedirectResponse
    {
        if ($transaction->status !== GasoilTransaction::STATUS_PENDING) {
            return back()->with('error', __('This entry has already been processed.'));
        }

        $transaction->update([
            'status' => GasoilTransaction::STATUS_REJECTED,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return back()->with('success', __('Gasoil entry rejected.'));
    }

    public function destroy(GasoilTransaction $transaction): RedirectResponse
    {
        $transaction->delete();

        return back()->with('success', __('Gasoil entry deleted.'));
    }

    /**
     * The alert level is configurable per facility: a fixed number of liters,
     * or a percentage of everything imported so far.
     */
    public function saveSettings(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'mode' => ['required', Rule::in(['liters', 'percent'])],
            'value' => 'required|numeric|min:1',
        ]);

        if ($data['mode'] === 'percent' && $data['value'] > 100) {
            return back()->withErrors(['value' => __('A percentage cannot exceed 100.')])->withInput();
        }

        Setting::set('gasoil_alert_mode', $data['mode']);
        Setting::set('gasoil_alert_value', (string) $data['value']);

        return back()->with('success', __('Alert level saved: :threshold L.', [
            'threshold' => number_format($this->thresholdLiters(), 2),
        ]));
    }

    /** Resolve the configured alert level to liters. */
    private function thresholdLiters(): float
    {
        return GasoilTransaction::alertThresholdLiters();
    }

    /**
     * Notify every admin the moment the stock crosses below the threshold —
     * once per crossing, not on every subsequent consumption.
     */
    private function alertIfLow(float $stockBefore): void
    {
        $threshold = $this->thresholdLiters();
        $stockNow = GasoilTransaction::stockLiters();

        if ($stockNow <= $threshold && $stockBefore > $threshold) {
            Notification::send(
                User::role(User::ROLE_ADMIN)->get(),
                new GasoilLowStock($stockNow),
            );
        }
    }
}
