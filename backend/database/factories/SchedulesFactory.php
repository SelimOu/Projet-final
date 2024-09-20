<?php

namespace Database\Factories;

use App\Models\Schedules;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchedulesFactory extends Factory
{
    protected $model = Schedules::class;

    public function definition()
    {
        return [
            'day_start' => $this->faker->randomElement(['Lundi', 'Mardi']),
            'day_end' => $this->faker->randomElement(['Vendredi', 'Samedi','Dimanche']),
            'hour_start' => $this->faker->randomElement(['08:00', '10:00','14:00']),
            'hour_end' => $this->faker->randomElement(['18:00', '20:00','22:00']),
            'user_id' => User::factory(),
        ];
    }
}
