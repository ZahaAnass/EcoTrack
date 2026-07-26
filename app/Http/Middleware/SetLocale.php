<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public const SUPPORTED = ['fr', 'en', 'ar'];

    /**
     * French is the primary language of the product; the frontend keeps the
     * same choice in a plain cookie so server-side messages match the UI.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale', 'fr');

        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = 'fr';
        }

        App::setLocale($locale);

        return $next($request);
    }
}
