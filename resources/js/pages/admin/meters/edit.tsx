import { MeterForm } from '@/components/eco/meter-form';
import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Meter } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Meters', href: '/admin/meters' },
    { title: 'Edit meter', href: '#' },
];

export default function EditMeter({ meter }: { meter: Meter }) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${meter.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={`Edit ${meter.name}`}
                        description={t('Changes apply to future readings; existing history keeps its snapshot.')}
                    />
                    <MeterForm meter={meter} />
                </div>
            </div>
        </AppLayout>
    );
}
