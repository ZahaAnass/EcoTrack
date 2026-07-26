import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { UserForm } from '@/components/eco/user-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Edit user', href: '#' },
];

export default function EditUser({
    user,
}: {
    user: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${user.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={`Edit ${user.name}`}
                        description={t('Leave the password fields empty to keep the current password.')}
                    />
                    <UserForm user={user} />
                </div>
            </div>
        </AppLayout>
    );
}
