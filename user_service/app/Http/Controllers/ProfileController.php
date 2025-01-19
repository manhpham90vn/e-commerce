<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Http\Requests\StoreOrUpdateProfileRequest;

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

    public function show($id)
    {
        $profile = Profile::findOrFail($id);
        return $this->successResponse($profile);
    }
}
