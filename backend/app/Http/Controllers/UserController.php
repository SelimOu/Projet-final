<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Schedules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;


/**
 * @OA\Info(
 *     title="User Management API",
 *     version="1.0.0",
 *     description="API for managing users and their goals.",
 *     @OA\Contact(
 *         email="support@example.com"
 *     ),
 *     @OA\License(
 *         name="Apache 2.0",
 *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *     )
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Utiliser un token d'accès JWT pour accéder aux endpoints protégés"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Retrieve all users",
     *     tags={"User"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of users retrieved successfully",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/User"))
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function index()
    {
        $users = User::with('schedule', 'goals')->get(); 
        return response()->json($users);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Create a new user",
     *     tags={"User"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "role", "numero"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="SecurePass123"),
     *             @OA\Property(property="role", type="string", enum={"coach", "client"}, example="client"),
     *             @OA\Property(property="numero", type="string", pattern="^0\d{9}$", example="0123456789"),
     *             @OA\Property(property="goals", type="array", @OA\Items(type="integer"), example={1,2,3}),
     *             @OA\Property(property="price", type="number", format="float", nullable=true, example=99.99),
     *             @OA\Property(property="city", type="string", nullable=true, example="Paris"),
     *             @OA\Property(property="day_start", type="string", enum={"Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"}, nullable=true, example="Lundi"),
     *             @OA\Property(property="day_end", type="string", enum={"Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"}, nullable=true, example="Vendredi"),
     *             @OA\Property(property="hour_start", type="string", format="time", nullable=true, example="09:00"),
     *             @OA\Property(property="hour_end", type="string", format="time", nullable=true, example="17:00"),
     *             @OA\Property(property="image", type="string", format="binary", nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email already in use",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="L'email est déjà utilisé")
     *         )
     *     )
     * )
     */
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
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', 
        'price' => 'nullable|numeric',
        'city' => 'nullable|string|max:255',
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
        'city' => $validatedData['city'] ?? null,
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

    $this->storeImage($user);

    return response()->json($user->load('goals'), 201);
}

    /**
     * @OA\Get(
     *     path="/api/users/{id}",
     *     summary="Retrieve a user by ID",
     *     tags={"User"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the user to retrieve",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User details retrieved successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $user = User::with('schedule', 'goals')->findOrFail($id);
        return response()->json($user); 
    }

    /**
     * @OA\Put(
     *     path="/api/users/{id}",
     *     summary="Update an existing user",
     *     tags={"User"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the user to update",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Jane Doe"),
     *             @OA\Property(property="email", type="string", format="email", example="jane.doe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="NewSecurePass456"),
     *             @OA\Property(property="role", type="string", enum={"coach", "client"}, example="coach"),
     *             @OA\Property(property="price", type="number", format="float", nullable=true, example=149.99),
     *             @OA\Property(property="goals", type="array", @OA\Items(type="integer"), example={2,3,4}),
     *             @OA\Property(property="numero", type="string", pattern="^0\d{9}$", nullable=true, example="0987654321"),
     *             @OA\Property(property="image", type="string", format="binary", nullable=true),
     *             @OA\Property(property="city", type="string", nullable=true, example="Lyon"),
     *             @OA\Property(property="day_start", type="string", enum={"Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"}, nullable=true, example="Mardi"),
     *             @OA\Property(property="day_end", type="string", enum={"Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"}, nullable=true, example="Samedi"),
     *             @OA\Property(property="hour_start", type="string", format="time", nullable=true, example="10:00"),
     *             @OA\Property(property="hour_end", type="string", format="time", nullable=true, example="18:00")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email already in use",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="L'email est déjà utilisé")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
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
            'numero' => 'nullable|string|regex:/^0\d{9}$/',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'city' => 'nullable|string|max:255', 
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
            'city' => $validatedData['city'] ?? $user->city, 
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

    /**
     * @OA\Delete(
     *     path="/api/users/{id}",
     *     summary="Delete a user",
     *     tags={"User"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the user to delete",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User and schedule deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Utilisateur et horaire supprimés avec succès")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Authenticate a user and retrieve a token",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="SecurePass123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="user", ref="#/components/schemas/User"),
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Les informations d'identification fournies sont incorrectes")
     *         )
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Logout the authenticated user",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Token supprimé")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="User not authenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Utilisateur non authentifié")
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }

        $user->currentAccessToken()->delete();

        return response()->json(['message' => 'Token supprimé'], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/users/{id}/goals",
     *     summary="Update goals for a user",
     *     tags={"User"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the user",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"goals"},
     *             @OA\Property(property="goals", type="array", @OA\Items(type="integer"), example={2,3,4})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Goals updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Goals updated successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User not found")
     *         )
     *     )
     * )
     */
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

    /**
     * Méthode interne pour stocker l'image de l'utilisateur sur Cloudinary.
     * Cette méthode n'est pas exposée en tant que route API.
     *
     * @param \App\Models\User $user
     * @return void
     */
    public function storeImage(User $user)
    {
        if (request()->hasFile('image')) {
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key' => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => [
                    'secure' => true 
                ]
            ]);

            $filePath = request()->file('image')->getRealPath();

            try {
                $uploadResult = (new UploadApi())->upload($filePath, [
                    'folder' => 'users/' . $user->id, 
                ]);

                $user->update(['image' => $uploadResult['secure_url']]);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Image upload failed: ' . $e->getMessage()], 500);
            }
        }
    }
}
