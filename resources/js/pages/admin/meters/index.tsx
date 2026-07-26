import {
    ColumnsMenu,
    SortableHead,
    useColumnVisibility,
    useSort,
} from '@/components/eco/data-table';
import { EmptyState } from '@/components/eco/empty-state';
import { PageHeader } from '@/components/eco/page-header';
import { UtilityBadge } from '@/components/eco/utility-badge';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFilters } from '@/hooks/use-filters';
import { useT } from '@/lib/i18n';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Meter, type Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Gauge, Pencil, PlusCircle, Search, Trash2 } from 'lucide-react';

interface Props {
    meters: Paginated<Meter>;
    filters: { search?: string; type?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Meters', href: '/admin/meters' },
];

function MeterActions({ meter }: { meter: Meter }) {
    const t = useT();
    return (
        <div className="flex items-center justify-end gap-1.5">
            <Button size="icon" variant="ghost" asChild aria-label={t('Edit meter')}>
                <Link href={`/admin/meters/${meter.id}/edit`} prefetch>
                    <Pencil className="size-4" />
                </Link>
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        aria-label={t('Delete meter')}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('Delete “:name”?', { name: meter.name })}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {meter.consumption_records_count
                                ? t('This meter has :count readings — deletion will be refused. Set it to inactive instead.', { count: meter.consumption_records_count })
                                : t('The meter has no readings and will be removed permanently.')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() =>
                                router.delete(`/admin/meters/${meter.id}`, {
                                    preserveScroll: true,
                                })
                            }
                        >
                            {t('Delete meter')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

const METER_COLUMNS = [
    { key: 'serial', label: 'Serial' },
    { key: 'utility', label: 'Utility' },
    { key: 'location', label: 'Location' },
    { key: 'readings', label: 'Readings' },
    { key: 'status', label: 'Status' },
];

export default function MetersIndex({ meters, filters }: Props) {
    const t = useT();
    const sort = useSort();
    const visibility = useColumnVisibility('admin-meters');

    const { values, set } = useFilters('/admin/meters', {
        search: filters.search ?? '',
        type: filters.type ?? 'all',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Meters')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title="Meters"
                    description={t('The physical electricity and water meters technicians read.')}
                    actions={
                        <Button asChild>
                            <Link href="/admin/meters/create" prefetch>
                                <PlusCircle className="size-4" />
                                {t('Add meter')}
                            </Link>
                        </Button>
                    }
                />

                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={values.search}
                            onChange={(e) =>
                                set('search', e.target.value, {
                                    debounce: true,
                                })
                            }
                            placeholder={t('Search by name, serial or location…')}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        value={values.type}
                        onValueChange={(v) => set('type', v)}
                    >
                        <SelectTrigger className="sm:w-44">
                            <SelectValue placeholder="Utility" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('All utilities')}</SelectItem>
                            <SelectItem value="electricity">{t('Electricity')}</SelectItem>
                            <SelectItem value="water">{t('Water')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {meters.data.length === 0 ? (
                    <EmptyState
                        icon={Gauge}
                        title={t('No meters found')}
                        description={t('Add your first meter so technicians can start recording readings.')}
                        action={
                            <Button asChild>
                                <Link href="/admin/meters/create">
                                    <PlusCircle className="size-4" />
                                    {t('Add meter')}
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <ColumnsMenu
                            columns={METER_COLUMNS}
                            visibility={visibility}
                        />

                        {/* Desktop */}
                        <div className="hidden overflow-x-auto rounded-xl border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <SortableHead
                                            sortKey="name"
                                            label="Meter"
                                            sort={sort}
                                        />
                                        {visibility.isVisible('serial') && (
                                            <SortableHead
                                                sortKey="serial"
                                                label="Serial"
                                                sort={sort}
                                            />
                                        )}
                                        {visibility.isVisible('utility') && (
                                            <SortableHead
                                                sortKey="type"
                                                label="Utility"
                                                sort={sort}
                                            />
                                        )}
                                        {visibility.isVisible('location') && (
                                            <SortableHead
                                                sortKey="location"
                                                label="Location"
                                                sort={sort}
                                            />
                                        )}
                                        {visibility.isVisible('readings') && (
                                            <SortableHead
                                                sortKey="readings"
                                                label={t('Readings')}
                                                sort={sort}
                                                descFirst
                                                className="text-right"
                                            />
                                        )}
                                        {visibility.isVisible('status') && (
                                            <SortableHead
                                                sortKey="status"
                                                label="Status"
                                                sort={sort}
                                            />
                                        )}
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {meters.data.map((meter) => (
                                        <TableRow key={meter.id}>
                                            <TableCell className="font-medium">
                                                {meter.name}
                                            </TableCell>
                                            {visibility.isVisible('serial') && (
                                                <TableCell className="figure text-muted-foreground">
                                                    {meter.serial_number ?? '—'}
                                                </TableCell>
                                            )}
                                            {visibility.isVisible(
                                                'utility',
                                            ) && (
                                                <TableCell>
                                                    <UtilityBadge
                                                        type={meter.type}
                                                    />
                                                </TableCell>
                                            )}
                                            {visibility.isVisible(
                                                'location',
                                            ) && (
                                                <TableCell className="text-muted-foreground">
                                                    {meter.location ?? '—'}
                                                </TableCell>
                                            )}
                                            {visibility.isVisible(
                                                'readings',
                                            ) && (
                                                <TableCell className="figure text-right">
                                                    {meter.consumption_records_count ??
                                                        0}
                                                </TableCell>
                                            )}
                                            {visibility.isVisible('status') && (
                                                <TableCell>
                                                    <span
                                                        className={cn(
                                                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                            meter.status ===
                                                                'active'
                                                                ? 'bg-primary/12 text-primary'
                                                                : 'bg-muted text-muted-foreground',
                                                        )}
                                                    >
                                                        {meter.status ===
                                                        'active'
                                                            ? t('Active')
                                                            : t('Inactive')}
                                                    </span>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <MeterActions meter={meter} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {meters.data.map((meter) => (
                                <div
                                    key={meter.id}
                                    className="rounded-xl border bg-card p-4 shadow-xs"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {meter.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {meter.serial_number ??
                                                    t('No serial')}{' '}
                                                ·{' '}
                                                {meter.location ??
                                                    t('No location')}{' '}
                                                ·{' '}
                                                {meter.consumption_records_count ??
                                                    0}{' '}
                                                {t('readings')}
                                            </p>
                                        </div>
                                        <UtilityBadge type={meter.type} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span
                                            className={cn(
                                                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                                meter.status === 'active'
                                                    ? 'bg-primary/12 text-primary'
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {meter.status === 'active'
                                                ? t('Active')
                                                : t('Inactive')}
                                        </span>
                                        <MeterActions meter={meter} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <InertiaPagination data={meters} />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
