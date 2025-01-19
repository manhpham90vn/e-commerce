<?php

namespace App\Traits;

use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    protected function successResponse($data = null, $message = null)
    {
        return $this->apiResponse(Response::HTTP_OK, $data, $message, null);
    }

    protected function errorResponse($statusCode = Response::HTTP_NOT_FOUND, $message = null, $errors = null)
    {
        return $this->apiResponse($statusCode, null, $message, $errors);
    }

    protected function apiResponse($statusCode = Response::HTTP_OK, $data = null, $message = null, $errors = null)
    {
        $response = [
            'status' => $statusCode,
            'data' => $data,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }
}
