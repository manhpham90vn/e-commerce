<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Helpers\ApiResponseHelper;
use App\Http\Middleware\VerifyToken;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\HttpFoundation\Response;

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
        $exceptions->render(function (BadRequestHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_BAD_REQUEST, 'Bad request.', null);
            }
        });

        $exceptions->render(function (UnauthorizedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_UNAUTHORIZED, 'Unauthorized.', null);
            }
        });

        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_FORBIDDEN, 'Forbidden.', null);
            }
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_NOT_FOUND, 'Resource not found.', null);
            }
        });

        $exceptions->render(function (RouteNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_NOT_FOUND, 'Route not found.', null);
            }
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_METHOD_NOT_ALLOWED, 'Method Not Allowed.', null);
            }
        });

        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api/*') && $e->getStatusCode() == Response::HTTP_UNPROCESSABLE_ENTITY) {
                return ApiResponseHelper::error(Response::HTTP_UNPROCESSABLE_ENTITY, 'Unprocessable entity.', null);
            }
        });

        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiResponseHelper::error(Response::HTTP_INTERNAL_SERVER_ERROR, 'Internal Server Error.', $e->getMessage());
            }
        });
    })->create();
