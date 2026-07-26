import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type Role, type User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Eye, LoaderCircle, ShieldCheck, Wrench } from 'lucide-react';
import { FormEvent } from 'react';

const roles: {
    value: Role;
    label: string;
    help: string;
    icon: typeof ShieldCheck;
    chip: string;
}[] = [
    {
        value: 'admin',
        label: 'Admin',
        help: 'Full access — approves readings and manages meters, tariffs and users.',
        icon: ShieldCheck,
        chip: 'bg-primary/15 text-primary',
    },
    {
        value: 'technician',
        label: 'Technician',
        help: 'Records meter readings in the field and tracks their approval.',
        icon: Wrench,
        chip: 'bg-electricity/15 text-electricity',
    },
    {
        value: 'user',
        label: 'Viewer',
        help: 'Read-only access to approved consumption data and reports.',
        icon: Eye,
        chip: 'bg-water/15 text-water',
    },
];

export function UserForm({
    user,
}: {
    user?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}) {
    const t = useT();

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: (user?.role ?? 'user') as Role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (user) {
            put(`/admin/users/${user.id}`);
        } else {
            post('/admin/users');
        }
    };

    return (
        <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('Name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('Email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="role">{t('Role')}</Label>
                    <Select value={data.role} onValueChange={(v) => setData('role', v as Role)}>
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    <span className="flex items-center gap-2">
                                        <role.icon className="size-4" />
                                        {t(role.label)}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.role} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            {user ? t('New password (optional)') : t('Password')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">{t('Confirm password')}</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {user ? t('Save changes') : t('Create user')}
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/admin/users">{t('Cancel')}</Link>
                    </Button>
                </div>
            </div>

            {/* Role guide — the selected role lights up */}
            <aside className="flex flex-col gap-3">
                {roles.map((role) => (
                    <button
                        key={role.value}
                        type="button"
                        onClick={() => setData('role', role.value)}
                        className={cn(
                            'flex items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-xs transition-all',
                            data.role === role.value
                                ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card ring-1 ring-primary/30'
                                : 'opacity-70 hover:opacity-100',
                        )}
                    >
                        <span
                            className={cn(
                                'flex size-9 shrink-0 items-center justify-center rounded-lg',
                                role.chip,
                            )}
                        >
                            <role.icon className="size-4" />
                        </span>
                        <span>
                            <span className="block text-sm font-semibold">{t(role.label)}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                {t(role.help)}
                            </span>
                        </span>
                    </button>
                ))}
            </aside>
        </form>
    );
}
