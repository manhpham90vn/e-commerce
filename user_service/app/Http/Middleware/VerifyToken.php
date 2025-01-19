<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponse;

class VerifyToken
{

    use ApiResponse;

    public function handle(Request $request, Closure $next): JsonResponse
    {
        try {
            $client = new Client();
            $authServiceUrl = env('AUTH_SERVICE_URL');
            $token = $request->bearerToken();

            if (!$token) {
                return $this->errorResponse(Response::HTTP_UNAUTHORIZED, 'Unauthorized');
            }

            $response = $client->get($authServiceUrl . '/api/auth_service/v1/verify-token', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                ],
            ]);

            if ($response->getStatusCode() === Response::HTTP_OK) {
                $responseData = json_decode($response->getBody(), true);

                $request->merge(['user_data' => $responseData['data']]);

                return $next($request);
            }

            return $this->errorResponse(Response::HTTP_UNAUTHORIZED, 'Unauthorized');
        } catch (GuzzleException $e) {
            if ($e->getCode() === Response::HTTP_UNAUTHORIZED) {
                return $this->errorResponse(Response::HTTP_UNAUTHORIZED, 'Unauthorized');
            }
            return $this->errorResponse(Response::HTTP_SERVICE_UNAVAILABLE, 'Auth service unavailable');
        } catch (\Exception $e) {
            return $this->errorResponse(Response::HTTP_UNAUTHORIZED, 'Auth service unavailable');
        }
    }
}
