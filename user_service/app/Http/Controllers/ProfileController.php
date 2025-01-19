<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Http\Requests\StoreOrUpdateProfileRequest;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{
    public function storeOrUpdate(StoreOrUpdateProfileRequest $request)
    {
        $data = $request->only([
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'avatar'
        ]);
        $user_id = $request['user_data']['id'];

        $data['user_id'] = $user_id;

        $profile = Profile::updateOrCreate(
            ['user_id' => $user_id],
            $data
        );

        return $this->successResponse($profile);
    }

    public function showMe(Request $request)
    {
        $user_id = $request['user_data']['id'];
        $profile = Profile::where('user_id', $user_id)->first();
        return $this->successResponse($profile);
    }

    public function show(int $id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return $this->errorResponse(Response::HTTP_NOT_FOUND, 'Profile not found');
        }
        return $this->successResponse($profile);
    }
}
