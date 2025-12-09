<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;

class ConsumptionRecordFactory extends Factory
{
    public function definition(): array
    {
        $meter = Meter::inRandomOrder()->first();
        $period = Period::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();

        $previous = fake()->numberBetween(100, 800);
        $current = $previous + fake()->numberBetween(10, 150);
        $consumption = $current - $previous;

        return [
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'user_id' => $user->id,

            'reading_date' => fake()->dateTimeBetween('-40 days', 'now'),

            'previous_value' => $previous,
            'current_value' => $current,
            'calculated_value' => $consumption,

            'unit_price' => $period->unit_price,
            'total_amount' => $consumption * $period->unit_price,

            'status' => fake()->randomElement(['approved', 'pending', 'rejected']),
        ];
    }
}
