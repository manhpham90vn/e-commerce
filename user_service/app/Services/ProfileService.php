<?php

namespace App\Services;

use App\Repositories\Profile\ProfileRepository;

use App\Models\Profile;

class ProfileService
{
    public function __construct(protected ProfileRepository $profileRepository) {}

    public function storeOrUpdate(array $data): Profile
    {
        $isExistsProfile = $this->profileRepository->findWhere(['user_id' => $data['user_id']]);

        if ($isExistsProfile) {
            $this->profileRepository->update($data, $isExistsProfile->id);
            return $isExistsProfile->fresh();
        } else {
            $profile = $this->profileRepository->create($data);
            return $profile;
        }
    }

    public function me(int $user_id): ?Profile
    {
        $profile = $this->profileRepository->findWhere(['user_id' => $user_id]);
        return $profile;
    }

    public function show(int $id): ?Profile
    {
        $profile = $this->profileRepository->find($id);
        return $profile;
    }
}
