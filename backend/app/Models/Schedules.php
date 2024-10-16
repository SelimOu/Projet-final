<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 *     schema="Schedule",
 *     type="object",
 *     required={"day_start", "day_end", "hour_start", "hour_end", "user_id"},
 *     @OA\Property(property="id", type="integer", example=1, description="Identifiant unique de l'horaire"),
 *     @OA\Property(property="day_start", type="string", example="Lundi", description="Jour de début de l'horaire"),
 *     @OA\Property(property="day_end", type="string", example="Vendredi", description="Jour de fin de l'horaire"),
 *     @OA\Property(property="hour_start", type="string", example="09:00", description="Heure de début de l'horaire au format H:i"),
 *     @OA\Property(property="hour_end", type="string", example="17:00", description="Heure de fin de l'horaire au format H:i"),
 *     @OA\Property(property="user_id", type="integer", example=1, description="Identifiant de l'utilisateur associé à cet horaire"),
 *     @OA\Property(property="user", ref="#/components/schemas/User", description="Utilisateur associé à cet horaire")
 * )
 */
class Schedules extends Model
{
    use HasFactory;

    protected $fillable = [
        'day_start',
        'day_end',
        'hour_start',
        'hour_end',
        'user_id',  
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
