<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Goal; 
use App\Models\Schedules;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory()->count(10)->create();

        $goals = [
            ['name' => 'musculation'],
            ['name' => 'fitness'],
            ['name' => 'nutrition'],
            ['name' => 'running'],
        ];

        Goal::insert($goals); 

        foreach ($users as $user) {
            Schedules::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
