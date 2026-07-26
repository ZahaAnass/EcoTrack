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
                'type' => Period::TYPE_ELECTRICITY,
                'start_time' => '08:00',
                'end_time' => '17:00',
                'unit_price' => 0.87, // change later
            ],
            [
                'name' => 'Période 2',
                'type' => Period::TYPE_ELECTRICITY,
                'start_time' => '17:00',
                'end_time' => '23:00',
                'unit_price' => 1.11,
            ],
            [
                'name' => 'Période 3',
                'type' => Period::TYPE_ELECTRICITY,
                'start_time' => '23:00',
                'end_time' => '08:00',
                'unit_price' => 0.76,
            ],
            [
                // Water is billed at one flat daily tariff.
                'name' => 'Eau — tarif journalier',
                'type' => Period::TYPE_WATER,
                'start_time' => '00:00',
                'end_time' => '23:59',
                'unit_price' => 7.50,
            ],
        ];

        foreach ($periods as $p) {
            Period::firstOrCreate(['name' => $p['name']], $p);
        }
    }
}
