import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import { StatCard } from '@/components/eco/stat-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/i18n';
import { type BreadcrumbItem, type ConsumptionRecord } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    Gauge,
    ListChecks,
    PlusCircle,
    XCircle,
} from 'lucide-react';

interface Props {
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        meters: number;
    };
    recentEntries: ConsumptionRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/technician/dashboard' },
];

export default function TechnicianDashboard({ stats, recentEntries }: Props) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Technician Dashboard')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Field readings')}
                    description={t(':count active meters are waiting on you.', {
                        count: stats.meters,
                    })}
                    actions={
                        <Button asChild>
                            <Link href="/technician/consumptions/create" prefetch>
                                <PlusCircle className="size-4" />
                                {t('New reading')}
                            </Link>
                        </Button>
                    }
                />

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatCard label={t('My entries')} value={stats.total} icon={ListChecks} />
                    <StatCard
                        label={t('Pending review')}
                        value={stats.pending}
                        icon={Clock3}
                        tone="pending"
                    />
                    <StatCard
                        label={t('Approved')}
                        value={stats.approved}
                        icon={CheckCircle2}
                        tone="success"
                    />
                    <StatCard
                        label={t('Rejected')}
                        value={stats.rejected}
                        icon={XCircle}
                        tone={stats.rejected > 0 ? 'danger' : 'default'}
                    />
                </div>

                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{t('Latest entries')}</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/technician/consumptions" prefetch>
                                {t('View all')}
                            </Link>
                        </Button>
                    </div>
                    <RecordsTable
                        records={recentEntries}
                        emptyTitle="No readings yet"
                        emptyDescription="Record your first meter reading to get started."
                    />
                    {recentEntries.length === 0 && (
                        <div className="flex justify-center">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/technician/consumptions/create">
                                    <Gauge className="size-4" />
                                    {t('Record a reading')}
                                </Link>
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
