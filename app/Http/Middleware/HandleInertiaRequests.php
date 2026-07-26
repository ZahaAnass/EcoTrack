<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(\Illuminate\Foundation\Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'currency' => config('ecotrack.currency'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'notifications' => fn () => $this->notifications($request),
        ];
    }

    /**
     * In-app notifications for the bell in the header. Only admins and
     * technicians take part in the approval workflow, so viewers get none.
     *
     * @return array{items: array<int, mixed>, unread: int}
     */
    private function notifications(Request $request): array
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, ['admin', 'technician'], true)) {
            return ['items' => [], 'unread' => 0];
        }

        return [
            'items' => $user->notifications()
                ->latest()
                ->take(12)
                ->get()
                ->map(fn ($notification) => [
                    'id' => $notification->id,
                    'read' => $notification->read_at !== null,
                    'created_at' => $notification->created_at->toIso8601String(),
                    ...$notification->data,
                ])
                ->all(),
            'unread' => $user->unreadNotifications()->count(),
        ];
    }
}
