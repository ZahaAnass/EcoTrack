<?php

namespace Database\Seeders;

use App\Models\Meter;
use Illuminate\Database\Seeder;

class MeterSeeder extends Seeder
{
    public function run(): void
    {
        $electricity = [
            ['name' => 'Compteur Général', 'location' => 'Main board'],
            ['name' => 'Chambre froide', 'location' => 'Cold room'],
            ['name' => 'Cuisine RDC', 'location' => 'Kitchen — ground floor'],
            ['name' => 'RDC', 'location' => 'Ground floor'],
            ['name' => 'Mezzanine', 'location' => 'Mezzanine'],
            ['name' => 'Clim terrasse', 'location' => 'Terrace AC'],
            ['name' => 'Clim mezzanine', 'location' => 'Mezzanine AC'],
            ['name' => 'Chaufferie', 'location' => 'Boiler room'],
        ];

        $water = [
            ['name' => 'Eau générale', 'location' => 'Main supply'],
            ['name' => 'Eau cuisine', 'location' => 'Kitchen'],
            ['name' => 'Eau sanitaires', 'location' => 'Restrooms'],
        ];

        foreach ($electricity as $i => $meter) {
            Meter::firstOrCreate(
                ['serial_number' => sprintf('ELC-%04d', $i + 1)],
                $meter + ['type' => Meter::TYPE_ELECTRICITY, 'status' => 'active'],
            );
        }

        foreach ($water as $i => $meter) {
            Meter::firstOrCreate(
                ['serial_number' => sprintf('WTR-%04d', $i + 1)],
                $meter + ['type' => Meter::TYPE_WATER, 'status' => 'active'],
            );
        }
    }
}
