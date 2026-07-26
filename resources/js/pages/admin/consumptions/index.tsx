import { ApprovalActions } from '@/components/eco/approval-actions';
import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import { UtilityTabs } from '@/components/eco/utility-tabs';
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
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type MeterType,
    type Paginated,
    type Period,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Download, Eye, Search } from 'lucide-react';

interface Props {
    records: Paginated<ConsumptionRecord>;
    filters: {
        search?: string;
        status?: string;
        meter_id?: string;
        period_id?: string;
        type?: string;
    };
    statusCounts: { all: number; pending: number; approved: number; rejected: number };
    meters: { id: number; name: string; type: MeterType }[];
    periods: Period[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Approvals', href: '/admin/consumptions' },
];

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
] as const;

export default function AdminConsumptions({
    records,
    filters,
    statusCounts,
    meters,
    periods,
}: Props) {
    const t = useT();

    const { values, set, setMany } = useFilters('/admin/consumptions', {
        type: filters.type ?? 'electricity',
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        meter_id: filters.meter_id ?? 'all',
        period_id: filters.period_id ?? 'all',
    });

    const exportQuery = new URLSearchParams(
        Object.entries(values).filter(([, v]) => v !== '' && v !== 'all'),
    ).toString();

    const switchUtility = (type: MeterType) => {
        // Meter/period filters belong to one utility — reset them on switch.
        setMany({ type, meter_id: 'all', period_id: 'all' } as Partial<typeof values>);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Approvals')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Readings & approvals')}
                    description={t('Review technician readings — approved values become billing history.')}
                    actions={
                        <Button variant="outline" asChild>
                            <a
                                href={`/admin/consumptions/export${exportQuery ? `?${exportQuery}` : ''}`}
                            >
                                <Download className="size-4" />
                                {t('Export Excel')}
                            </a>
                        </Button>
                    }
                />

                {/* Electricity / water are separate pages */}
                <UtilityTabs value={values.type} onChange={switchUtility} />

                {/* Status tabs */}
                <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1 sm:w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => set('status', tab.key)}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                values.status === tab.key
                                    ? 'bg-card text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {t(tab.label)}
                            <span className="figure ml-1.5 text-xs text-muted-foreground">
                                {statusCounts[tab.key]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-2 lg:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={values.search}
                            onChange={(e) => set('search', e.target.value, { debounce: true })}
                            placeholder={t('Search meter, serial or technician…')}
                            className="pl-8"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
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
                    </div>
                </div>

                <RecordsTable
                    records={records.data}
                    showTechnician
                    sortable
                    storageKey="admin-consumptions"
                    linkFor={(r) => `/admin/consumptions/${r.id}`}
                    actions={(record) => (
                        <>
                            {record.status === 'pending' ? (
                                <ApprovalActions record={record} />
                            ) : (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    asChild
                                    aria-label={t('View reading')}
                                >
                                    <Link href={`/admin/consumptions/${record.id}`} prefetch>
                                        <Eye className="size-4" />
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}
                />

                <InertiaPagination data={records} />
            </div>
        </AppLayout>
    );
}
