<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gasoil_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // import | consumption
            $table->decimal('quantity_liters', 12, 2);
            $table->date('entry_date');
            $table->string('note')->nullable();
            $table->string('status')->default('approved'); // approved | pending | rejected
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('entry_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gasoil_transactions');
    }
};
