import {
    ColumnsMenu,
    SortableHead,
    useColumnVisibility,
    useSort,
} from '@/components/eco/data-table';
import { EmptyState } from '@/components/eco/empty-state';
import { StatusBadge } from '@/components/eco/status-badge';
import { UtilityBadge } from '@/components/eco/utility-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { type ConsumptionRecord } from '@/types';
import { Link } from '@inertiajs/react';
import { Gauge } from 'lucide-react';
import { type ReactNode } from 'react';

const COLUMN_LABELS = {
    period: 'Period',
    technician: 'Technician',
    reading: 'Reading',
    used: 'Used',
    amount: 'Amount',
    status: 'Status',
    date: 'Date',
} as const;

type ColumnKey = keyof typeof COLUMN_LABELS;

/** Columns whose natural first sort is highest/newest first. */
const DESC_FIRST: string[] = ['reading', 'used', 'amount', 'date'];

interface RecordsTableProps {
    records: ConsumptionRecord[];
    showTechnician?: boolean;
    showStatus?: boolean;
    /** Enables server-side sorting on the column headers. */
    sortable?: boolean;
    /** Shows the column picker and persists choices under this key. */
    storageKey?: string;
    /** Row-level actions (buttons / dropdowns), rendered at the row end. */
    actions?: (record: ConsumptionRecord) => ReactNode;
    /** When set, meter name links to the record detail. */
    linkFor?: (record: ConsumptionRecord) => string;
    emptyTitle?: string;
    emptyDescription?: string;
}

/**
 * The one consumption list used across all roles — a sortable, configurable
 * data table from `md` up, a card list below it.
 */
export function RecordsTable({
    records,
    showTechnician = false,
    showStatus = true,
    sortable = false,
    storageKey,
    actions,
    linkFor,
    emptyTitle = 'No readings found',
    emptyDescription = 'Try changing the filters, or check back later.',
}: RecordsTableProps) {
    const currency = useCurrency();
    const t = useT();
    const sort = useSort();
    const visibility = useColumnVisibility(storageKey ?? 'records');

    const show = (key: ColumnKey) => {
        if (key === 'technician' && !showTechnician) return false;
        if (key === 'status' && !showStatus) return false;
        return !storageKey || visibility.isVisible(key);
    };

    const menuColumns = (Object.keys(COLUMN_LABELS) as ColumnKey[])
        .filter((key) => (key === 'technician' ? showTechnician : true))
        .filter((key) => (key === 'status' ? showStatus : true))
        .map((key) => ({ key, label: t(COLUMN_LABELS[key]) }));

    const headerCell = (
        key: ColumnKey | 'meter',
        label: string,
        className?: string,
    ) =>
        sortable ? (
            <SortableHead
                key={key}
                sortKey={key}
                label={label}
                sort={sort}
                descFirst={DESC_FIRST.includes(key)}
                className={className}
            />
        ) : (
            <TableHead key={key} className={className}>
                {label}
            </TableHead>
        );

    const meterCell = (record: ConsumptionRecord) => {
        const content = (
            <span className="font-medium">{record.meter?.name ?? '—'}</span>
        );

        return linkFor ? (
            <Link href={linkFor(record)} className="hover:underline" prefetch>
                {content}
            </Link>
        ) : (
            content
        );
    };

    if (records.length === 0) {
        return (
            <EmptyState
                icon={Gauge}
                title={t(emptyTitle)}
                description={t(emptyDescription)}
            />
        );
    }

    return (
        <>
            {storageKey && (
                <ColumnsMenu columns={menuColumns} visibility={visibility} />
            )}

            {/* Desktop */}
            <div className="hidden overflow-x-auto rounded-xl border md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {headerCell('meter', t('Meter'))}
                            {show('period') && headerCell('period', t('Period'))}
                            {show('technician') &&
                                headerCell('technician', t('Technician'))}
                            {show('reading') &&
                                headerCell('reading', t('Reading'), 'text-right')}
                            {show('used') &&
                                headerCell('used', t('Used'), 'text-right')}
                            {show('amount') &&
                                headerCell('amount', t('Amount'), 'text-right')}
                            {show('status') && headerCell('status', t('Status'))}
                            {show('date') && headerCell('date', t('Date'))}
                            {actions && (
                                <TableHead className="text-right">{t('Actions')}</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        {meterCell(record)}
                                        <UtilityBadge
                                            type={
                                                record.meter?.type ??
                                                'electricity'
                                            }
                                            className="w-fit"
                                        />
                                    </div>
                                </TableCell>
                                {show('period') && (
                                    <TableCell className="text-muted-foreground">
                                        {record.period?.name ?? '—'}
                                    </TableCell>
                                )}
                                {show('technician') && (
                                    <TableCell className="text-muted-foreground">
                                        {record.user?.name ?? '—'}
                                    </TableCell>
                                )}
                                {show('reading') && (
                                    <TableCell className="figure text-right">
                                        {formatNumber(record.current_value)}
                                    </TableCell>
                                )}
                                {show('used') && (
                                    <TableCell className="figure text-right font-medium">
                                        {formatNumber(record.calculated_value)}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {record.meter?.unit}
                                        </span>
                                    </TableCell>
                                )}
                                {show('amount') && (
                                    <TableCell className="figure text-right font-medium">
                                        {formatNumber(record.total_amount)}{' '}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {currency}
                                        </span>
                                    </TableCell>
                                )}
                                {show('status') && (
                                    <TableCell>
                                        <StatusBadge status={record.status} />
                                    </TableCell>
                                )}
                                {show('date') && (
                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {formatDate(record.reading_date)}
                                    </TableCell>
                                )}
                                {actions && (
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {actions(record)}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-3 md:hidden">
                {records.map((record) => (
                    <div
                        key={record.id}
                        className="rounded-xl border bg-card p-4 shadow-xs"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                {meterCell(record)}
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {record.period?.name} ·{' '}
                                    {formatDate(record.reading_date)}
                                    {showTechnician && record.user?.name
                                        ? ` · ${record.user.name}`
                                        : ''}
                                </p>
                            </div>
                            <UtilityBadge
                                type={record.meter?.type ?? 'electricity'}
                            />
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <p className="text-xs text-muted-foreground">{t('Reading')}</p>
                                <p className="figure font-medium">
                                    {formatNumber(record.current_value)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{t('Used')}</p>
                                <p className="figure font-medium">
                                    {formatNumber(record.calculated_value)}{' '}
                                    {record.meter?.unit}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{t('Amount')}</p>
                                <p className="figure font-medium">
                                    {formatNumber(record.total_amount)}{' '}
                                    {currency}
                                </p>
                            </div>
                        </div>

                        {(showStatus || actions) && (
                            <div className="mt-3 flex items-center justify-between gap-2">
                                {showStatus ? (
                                    <StatusBadge status={record.status} />
                                ) : (
                                    <span />
                                )}
                                {actions && (
                                    <div className="flex items-center gap-1.5">
                                        {actions(record)}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
