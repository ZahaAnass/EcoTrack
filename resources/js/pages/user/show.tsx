import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { RecordDetail } from '@/components/eco/record-detail';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ConsumptionRecord } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    record: ConsumptionRecord;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'History', href: '/user/consumptions' },
    { title: 'Reading', href: '#' },
];

export default function ShowRecord({ record }: Props) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reading — ${record.meter?.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Reading detail')}
                        actions={
                            <Button variant="outline" asChild>
                                <Link href="/user/consumptions" prefetch>
                                    <ArrowLeft className="size-4" />
                                    {t('Back to history')}
                                </Link>
                            </Button>
                        }
                    />

                    <RecordDetail record={record} showStatus={false} />
                </div>
            </div>
        </AppLayout>
    );
}
