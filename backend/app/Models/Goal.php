<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Goal",
 *     type="object",
 *     required={"name"},
 *     @OA\Property(property="id", type="integer", example=1, description="Identifiant unique de l'objectif"),
 *     @OA\Property(property="name", type="string", example="Apprendre PHP", description="Nom de l'objectif"),
 *     @OA\Property(property="users", type="array", @OA\Items(ref="#/components/schemas/User"), description="Liste des utilisateurs associés à cet objectif")
 * )
 */
class Goal extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'goal_user');
    }
}