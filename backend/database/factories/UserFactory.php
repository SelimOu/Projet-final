<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Goal; 
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
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728383454/users/70/nzaooqsjv6nnn1qf8hsk.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728382592/users/65/zu1wpcwsbh1pcodinohu.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728383520/users/71/vcoub8grvtndkqagoo9x.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728383816/users/72/pvsoarkborsuk1vzg676.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728382592/users/65/zu1wpcwsbh1pcodinohu.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728383380/users/69/okhob6ezi4p0fjthohea.jpg',
            'https://res.cloudinary.com/dhispyzf1/image/upload/v1728383052/users/68/jrsylapkh2yflpm8szwz.jpg'
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
            'image' =>  $images[array_rand($images)],
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
