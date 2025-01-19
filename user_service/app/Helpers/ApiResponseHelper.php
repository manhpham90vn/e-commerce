<?php

namespace App\Helpers;

use App\Traits\ApiResponse;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseHelper
{
    use ApiResponse;

    public static function success($data = null, $message = null)
    {
        return (new self)->successResponse($data, $message);
    }

    public static function error($statusCode = Response::HTTP_NOT_FOUND, $message = null, $errors = null)
    {
        return (new self)->errorResponse($statusCode, $message, $errors);
    }
}
