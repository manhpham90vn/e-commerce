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
            'phone',
            'address',
            'avatar'
        ]);
        $user_id = $request['user_data']['id'];

        $data['user_id'] = $user_id;

        $profile = Profile::updateOrCreate(
            ['user_id' => $user_id],
            $data
        )->fresh();

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
        $profile = Profile::findOrFail($id);
        return $this->successResponse($profile);
    }
}
