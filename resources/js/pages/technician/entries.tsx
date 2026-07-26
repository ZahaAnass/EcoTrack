import { PageHeader } from '@/components/eco/page-header';
import { RecordsTable } from '@/components/eco/records-table';
import { UtilityTabs } from '@/components/eco/utility-tabs';
import InertiaPagination from '@/components/inertia-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';

interface Props {
    records: Paginated<ConsumptionRecord>;
    filters: { search?: string; status?: string; period_id?: string; type?: string };
    periods: Period[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/technician/dashboard' },
    { title: 'My entries', href: '/technician/consumptions' },
];

export default function MyEntries({ records, filters, periods }: Props) {
    const t = useT();

    const { values, set, setMany } = useFilters('/technician/consumptions', {
        type: filters.type ?? 'electricity',
        search: filters.search ?? '',
        status: filters.status ?? 'all',
        period_id: filters.period_id ?? 'all',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('My entries')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('My entries')}
                    description={t('Everything you have recorded. Pending and rejected readings can still be edited.')}
                    actions={
                        <Button asChild>
                            <Link href="/technician/consumptions/create" prefetch>
                                <PlusCircle className="size-4" />
                                {t('New reading')}
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

                {/* Filters */}
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
                    <Select value={values.status} onValueChange={(v) => set('status', v)}>
                        <SelectTrigger className="sm:w-40">
                            <SelectValue placeholder={t('Status')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All statuses')}</SelectItem>
                            <SelectItem value="pending">{t('Pending')}</SelectItem>
                            <SelectItem value="approved">{t('Approved')}</SelectItem>
                            <SelectItem value="rejected">{t('Rejected')}</SelectItem>
                        </SelectContent>
                    </Select>
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
                    sortable
                    storageKey="technician-entries"
                    actions={(record) =>
                        record.status !== 'approved' ? (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    asChild
                                    aria-label={t('Edit reading')}
                                >
                                    <Link
                                        href={`/technician/consumptions/${record.id}/edit`}
                                        prefetch
                                    >
                                        <Pencil className="size-4" />
                                    </Link>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive"
                                            aria-label={t('Delete reading')}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {t('Delete this reading?')}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {record.meter?.name} — {record.current_value}{' '}
                                                {record.meter?.unit}.{' '}
                                                {t('This cannot be undone.')}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                onClick={() =>
                                                    router.delete(
                                                        `/technician/consumptions/${record.id}`,
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            >
                                                {t('Delete reading')}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : null
                    }
                />

                <InertiaPagination data={records} />
            </div>
        </AppLayout>
    );
}
