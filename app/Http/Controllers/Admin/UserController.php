<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $query = User::withCount('consumptionRecords')->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (in_array($request->input('role'), User::ROLES, true)) {
            $query->where('role', $request->input('role'));
        }

        $sortColumn = match ($request->input('sort')) {
            'name' => 'name',
            'email' => 'email',
            'role' => 'role',
            'readings' => 'consumption_records_count',
            'joined' => 'created_at',
            default => null,
        };

        if ($sortColumn) {
            $query->reorder($sortColumn, $request->input('dir') === 'asc' ? 'asc' : 'desc');
        }

        return Inertia::render('admin/users/index', [
            'users' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'role', 'sort', 'dir']),
            'roleCounts' => [
                'all' => User::count(),
                'admin' => User::role(User::ROLE_ADMIN)->count(),
                'technician' => User::role(User::ROLE_TECHNICIAN)->count(),
                'user' => User::role(User::ROLE_USER)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => ['required', Rule::in(User::ROLES)],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        // forceCreate so we can set email_verified_at; the 'hashed' cast
        // on the model takes care of the password.
        User::forceCreate([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
            'password' => $data['password'],
            'email_verified_at' => now(),
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('User created.'));
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(User::ROLES)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if ($user->id === auth()->id() && $data['role'] !== User::ROLE_ADMIN) {
            return back()->with('error', __('You cannot remove your own admin role.'));
        }

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password'];
        }

        $user->save();

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('User updated.'));
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', __('You cannot delete your own account from here.'));
        }

        $user->delete();

        return back()->with('success', __('User deleted.'));
    }
}
