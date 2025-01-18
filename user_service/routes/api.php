<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\DB;

Route::prefix('user_service/v1')->group(function () {
    Route::get('/health', function () {
        DB::select('SELECT 1');
        return response()->json(['status' => 'ok']);
    });
    Route::post('/profiles', [ProfileController::class, 'storeOrUpdate']);
    Route::get('/profiles/{id}', [ProfileController::class, 'show']);
});
