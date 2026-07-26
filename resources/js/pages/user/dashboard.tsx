import { UtilityTrendChart } from '@/components/eco/charts';
import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import { StatCard } from '@/components/eco/stat-card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type DailyPoint,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Droplets, Gauge, Wallet, Zap } from 'lucide-react';

interface Props {
    stats: {
        meters: number;
        monthElectricity: number;
        monthWater: number;
        monthAmount: number;
    };
    daily: DailyPoint[];
    recentEntries: ConsumptionRecord[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/user/dashboard' }];

export default function UserDashboard({ stats, daily, recentEntries }: Props) {
    const t = useT();
    const currency = useCurrency();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Dashboard')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Consumption overview')}
                    description={t('Validated readings across the facility, updated as admins approve them.')}
                />

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        label={t('Electricity this month')}
                        value={formatNumber(stats.monthElectricity)}
                        unit="kWh"
                        icon={Zap}
                        tone="electricity"
                    />
                    <StatCard
                        label={t('Water this month')}
                        value={formatNumber(stats.monthWater)}
                        unit="m³"
                        icon={Droplets}
                        tone="water"
                    />
                    <StatCard
                        label={t('Cost this month')}
                        value={formatNumber(stats.monthAmount)}
                        unit={currency}
                        icon={Wallet}
                        tone="success"
                    />
                    <StatCard label={t('Active meters')} value={stats.meters} icon={Gauge} />
                </div>

                {/* Two small multiples — different units never share an axis. */}
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

                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            {t('Recent approved readings')}
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/user/consumptions" prefetch>
                                {t('View history')}
                            </Link>
                        </Button>
                    </div>
                    <RecordsTable
                        records={recentEntries}
                        showStatus={false}
                        linkFor={(r) => `/user/consumptions/${r.id}`}
                        emptyTitle="Nothing approved yet"
                        emptyDescription="Approved readings will show up here as soon as an admin validates them."
                    />
                </section>
            </div>
        </AppLayout>
    );
}
