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
Route::middleware(['auth', 'verified', "role:technician"])->group(function () {
    Route::get('/dashboard', [ConsumptionController::class, 'dashboard'])->name('dashboard');

    // Add consumption
    Route::get('/consumptions/create', [ConsumptionController::class, 'create'])->name('consumptions.create');
    Route::post('/consumptions', [ConsumptionController::class, 'store'])->name('consumptions.store');

    // View own entries
    Route::get('/consumptions/mine', [ConsumptionController::class, 'myEntries'])->name('consumptions.mine');
});

require __DIR__.'/settings.php';
