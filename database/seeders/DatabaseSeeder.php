<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MarketplaceSeeder::class,
        ]);

        // Demo: generate slots for next 14 days
        Artisan::call('schedule:generate-slots --days=14 --cancel-invalid=1');
    }
}
