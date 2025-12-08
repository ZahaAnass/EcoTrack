<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\TechnicianConsumptionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Technician Routes
Route::middleware(['auth', 'verified', 'role:technician'])->group(function () {

    // Technician dashboard
    Route::get('/dashboard', [TechnicianConsumptionController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('/consumptions', [TechnicianConsumptionController::class, 'dashboard'])
        ->name('consumptions.dashboard');

    Route::get('/consumptions/mine', [TechnicianConsumptionController::class, 'myEntries'])
        ->name('consumptions.mine');

    Route::get('/consumptions/create', [TechnicianConsumptionController::class, 'create'])
        ->name('consumptions.create');

    Route::post('/consumptions', [TechnicianConsumptionController::class, 'store'])
        ->name('consumptions.store');

    Route::get('/consumptions/{record}/edit', [TechnicianConsumptionController::class, 'edit'])
        ->name('consumptions.edit');

    Route::put('/consumptions/{record}', [TechnicianConsumptionController::class, 'update'])
        ->name('consumptions.update');

    Route::delete('/consumptions/{record}', [TechnicianConsumptionController::class, 'destroy'])
        ->name('consumptions.destroy');
});
//
//// Admin Routes
//Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
//
//    // Dashboard for admin
//    Route::get('/admin/dashboard', function () {
//        return Inertia::render('admin/dashboard');
//    })->name('admin.dashboard');
//
//    /*
//    |--------------------------------------------------------------------------
//    | Meter Management
//    |--------------------------------------------------------------------------
//    */
//    Route::get('/admin/meters', [\App\Http\Controllers\Admin\MeterController::class, 'index'])
//        ->name('admin.meters.index');
//
//    Route::get('/admin/meters/create', [\App\Http\Controllers\Admin\MeterController::class, 'create'])
//        ->name('admin.meters.create');
//
//    Route::post('/admin/meters', [\App\Http\Controllers\Admin\MeterController::class, 'store'])
//        ->name('admin.meters.store');
//
//    Route::get('/admin/meters/{meter}/edit', [\App\Http\Controllers\Admin\MeterController::class, 'edit'])
//        ->name('admin.meters.edit');
//
//    Route::put('/admin/meters/{meter}', [\App\Http\Controllers\Admin\MeterController::class, 'update'])
//        ->name('admin.meters.update');
//
//    Route::delete('/admin/meters/{meter}', [\App\Http\Controllers\Admin\MeterController::class, 'destroy'])
//        ->name('admin.meters.destroy');
//
//    /*
//    |--------------------------------------------------------------------------
//    | Period Management
//    |--------------------------------------------------------------------------
//    */
//    Route::get('/admin/periods', [\App\Http\Controllers\Admin\PeriodController::class, 'index'])
//        ->name('admin.periods.index');
//
//    Route::get('/admin/periods/create', [\App\Http\Controllers\Admin\PeriodController::class, 'create'])
//        ->name('admin.periods.create');
//
//    Route::post('/admin/periods', [\App\Http\Controllers\Admin\PeriodController::class, 'store'])
//        ->name('admin.periods.store');
//
//    Route::get('/admin/periods/{period}/edit', [\App\Http\Controllers\Admin\PeriodController::class, 'edit'])
//        ->name('admin.periods.edit');
//
//    Route::put('/admin/periods/{period}', [\App\Http\Controllers\Admin\PeriodController::class, 'update'])
//        ->name('admin.periods.update');
//
//    Route::delete('/admin/periods/{period}', [\App\Http\Controllers\Admin\PeriodController::class, 'destroy'])
//        ->name('admin.periods.destroy');
//
//    /*
//    |--------------------------------------------------------------------------
//    | Consumption Records (Admin Approval)
//    |--------------------------------------------------------------------------
//    */
//    Route::get('/admin/consumptions', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'index'])
//        ->name('admin.consumptions.index');
//
//    Route::get('/admin/consumptions/{record}', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'show'])
//        ->name('admin.consumptions.show');
//
//    // Add & Edit Consumption Record (Admin)
//    Route::get('/admin/consumptions/create', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'create'])
//        ->name('admin.consumptions.create');
//
//    Route::post('/admin/consumptions', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'store'])
//        ->name('admin.consumptions.store');
//
//    Route::get('/admin/consumptions/{record}/edit', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'edit'])
//        ->name('admin.consumptions.edit');
//
//    Route::put('/admin/consumptions/{record}', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'update'])
//        ->name('admin.consumptions.update');
//
//    Route::delete('/admin/consumptions/{record}', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'destroy'])
//        ->name('admin.consumptions.destroy');
//
//    // Approve / Reject
//    Route::post('/admin/consumptions/{record}/approve', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'approve'])
//        ->name('admin.consumptions.approve');
//
//    Route::post('/admin/consumptions/{record}/reject', [\App\Http\Controllers\Admin\ConsumptionAdminController::class, 'reject'])
//        ->name('admin.consumptions.reject');
//
//    /*
//    |--------------------------------------------------------------------------
//    | Technician List (Users)
//    |--------------------------------------------------------------------------
//    */
//    Route::get('/admin/technicians', [\App\Http\Controllers\Admin\UserController::class, 'technicians'])
//        ->name('admin.technicians.index');
//
//});
//
//// Normal User Routes
//Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
//
//    Route::get('/dashboard', function () {
//        return Inertia::render('User/Dashboard');
//    })->name('user.dashboard');
//
//    // Read-only list of consumptions
//    Route::get('/consumptions', [ConsumptionController::class, 'userIndex'])
//        ->name('user.consumptions.index');
//
//    // View single consumption entry
//    Route::get('/consumptions/{record}', [ConsumptionController::class, 'show'])
//        ->name('user.consumptions.show');
//});
//

require __DIR__.'/settings.php';
