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
import {
    type BreadcrumbItem,
    type ConsumptionRecord,
    type MeterType,
    type Paginated,
    type Period,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Search } from 'lucide-react';

interface Props {
    records: Paginated<ConsumptionRecord>;
    filters: { search?: string; type?: string; period_id?: string };
    periods: Period[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/user/dashboard' },
    { title: 'History', href: '/user/consumptions' },
];

export default function History({ records, filters, periods }: Props) {
    const t = useT();

    const { values, set, setMany } = useFilters('/user/consumptions', {
        type: filters.type ?? 'electricity',
        search: filters.search ?? '',
        period_id: filters.period_id ?? 'all',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('History')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Reading history')}
                    description={t('All approved readings, newest first.')}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href="/user/reports" prefetch>
                                <BarChart3 className="size-4" />
                                {t('Open reports')}
                            </Link>
                        </Button>
                    }
                />

                <UtilityTabs
                    value={values.type}
                    onChange={(type: MeterType) =>
                        setMany({ type, period_id: 'all' } as Partial<typeof values>)
                    }
                />

                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={values.search}
                            onChange={(e) => set('search', e.target.value, { debounce: true })}
                            placeholder={t('Search by meter name or serial…')}
                            className="pl-8"
                        />
                    </div>
                    <Select value={values.period_id} onValueChange={(v) => set('period_id', v)}>
                        <SelectTrigger className="sm:w-44">
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

                <RecordsTable
                    records={records.data}
                    showStatus={false}
                    sortable
                    storageKey="user-history"
                    linkFor={(r) => `/user/consumptions/${r.id}`}
                />

                <InertiaPagination data={records} />
            </div>
        </AppLayout>
    );
}
