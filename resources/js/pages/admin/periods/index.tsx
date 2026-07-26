import { EmptyState } from '@/components/eco/empty-state';
import { PageHeader } from '@/components/eco/page-header';
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
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/i18n';
import { formatNumber, useCurrency } from '@/lib/format';
import { type BreadcrumbItem, type Period } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, Pencil, PlusCircle, Trash2 } from 'lucide-react';

interface Props {
    periods: Period[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Tariff periods', href: '/admin/periods' },
];

export default function PeriodsIndex({ periods }: Props) {
    const t = useT();
    const currency = useCurrency();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Tariff periods')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title="Tariff periods"
                    description={t('Electricity is billed by time-of-day windows; water has one flat daily tariff.')}
                    actions={
                        <Button asChild>
                            <Link href="/admin/periods/create" prefetch>
                                <PlusCircle className="size-4" />
                                {t('Add period')}
                            </Link>
                        </Button>
                    }
                />

                {periods.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title={t('No tariff periods')}
                        description={t('Create at least one period so readings can be priced.')}
                        action={
                            <Button asChild>
                                <Link href="/admin/periods/create">
                                    <PlusCircle className="size-4" />
                                    {t('Add period')}
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {periods.map((period) => (
                            <div
                                key={period.id}
                                className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-xs"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="font-semibold">
                                            {period.name}
                                        </h2>
                                        <p className="figure mt-0.5 text-sm text-muted-foreground">
                                            {period.start_time?.slice(0, 5)} –{' '}
                                            {period.end_time?.slice(0, 5)}
                                        </p>
                                    </div>
                                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                                        <Clock className="size-4" />
                                    </span>
                                </div>

                                <p className="figure text-2xl font-semibold">
                                    {formatNumber(period.unit_price)}
                                    <span className="ml-1 text-sm font-normal text-muted-foreground">
                                        {currency} / unit
                                    </span>
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    {period.consumption_records_count ?? 0}{' '}
                                    readings priced with this period
                                </p>

                                <div className="mt-auto flex items-center gap-1.5 border-t pt-3">
                                    <Button size="sm" variant="outline" asChild>
                                        <Link
                                            href={`/admin/periods/${period.id}/edit`}
                                            prefetch
                                        >
                                            <Pencil className="size-4" />
                                            {t('Edit')}
                                        </Link>
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="size-4" />
                                                {t('Delete')}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    {t('Delete “:name”?', { name: period.name })}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {period.consumption_records_count
                                                        ? t('This period is used by existing readings and cannot be deleted.')
                                                        : t('This period has no readings and will be removed permanently.')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-destructive text-white hover:bg-destructive/90"
                                                    onClick={() =>
                                                        router.delete(
                                                            `/admin/periods/${period.id}`,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {t('Delete period')}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
