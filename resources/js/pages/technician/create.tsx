import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { ReadingForm, type MeterOption } from '@/components/eco/reading-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Period } from '@/types';
import { Head } from '@inertiajs/react';

interface Props {
    meters: MeterOption[];
    periods: Period[];
    maxIncrement: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/technician/dashboard' },
    { title: 'New reading', href: '/technician/consumptions/create' },
];

export default function CreateReading({
    meters,
    periods,
    maxIncrement,
}: Props) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('New reading')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Record a reading')}
                        description={t('Enter the value shown on the meter dial. It goes to an admin for approval.')}
                    />

                    <ReadingForm
                        meters={meters}
                        periods={periods}
                        maxIncrement={maxIncrement}
                        action="/technician/consumptions"
                        method="post"
                        submitLabel="Save reading"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
