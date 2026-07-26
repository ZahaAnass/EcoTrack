<?php

namespace App\Notifications;

use App\Models\ConsumptionRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Sent to the technician when an admin approves or rejects their reading.
 */
class ReadingReviewed extends Notification
{
    use Queueable;

    public function __construct(public ConsumptionRecord $record) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'kind' => $this->record->status === ConsumptionRecord::STATUS_APPROVED
                ? 'reading_approved'
                : 'reading_rejected',
            'record_id' => $this->record->id,
            'meter' => $this->record->meter?->name,
            'meter_type' => $this->record->meter?->type,
            'unit' => $this->record->meter?->unit,
            'consumption' => $this->record->calculated_value,
            'reason' => $this->record->rejection_reason,
            'url' => '/technician/consumptions',
        ];
    }
}
