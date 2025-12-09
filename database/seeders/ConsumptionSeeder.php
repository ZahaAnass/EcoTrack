<?php

namespace Database\Seeders;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use Illuminate\Database\Seeder;

class ConsumptionSeeder extends Seeder
{
    public function run(): void
    {
        ConsumptionRecord::factory()->count(150)->create();
    }
}
