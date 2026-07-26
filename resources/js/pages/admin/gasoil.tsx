import { PageHeader } from '@/components/eco/page-header';
import InertiaPagination from '@/components/inertia-pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
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
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatNumber } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Paginated } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowDownToLine,
    BellRing,
    CalendarClock,
    Download,
    Check,
    Flame,
    Fuel,
    LoaderCircle,
    Trash2,
    TriangleAlert,
    X,
} from 'lucide-react';
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface GasoilTransaction {
    id: number;
    type: 'import' | 'consumption';
    quantity_liters: number;
    entry_date: string;
    note: string | null;
    status: 'approved' | 'pending' | 'rejected';
    user?: { id: number; name: string } | null;
    approver?: { id: number; name: string } | null;
}

interface Props {
    stock: number;
    threshold: number;
    alertMode: 'liters' | 'percent';
    alertValue: number;
    litersPerTon: number;
    forecast: {
        avgDaily: number;
        daysLeft: number | null;
        emptyDate: string | null;
        peakDay: { date: string; liters: number } | null;
    };
    totals: {
        imported: number;
        consumed: number;
        consumedThisMonth: number;
        pending: number;
    };
    daily: { date: string; liters: number }[];
    transactions: Paginated<GasoilTransaction>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Gasoil', href: '/admin/gasoil' },
];

