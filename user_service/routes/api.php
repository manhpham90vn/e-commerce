<?php

use App\Helpers\ApiResponseHelper;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

Route::prefix('user_service/v1')->group(function () {
    Route::get('/health', function () {
        try {
            DB::select('SELECT 1');
            return ApiResponseHelper::success(null, 'OK');
        } catch (\Exception $e) {
            return ApiResponseHelper::error(Response::HTTP_INTERNAL_SERVER_ERROR, 'Errors', $e->getMessage());
        }
    });

    Route::get('/profiles/{id}', [ProfileController::class, 'show']);

    Route::middleware(['verify-token'])->group(function () {
        Route::post('/profiles', [ProfileController::class, 'storeOrUpdate']);
        Route::get('/profiles', [ProfileController::class, 'showMe']);
    });
});
