<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\ConsumptionReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/reports', array_merge(
            ConsumptionReport::build($request),
            ['gasoil' => $this->gasoilSection($request)],
        ));
    }

    /**
     * Gasoil is admin-only, so its report block only exists on this page.
     * It honors the same date filters as the meter report above it.
     *
     * @return array<string, mixed>
     */
    private function gasoilSection(Request $request): array
    {
        $query = \App\Models\GasoilTransaction::approved();

        match ($request->input('date')) {
            'day' => $query->whereDate('entry_date', today()),
            'week' => $query->whereBetween('entry_date', [now()->startOfWeek(), now()->endOfWeek()]),
            'month' => $query->whereBetween('entry_date', [now()->startOfMonth(), now()->endOfMonth()]),
            'year' => $query->whereBetween('entry_date', [now()->startOfYear(), now()->endOfYear()]),
            default => null,
        };

        if ($request->filled('range_start')) {
            $query->where('entry_date', '>=', $request->input('range_start'));
        }

        if ($request->filled('range_end')) {
            $query->where('entry_date', '<=', $request->input('range_end'));
        }

        $all = $query->get();
        $consumptions = $all->where('type', 'consumption');

        return [
            'imported' => round((float) $all->where('type', 'import')->sum('quantity_liters'), 2),
            'consumed' => round((float) $consumptions->sum('quantity_liters'), 2),
            'stock' => \App\Models\GasoilTransaction::stockLiters(),
            'daily' => $consumptions
                ->sortBy('entry_date')
                ->groupBy(fn ($t) => $t->entry_date->format('Y-m-d'))
                ->map(fn ($group, $date) => [
                    'date' => $date,
                    'liters' => round($group->sum('quantity_liters'), 2),
                ])
                ->values(),
        ];
    }

    public function export(Request $request): StreamedResponse
    {
        return ConsumptionReport::exportExcel($request);
    }
}
