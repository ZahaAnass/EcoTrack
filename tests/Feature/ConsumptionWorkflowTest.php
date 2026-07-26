<?php

namespace Tests\Feature;

use App\Models\ConsumptionRecord;
use App\Models\Meter;
use App\Models\Period;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsumptionWorkflowTest extends TestCase
{
    use RefreshDatabase;

    private function technician(): User
    {
        return User::factory()->create(['role' => User::ROLE_TECHNICIAN]);
    }

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_technician_can_record_a_reading_and_it_starts_pending()
    {
        $technician = $this->technician();
        $meter = Meter::factory()->electricity()->create();
        $period = Period::factory()->create(['unit_price' => 2.5]);

        $response = $this->actingAs($technician)->post('/technician/consumptions', [
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'current_value' => 120,
        ]);

        $response->assertRedirect(route('technician.consumptions.index', ['type' => 'electricity']));

        $record = ConsumptionRecord::sole();
        $this->assertSame(ConsumptionRecord::STATUS_PENDING, $record->status);
        $this->assertSame(120.0, $record->current_value);
        $this->assertSame(0.0, $record->previous_value);
        $this->assertSame(120.0, $record->calculated_value);
        $this->assertSame(300.0, $record->total_amount); // 120 * 2.5, priced by the period
    }

    public function test_reading_must_be_greater_than_previous_approved_value()
    {
        $technician = $this->technician();
        $meter = Meter::factory()->electricity()->create();
        $period = Period::factory()->create();

        ConsumptionRecord::factory()->approved()->create([
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'user_id' => $technician->id,
            'current_value' => 500,
        ]);

        $response = $this->actingAs($technician)->post('/technician/consumptions', [
            'meter_id' => $meter->id,
            'period_id' => $period->id,
            'current_value' => 400,
        ]);

        $response->assertSessionHasErrors('current_value');
        $this->assertSame(1, ConsumptionRecord::count());
    }

    public function test_admin_can_approve_a_pending_reading()
    {
        $admin = $this->admin();
        $record = ConsumptionRecord::factory()->pending()->create();

        $this->actingAs($admin)
            ->post("/admin/consumptions/{$record->id}/approve")
            ->assertRedirect();

        $record->refresh();
        $this->assertSame(ConsumptionRecord::STATUS_APPROVED, $record->status);
        $this->assertSame($admin->id, $record->approved_by);
        $this->assertNotNull($record->approved_at);
    }

    public function test_admin_can_reject_with_a_reason()
    {
        $admin = $this->admin();
        $record = ConsumptionRecord::factory()->pending()->create();

        $this->actingAs($admin)
            ->post("/admin/consumptions/{$record->id}/reject", ['reason' => 'Wrong dial'])
            ->assertRedirect();

        $record->refresh();
        $this->assertSame(ConsumptionRecord::STATUS_REJECTED, $record->status);
        $this->assertSame('Wrong dial', $record->rejection_reason);
    }

    public function test_technician_cannot_edit_an_approved_reading()
    {
        $technician = $this->technician();
        $record = ConsumptionRecord::factory()->approved()->create([
            'user_id' => $technician->id,
        ]);

        $this->actingAs($technician)
            ->get("/technician/consumptions/{$record->id}/edit")
            ->assertForbidden();
    }

    public function test_technician_cannot_touch_someone_elses_reading()
    {
        $technician = $this->technician();
        $other = $this->technician();
        $record = ConsumptionRecord::factory()->pending()->create(['user_id' => $other->id]);

        $this->actingAs($technician)
            ->delete("/technician/consumptions/{$record->id}")
            ->assertForbidden();
    }

    public function test_viewers_only_see_approved_readings()
    {
        $viewer = User::factory()->create(['role' => User::ROLE_USER]);
        $pending = ConsumptionRecord::factory()->pending()->create();
        $approved = ConsumptionRecord::factory()->approved()->create();

        $this->actingAs($viewer)->get("/user/consumptions/{$approved->id}")->assertOk();
        $this->actingAs($viewer)->get("/user/consumptions/{$pending->id}")->assertNotFound();
    }
}
