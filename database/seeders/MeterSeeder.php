<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Meter;

class MeterSeeder extends Seeder
{
    public function run(): void
    {
        $meters = [
            "Chambre froid",
            "RDC",
            "Mezzanine",
            "Clim teras",
            "Cuisine RDC",
            "Clim mezzanine",
            "Chouferiez",
            "Compter Général",
            "General 1",
            "General 2",
            "General 3",
        ];

        /** @var array<int,string> $locations */
        $locations = [
            "kitchen",
            "living room",
            "bedroom",
            "bathroom",
            "garage",
            "garden",
            "basement",
            "attic",
            "dining room",
            "office",
            "hallway",
        ];

        $locationCount = count($locations);

        foreach ($meters as $index => $meter) {
            $assignedLocation = $locations[$index % $locationCount];

            Meter::create([
                'name' => $meter,
                'location' => $assignedLocation,
            ]);
        }
    }
}
