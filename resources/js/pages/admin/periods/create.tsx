import { PageHeader } from '@/components/eco/page-header';
import { PeriodForm } from '@/components/eco/period-form';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/i18n';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Tariff periods', href: '/admin/periods' },
    { title: 'Add period', href: '/admin/periods/create' },
];

export default function CreatePeriod({ hasWaterPeriod }: { hasWaterPeriod: boolean }) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Add tariff period')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Add tariff period')}
                    description={t('Electricity uses time-of-day windows; water has one flat daily tariff.')}
                />
                <PeriodForm hasWaterPeriod={hasWaterPeriod} />
            </div>
        </AppLayout>
    );
}
