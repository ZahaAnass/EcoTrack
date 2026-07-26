<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Safe to re-run: existing rows are reused, never duplicated.
     */
    public function run(): void
    {
        $accounts = [
            ['name' => 'Admin User', 'email' => 'admin@gmail.com', 'role' => User::ROLE_ADMIN],
            ['name' => 'Sami Technician', 'email' => 'tech@gmail.com', 'role' => User::ROLE_TECHNICIAN],
            ['name' => 'Nadia Technician', 'email' => 'tech2@gmail.com', 'role' => User::ROLE_TECHNICIAN],
            ['name' => 'Regular User', 'email' => 'user@gmail.com', 'role' => User::ROLE_USER],
        ];

        foreach ($accounts as $account) {
            User::firstOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'role' => $account['role'],
                    'password' => 'password1234',
                    'email_verified_at' => now(),
                ],
            );
        }

        // A few extra viewer accounts, only on the first run.
        if (User::count() <= count($accounts)) {
            User::factory()->count(3)->create();
        }

        $this->call([
            MeterSeeder::class,
            PeriodSeeder::class,
            ConsumptionSeeder::class,
            GasoilSeeder::class,
        ]);
    }
}
