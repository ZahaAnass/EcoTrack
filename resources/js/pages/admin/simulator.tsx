import { PageHeader } from '@/components/eco/page-header';
import { UtilityTabs } from '@/components/eco/utility-tabs';
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
import AppLayout from '@/layouts/app-layout';
import { formatNumber, useCurrency } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { type BreadcrumbItem, type MeterType, type Period } from '@/types';
import { Head } from '@inertiajs/react';
import { Calculator, Droplets, Eraser, FlaskConical, Zap } from 'lucide-react';
import { useState } from 'react';

interface Props {
    periods: (Period & { type?: MeterType })[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Simulator', href: '/admin/simulator' },
];

/**
 * A scratchpad for quick what-if pricing. Everything happens in the browser —
 * nothing here is ever saved to the database.
 */
export default function Simulator({ periods }: Props) {
    const t = useT();
    const currency = useCurrency();

    const [type, setType] = useState<MeterType>('electricity');
    const [previous, setPrevious] = useState('');
    const [current, setCurrent] = useState('');
    const [periodId, setPeriodId] = useState('');
    const [customPrice, setCustomPrice] = useState('');

    const unit = type === 'water' ? 'm³' : 'kWh';
    const typePeriods = periods.filter((p) => (p.type ?? 'electricity') === type);
    const period = typePeriods.find((p) => String(p.id) === periodId);

    const price =
        customPrice !== ''
            ? parseFloat(customPrice)
            : (period?.unit_price ?? typePeriods[0]?.unit_price ?? NaN);

    const prev = parseFloat(previous);
    const curr = parseFloat(current);
    const used = !Number.isNaN(prev) && !Number.isNaN(curr) && curr > prev ? curr - prev : null;
    const total = used !== null && !Number.isNaN(price) ? used * price : null;

    const switchType = (next: MeterType) => {
        setType(next);
        setPeriodId('');
    };

    const reset = () => {
        setPrevious('');
        setCurrent('');
        setPeriodId('');
        setCustomPrice('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Simulator')} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Cost simulator')}
                    description={t('Quick what-if calculations — nothing on this page is ever saved.')}
                    actions={
                        <Button variant="outline" onClick={reset}>
                            <Eraser className="size-4" />
                            {t('Clear')}
                        </Button>
                    }
                />

                <div className="flex items-start gap-2 rounded-xl border border-primary/25 bg-primary/8 p-3 text-sm">
                    <FlaskConical className="mt-0.5 size-4 shrink-0 text-primary" />
                    <p className="text-muted-foreground">
                        {t('Use this to sanity-check a bill, test a tariff change, or estimate a reading before it is recorded.')}
                    </p>
                </div>

                <UtilityTabs value={type} onChange={switchType} />

                <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
                    {/* Inputs */}
                    <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-xs">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="previous">
                                    {t('Previous reading')} ({unit})
                                </Label>
                                <Input
                                    id="previous"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    className="figure text-lg"
                                    value={previous}
                                    onChange={(e) => setPrevious(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="current">
                                    {t('Current reading')} ({unit})
                                </Label>
                                <Input
                                    id="current"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    className="figure text-lg"
                                    value={current}
                                    onChange={(e) => setCurrent(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="period">{t('Tariff period')}</Label>
                                <Select
                                    value={periodId}
                                    onValueChange={(v) => {
                                        setPeriodId(v);
                                        setCustomPrice('');
                                    }}
                                >
                                    <SelectTrigger id="period" className="w-full">
                                        <SelectValue
                                            placeholder={
                                                typePeriods.length
                                                    ? t('Pick a tariff')
                                                    : t('No tariff for this utility')
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {typePeriods.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {formatNumber(p.unit_price)} {currency}/{unit}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="custom_price">
                                    {t('Or a custom price')} ({currency}/{unit})
                                </Label>
                                <Input
                                    id="custom_price"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    className="figure"
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(e.target.value)}
                                    placeholder={
                                        period
                                            ? formatNumber(period.unit_price)
                                            : t('Overrides the tariff')
                                    }
                                />
                            </div>
                        </div>

                        {used === null && previous !== '' && current !== '' && (
                            <p className="text-sm text-amber-600 dark:text-amber-500">
                                {t('The current reading must be greater than the previous one.')}
                            </p>
                        )}
                    </div>

                    {/* Result */}
                    <aside
                        className={
                            type === 'water'
                                ? 'flex flex-col gap-4 rounded-xl border border-water/30 bg-gradient-to-br from-water/12 via-card to-card p-6 shadow-xs'
                                : 'flex flex-col gap-4 rounded-xl border border-electricity/30 bg-gradient-to-br from-electricity/12 via-card to-card p-6 shadow-xs'
                        }
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className={
                                    type === 'water'
                                        ? 'flex size-9 items-center justify-center rounded-lg bg-water/15 text-water'
                                        : 'flex size-9 items-center justify-center rounded-lg bg-electricity/15 text-electricity'
                                }
                            >
                                {type === 'water' ? (
                                    <Droplets className="size-4.5" />
                                ) : (
                                    <Zap className="size-4.5" />
                                )}
                            </span>
                            <p className="font-semibold">{t('Result')}</p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">{t('Consumption')}</p>
                            <p
                                className={`figure text-3xl font-semibold ${type === 'water' ? 'text-water' : 'text-electricity'}`}
                            >
                                {used !== null ? formatNumber(used) : '—'}
                                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                                    {unit}
                                </span>
                            </p>
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-xs text-muted-foreground">{t('Unit price')}</p>
                            <p className="figure text-xl font-semibold">
                                {!Number.isNaN(price) ? formatNumber(price) : '—'}
                                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                                    {currency}/{unit}
                                </span>
                            </p>
                            {customPrice !== '' && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {t('Using your custom price')}
                                </p>
                            )}
                        </div>

                        <div className="border-t pt-3">
                            <p className="text-xs text-muted-foreground">{t('Estimated amount')}</p>
                            <p className="figure text-3xl font-semibold text-primary">
                                {total !== null ? formatNumber(total) : '—'}
                                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                                    {currency}
                                </span>
                            </p>
                        </div>

                        <p className="flex items-start gap-1.5 border-t pt-3 text-xs text-muted-foreground">
                            <Calculator className="mt-0.5 size-3.5 shrink-0" />
                            {t('This is a scratchpad — close the page and it is gone.')}
                        </p>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
