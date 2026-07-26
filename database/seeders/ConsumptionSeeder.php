<?php

namespace Database\Seeders;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConsumptionSeeder extends Seeder
{
    /**
     * Generates a believable history: every meter gets a monotonically
     * increasing index reading every 2-3 days over the last ~4 months.
     * Older readings are approved, the most recent ones are still pending,
     * and a few are rejected so every workflow state shows up in the UI.
     */
    public function run(): void
    {
        // The generated history is sequential per meter — running it twice
        // would corrupt the running index values, so only seed an empty table.
        if (ConsumptionRecord::exists()) {
            $this->command?->warn('Consumption records already exist — skipping. Use migrate:fresh --seed for a clean slate.');

            return;
        }

        $admin = User::role(User::ROLE_ADMIN)->first();
        $technicians = User::role(User::ROLE_TECHNICIAN)->pluck('id');
        $periods = Period::all();

        foreach (Meter::all() as $meter) {
            $isWater = $meter->type === Meter::TYPE_WATER;

            // Starting index on the physical meter.
            $value = $isWater ? fake()->numberBetween(200, 900) : fake()->numberBetween(5000, 20000);
            $date = now()->subDays(120);

            while ($date->lessThan(now())) {
                $date = $date->copy()->addDays(fake()->numberBetween(2, 3))
                    ->setTime(fake()->numberBetween(7, 22), fake()->numberBetween(0, 59));

                if ($date->greaterThanOrEqualTo(now())) {
                    break;
                }

                $previous = $value;
                $value += $isWater
                    ? fake()->randomFloat(2, 2, 14)
                    : fake()->randomFloat(2, 15, 90);

                $period = $isWater
                    ? $periods->firstWhere('type', Period::TYPE_WATER) ?? $periods->first()
                    : $this->periodForHour(
                        $periods->where('type', Period::TYPE_ELECTRICITY),
                        $date->hour,
                    );

                // Recent entries are still in the approval queue; sprinkle in
                // a few rejected ones for realism.
                $isRecent = $date->greaterThan(now()->subDays(7));
                $status = $isRecent
                    ? ConsumptionRecord::STATUS_PENDING
                    : (fake()->numberBetween(1, 25) === 1
                        ? ConsumptionRecord::STATUS_REJECTED
                        : ConsumptionRecord::STATUS_APPROVED);

                ConsumptionRecord::create([
                    'meter_id' => $meter->id,
                    'period_id' => $period->id,
                    'user_id' => $technicians->random(),
                    'reading_date' => $date,
                    'current_value' => round($value, 2),
                    'previous_value' => round($previous, 2),
                    'unit_price' => $period->unit_price,
                    'status' => $status,
                    'approved_by' => $status === ConsumptionRecord::STATUS_PENDING ? null : $admin?->id,
                    'approved_at' => $status === ConsumptionRecord::STATUS_PENDING ? null : $date->copy()->addHours(6),
                    'rejection_reason' => $status === ConsumptionRecord::STATUS_REJECTED
                        ? 'Reading looks inconsistent with the meter photo.'
                        : null,
                ]);
            }
        }
    }

    private function periodForHour($periods, int $hour): Period
    {
        foreach ($periods as $period) {
            $start = (int) substr($period->start_time, 0, 2);
            $end = (int) substr($period->end_time, 0, 2);

            $matches = $start <= $end
                ? ($hour >= $start && $hour < $end)
                : ($hour >= $start || $hour < $end); // overnight window

            if ($matches) {
                return $period;
            }
        }

        return $periods->first();
    }
}
