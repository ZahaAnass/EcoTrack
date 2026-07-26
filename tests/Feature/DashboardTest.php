<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_each_role_is_redirected_to_its_own_dashboard()
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $technician = User::factory()->create(['role' => User::ROLE_TECHNICIAN]);
        $viewer = User::factory()->create(['role' => User::ROLE_USER]);

        $this->actingAs($admin)->get(route('dashboard'))
            ->assertRedirect(route('admin.dashboard'));

        $this->actingAs($technician)->get(route('dashboard'))
            ->assertRedirect(route('technician.dashboard'));

        $this->actingAs($viewer)->get(route('dashboard'))
            ->assertRedirect(route('user.dashboard'));
    }

    public function test_role_dashboards_render_for_their_role()
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
        $technician = User::factory()->create(['role' => User::ROLE_TECHNICIAN]);
        $viewer = User::factory()->create(['role' => User::ROLE_USER]);

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
        $this->actingAs($technician)->get(route('technician.dashboard'))->assertOk();
        $this->actingAs($viewer)->get(route('user.dashboard'))->assertOk();
    }

    public function test_roles_cannot_access_each_others_areas()
    {
        $viewer = User::factory()->create(['role' => User::ROLE_USER]);

        $this->actingAs($viewer)->get(route('admin.dashboard'))->assertForbidden();
        $this->actingAs($viewer)->get(route('technician.dashboard'))->assertForbidden();
    }
}
