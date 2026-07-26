<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meters', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->unique()->after('name');
            $table->string('type')->default('electricity')->after('serial_number'); // electricity | water
            $table->string('status')->default('active')->after('location'); // active | inactive
        });

        Schema::table('consumption_records', function (Blueprint $table) {
            $table->foreignId('approved_by')->nullable()->after('status')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->string('rejection_reason')->nullable()->after('approved_at');

            $table->index(['meter_id', 'status']);
            $table->index('status');
            $table->index('reading_date');
        });
    }

    public function down(): void
    {
        Schema::table('consumption_records', function (Blueprint $table) {
            $table->dropIndex(['meter_id', 'status']);
            $table->dropIndex(['status']);
            $table->dropIndex(['reading_date']);
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn(['approved_at', 'rejection_reason']);
        });

        Schema::table('meters', function (Blueprint $table) {
            $table->dropColumn(['serial_number', 'type', 'status']);
        });
    }
};
