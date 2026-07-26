import { UtilityBadge } from '@/components/eco/utility-badge';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatDateTime, formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { type MeterType, type Period } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Droplets, LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

export interface MeterOption {
    id: number;
    name: string;
    serial_number: string | null;
    type: MeterType;
    unit: string;
    location: string | null;
    last_value: number;
    last_reading_at: string | null;
}

interface ReadingFormProps {
    meters: MeterOption[];
    periods: (Period & { type?: MeterType })[];
    maxIncrement: number;
    action: string;
    method: 'post' | 'put';
    initial?: {
        meter_id: number;
        period_id: number;
        current_value: number;
    };
    submitLabel: string;
}

export function ReadingForm({
    meters,
    periods,
    maxIncrement,
    action,
    method,
    initial,
    submitLabel,
}: ReadingFormProps) {
    const t = useT();
    const currency = useCurrency();

    const { data, setData, post, put, processing, errors } = useForm({
        meter_id: initial ? String(initial.meter_id) : '',
        period_id: initial ? String(initial.period_id) : '',
        current_value: initial ? String(initial.current_value) : '',
    });

    const meter = meters.find((m) => String(m.id) === data.meter_id);
    const isWater = meter?.type === 'water';

    // Water is billed with one flat daily tariff — the period is implicit.
    const waterPeriod = periods.find((p) => p.type === 'water');
    const electricityPeriods = periods.filter((p) => p.type !== 'water');

    const period = isWater
        ? waterPeriod
        : periods.find((p) => String(p.id) === data.period_id);

    const selectMeter = (value: string) => {
        const next = meters.find((m) => String(m.id) === value);
        setData((current) => ({
            ...current,
            meter_id: value,
            // Auto-assign the daily water tariff; clear a water period when
            // switching back to an electricity meter.
            period_id:
                next?.type === 'water'
                    ? waterPeriod
                        ? String(waterPeriod.id)
                        : ''
                    : current.period_id === (waterPeriod ? String(waterPeriod.id) : '')
                      ? ''
                      : current.period_id,
        }));
    };

    const current = parseFloat(data.current_value);
    const used =
        meter && !Number.isNaN(current) && current > meter.last_value
            ? current - meter.last_value
            : null;
    const estimated = used !== null && period?.unit_price ? used * period.unit_price : null;
    const overLimit = used !== null && meter && meter.last_value > 0 && used > maxIncrement;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        (method === 'post' ? post : put)(action);
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-xs">
                    {/* Meter */}
                    <div className="grid gap-2">
                        <Label htmlFor="meter">{t('Meter')}</Label>
                        <Select value={data.meter_id} onValueChange={selectMeter}>
                            <SelectTrigger id="meter" className="w-full">
                                <SelectValue
                                    placeholder={t('Choose the meter you are reading')}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {meters.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        <span className="flex items-center gap-2">
                                            <UtilityBadge
                                                type={m.type}
                                                label={m.type === 'water' ? 'W' : 'E'}
                                            />
                                            {m.name}
                                            {m.serial_number && (
                                                <span className="text-xs text-muted-foreground">
                                                    · {m.serial_number}
                                                </span>
                                            )}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.meter_id} />
                    </div>

                    {/* Period — electricity only; water uses the daily tariff */}
                    {isWater ? (
                        <div className="flex items-start gap-2 rounded-lg border border-water/25 bg-water/8 p-3 text-sm">
                            <Droplets className="mt-0.5 size-4 shrink-0 text-water" />
                            <p className="text-muted-foreground">
                                {waterPeriod
                                    ? t('Water uses the daily tariff: :price :currency per m³. No period to choose.', {
                                          price: formatNumber(waterPeriod.unit_price),
                                          currency,
                                      })
                                    : t('No water tariff exists yet — ask an admin to create one.')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            <Label htmlFor="period">{t('Tariff period')}</Label>
                            <Select
                                value={data.period_id}
                                onValueChange={(value) => setData('period_id', value)}
                            >
                                <SelectTrigger id="period" className="w-full">
                                    <SelectValue
                                        placeholder={t('When was the reading taken?')}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {electricityPeriods.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {p.start_time?.slice(0, 5)}–
                                                {p.end_time?.slice(0, 5)} ·{' '}
                                                {formatNumber(p.unit_price)} {currency}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.period_id} />
                        </div>
                    )}

                    {/* Reading */}
                    <div className="grid gap-2">
                        <Label htmlFor="current_value">
                            {t('Meter reading')} {meter ? `(${meter.unit})` : ''}
                        </Label>
                        <Input
                            id="current_value"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            className="figure text-lg"
                            value={data.current_value}
                            onChange={(e) => setData('current_value', e.target.value)}
                            placeholder={
                                meter
                                    ? t('Greater than :value', {
                                          value: formatNumber(meter.last_value),
                                      })
                                    : '0.00'
                            }
                        />
                        <InputError message={errors.current_value} />
                        {overLimit && (
                            <p className="text-sm text-amber-600 dark:text-amber-500">
                                {t('That is a jump of more than :max :unit — the entry will be blocked. Double-check the dial.', {
                                    max: formatNumber(maxIncrement),
                                    unit: meter?.unit ?? '',
                                })}
                            </p>
                        )}
                    </div>
                </div>

                {/* Live summary */}
                <aside className="flex h-fit flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
                    <p className="text-sm font-medium text-muted-foreground">{t('Summary')}</p>

                    {meter ? (
                        <>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    {t('Previous approved reading')}
                                </p>
                                <p className="figure text-xl font-semibold">
                                    {formatNumber(meter.last_value)}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {meter.unit}
                                    </span>
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {meter.last_reading_at
                                        ? formatDateTime(meter.last_reading_at)
                                        : t('First reading for this meter')}
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs text-muted-foreground">
                                    {t('Consumption')}
                                </p>
                                <p className="figure text-xl font-semibold">
                                    {used !== null ? formatNumber(used) : '—'}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {meter.unit}
                                    </span>
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs text-muted-foreground">
                                    {t('Estimated amount')}
                                </p>
                                <p className="figure text-xl font-semibold">
                                    {estimated !== null ? formatNumber(estimated) : '—'}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        {currency}
                                    </span>
                                </p>
                                {!period && !isWater && (
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {t('Pick a tariff period to estimate the amount.')}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t('Pick a meter to see its previous reading and a live cost estimate.')}
                        </p>
                    )}
                </aside>
            </div>

            <div className="flex items-center gap-3">
                <Button type="submit" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    {t(submitLabel)}
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/technician/consumptions">{t('Cancel')}</Link>
                </Button>
            </div>
        </form>
    );
}
