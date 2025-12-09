<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin, technician, normal user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'role' => 'admin',
            'password' => bcrypt('password1234'),
        ]);

        User::factory()->create([
            'name' => 'Technician',
            'email' => 'tech@gmail.com',
            'role' => 'technician',
            'password' => bcrypt('password1234'),
        ]);

        User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@gmail.com',
            'role' => 'user',
            'password' => bcrypt('password1234'),
        ]);

        // extra fake users
        User::factory()->count(3)->create();

        // Seed base data
        $this->call([
            MeterSeeder::class,
            PeriodSeeder::class,
            ConsumptionSeeder::class,
        ]);
    }
}
