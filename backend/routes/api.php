<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ScheduleController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/users', [UserController::class, 'index'])->middleware('auth:sanctum');
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');
Route::put('/users/{id}', [UserController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/schedules', [ScheduleController::class, 'index'])->middleware('auth:sanctum');
Route::post('/schedules', [ScheduleController::class, 'store'])->middleware('auth:sanctum');
Route::get('/schedules/{id}', [ScheduleController::class, 'show'])->middleware('auth:sanctum');
Route::put('/schedules/{id}', [ScheduleController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy'])->middleware('auth:sanctum');

Route::post('/users/{id}/goals', [UserController::class, 'updateGoals']);
Route::get('/users/{id}/goals', [UserController::class, 'getUserGoals']);


Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

