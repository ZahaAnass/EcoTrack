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
import { formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { type MeterType, type Period } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Clock, Droplets, LoaderCircle, Lock, Moon, Sun, Zap } from 'lucide-react';
import { FormEvent } from 'react';

export function PeriodForm({
    period,
    hasWaterPeriod = false,
}: {
    period?: Period & { type?: MeterType };
    hasWaterPeriod?: boolean;
}) {
    const t = useT();
    const currency = useCurrency();

    const { data, setData, post, put, processing, errors } = useForm({
        name: period?.name ?? '',
        type: (period?.type ?? 'electricity') as MeterType,
        start_time: period?.start_time?.slice(0, 5) ?? '',
        end_time: period?.end_time?.slice(0, 5) ?? '',
        unit_price: period?.unit_price !== undefined ? String(period.unit_price) : '',
    });

    const isWater = data.type === 'water';

    const selectType = (value: MeterType) => {
        // Water always covers the full day, so the window is fixed.
        setData((current) => ({
            ...current,
            type: value,
            start_time: value === 'water' ? '00:00' : current.start_time,
            end_time: value === 'water' ? '23:59' : current.end_time,
        }));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (period) {
            put(`/admin/periods/${period.id}`);
        } else {
            post('/admin/periods');
        }
    };

    const overnight =
        !isWater && data.start_time && data.end_time && data.end_time <= data.start_time;
    const price = parseFloat(data.unit_price);

    return (
        <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('Name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={t('e.g. Peak hours')}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">{t('Utility')}</Label>
                        <Select
                            value={data.type}
                            onValueChange={(v) => selectType(v as MeterType)}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electricity">
                                    <span className="flex items-center gap-2">
                                        <Zap className="size-4 text-electricity" />
                                        {t('Electricity')}
                                    </span>
                                </SelectItem>
                                <SelectItem
                                    value="water"
                                    disabled={hasWaterPeriod && period?.type !== 'water'}
                                >
                                    <span className="flex items-center gap-2">
                                        <Droplets className="size-4 text-water" />
                                        {t('Water')}
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                        {hasWaterPeriod && period?.type !== 'water' && (
                            <p className="text-xs text-muted-foreground">
                                {t('Water already has its daily tariff — edit that period instead.')}
                            </p>
                        )}
                    </div>
                </div>

                {isWater ? (
                    <div className="flex items-start gap-2 rounded-lg border border-water/25 bg-water/8 p-3 text-sm">
                        <Droplets className="mt-0.5 size-4 shrink-0 text-water" />
                        <p className="text-muted-foreground">
                            {t('Water is billed at one flat tariff for the whole day — no time window to configure.')}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">{t('Starts at')}</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                            />
                            <InputError message={errors.start_time} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_time">{t('Ends at')}</Label>
                            <Input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                            />
                            <InputError message={errors.end_time} />
                        </div>
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="unit_price">
                        {t('Unit price')} ({currency} / {isWater ? 'm³' : 'kWh'})
                    </Label>
                    <Input
                        id="unit_price"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        className="figure"
                        value={data.unit_price}
                        onChange={(e) => setData('unit_price', e.target.value)}
                        placeholder="0.00"
                    />
                    <InputError message={errors.unit_price} />
                </div>

                <div className="flex items-center gap-3 border-t pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {period ? t('Save changes') : t('Create period')}
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/admin/periods">{t('Cancel')}</Link>
                    </Button>
                </div>
            </div>

            {/* Live preview + guidance */}
            <aside className="flex flex-col gap-4">
                <div
                    className={
                        isWater
                            ? 'rounded-xl border border-water/30 bg-gradient-to-br from-water/15 via-card to-card p-5 shadow-xs'
                            : 'rounded-xl border border-primary/30 bg-gradient-to-br from-primary/12 via-card to-card p-5 shadow-xs'
                    }
                >
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {t('Preview')}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        <span
                            className={
                                isWater
                                    ? 'flex size-11 items-center justify-center rounded-xl bg-water/15 text-water'
                                    : 'flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary'
                            }
                        >
                            {isWater ? (
                                <Droplets className="size-5" />
                            ) : overnight ? (
                                <Moon className="size-5" />
                            ) : (
                                <Sun className="size-5" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                {data.name || t('Period name')}
                            </p>
                            <p className="figure text-xs text-muted-foreground">
                                {isWater
                                    ? t('Whole day')
                                    : `${data.start_time || '--:--'} – ${data.end_time || '--:--'}${overnight ? ` (${t('overnight')})` : ''}`}
                            </p>
                        </div>
                    </div>
                    <p
                        className={`figure mt-3 text-2xl font-semibold ${isWater ? 'text-water' : 'text-primary'}`}
                    >
                        {Number.isNaN(price) ? '—' : formatNumber(price)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                            {currency} / {isWater ? 'm³' : 'kWh'}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-sm shadow-xs">
                    <p className="flex items-start gap-2 text-muted-foreground">
                        <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                        {t('Overnight windows are fine — 23:00 to 08:00 covers the night tariff.')}
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                        <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
                        {t('New readings snapshot this price at the moment they are recorded — changing it later never rewrites billing history.')}
                    </p>
                </div>
            </aside>
        </form>
    );
}
