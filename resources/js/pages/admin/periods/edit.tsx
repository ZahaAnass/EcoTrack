import { PageHeader } from '@/components/eco/page-header';
import { PeriodForm } from '@/components/eco/period-form';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/i18n';
import { type BreadcrumbItem, type MeterType, type Period } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Tariff periods', href: '/admin/periods' },
    { title: 'Edit period', href: '#' },
];

export default function EditPeriod({
    period,
    hasWaterPeriod,
}: {
    period: Period & { type?: MeterType };
    hasWaterPeriod: boolean;
}) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('Edit period')} — ${period.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={`${t('Edit period')}: ${period.name}`}
                    description={t('Existing readings keep the price they were recorded with.')}
                />
                <PeriodForm period={period} hasWaterPeriod={hasWaterPeriod} />
            </div>
        </AppLayout>
    );
}
