<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Http\Requests\StoreOrUpdateProfileRequest;
use App\Services\ProfileService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{

    public function __construct(protected ProfileService $profileService) {}

    public function storeOrUpdate(StoreOrUpdateProfileRequest $request)
    {
        $data = $request->only([
            'first_name',
            'last_name',
            'phone',
            'address',
            'avatar'
        ]);
        $user_id = $request['user_data']['id'];

        $data['user_id'] = $user_id;

        $profile = $this->profileService->storeOrUpdate($data);

        return $this->successResponse($profile);
    }

    public function me(Request $request)
    {
        $user_id = $request['user_data']['id'];
        $profile = $this->profileService->me($user_id);

        if (!$profile) {
            return $this->errorResponse(Response::HTTP_NOT_FOUND, 'Profile not found');
        }
        return $this->successResponse($profile);
    }

    public function show(int $id)
    {
        $profile = $this->profileService->show($id);

        if (!$profile) {
            return $this->errorResponse(Response::HTTP_NOT_FOUND, 'Profile not found');
        }
        return $this->successResponse($profile);
    }
}
