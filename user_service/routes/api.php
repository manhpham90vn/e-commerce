<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::prefix('user_service/v1')->group(function () {
    Route::post('/profiles', [ProfileController::class, 'storeOrUpdate']);
    Route::get('/profiles/{id}', [ProfileController::class, 'show']);
});
