import { ApprovalActions } from '@/components/eco/approval-actions';
import { UtilityTrendChart } from '@/components/eco/charts';
import { EmptyState } from '@/components/eco/empty-state';
import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import { StatCard } from '@/components/eco/stat-card';
import { UtilityBadge } from '@/components/eco/utility-badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type DailyPoint,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    CheckSquare,
    Clock3,
    Droplets,
    Gauge,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';

interface Props {
    stats: {
        meters: number;
        electricityMeters: number;
        waterMeters: number;
        periods: number;
        records: number;
        pending: number;
        technicians: number;
        users: number;
        monthConsumptionElectricity: number;
        monthConsumptionWater: number;
        monthAmount: number;
    };
    daily: DailyPoint[];
    pendingRecords: ConsumptionRecord[];
    recentRecords: ConsumptionRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin/dashboard' }];

export default function AdminDashboard({
    stats,
    daily,
    pendingRecords,
    recentRecords,
}: Props) {
    const t = useT();
    const currency = useCurrency();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Admin Dashboard')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Facility overview')}
                    description={
                        stats.pending > 0
                            ? t(':count readings waiting for your approval.', {
                                  count: stats.pending,
                              })
                            : t('All readings reviewed — nothing waiting on you.')
                    }
                    actions={
                        <Button asChild>
                            <Link href="/admin/consumptions?status=pending" prefetch>
                                <CheckSquare className="size-4" />
                                {t('Review queue')}
                            </Link>
                        </Button>
                    }
                />

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        label={t('Pending approval')}
                        value={stats.pending}
                        icon={Clock3}
                        tone={stats.pending > 0 ? 'pending' : 'default'}
                        hint={t(':count readings in total', { count: stats.records })}
                    />
                    <StatCard
                        label={t('Electricity this month')}
                        value={formatNumber(stats.monthConsumptionElectricity)}
                        unit="kWh"
                        icon={Zap}
                        tone="electricity"
                    />
                    <StatCard
                        label={t('Water this month')}
                        value={formatNumber(stats.monthConsumptionWater)}
                        unit="m³"
                        icon={Droplets}
                        tone="water"
                    />
                    <StatCard
                        label={t('Billed this month')}
                        value={formatNumber(stats.monthAmount)}
                        unit={currency}
                        icon={Wallet}
                        tone="success"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        label={t('Meters')}
                        value={stats.meters}
                        icon={Gauge}
                        hint={`${stats.electricityMeters} ${t('electricity')} · ${stats.waterMeters} ${t('water')}`}
                    />
                    <StatCard label={t('Tariff periods')} value={stats.periods} icon={Clock3} />
                    <StatCard label={t('Technicians')} value={stats.technicians} icon={Users} />
                    <StatCard label={t('Accounts')} value={stats.users} icon={Users} />
                </div>

                {/* Approval queue */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{t('Waiting for approval')}</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/consumptions?status=pending" prefetch>
                                {t('View all')}
                            </Link>
                        </Button>
                    </div>

                    {pendingRecords.length === 0 ? (
                        <EmptyState
                            icon={CheckCircle2}
                            title={t('Queue is clear')}
                            description={t('New readings from technicians will appear here for review.')}
                        />
                    ) : (
                        <div className="grid gap-3 lg:grid-cols-2">
                            {pendingRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/8 via-card to-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/consumptions/${record.id}`}
                                                className="truncate font-medium hover:underline"
                                                prefetch
                                            >
                                                {record.meter?.name}
                                            </Link>
                                            <UtilityBadge
                                                type={record.meter?.type ?? 'electricity'}
                                            />
                                        </div>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            <span className="figure font-medium text-foreground">
                                                +{formatNumber(record.calculated_value)}{' '}
                                                {record.meter?.unit}
                                            </span>{' '}
                                            · {record.user?.name} ·{' '}
                                            {formatDate(record.reading_date)}
                                        </p>
                                    </div>
                                    <ApprovalActions record={record} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 30-day trends */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <section className="rounded-xl border border-t-2 border-t-electricity/70 bg-card p-4 shadow-xs sm:p-5">
                        <div className="mb-2 flex items-center gap-2">
                            <Zap className="size-4 text-electricity" />
                            <h2 className="font-semibold">
                                {t('Electricity — last 30 days (kWh)')}
                            </h2>
                        </div>
                        <UtilityTrendChart data={daily} type="electricity" />
                    </section>
                    <section className="rounded-xl border border-t-2 border-t-water/70 bg-card p-4 shadow-xs sm:p-5">
                        <div className="mb-2 flex items-center gap-2">
                            <Droplets className="size-4 text-water" />
                            <h2 className="font-semibold">{t('Water — last 30 days (m³)')}</h2>
                        </div>
                        <UtilityTrendChart data={daily} type="water" />
                    </section>
                </div>

                {/* Recent activity */}
                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{t('Recent readings')}</h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/consumptions" prefetch>
                                {t('View all')}
                            </Link>
                        </Button>
                    </div>
                    <RecordsTable
                        records={recentRecords}
                        showTechnician
                        linkFor={(r) => `/admin/consumptions/${r.id}`}
                    />
                </section>
            </div>
        </AppLayout>
    );
}
