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
        $users = User::with('schedule', 'goals')->get(); 
        return response()->json($users);
    }

    public function store(Request $request)
{
    if (User::where('email', $request->email)->exists()) {
        return response()->json(['message' => 'L\'email est déjà utilisé'], 400);
    }

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'role' => 'required|string|in:coach,client',
        'goals' => 'nullable|array',  
        'goals.*' => 'exists:goals,id', 
        'numero' => 'required|string|regex:/^0\d{9}$/',
        'price' => 'nullable|numeric', 
        'day_start' => 'nullable|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche',
        'day_end' => 'nullable|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche',
        'hour_start' => 'nullable|date_format:H:i',
        'hour_end' => 'nullable|date_format:H:i',
    ]);

    $user = User::create([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
        'role' => $validatedData['role'],
        'numero' => $validatedData['numero'],
        'price' => $validatedData['price'] ?? null, 
    ]);

    if ($user->role === 'coach') {
        Schedules::create([
            'user_id' => $user->id,
            'day_start' => $validatedData['day_start'],
            'day_end' => $validatedData['day_end'],
            'hour_start' => $validatedData['hour_start'],
            'hour_end' => $validatedData['hour_end'],
        ]);
    }

    if (!empty($validatedData['goals'])) {
        $user->goals()->attach($validatedData['goals']);
    }

    return response()->json($user->load('goals'), 201);
}

    
    public function show($id)
    {
        $user = User::with('schedule', 'goals')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        if ($request->email !== $user->email && User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'L\'email est déjà utilisé'], 400);
        }
    
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|string|in:coach,client',
            'price' => 'nullable|numeric',
            'goals' => 'nullable|array',
            'goals.*' => 'exists:goals,id',
            'numero' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'day_start' => 'nullable|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche',
            'day_end' => 'nullable|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche',
            'hour_start' => 'nullable|date_format:H:i',
            'hour_end' => 'nullable|date_format:H:i',
        ]);
    
        $user->update(array_filter([
            'name' => $validatedData['name'] ?? $user->name,
            'email' => $validatedData['email'] ?? $user->email,
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password,
            'role' => $validatedData['role'] ?? $user->role,
            'price' => $validatedData['price'] ?? $user->price,
            'numero' => $validatedData['numero'] ?? $user->numero,
        ]));
    
        if ($user->role === 'coach') {
            $scheduleData = [
                'day_start' => $validatedData['day_start'] ?? null,
                'day_end' => $validatedData['day_end'] ?? null,
                'hour_start' => $validatedData['hour_start'] ?? null,
                'hour_end' => $validatedData['hour_end'] ?? null,
            ];
    
            if ($user->schedule) {
                $user->schedule->update(array_filter($scheduleData));
            } else {
                Schedules::create(array_merge(['user_id' => $user->id], $scheduleData));
            }
        }
    
        if (isset($validatedData['goals'])) {
            $user->goals()->sync($validatedData['goals']);
        }
    
        $this->storeImage($user);
    
        return response()->json($user->load('schedule', 'goals'));
    }
    
    public function destroy($id)
    {
        $user = User::findOrFail($id);
    
        if ($user->schedule) {
            $user->schedule->delete();
        }
    
        $user->goals()->detach();
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

        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Token supprimé'], 200);
    }

    public function storeImage(User $user)
    {
        if (request()->hasFile('image')) {
            $user->update([
                'image' => request()->file('image')->store('images', 'public'), 
            ]);
        }
    }

    public function updateGoals(Request $request, $id)
    {
        $request->validate([
            'goals' => 'required|array',
            'goals.*' => 'exists:goals,id', 
        ]);
    
        $user = User::findOrFail($id);
    
        $user->goals()->sync($request->goals);
    
        return response()->json(['message' => 'Goals updated successfully']);
    }
}
