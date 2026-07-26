import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { UserForm } from '@/components/eco/user-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Add user', href: '/admin/users/create' },
];

export default function CreateUser() {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Add user')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Add user')}
                        description={t('The account is created verified and can sign in right away.')}
                    />
                    <UserForm />
                </div>
            </div>
        </AppLayout>
    );
}
