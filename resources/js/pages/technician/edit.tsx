import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { ReadingForm, type MeterOption } from '@/components/eco/reading-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type Period,
} from '@/types';
import { Head } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

interface Props {
    entry: ConsumptionRecord;
    meters: MeterOption[];
    periods: Period[];
    maxIncrement: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/technician/dashboard' },
    { title: 'My entries', href: '/technician/consumptions' },
    { title: 'Edit reading', href: '#' },
];

export default function EditReading({
    entry,
    meters,
    periods,
    maxIncrement,
}: Props) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Edit reading')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Edit reading')}
                        description={t('Saving resubmits this reading for admin approval.')}
                    />

                    {entry.status === 'rejected' && (
                        <Alert variant="destructive">
                            <XCircle className="size-4" />
                            <AlertTitle>{t('This reading was rejected')}</AlertTitle>
                            <AlertDescription>
                                {entry.rejection_reason ??
                                    t('No reason was given. Correct the value and resubmit.')}
                            </AlertDescription>
                        </Alert>
                    )}

                    <ReadingForm
                        meters={meters}
                        periods={periods}
                        maxIncrement={maxIncrement}
                        action={`/technician/consumptions/${entry.id}`}
                        method="put"
                        initial={{
                            meter_id: entry.meter.id,
                            period_id: entry.period.id,
                            current_value: entry.current_value,
                        }}
                        submitLabel="Save changes"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
