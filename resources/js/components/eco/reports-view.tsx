import {
    MeterBreakdownChart,
    UtilityTrendChart,
    type MeterSlice,
} from '@/components/eco/charts';
import { EmptyState } from '@/components/eco/empty-state';
import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import InertiaPagination from '@/components/inertia-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFilters } from '@/hooks/use-filters';
import AppLayout from '@/layouts/app-layout';
import { formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type DailyPoint,
    type MeterType,
    type Paginated,
    type Period,
    type SharedData,
} from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Droplets,
    Download,
    ReceiptText,
    Wallet,
    Zap,
} from 'lucide-react';

export interface ReportsProps {
    records: Paginated<ConsumptionRecord>;
    filters: {
        type?: string;
        meter_id?: string;
        period_id?: string;
        date?: string;
        range_start?: string;
        range_end?: string;
    };
    totals: { consumption: number; amount: number; count: number };
    byType: { type: MeterType; consumption: number; amount: number; count: number }[];
    daily: DailyPoint[];
    byMeter: (MeterSlice & { count: number })[];
    meters: { id: number; name: string; type: MeterType }[];
    periods: Period[];
}

/** Reports screen shared by the viewer and admin roles. */
export function ReportsView({
    baseUrl,
    breadcrumbs,
    showTechnician = false,
    ...props
}: ReportsProps & {
    baseUrl: string;
    breadcrumbs: BreadcrumbItem[];
    showTechnician?: boolean;
}) {
    const t = useT();
    const currency = useCurrency();
    const { auth } = usePage<SharedData>().props;
    const { records, filters, totals, byType, daily, byMeter, meters, periods } = props;

    const { values, set } = useFilters(baseUrl, {
        date: filters.date ?? 'all',
        range_start: filters.range_start ?? '',
        range_end: filters.range_end ?? '',
        type: filters.type ?? 'all',
        meter_id: filters.meter_id ?? 'all',
        period_id: filters.period_id ?? 'all',
    });

    const electricity = byType.find((entry) => entry.type === 'electricity');
    const water = byType.find((entry) => entry.type === 'water');

    const exportQuery = new URLSearchParams(
        Object.entries(values).filter(([, v]) => v !== '' && v !== 'all'),
    ).toString();

    // Exporting billing data is an admin-only capability.
    const canExport = auth.user.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Reports')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Reports')}
                    description={t('Approved readings only — the numbers you can bill against.')}
                    actions={
                        canExport ? (
                            <Button variant="outline" asChild>
                                <a
                                    href={`${baseUrl}/export${exportQuery ? `?${exportQuery}` : ''}`}
                                >
                                    <Download className="size-4" />
                                    {t('Export Excel')}
                                </a>
                            </Button>
                        ) : undefined
                    }
                />

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2 rounded-xl border bg-card p-3 shadow-xs sm:grid-cols-3 lg:grid-cols-6">
                    <Select value={values.date} onValueChange={(v) => set('date', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Time range')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All time')}</SelectItem>
                            <SelectItem value="day">{t('Today')}</SelectItem>
                            <SelectItem value="week">{t('This week')}</SelectItem>
                            <SelectItem value="month">{t('This month')}</SelectItem>
                            <SelectItem value="year">{t('This year')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={values.type} onValueChange={(v) => set('type', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Utility')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All utilities')}</SelectItem>
                            <SelectItem value="electricity">{t('Electricity')}</SelectItem>
                            <SelectItem value="water">{t('Water')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={values.meter_id} onValueChange={(v) => set('meter_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Meter')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All meters')}</SelectItem>
                            {meters.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={values.period_id} onValueChange={(v) => set('period_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('Period')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All periods')}</SelectItem>
                            {periods.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        aria-label={t('From date')}
                        value={values.range_start}
                        onChange={(e) => set('range_start', e.target.value)}
                    />
                    <Input
                        type="date"
                        aria-label={t('To date')}
                        value={values.range_end}
                        onChange={(e) => set('range_end', e.target.value)}
                    />
                </div>

                {/* Totals */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <StatTile
                        label={t('Electricity')}
                        value={formatNumber(electricity?.consumption ?? 0)}
                        unit="kWh"
                        tone="electricity"
                    />
                    <StatTile
                        label={t('Water')}
                        value={formatNumber(water?.consumption ?? 0)}
                        unit="m³"
                        tone="water"
                    />
                    <StatTile
                        label={t('Total cost')}
                        value={formatNumber(totals.amount)}
                        unit={currency}
                        tone="success"
                    />
                    <StatTile label={t('Readings')} value={String(totals.count)} tone="default" />
                </div>

                {totals.count === 0 ? (
                    <EmptyState
                        icon={BarChart3}
                        title={t('Nothing to report')}
                        description={t('No approved readings match these filters.')}
                    />
                ) : (
                    <>
                        {/* Trends */}
                        <div className="grid gap-4 lg:grid-cols-2">
                            {values.type !== 'water' && (
                                <section className="rounded-xl border border-t-2 border-t-electricity/70 bg-card p-4 shadow-xs sm:p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Zap className="size-4 text-electricity" />
                                        <h2 className="font-semibold">
                                            {t('Electricity')} (kWh)
                                        </h2>
                                    </div>
                                    <UtilityTrendChart data={daily} type="electricity" />
                                </section>
                            )}
                            {values.type !== 'electricity' && (
                                <section className="rounded-xl border border-t-2 border-t-water/70 bg-card p-4 shadow-xs sm:p-5">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Droplets className="size-4 text-water" />
                                        <h2 className="font-semibold">{t('Water')} (m³)</h2>
                                    </div>
                                    <UtilityTrendChart data={daily} type="water" />
                                </section>
                            )}
                        </div>

                        {/* Per-meter breakdown */}
                        <section className="rounded-xl border border-t-2 border-t-primary/70 bg-card p-4 shadow-xs sm:p-5">
                            <h2 className="mb-1 font-semibold">{t('Cost by meter')}</h2>
                            <p className="mb-3 text-xs text-muted-foreground">
                                {t('Top :top of :total meters, by billed amount (:currency).', {
                                    top: Math.min(10, byMeter.length),
                                    total: byMeter.length,
                                    currency,
                                })}
                            </p>
                            <MeterBreakdownChart data={byMeter} dataKey="amount" unit={currency} />
                        </section>

                        {/* Records */}
                        <section className="flex flex-col gap-3">
                            <h2 className="text-lg font-semibold">{t('Matching readings')}</h2>
                            <RecordsTable
                                records={records.data}
                                showStatus={false}
                                showTechnician={showTechnician}
                                sortable
                                storageKey={showTechnician ? 'admin-reports' : 'user-reports'}
                            />
                            <InertiaPagination data={records} />
                        </section>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

const tileTones = {
    default: 'bg-card',
    electricity:
        'border-electricity/25 bg-gradient-to-br from-electricity/12 via-card to-card',
    water: 'border-water/25 bg-gradient-to-br from-water/12 via-card to-card',
    success: 'border-primary/25 bg-gradient-to-br from-primary/12 via-card to-card',
} as const;

const tileIcons = {
    default: ReceiptText,
    electricity: Zap,
    water: Droplets,
    success: Wallet,
} as const;

const tileValueTones = {
    default: 'text-foreground',
    electricity: 'text-electricity',
    water: 'text-water',
    success: 'text-primary',
} as const;

function StatTile({
    label,
    value,
    unit,
    tone,
}: {
    label: string;
    value: string;
    unit?: string;
    tone: keyof typeof tileTones;
}) {
    const Icon = tileIcons[tone];

    return (
        <div className={`rounded-xl border p-4 shadow-xs ${tileTones[tone]}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <Icon className={`size-4.5 ${tileValueTones[tone]}`} />
            </div>
            <p className={`figure mt-2 text-2xl font-semibold sm:text-3xl ${tileValueTones[tone]}`}>
                {value}
                {unit && (
                    <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                        {unit}
                    </span>
                )}
            </p>
        </div>
    );
}
