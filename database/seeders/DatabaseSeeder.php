<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Default test users
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'role' => 'admin',
                'password' => bcrypt('password1234'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'tech@gmail.com'],
            [
                'name' => 'Technician',
                'role' => 'technician',
                'password' => bcrypt('password1234'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@gmail.com'],
            [
                'name' => 'Regular User',
                'role' => 'user',
                'password' => bcrypt('password1234'),
                'email_verified_at' => now(),
            ]
        );

        User::factory()->count(3)->create([
            'password' => bcrypt('password1234'),
        ]);

        $this->call([
            MeterSeeder::class,
            PeriodSeeder::class,
            ConsumptionSeeder::class,
        ]);
    }
}
