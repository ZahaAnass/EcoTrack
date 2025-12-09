<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Meter>
 */
class MeterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                "Chambre froid",
                "RDC",
                "Mezzanine",
                "Clim teras",
                "Cuisine RDC",
                "Clim mezzanine",
                "Choufrie",
                "C.G",
                "General 1",
                "General 2",
                "General 3",
            ]),
            'location' => fake()->randomElement([
                "kitchen", "living room", "garage", "basement",
                "office", "attic", "dining room", "yard"
            ]),
        ];
    }
}
