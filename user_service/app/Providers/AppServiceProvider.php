<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Helpers
        $apiResponseHelper = app_path('Helpers/ApiResponseHelper.php');
        if (file_exists($apiResponseHelper)) {
            require_once $apiResponseHelper;
        }

        // Repositories
        $this->app->bind(
            \App\Repositories\Profile\ProfileRepository::class,
            \App\Repositories\Profile\ProfileRepositoryEloquent::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
