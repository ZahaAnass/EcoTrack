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
            'meter_id' => Meter::inRandomOrder()->first()->id,
            'period_id' => Period::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,

            'reading_date' => fn () => fake()->dateTimeBetween('-65 days', 'now'),

            'previous_value' => $previous = fake()->numberBetween(100, 900),
            'current_value' => $current = fake()->numberBetween($previous, $previous + 200),
            'calculated_value' => $current - $previous,

            'unit_price' => fake()->randomFloat(2, 0.5, 3),
            'total_amount' => fn () => ($current - $previous) * fake()->randomFloat(2, 0.5, 3),

            'status' => fake()->randomElement(['approved', 'pending', 'rejected']),
        ];

    }
}
