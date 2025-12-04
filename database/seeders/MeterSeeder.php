<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Meter;

class MeterSeeder extends Seeder
{
    public function run(): void
    {
        $meters = [
            "chambre froid",
            "RDC",
            "mezzanine",
            "clim teras",
            "cuisine RDC",
            "clim mezzanine",
            "choufrie",
            "C.G",
            "General 1",
            "General 2",
            "General 3",
        ];

        foreach ($meters as $meter) {
            Meter::create([
                'name' => $meter,
                'location' => 'Unknown',
            ]);
        }
    }
}
