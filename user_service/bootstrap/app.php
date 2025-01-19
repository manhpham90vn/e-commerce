<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Helpers\ApiResponseHelper;
use App\Http\Middleware\VerifyToken;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php'
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('verify-token', [VerifyToken::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_UNPROCESSABLE_ENTITY, 'Validation error', null);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_NOT_FOUND, 'Not found', null);
            }
        });

        $exceptions->render(function (\Exception $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_INTERNAL_SERVER_ERROR, 'Server error', null);
            }
        });
    })->create();
