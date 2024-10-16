<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Jetstream\HasTeams;
use Laravel\Sanctum\HasApiTokens;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     required={"name", "email", "password", "role"},
 *     @OA\Property(property="id", type="integer", example=1, description="Identifiant unique de l'utilisateur"),
 *     @OA\Property(property="name", type="string", example="John Doe", description="Nom de l'utilisateur"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com", description="Adresse e-mail de l'utilisateur"),
 *     @OA\Property(property="password", type="string", example="Password123", description="Mot de passe de l'utilisateur"),
 *     @OA\Property(property="role", type="string", enum={"coach", "client"}, example="client", description="Rôle de l'utilisateur (coach ou client)"),
 *     @OA\Property(property="price", type="number", format="float", nullable=true, example=99.99, description="Prix associé à l'utilisateur"),
 *     @OA\Property(property="numero", type="string", pattern="^0\d{9}$", example="0123456789", description="Numéro de téléphone de l'utilisateur"),
 *     @OA\Property(property="image", type="string", format="uri", nullable=true, example="https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/users/1/profile.jpg", description="URL de l'image de profil de l'utilisateur"),
 *     @OA\Property(property="city", type="string", nullable=true, example="Paris", description="Ville de résidence de l'utilisateur"),
 *     @OA\Property(property="schedule", type="object", ref="#/components/schemas/Schedule", nullable=true, description="Planning associé à l'utilisateur"),
 *     @OA\Property(property="goals", type="array", @OA\Items(ref="#/components/schemas/Goal"), description="Liste des objectifs associés à l'utilisateur"),
 *     @OA\Property(property="profile_photo_url", type="string", format="uri", description="URL de la photo de profil de l'utilisateur")
 * )
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasProfilePhoto, HasTeams, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'price',
        'numero',
        'image',
        'city'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $appends = [
        'profile_photo_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function schedule()
    {
        return $this->hasOne(Schedules::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function goals()
    {
        return $this->belongsToMany(Goal::class, 'goal_user');
    }
}
