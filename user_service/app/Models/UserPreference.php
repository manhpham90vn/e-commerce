<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserPreference extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_preferences';

    protected $fillable = [
        'user_id',
        'email_notification',
        'push_notification',
    ];
}
