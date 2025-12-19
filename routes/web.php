<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\TechnicianConsumptionController;
use App\Http\Controllers\UserConsumptionController;
use App\Http\Controllers\Admin\MeterController;
use App\Http\Controllers\Admin\AdminConsumptionController;
use App\Http\Controllers\Admin\PeriodController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        $user = auth()->user();

        if ($user->role == 'technician') {;
            return redirect()->route('technician.dashboard');
        }

        if ($user->role == 'user') {
            return redirect()->route('user.dashboard');
        }

        if ($user->role == 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('dashboard');

    })->name('dashboard');
});


// Technician Routes
Route::middleware(['auth', 'verified', 'role:technician'])
    ->prefix("technician")->name("technician.")->group(function () {

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

// Admin Routes
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Admin Dashboard
        |--------------------------------------------------------------------------
        */
        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | Meter Management
        |--------------------------------------------------------------------------
        */
        Route::resource('meters', MeterController::class);

        /*
        |--------------------------------------------------------------------------
        | Period Management
        |--------------------------------------------------------------------------
        */
        Route::resource('periods', PeriodController::class);

        /*
        |--------------------------------------------------------------------------
        | Consumption Records (Admin Approval)
        |--------------------------------------------------------------------------
        */
        Route::resource('consumptions', AdminConsumptionController::class);

        // Approve / Reject
        Route::post(
            'consumptions/{consumption}/approve',
            [AdminConsumptionController::class, 'approve']
        )->name('consumptions.approve');

        Route::post(
            'consumptions/{consumption}/reject',
            [AdminConsumptionController::class, 'reject']
        )->name('consumptions.reject');

        /*
        |--------------------------------------------------------------------------
        | Technician List
        |--------------------------------------------------------------------------
        */
        Route::get(
            'technicians',
            [UserController::class, 'technicians']
        )->name('technicians.index');
    });

// Normal User Routes
Route::middleware(['auth', 'verified', 'role:user'])->prefix("user")->name("user.")->group(function () {

    Route::get('/dashboard', [UserConsumptionController::class, 'dashboard'])
        ->name('dashboard');

    // Read-only list of consumptions
    Route::get('/consumptions', [UserConsumptionController::class, 'index'])
        ->name('user.consumptions.index');

    // View single consumption entry
    Route::get('/consumptions/{record}', [UserConsumptionController::class, 'show'])
        ->name('user.consumptions.show');

    // Reports
    Route::get('/reports', [UserConsumptionController::class, 'reports'])
        ->name('user.reports.index');
});


require __DIR__.'/settings.php';
