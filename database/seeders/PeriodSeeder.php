<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Period;

class PeriodSeeder extends Seeder
{
    public function run(): void
    {
        $periods = [
            [
                'name' => 'Période 1',
                'start_time' => '08:00',
                'end_time' => '17:00',
                'unit_price' => 0.87, // change later
            ],
            [
                'name' => 'Période 2',
                'start_time' => '17:00',
                'end_time' => '23:00',
                'unit_price' => 1.11,
            ],
            [
                'name' => 'Période 3',
                'start_time' => '23:00',
                'end_time' => '08:00',
                'unit_price' => 0.76,
            ],
        ];

        foreach ($periods as $p) {
            Period::create($p);
        }
    }
}
