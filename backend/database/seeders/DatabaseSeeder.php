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
        $goals = [
            ['name' => 'musculation'],
            ['name' => 'fitness'],
            ['name' => 'nutrition'],
            ['name' => 'running'],
        ];

        Goal::insert($goals); 

        $users = User::factory()->count(50)->create();

        foreach ($users as $user) {
            $goalIds = Goal::all()->pluck('id')->toArray();
            $user->goals()->attach(array_rand(array_flip($goalIds), rand(1, count($goalIds))));

            Schedules::factory()->create([
                'user_id' => $user->id,
            ]);
        }
    }
}
