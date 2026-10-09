<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::createUrlUsing(
            function ($usuario, string $token) {
                $frontend = rtrim(
                    config('app.frontend_url', 'http://localhost:5173'),
                    '/'
                );

                return $frontend . '/resetar-senha?token='
                    . urlencode($token)
                    . '&email='
                    . urlencode($usuario->email);
            }
        );
    }
}
