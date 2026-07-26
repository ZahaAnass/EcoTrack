<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Reading validation
    |--------------------------------------------------------------------------
    |
    | A new meter reading must be greater than the previous approved reading,
    | and may not jump by more than this many units in a single entry. This
    | guards against typos (e.g. an extra digit) when technicians enter data.
    |
    */

    'max_reading_increment' => env('ECOTRACK_MAX_READING_INCREMENT', 1000),

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */

    'currency' => env('ECOTRACK_CURRENCY', 'MAD'),

    /*
    |--------------------------------------------------------------------------
    | Gasoil
    |--------------------------------------------------------------------------
    |
    | Admins are alerted when the tank crosses below the alert level.
    | Imports may be entered in tons; diesel at ~0.85 kg/L gives 1176 L/t.
    |
    */

    'gasoil_alert_liters' => env('ECOTRACK_GASOIL_ALERT_LITERS', 500),
    'gasoil_liters_per_ton' => env('ECOTRACK_GASOIL_LITERS_PER_TON', 1176),
];
