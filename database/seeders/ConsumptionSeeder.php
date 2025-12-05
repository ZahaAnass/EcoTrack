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
        $userId = 2; // Technician (or any)

        $meters = Meter::all();
        $periods = Period::all();

        $statuses = ['approved', 'pending', 'rejected'];

        foreach ($meters as $meter) {
            foreach ($periods as $period) {

                // previous/current values
                $previous = rand(100, 1000);
                $current = $previous + rand(5, 120);
                $consumption = $current - $previous;

                // pick random status
                $status = $statuses[array_rand($statuses)];

                // random date in last 30 days
                $date = now()->subDays(rand(1, 30));

                ConsumptionRecord::create([
                    'meter_id'          => $meter->id,
                    'period_id'         => $period->id,
                    'user_id'           => $userId,

                    'reading_date'      => $date,

                    'previous_value'    => $previous,
                    'current_value'     => $current,
                    'calculated_value'  => $consumption,

                    'unit_price'        => $period->unit_price,
                    'total_amount'      => $consumption * $period->unit_price,

                    'status'            => $status,
                ]);
            }
        }
    }
}
