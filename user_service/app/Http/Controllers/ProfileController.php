<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function storeOrUpdate(Request $request)
    {
        // verify token
        $user_data = $this->verifyToken();

        // validate request
        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:255',
        ]);

        // build data
        $data = $request->all();
        $data['user_id'] = $user_data['data']['id'];

        // check if profile exists
        $existingProfile = Profile::where('user_id', $user_data['data']['id'])->first();

        if ($existingProfile) {
            $existingProfile->update($data);
            return response()->json($existingProfile, 200);
        } else {
            $profile = Profile::create($data);
            return response()->json($profile, 200);
        }
    }

    public function show($id)
    {
        $profile = Profile::findOrFail($id);
        return response()->json($profile);
    }

    public function verifyToken()
    {
        try {
            $client = new \GuzzleHttp\Client();
            $authServiceUrl = env('AUTH_SERVICE_URL');

            $token = request()->bearerToken();
            $response = $client->request('GET', $authServiceUrl . '/v1/verify-token/', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                ]
            ]);

            if ($response->getStatusCode() == 200) {
                $responseData = json_decode($response->getBody(), true);
                return $responseData;
            } else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    }
}
