<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ConsumptionController;

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
    Route::get('/dashboard', [ConsumptionController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('/consumptions/mine', [ConsumptionController::class, 'myEntries'])
        ->name('consumptions.mine');

    Route::get('/consumptions/create', [ConsumptionController::class, 'create'])
        ->name('consumptions.create');

    Route::post('/consumptions', [ConsumptionController::class, 'store'])
        ->name('consumptions.store');

    Route::get('/consumptions/{record}/edit', [ConsumptionController::class, 'edit'])
        ->name('consumptions.edit');

    Route::put('/consumptions/{record}', [ConsumptionController::class, 'update'])
        ->name('consumptions.update');

    Route::delete('/consumptions/{record}', [ConsumptionController::class, 'destroy'])
        ->name('consumptions.destroy');
});

require __DIR__.'/settings.php';
