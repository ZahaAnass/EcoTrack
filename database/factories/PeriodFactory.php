<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Period>
 */
class PeriodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => "Période " . fake()->numberBetween(1, 3),
            'start_time' => fake()->time('H:i'),
            'end_time' => fake()->time('H:i'),
            'unit_price' => fake()->randomFloat(2, 0.60, 1.50),
        ];
    }
}
