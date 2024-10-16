<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        // Créer un utilisateur pour les tests d'authentification
        $this->user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => bcrypt('password123'),
        ]);
    }

    /** @test */
    public function can_create_user()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'role' => 'client',
            'numero' => '0123456789',
            'goals' => [1, 4], // IDs des objectifs à associer
        ];

        $response = $this->postJson('/api/users', $data);

        $response->assertStatus(201)
                 ->assertJson([
                     'name' => 'John Doe',
                     'email' => 'john.doe@example.com',
                     'role' => 'client',
                     'numero' => '0123456789',
                     'price' => null,
                     'city' => null,
                     'goals' => [
                         [
                             'id' => 1,
                             'name' => 'musculation',
                             'pivot' => [
                                 'user_id' => $response->json('id'), // ID de l'utilisateur créé
                                 'goal_id' => 1,
                             ],
                         ],
                         [
                             'id' => 4,
                             'name' => 'running',
                             'pivot' => [
                                 'user_id' => $response->json('id'),
                                 'goal_id' => 4,
                             ],
                         ],
                     ],
                 ]);

        $this->assertDatabaseHas('users', ['email' => 'john.doe@example.com']);
    }

    /** @test */
    public function create_user_with_existing_email()
    {
        User::factory()->create(['email' => 'john.doe@example.com']);

        $data = [
            'name' => 'Jane Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/users', $data);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Email already exists']);
    }

    /** @test */
    public function can_get_all_users()
    {
        $this->actingAs($this->user, 'api');

        User::factory()->count(3)->create();

        $response = $this->getJson('/api/users');

        $response->assertStatus(200)
                 ->assertJsonCount(4); // 3 utilisateurs créés + 1 utilisateur authentifié
    }

    /** @test */
    public function can_get_user_by_id()
    {
        $this->actingAs($this->user, 'api');

        $userToRetrieve = User::factory()->create();

        $response = $this->getJson("/api/users/{$userToRetrieve->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $userToRetrieve->id,
                     'name' => $userToRetrieve->name,
                     'email' => $userToRetrieve->email,
                 ]);
    }

    /** @test */
    public function get_user_by_nonexistent_id()
    {
        $this->actingAs($this->user, 'api');

        $response = $this->getJson('/api/users/999'); // ID inexistant

        $response->assertStatus(404)
                 ->assertJson(['message' => 'User not found']);
    }

    /** @test */
    public function can_update_user()
    {
        $this->actingAs($this->user, 'api');

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'role' => 'client',
            'numero' => '0123456789',
            'goals' => [1, 4],
        ];

        $response = $this->putJson("/api/users/{$userToUpdate->id}", $data);

        $response->assertStatus(200)
                 ->assertJson(['name' => 'Jane Doe', 'email' => 'jane.doe@example.com']);

        $this->assertDatabaseHas('users', ['id' => $userToUpdate->id, 'name' => 'Jane Doe']);
    }

    /** @test */
    public function update_user_with_existing_email()
    {
        $this->actingAs($this->user, 'api');

        User::factory()->create(['email' => 'existing@example.com']);

        $userToUpdate = User::factory()->create(['email' => 'user@example.com']);

        $data = [
            'name' => 'Jane Doe',
            'email' => 'existing@example.com', // Email existant
        ];

        $response = $this->putJson("/api/users/{$userToUpdate->id}", $data);

        $response->assertStatus(400)
                 ->assertJson(['message' => 'Email already exists']);
    }

    /** @test */
    public function can_delete_user()
    {
        $this->actingAs($this->user, 'api');

        $userToDelete = User::factory()->create();

        $response = $this->deleteJson("/api/users/{$userToDelete->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'User deleted successfully']);

        $this->assertDatabaseMissing('users', ['id' => $userToDelete->id]);
    }

    /** @test */
    public function delete_nonexistent_user()
    {
        $this->actingAs($this->user, 'api');

        $response = $this->deleteJson('/api/users/999'); // ID inexistant

        $response->assertStatus(404)
                 ->assertJson(['message' => 'User not found']);
    }

    /** @test */
    public function can_login_user()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token']);
    }

    /** @test */
    public function login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'user@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Invalid credentials']);
    }

    /** @test */
    public function can_logout_user()
    {
        $this->actingAs($this->user, 'api');

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Logged out successfully']);
    }

    /** @test */
    public function logout_user_not_authenticated()
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Unauthenticated']);
    }
}
