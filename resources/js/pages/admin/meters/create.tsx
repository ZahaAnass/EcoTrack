import { MeterForm } from '@/components/eco/meter-form';
import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Meters', href: '/admin/meters' },
    { title: 'Add meter', href: '/admin/meters/create' },
];

export default function CreateMeter() {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Add meter')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Add meter')}
                        description={t('Register a new electricity or water meter.')}
                    />
                    <MeterForm />
                </div>
            </div>
        </AppLayout>
    );
}
