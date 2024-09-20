<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Schedules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('schedule')->get(); 
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:coach,client',
            'price' => 'nullable|numeric',
            'goal' => 'nullable|string',
            'day_start' => 'required|string',
            'day_end' => 'required|string',
            'hour_start' => 'required|date_format:H:i',
            'hour_end' => 'required|date_format:H:i',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

    
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
            'price' => $validatedData['price'] ?? null,
            'goal' => $validatedData['goal'] ?? null,
        ]);

        $schedule = Schedules::create([
            'user_id' => $user->id, 
            'day_start' => $validatedData['day_start'],
            'day_end' => $validatedData['day_end'],
            'hour_start' => $validatedData['hour_start'],
            'hour_end' => $validatedData['hour_end'],
        ]);
    
        $this->storeImage($user);
    
        return response()->json($user, 201);
    }
    public function show($id)
    {
        $user = User::with('schedule')->find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
        'password' => 'sometimes|required|string|min:8',
        'role' => 'sometimes|required|string',
        'price' => 'nullable|numeric',
        'goal' => 'nullable|string',
        'numero' => 'required|string|regex:/^0\d{9}$/', 
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        'day_start' => 'nullable|string',
        'day_end' => 'nullable|string',
        'hour_start' => 'nullable|date_format:H:i', 
        'hour_end' => 'nullable|date_format:H:i',   
    ]);

    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->update([
        'name' => $validatedData['name'] ?? $user->name,
        'email' => $validatedData['email'] ?? $user->email,
        'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
        'role' => $validatedData['role'] ?? $user->role,
        'price' => $validatedData['price'] ?? $user->price,
        'goal' => $validatedData['goal'] ?? $user->goal,
        'numero' => $validatedData['numero'] ?? $user->numero,
    ]);

    $this->storeImage($user);

    if (isset($validatedData['day_start']) || isset($validatedData['day_end']) || isset($validatedData['hour_start']) || isset($validatedData['hour_end'])) {
        if ($user->schedule) {
            $user->schedule->update([
                'day_start' => $validatedData['day_start'] ?? $user->schedule->day_start,
                'day_end' => $validatedData['day_end'] ?? $user->schedule->day_end,
                'hour_start' => $validatedData['hour_start'] ?? $user->schedule->hour_start,
                'hour_end' => $validatedData['hour_end'] ?? $user->schedule->hour_end,
            ]);
        } else {
            $schedule = Schedules::create([
                'user_id' => $user->id,
                'day_start' => $validatedData['day_start'],
                'day_end' => $validatedData['day_end'],
                'hour_start' => $validatedData['hour_start'],
                'hour_end' => $validatedData['hour_end'],
            ]);
        }
    }

    return response()->json($user->load('schedule'));
}

    public function destroy($id)
 {
        $user = User::find($id);
    
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }
    
        if ($user->schedule) {
            $user->schedule->delete();
        }
    
        $user->delete();
    
        return response()->json(['message' => 'Utilisateur et horaire supprimés avec succès']);
  }
    
    public function login(Request $request)
 {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => "Les informations d'identification fournies sont incorrectes"], 401);
        }

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => "L'utilisateur n'est pas authentifié"], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('app_token', ['*'])->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 200);
 }

    public function logout(Request $request)
{
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        // Supprimer le token
        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Token supprimé'], 200);
}

     function storeImage(User $user)
{
    if (request('image')) {
        $user->update([
            'image' => request('image')->store('images', 'public'),
        ]);
    }
}

}
