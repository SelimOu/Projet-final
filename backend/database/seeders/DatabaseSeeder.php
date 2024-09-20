<?php

use App\Models\User;
use App\Models\Schedules;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(10)->create();

        foreach ($users as $user) {
            Schedules::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}



