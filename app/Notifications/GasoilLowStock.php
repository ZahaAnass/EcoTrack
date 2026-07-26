<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

/**
 * Sent to every admin when the gasoil stock crosses below the alert
 * threshold (500 L by default).
 */
class GasoilLowStock extends Notification
{
    use Queueable;

    public function __construct(public float $remainingLiters) {}

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
            'kind' => 'gasoil_low',
            'remaining_liters' => $this->remainingLiters,
            'url' => '/admin/gasoil',
        ];
    }
}
