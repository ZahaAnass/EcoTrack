<?php

namespace Database\Seeders;

use App\Models\GasoilTransaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class GasoilSeeder extends Seeder
{
    /**
     * Two deliveries and a realistic daily burn — leaves a healthy stock
     * so the low-level alert can be demonstrated by real usage.
     */
    public function run(): void
    {
        if (GasoilTransaction::exists()) {
            return;
        }

        $admin = User::role(User::ROLE_ADMIN)->first();
        if (! $admin) {
            return;
        }

        $imports = [
            ['days_ago' => 75, 'liters' => 4 * 1176, 'note' => 'Livraison 4 t'],
            ['days_ago' => 25, 'liters' => 2 * 1176, 'note' => 'Livraison 2 t'],
        ];

        foreach ($imports as $import) {
            GasoilTransaction::create([
                'type' => GasoilTransaction::TYPE_IMPORT,
                'quantity_liters' => $import['liters'],
                'entry_date' => now()->subDays($import['days_ago'])->toDateString(),
                'note' => $import['note'],
                'status' => GasoilTransaction::STATUS_APPROVED,
                'user_id' => $admin->id,
                'approved_by' => $admin->id,
                'approved_at' => now()->subDays($import['days_ago']),
            ]);
        }

        // Daily consumption since the first delivery, weekdays heavier.
        for ($daysAgo = 74; $daysAgo >= 1; $daysAgo--) {
            $date = now()->subDays($daysAgo);

            GasoilTransaction::create([
                'type' => GasoilTransaction::TYPE_CONSUMPTION,
                'quantity_liters' => fake()->randomFloat(2, 45, $date->isWeekend() ? 70 : 110),
                'entry_date' => $date->toDateString(),
                'note' => null,
                'status' => GasoilTransaction::STATUS_APPROVED,
                'user_id' => $admin->id,
                'approved_by' => $admin->id,
                'approved_at' => $date,
            ]);
        }

        // Today's entry is still waiting for approval.
        GasoilTransaction::create([
            'type' => GasoilTransaction::TYPE_CONSUMPTION,
            'quantity_liters' => fake()->randomFloat(2, 60, 100),
            'entry_date' => now()->toDateString(),
            'status' => GasoilTransaction::STATUS_PENDING,
            'user_id' => $admin->id,
        ]);
    }
}
