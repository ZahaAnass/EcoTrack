<?php

namespace Database\Factories;

use App\Models\Meter;
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
        $type = fake()->randomElement(Meter::TYPES);

        return [
            'name' => fake()->words(2, true),
            'serial_number' => strtoupper(fake()->unique()->bothify('MTR-####??')),
            'type' => $type,
            'location' => fake()->randomElement([
                'kitchen', 'living room', 'garage', 'basement',
                'office', 'attic', 'dining room', 'yard',
            ]),
            'status' => 'active',
        ];
    }

    public function electricity(): static
    {
        return $this->state(['type' => Meter::TYPE_ELECTRICITY]);
    }

    public function water(): static
    {
        return $this->state(['type' => Meter::TYPE_WATER]);
    }
}
