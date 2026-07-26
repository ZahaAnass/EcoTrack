<?php

namespace App\Notifications;

use App\Models\ConsumptionRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Sent to every admin when a technician records (or resubmits) a reading
 * that is waiting for approval.
 */
class ReadingSubmitted extends Notification
{
    use Queueable;

    public function __construct(
        public ConsumptionRecord $record,
        public bool $resubmitted = false,
    ) {}

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
            'kind' => $this->resubmitted ? 'reading_resubmitted' : 'reading_submitted',
            'record_id' => $this->record->id,
            'meter' => $this->record->meter?->name,
            'meter_type' => $this->record->meter?->type,
            'unit' => $this->record->meter?->unit,
            'consumption' => $this->record->calculated_value,
            'technician' => $this->record->user?->name,
            'url' => "/admin/consumptions/{$this->record->id}",
        ];
    }
}
