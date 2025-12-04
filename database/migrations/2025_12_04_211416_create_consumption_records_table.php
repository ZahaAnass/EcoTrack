<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('consumption_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meter_id')->constrained('meters')->onDelete('cascade');
            $table->foreignId('period_id')->constrained('periods')->onDelete('cascade');
            $table->foreignId("user_id")->constrained('users')->onDelete('cascade');

            $table->dateTime('reading_date');

            $table->decimal('current_value', 12, 2);
            $table->decimal('previous_value', 12, 2);
            $table->decimal('calculated_value', 12, 2);

            $table->decimal("unit_price", 10, 2); // snapshot of the unit price at the time of recording
            $table->decimal("total_amount", 12, 2); // calculated_value * unit_price

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumption_records');
    }
};
