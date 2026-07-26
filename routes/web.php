<?php

use App\Http\Controllers\Admin\AdminConsumptionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MeterController;
use App\Http\Controllers\Admin\PeriodController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\TechnicianConsumptionController;
use App\Http\Controllers\UserConsumptionController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| Role dispatcher
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->get('dashboard', function () {
    return match (auth()->user()->role) {
        User::ROLE_ADMIN => redirect()->route('admin.dashboard'),
        User::ROLE_TECHNICIAN => redirect()->route('technician.dashboard'),
        default => redirect()->route('user.dashboard'),
    };
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Notifications (admin + technician bell)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllRead'])
        ->name('notifications.read-all');
    Route::post('notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markRead'])
        ->name('notifications.read');
});

/*
|--------------------------------------------------------------------------
| Technician
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:technician'])
    ->prefix('technician')
    ->name('technician.')
    ->group(function () {
        Route::get('dashboard', [TechnicianConsumptionController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('consumptions', [TechnicianConsumptionController::class, 'myEntries'])
            ->name('consumptions.index');

        Route::get('consumptions/create', [TechnicianConsumptionController::class, 'create'])
            ->name('consumptions.create');

        Route::post('consumptions', [TechnicianConsumptionController::class, 'store'])
            ->name('consumptions.store');

        Route::get('consumptions/{record}/edit', [TechnicianConsumptionController::class, 'edit'])
            ->name('consumptions.edit');

        Route::put('consumptions/{record}', [TechnicianConsumptionController::class, 'update'])
            ->name('consumptions.update');

        Route::delete('consumptions/{record}', [TechnicianConsumptionController::class, 'destroy'])
            ->name('consumptions.destroy');
    });

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('meters', MeterController::class)->except(['show']);
        Route::resource('periods', PeriodController::class)->except(['show']);

        Route::get('consumptions', [AdminConsumptionController::class, 'index'])
            ->name('consumptions.index');
        Route::get('consumptions/export', [AdminConsumptionController::class, 'export'])
            ->name('consumptions.export');
        Route::get('consumptions/{consumption}', [AdminConsumptionController::class, 'show'])
            ->name('consumptions.show');
        Route::post('consumptions/{consumption}/approve', [AdminConsumptionController::class, 'approve'])
            ->name('consumptions.approve');
        Route::post('consumptions/{consumption}/reject', [AdminConsumptionController::class, 'reject'])
            ->name('consumptions.reject');
        Route::delete('consumptions/{consumption}', [AdminConsumptionController::class, 'destroy'])
            ->name('consumptions.destroy');

        Route::resource('users', UserController::class)->except(['show']);

        Route::get('reports', [ReportController::class, 'index'])
            ->name('reports.index');
        Route::get('reports/export', [ReportController::class, 'export'])
            ->name('reports.export');

        // Quick what-if calculator — nothing it computes is ever saved.
        Route::get('simulator', function () {
            return Inertia::render('admin/simulator', [
                'periods' => \App\Models\Period::orderBy('start_time')->get(),
            ]);
        })->name('simulator');

        // Gasoil stock tracking (admin only).
        Route::get('gasoil', [\App\Http\Controllers\Admin\GasoilController::class, 'index'])
            ->name('gasoil.index');
        Route::get('gasoil/export', [\App\Http\Controllers\Admin\GasoilController::class, 'export'])
            ->name('gasoil.export');
        Route::post('gasoil/import', [\App\Http\Controllers\Admin\GasoilController::class, 'storeImport'])
            ->name('gasoil.import');
        Route::post('gasoil/consumption', [\App\Http\Controllers\Admin\GasoilController::class, 'storeConsumption'])
            ->name('gasoil.consumption');
        Route::post('gasoil/settings', [\App\Http\Controllers\Admin\GasoilController::class, 'saveSettings'])
            ->name('gasoil.settings');
        Route::post('gasoil/{transaction}/approve', [\App\Http\Controllers\Admin\GasoilController::class, 'approve'])
            ->name('gasoil.approve');
        Route::post('gasoil/{transaction}/reject', [\App\Http\Controllers\Admin\GasoilController::class, 'reject'])
            ->name('gasoil.reject');
        Route::delete('gasoil/{transaction}', [\App\Http\Controllers\Admin\GasoilController::class, 'destroy'])
            ->name('gasoil.destroy');
    });

/*
|--------------------------------------------------------------------------
| Viewer (regular user)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:user'])
    ->prefix('user')
    ->name('user.')
    ->group(function () {
        Route::get('dashboard', [UserConsumptionController::class, 'dashboard'])
            ->name('dashboard');

        Route::get('consumptions', [UserConsumptionController::class, 'index'])
            ->name('consumptions.index');

        Route::get('consumptions/{record}', [UserConsumptionController::class, 'show'])
            ->name('consumptions.show');

        Route::get('reports', [UserConsumptionController::class, 'reports'])
            ->name('reports.index');
    });

require __DIR__.'/settings.php';
