<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Goal; // Assurez-vous d'importer le modèle Goal
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Closure;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        $images = [
            '1TLkGbAsSltQQyLtQjF4lGCvwlfdfFUxYfDfrFqp.jpg',
            'zzsO1IgFZ2149sdVljYwq9mAeuwhyXeeC2DFL21T.jpg',
            'DuDDA2BccEj8cRL6gq4i10NNA9zzugg6ovJiqPMQ.jpg',
            'jAoYPHbDaR9ZgAyJwxay2KpsYali9tWBljz8i6H9.jpg',
            'jz2yTDi88OsdwGlmCAk2xdYBXaKa46l1eQYqNZH8.jpg'
        ];

        $cities = [
            'Paris',
            'Marseille',
            'Lyon',
            'Toulouse',
            'Nice',
            'Nantes',
            'Strasbourg',
            'Montpellier',
            'Bordeaux',
            'Lille',
            'Rennes',
            'Reims',
            'Saint-Étienne',
            'Le Havre',
            'Grenoble',
            'Dijon',
            'Nîmes',
            'Aix-en-Provence',
            'Saint-Denis',
            'Angers',
            'Villeurbanne',
            'Clermont-Ferrand'
        ];

        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password' => Hash::make('password'), 
            'role' => $this->faker->randomElement(['coach', 'client']),
            'price' => $this->faker->randomFloat(2, 10, 100), 
            'numero' => '0' . $this->faker->numberBetween(100000000, 999999999),
            'image' => 'images/' . $images[array_rand($images)],
            'city' => $this->faker->randomElement($cities), 
            'remember_token' => Str::random(10),
        ];
    }

    public function afterMaking($user, Closure $callback = null)
    {
        $goals = Goal::all()->pluck('id')->toArray();

        if (!empty($goals)) {
            $attachedGoals = $this->faker->randomElements($goals, rand(1, count($goals)));
            $user->goals()->attach($attachedGoals);
        }
    }

    public function unverified()
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
