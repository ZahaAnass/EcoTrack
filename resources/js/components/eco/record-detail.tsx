import { StatusBadge } from '@/components/eco/status-badge';
import { UtilityBadge } from '@/components/eco/utility-badge';
import { formatDateTime, formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { type ConsumptionRecord } from '@/types';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-right text-sm font-medium">{children}</div>
        </div>
    );
}

export function RecordDetail({
    record,
    showStatus = true,
    showTechnician = true,
}: {
    record: ConsumptionRecord;
    showStatus?: boolean;
    showTechnician?: boolean;
}) {
    const t = useT();
    const currency = useCurrency();

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {/* The reading itself */}
            <div className="rounded-xl border bg-card p-5 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <p className="text-sm text-muted-foreground">{t('Meter')}</p>
                        <p className="text-lg font-semibold">{record.meter?.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {record.meter?.serial_number}
                            {record.meter?.location ? ` · ${record.meter.location}` : ''}
                        </p>
                    </div>
                    <UtilityBadge type={record.meter?.type ?? 'electricity'} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground">{t('Previous')}</p>
                        <p className="figure text-lg font-semibold">
                            {formatNumber(record.previous_value)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('Current')}</p>
                        <p className="figure text-lg font-semibold">
                            {formatNumber(record.current_value)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">{t('Used')}</p>
                        <p className="figure text-lg font-semibold text-primary">
                            {formatNumber(record.calculated_value)}
                            <span className="ml-1 text-xs font-normal text-muted-foreground">
                                {record.meter?.unit}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Billing & workflow */}
            <div className="rounded-xl border bg-card p-5 shadow-xs">
                <div className="divide-y">
                    <Row label={t('Tariff period')}>
                        {record.period?.name}
                        {record.period?.start_time && (
                            <span className="ml-1 text-xs text-muted-foreground">
                                {record.period.start_time.slice(0, 5)}–
                                {record.period.end_time?.slice(0, 5)}
                            </span>
                        )}
                    </Row>
                    <Row label={t('Unit price')}>
                        <span className="figure">
                            {formatNumber(record.unit_price)} {currency}/{record.meter?.unit}
                        </span>
                    </Row>
                    <Row label={t('Amount')}>
                        <span className="figure text-base font-semibold">
                            {formatNumber(record.total_amount)} {currency}
                        </span>
                    </Row>
                    <Row label={t('Reading date')}>{formatDateTime(record.reading_date)}</Row>
                    {showTechnician && (
                        <Row label={t('Recorded by')}>{record.user?.name ?? '—'}</Row>
                    )}
                    {showStatus && (
                        <Row label={t('Status')}>
                            <StatusBadge status={record.status} />
                        </Row>
                    )}
                    {record.approver && (
                        <Row
                            label={
                                record.status === 'rejected'
                                    ? t('Rejected by')
                                    : t('Approved by')
                            }
                        >
                            {record.approver.name}
                            {record.approved_at && (
                                <span className="ml-1 text-xs text-muted-foreground">
                                    {formatDateTime(record.approved_at)}
                                </span>
                            )}
                        </Row>
                    )}
                    {record.rejection_reason && (
                        <Row label={t('Rejection reason')}>{record.rejection_reason}</Row>
                    )}
                </div>
            </div>
        </div>
    );
}