function ImportDialog({ litersPerTon }: { litersPerTon: number }) {
    const t = useT();
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: '',
        unit: 'liters',
        entry_date: new Date().toISOString().slice(0, 10),
        note: '',
    });

    const liters =
        data.unit === 'tons'
            ? (parseFloat(data.quantity) || 0) * litersPerTon
            : parseFloat(data.quantity) || 0;

    const submit = () => {
        post('/admin/gasoil/import', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <ArrowDownToLine className="size-4" />
                    {t('Add import')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('Record a gasoil delivery')}</DialogTitle>
                    <DialogDescription>
                        {t('The quantity is added to the tank immediately.')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-[1fr_130px] gap-2">
                        <div className="grid gap-2">
                            <Label htmlFor="import-qty">{t('Quantity')}</Label>
                            <Input
                                id="import-qty"
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                className="figure text-lg"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.quantity} />
                        </div>
                        <div className="grid gap-2">
                            <Label>{t('Unit')}</Label>
                            <Select value={data.unit} onValueChange={(v) => setData('unit', v)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="liters">{t('liters (L)')}</SelectItem>
                                    <SelectItem value="tons">{t('tons (t)')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {data.unit === 'tons' && liters > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {t('≈ :liters L (1 t ≈ :perTon L of diesel)', {
                                liters: formatNumber(liters),
                                perTon: formatNumber(litersPerTon, 0),
                            })}
                        </p>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="import-date">{t('Date')}</Label>
                        <Input
                            id="import-date"
                            type="date"
                            value={data.entry_date}
                            onChange={(e) => setData('entry_date', e.target.value)}
                        />
                        <InputError message={errors.entry_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="import-note">{t('Note (optional)')}</Label>
                        <Input
                            id="import-note"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder={t('e.g. Delivery — 4 t truck')}
                            maxLength={255}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {t('Add to stock')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ConsumptionDialog({ stock }: { stock: number }) {
    const t = useT();
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: '',
        entry_date: new Date().toISOString().slice(0, 10),
        note: '',
    });

    const submit = () => {
        post('/admin/gasoil/consumption', {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Flame className="size-4" />
                    {t('Add consumption')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Record a day's consumption")}</DialogTitle>
                    <DialogDescription>
                        {t('It is deducted from the tank once approved. :stock L currently in stock.', {
                            stock: formatNumber(stock),
                        })}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cons-qty">{t('Quantity')} (L)</Label>
                        <Input
                            id="cons-qty"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            className="figure text-lg"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', e.target.value)}
                            placeholder="0.00"
                        />
                        <InputError message={errors.quantity} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cons-date">{t('Date')}</Label>
                        <Input
                            id="cons-date"
                            type="date"
                            value={data.entry_date}
                            onChange={(e) => setData('entry_date', e.target.value)}
                        />
                        <InputError message={errors.entry_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cons-note">{t('Note (optional)')}</Label>
                        <Input
                            id="cons-note"
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            placeholder={t('e.g. Generator — night shift')}
                            maxLength={255}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {t('Record consumption')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AlertSettingsDialog({
    mode,
    value,
    threshold,
}: {
    mode: 'liters' | 'percent';
    value: number;
    threshold: number;
}) {
    const t = useT();
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        mode,
        value: String(value),
    });

    const submit = () => {
        post('/admin/gasoil/settings', {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('Alert settings')}>
                    <BellRing className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('Alert settings')}</DialogTitle>
                    <DialogDescription>
                        {t('Admins are notified when the stock crosses below this level. Current level: :threshold L.', {
                            threshold: formatNumber(threshold),
                        })}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>{t('Alert me when stock falls below')}</Label>
                        <div className="grid grid-cols-[1fr_170px] gap-2">
                            <Input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="1"
                                className="figure text-lg"
                                value={data.value}
                                onChange={(e) => setData('value', e.target.value)}
                            />
                            <Select
                                value={data.mode}
                                onValueChange={(v) =>
                                    setData('mode', v as 'liters' | 'percent')
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="liters">{t('liters (L)')}</SelectItem>
                                    <SelectItem value="percent">
                                        {t('% of total imports')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <InputError message={errors.value ?? errors.mode} />
                        {data.mode === 'percent' && (
                            <p className="text-xs text-muted-foreground">
                                {t('The level follows your deliveries — 10% of everything imported so far.')}
                            </p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        {t('Cancel')}
                    </Button>
                    <Button onClick={submit} disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {t('Save alert level')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Gasoil({
    stock,
    threshold,
    alertMode,
    alertValue,
    litersPerTon,
    forecast,
    totals,
    daily,
    transactions,
}: Props) {
    const t = useT();

    const isLow = stock <= threshold;
    // Gauge relative to everything ever imported — a simple, honest scale.
    const gaugePercent =
        totals.imported > 0 ? Math.max(0, Math.min(100, (stock / totals.imported) * 100)) : 0;

    const statusChip = (status: GasoilTransaction['status']) => (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                status === 'approved' && 'bg-primary/12 text-primary',
                status === 'pending' &&
                    'bg-amber-500/12 text-amber-700 dark:text-amber-400',
                status === 'rejected' && 'bg-destructive/12 text-destructive',
            )}
        >
            {status === 'approved' ? t('Approved') : status === 'pending' ? t('Pending') : t('Rejected')}
        </span>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Gasoil')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Gasoil stock')}
                    description={t('Deliveries in, daily consumption out — the tank in real time.')}
                    actions={
                        <>
                            <AlertSettingsDialog
                                mode={alertMode}
                                value={alertValue}
                                threshold={threshold}
                            />
                            <ConsumptionDialog stock={stock} />
                            <ImportDialog litersPerTon={litersPerTon} />
                        </>
                    }
                />

                {isLow && (
                    <Alert variant="destructive">
                        <TriangleAlert className="size-4" />
                        <AlertTitle>{t('Low stock')}</AlertTitle>
                        <AlertDescription>
                            {t('Only :stock L left in the tank (alert level: :threshold L). Plan a delivery.', {
                                stock: formatNumber(stock),
                                threshold: formatNumber(threshold, 0),
                            })}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Tank + stats */}
                <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
                    {/* Tank gauge */}
                    <div
                        className={cn(
                            'flex flex-col gap-4 rounded-xl border p-6 shadow-xs',
                            isLow
                                ? 'border-destructive/30 bg-gradient-to-br from-destructive/10 via-card to-card'
                                : 'border-gasoil/30 bg-gradient-to-br from-gasoil/12 via-card to-card',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className={cn(
                                    'flex size-10 items-center justify-center rounded-xl',
                                    isLow
                                        ? 'bg-destructive/15 text-destructive'
                                        : 'bg-gasoil/15 text-gasoil',
                                )}
                            >
                                <Fuel className="size-5" />
                            </span>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('Current stock')}
                                </p>
                                <p
                                    className={cn(
                                        'figure text-3xl font-semibold',
                                        isLow ? 'text-destructive' : 'text-gasoil',
                                    )}
                                >
                                    {formatNumber(stock)}
                                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                                        L
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ≈ {formatNumber(stock / litersPerTon)} t
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="h-3 overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn(
                                        'h-full rounded-full transition-all',
                                        isLow ? 'bg-destructive' : 'bg-gasoil',
                                    )}
                                    style={{ width: `${gaugePercent}%` }}
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                {t(':percent% of all-time imports still in the tank · alert at :threshold L', {
                                    percent: formatNumber(gaugePercent, 0),
                                    threshold: formatNumber(threshold, 0),
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border bg-card p-4 shadow-xs">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('Imported (total)')}
                            </p>
                            <p className="figure mt-2 text-2xl font-semibold">
                                {formatNumber(totals.imported)}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">
                                    L
                                </span>
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4 shadow-xs">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('Consumed (total)')}
                            </p>
                            <p className="figure mt-2 text-2xl font-semibold">
                                {formatNumber(totals.consumed)}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">
                                    L
                                </span>
                            </p>
                        </div>
                        <div className="rounded-xl border bg-card p-4 shadow-xs">
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('Consumed this month')}
                            </p>
                            <p className="figure mt-2 text-2xl font-semibold">
                                {formatNumber(totals.consumedThisMonth)}
                                <span className="ml-1 text-sm font-normal text-muted-foreground">
                                    L
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 30-day burn chart */}
                <section className="rounded-xl border border-t-2 border-t-gasoil/70 bg-card p-4 shadow-xs sm:p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <Flame className="size-4 text-gasoil" />
                        <h2 className="font-semibold">{t('Gasoil — last 30 days (L)')}</h2>
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={daily}
                                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="fill-gasoil" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="0%"
                                            stopColor="var(--gasoil)"
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--gasoil)"
                                            stopOpacity={0.02}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(v: string) =>
                                        new Date(v).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                        })
                                    }
                                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={32}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={52}
                                    tickFormatter={(v: number) => formatNumber(v, 0)}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                                    contentStyle={{
                                        background: 'var(--popover)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        color: 'var(--popover-foreground)',
                                    }}
                                    formatter={(value: number) => [
                                        `${formatNumber(value)} L`,
                                        t('Consumption'),
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="liters"
                                    stroke="var(--gasoil)"
                                    strokeWidth={2}
                                    fill="url(#fill-gasoil)"
                                    dot={false}
                                    activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* History */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">{t('Movements')}</h2>

                    {/* Desktop */}
                    <div className="hidden overflow-x-auto rounded-xl border md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead>{t('Type')}</TableHead>
                                    <TableHead className="text-right">{t('Quantity')}</TableHead>
                                    <TableHead>{t('Date')}</TableHead>
                                    <TableHead>{t('Note')}</TableHead>
                                    <TableHead>{t('Recorded by')}</TableHead>
                                    <TableHead>{t('Status')}</TableHead>
                                    <TableHead className="text-right">{t('Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                                    tx.type === 'import'
                                                        ? 'bg-primary/12 text-primary'
                                                        : 'bg-gasoil/12 text-gasoil',
                                                )}
                                            >
                                                {tx.type === 'import' ? (
                                                    <ArrowDownToLine className="size-3" />
                                                ) : (
                                                    <Flame className="size-3" />
                                                )}
                                                {tx.type === 'import' ? t('Import') : t('Consumption')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="figure text-right font-medium">
                                            {tx.type === 'import' ? '+' : '−'}
                                            {formatNumber(tx.quantity_liters)}{' '}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                L
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground">
                                            {formatDate(tx.entry_date)}
                                        </TableCell>
                                        <TableCell className="max-w-48 truncate text-muted-foreground">
                                            {tx.note ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {tx.user?.name ?? '—'}
                                        </TableCell>
                                        <TableCell>{statusChip(tx.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1.5">
                                                {tx.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/admin/gasoil/${tx.id}/approve`,
                                                                    {},
                                                                    { preserveScroll: true },
                                                                )
                                                            }
                                                        >
                                                            <Check className="size-4" />
                                                            {t('Approve')}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                router.post(
                                                                    `/admin/gasoil/${tx.id}/reject`,
                                                                    {},
                                                                    { preserveScroll: true },
                                                                )
                                                            }
                                                        >
                                                            <X className="size-4" />
                                                            {t('Reject')}
                                                        </Button>
                                                    </>
                                                )}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive"
                                                            aria-label={t('Delete')}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                {t('Delete this entry?')}
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {t('The stock is recalculated without it. This cannot be undone.')}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                {t('Cancel')}
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                                onClick={() =>
                                                                    router.delete(
                                                                        `/admin/gasoil/${tx.id}`,
                                                                        { preserveScroll: true },
                                                                    )
                                                                }
                                                            >
                                                                {t('Delete')}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-3 md:hidden">
                        {transactions.data.map((tx) => (
                            <div key={tx.id} className="rounded-xl border bg-card p-4 shadow-xs">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="figure font-semibold">
                                            {tx.type === 'import' ? '+' : '−'}
                                            {formatNumber(tx.quantity_liters)} L
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(tx.entry_date)} · {tx.user?.name}
                                            {tx.note ? ` · ${tx.note}` : ''}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                            tx.type === 'import'
                                                ? 'bg-primary/12 text-primary'
                                                : 'bg-gasoil/12 text-gasoil',
                                        )}
                                    >
                                        {tx.type === 'import' ? t('Import') : t('Consumption')}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    {statusChip(tx.status)}
                                    {tx.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                router.post(
                                                    `/admin/gasoil/${tx.id}/approve`,
                                                    {},
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            <Check className="size-4" />
                                            {t('Approve')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <InertiaPagination data={transactions} />
                </section>
            </div>
        </AppLayout>
    );
}
