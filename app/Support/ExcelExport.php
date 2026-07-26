<?php

namespace App\Support;

use App\Models\ConsumptionRecord;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Colorful Excel export (admin only). Produces a styled HTML table that
 * Excel, LibreOffice and Google Sheets open natively — green header band,
 * amber/blue utility chips and status colors, matching the app's identity.
 */
class ExcelExport
{
    private const GREEN = '#2f6f4f';
    private const GREEN_LIGHT = '#eaf3ee';
    private const AMBER = '#d97706';
    private const AMBER_LIGHT = '#fdf1e2';
    private const BLUE = '#0284c7';
    private const BLUE_LIGHT = '#e5f3fb';
    private const RED = '#b91c1c';
    private const RED_LIGHT = '#fdeaea';

    public static function gasoilTransactions(
        \Illuminate\Database\Eloquent\Builder $query,
        string $filename,
    ): StreamedResponse {
        $headers = [
            __('Date'), __('Type'), __('Quantity').' (L)', __('Note'),
            __('Recorded by'), __('Status'),
        ];

        return response()->streamDownload(function () use ($query, $headers) {
            echo '<html><head><meta charset="utf-8"></head><body>';
            echo '<table border="0" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">';

            echo '<tr>';
            foreach ($headers as $header) {
                echo '<th style="background:'.self::GREEN.';color:#ffffff;font-weight:bold;padding:8px 10px;border:1px solid '.self::GREEN.';text-align:left;">'
                    .e($header).'</th>';
            }
            echo '</tr>';

            $i = 0;
            $query->chunk(500, function ($transactions) use (&$i) {
                foreach ($transactions as $tx) {
                    $stripe = $i++ % 2 === 1 ? 'background:'.self::GREEN_LIGHT.';' : '';
                    $isImport = $tx->type === 'import';

                    $typeStyle = $isImport
                        ? 'background:'.self::GREEN_LIGHT.';color:'.self::GREEN.';font-weight:bold;'
                        : 'background:#f3e8ff;color:#7e22ce;font-weight:bold;';

                    $statusStyle = match ($tx->status) {
                        'approved' => 'color:'.self::GREEN.';font-weight:bold;',
                        'rejected' => 'color:'.self::RED.';font-weight:bold;',
                        default => 'color:'.self::AMBER.';font-weight:bold;',
                    };

                    $statusLabel = match ($tx->status) {
                        'approved' => __('Approved'),
                        'rejected' => __('Rejected'),
                        default => __('Pending'),
                    };

                    $cell = 'padding:6px 10px;border:1px solid #d8e4dc;'.$stripe;

                    echo '<tr>';
                    echo '<td style="'.$cell.'">'.e($tx->entry_date->format('Y-m-d')).'</td>';
                    echo '<td style="'.$cell.$typeStyle.'">'.($isImport ? __('Import') : __('Consumption')).'</td>';
                    echo '<td style="'.$cell.'text-align:right;font-weight:bold;">'.($isImport ? '+' : '-').$tx->quantity_liters.'</td>';
                    echo '<td style="'.$cell.'">'.e($tx->note ?? '').'</td>';
                    echo '<td style="'.$cell.'">'.e($tx->user?->name).'</td>';
                    echo '<td style="'.$cell.$statusStyle.'">'.$statusLabel.'</td>';
                    echo '</tr>';
                }
            });

            echo '</table></body></html>';
        }, $filename, [
            'Content-Type' => 'application/vnd.ms-excel; charset=utf-8',
        ]);
    }

    public static function consumptionRecords(
        Builder $query,
        string $filename,
        bool $includeStatus = true,
    ): StreamedResponse {
        $headers = [
            __('Date'), __('Meter'), __('Serial'), __('Utility'), __('Period'),
            __('Technician'), __('Previous'), __('Current'), __('Used'),
            __('Unit'), __('Unit price'), __('Amount'),
        ];

        if ($includeStatus) {
            $headers[] = __('Status');
        }

        return response()->streamDownload(function () use ($query, $headers, $includeStatus) {
            echo '<html><head><meta charset="utf-8"></head><body>';
            echo '<table border="0" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;">';

            echo '<tr>';
            foreach ($headers as $header) {
                echo '<th style="background:'.self::GREEN.';color:#ffffff;font-weight:bold;padding:8px 10px;border:1px solid '.self::GREEN.';text-align:left;">'
                    .e($header).'</th>';
            }
            echo '</tr>';

            $i = 0;
            $query->chunk(500, function ($records) use (&$i, $includeStatus) {
                foreach ($records as $record) {
                    /** @var ConsumptionRecord $record */
                    $stripe = $i++ % 2 === 1 ? 'background:'.self::GREEN_LIGHT.';' : '';
                    $isWater = $record->meter?->type === 'water';

                    $utilityStyle = $isWater
                        ? 'background:'.self::BLUE_LIGHT.';color:'.self::BLUE.';font-weight:bold;'
                        : 'background:'.self::AMBER_LIGHT.';color:'.self::AMBER.';font-weight:bold;';

                    $statusStyle = match ($record->status) {
                        ConsumptionRecord::STATUS_APPROVED => 'background:'.self::GREEN_LIGHT.';color:'.self::GREEN.';font-weight:bold;',
                        ConsumptionRecord::STATUS_REJECTED => 'background:'.self::RED_LIGHT.';color:'.self::RED.';font-weight:bold;',
                        default => 'background:'.self::AMBER_LIGHT.';color:'.self::AMBER.';font-weight:bold;',
                    };

                    $statusLabel = match ($record->status) {
                        ConsumptionRecord::STATUS_APPROVED => __('Approved'),
                        ConsumptionRecord::STATUS_REJECTED => __('Rejected'),
                        default => __('Pending'),
                    };

                    $cell = 'padding:6px 10px;border:1px solid #d8e4dc;'.$stripe;

                    echo '<tr>';
                    echo '<td style="'.$cell.'">'.e($record->reading_date->format('Y-m-d H:i')).'</td>';
                    echo '<td style="'.$cell.'font-weight:bold;">'.e($record->meter?->name).'</td>';
                    echo '<td style="'.$cell.'">'.e($record->meter?->serial_number).'</td>';
                    echo '<td style="'.$cell.$utilityStyle.'">'.($isWater ? __('Water') : __('Electricity')).'</td>';
                    echo '<td style="'.$cell.'">'.e($record->period?->name).'</td>';
                    echo '<td style="'.$cell.'">'.e($record->user?->name).'</td>';
                    echo '<td style="'.$cell.'text-align:right;">'.$record->previous_value.'</td>';
                    echo '<td style="'.$cell.'text-align:right;">'.$record->current_value.'</td>';
                    echo '<td style="'.$cell.'text-align:right;font-weight:bold;">'.$record->calculated_value.'</td>';
                    echo '<td style="'.$cell.'">'.e($record->meter?->unit).'</td>';
                    echo '<td style="'.$cell.'text-align:right;">'.$record->unit_price.'</td>';
                    echo '<td style="'.$cell.'text-align:right;font-weight:bold;color:'.self::GREEN.';">'.$record->total_amount.'</td>';
                    if ($includeStatus) {
                        echo '<td style="'.$cell.$statusStyle.'">'.$statusLabel.'</td>';
                    }
                    echo '</tr>';
                }
            });

            echo '</table></body></html>';
        }, $filename, [
            'Content-Type' => 'application/vnd.ms-excel; charset=utf-8',
        ]);
    }
}
