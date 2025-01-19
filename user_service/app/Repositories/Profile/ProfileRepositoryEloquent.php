<?php

namespace App\Repositories\Profile;

use App\Models\Profile;
use App\Repositories\RepositoryEloquent;
use App\Repositories\Profile\ProfileRepository;

class ProfileRepositoryEloquent extends RepositoryEloquent implements ProfileRepository
{
    public function getModel()
    {
        return Profile::class;
    }
}
