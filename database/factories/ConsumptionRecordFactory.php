<?php

namespace Database\Factories;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ConsumptionRecord>
 */
class ConsumptionRecordFactory extends Factory
{
    public function definition(): array
    {
        $previous = fake()->randomFloat(2, 100, 900);
        $current = $previous + fake()->randomFloat(2, 10, 150);
        $unitPrice = fake()->randomFloat(2, 0.5, 3);

        return [
            'meter_id' => Meter::factory(),
            'period_id' => Period::factory(),
            'user_id' => User::factory()->state(['role' => User::ROLE_TECHNICIAN]),
            'reading_date' => fake()->dateTimeBetween('-65 days', 'now'),
            'previous_value' => $previous,
            'current_value' => $current,
            'calculated_value' => round($current - $previous, 2),
            'unit_price' => $unitPrice,
            'total_amount' => round(($current - $previous) * $unitPrice, 2),
            'status' => fake()->randomElement(ConsumptionRecord::STATUSES),
        ];
    }

    public function approved(): static
    {
        return $this->state(['status' => ConsumptionRecord::STATUS_APPROVED]);
    }

    public function pending(): static
    {
        return $this->state(['status' => ConsumptionRecord::STATUS_PENDING]);
    }
}
