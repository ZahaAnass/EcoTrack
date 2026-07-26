<?php

namespace Tests\Feature;

use App\Models\GasoilTransaction;
use App\Models\User;
use App\Notifications\GasoilLowStock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class GasoilTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_gasoil_page_is_admin_only()
    {
        $viewer = User::factory()->create(['role' => User::ROLE_USER]);
        $technician = User::factory()->create(['role' => User::ROLE_TECHNICIAN]);

        $this->actingAs($viewer)->get('/admin/gasoil')->assertForbidden();
        $this->actingAs($technician)->get('/admin/gasoil')->assertForbidden();
        $this->actingAs($this->admin())->get('/admin/gasoil')->assertOk();
    }

    public function test_import_in_tons_is_converted_to_liters_and_added_to_stock()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/gasoil/import', [
            'quantity' => 3,
            'unit' => 'tons',
            'entry_date' => now()->toDateString(),
        ])->assertRedirect();

        $this->assertSame(3 * 1176.0, GasoilTransaction::stockLiters());
    }

    public function test_consumption_only_hits_stock_once_approved()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/gasoil/import', [
            'quantity' => 1000,
            'unit' => 'liters',
            'entry_date' => now()->toDateString(),
        ]);

        $this->actingAs($admin)->post('/admin/gasoil/consumption', [
            'quantity' => 200,
            'entry_date' => now()->toDateString(),
        ]);

        // Pending consumption does not touch the tank yet.
        $this->assertSame(1000.0, GasoilTransaction::stockLiters());

        $consumption = GasoilTransaction::where('type', 'consumption')->sole();
        $this->actingAs($admin)->post("/admin/gasoil/{$consumption->id}/approve");

        $this->assertSame(800.0, GasoilTransaction::stockLiters());
    }

    public function test_consumption_cannot_exceed_stock()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/gasoil/import', [
            'quantity' => 100,
            'unit' => 'liters',
            'entry_date' => now()->toDateString(),
        ]);

        $this->actingAs($admin)->post('/admin/gasoil/consumption', [
            'quantity' => 500,
            'entry_date' => now()->toDateString(),
        ])->assertSessionHasErrors('quantity');
    }

    public function test_admins_are_alerted_when_stock_crosses_below_500_liters()
    {
        Notification::fake();

        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/gasoil/import', [
            'quantity' => 600,
            'unit' => 'liters',
            'entry_date' => now()->toDateString(),
        ]);

        $this->actingAs($admin)->post('/admin/gasoil/consumption', [
            'quantity' => 150,
            'entry_date' => now()->toDateString(),
        ]);

        $consumption = GasoilTransaction::where('type', 'consumption')->sole();
        $this->actingAs($admin)->post("/admin/gasoil/{$consumption->id}/approve");

        // 600 - 150 = 450 ≤ 500 → crossing alert to admins.
        Notification::assertSentTo($admin, GasoilLowStock::class);
        $this->assertSame(450.0, GasoilTransaction::stockLiters());
    }

    public function test_alert_level_can_be_set_as_a_percentage_of_imports()
    {
        Notification::fake();

        $admin = $this->admin();

        // Alert at 50% of all-time imports.
        $this->actingAs($admin)->post('/admin/gasoil/settings', [
            'mode' => 'percent',
            'value' => 50,
        ])->assertRedirect()->assertSessionHasNoErrors();

        $this->actingAs($admin)->post('/admin/gasoil/import', [
            'quantity' => 1000,
            'unit' => 'liters',
            'entry_date' => now()->toDateString(),
        ]);

        // Burn 600 L → 400 left, threshold = 500 (50% of 1000) → alert fires.
        $this->actingAs($admin)->post('/admin/gasoil/consumption', [
            'quantity' => 600,
            'entry_date' => now()->toDateString(),
        ]);

        $consumption = GasoilTransaction::where('type', 'consumption')->sole();
        $this->actingAs($admin)->post("/admin/gasoil/{$consumption->id}/approve");

        Notification::assertSentTo($admin, GasoilLowStock::class);
    }

    public function test_percentage_above_100_is_rejected()
    {
        $this->actingAs($this->admin())->post('/admin/gasoil/settings', [
            'mode' => 'percent',
            'value' => 150,
        ])->assertSessionHasErrors('value');
    }
}
