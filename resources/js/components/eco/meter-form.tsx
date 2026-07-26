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
import { useT } from '@/lib/i18n';
import { type Meter } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Droplets, Gauge, LoaderCircle, MapPin, Power, Zap } from 'lucide-react';
import { FormEvent } from 'react';

export function MeterForm({ meter }: { meter?: Meter }) {
    const t = useT();

    const { data, setData, post, put, processing, errors } = useForm({
        name: meter?.name ?? '',
        serial_number: meter?.serial_number ?? '',
        type: meter?.type ?? 'electricity',
        location: meter?.location ?? '',
        status: meter?.status ?? 'active',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (meter) {
            put(`/admin/meters/${meter.id}`);
        } else {
            post('/admin/meters');
        }
    };

    const isWater = data.type === 'water';

    return (
        <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-5 rounded-xl border bg-card p-6 shadow-xs">
                <div className="grid gap-2">
                    <Label htmlFor="name">{t('Name')}</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={t('e.g. Kitchen — ground floor')}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="serial_number">{t('Serial number')}</Label>
                        <Input
                            id="serial_number"
                            value={data.serial_number}
                            onChange={(e) => setData('serial_number', e.target.value)}
                            placeholder="ELC-0009"
                        />
                        <InputError message={errors.serial_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">{t('Utility')}</Label>
                        <Select
                            value={data.type}
                            onValueChange={(v) => setData('type', v as 'electricity' | 'water')}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electricity">
                                    <span className="flex items-center gap-2">
                                        <Zap className="size-4 text-electricity" />
                                        {t('Electricity')} (kWh)
                                    </span>
                                </SelectItem>
                                <SelectItem value="water">
                                    <span className="flex items-center gap-2">
                                        <Droplets className="size-4 text-water" />
                                        {t('Water')} (m³)
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.type} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="location">{t('Location')}</Label>
                        <Input
                            id="location"
                            value={data.location ?? ''}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder={t('Where is the meter installed?')}
                        />
                        <InputError message={errors.location} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">{t('Status')}</Label>
                        <Select
                            value={data.status}
                            onValueChange={(v) => setData('status', v as 'active' | 'inactive')}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">{t('Active')}</SelectItem>
                                <SelectItem value="inactive">{t('Inactive')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} />
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing && <LoaderCircle className="size-4 animate-spin" />}
                        {meter ? t('Save changes') : t('Create meter')}
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/admin/meters">{t('Cancel')}</Link>
                    </Button>
                </div>
            </div>

            {/* Live preview + guidance */}
            <aside className="flex flex-col gap-4">
                <div
                    className={
                        isWater
                            ? 'rounded-xl border border-water/30 bg-gradient-to-br from-water/15 via-card to-card p-5 shadow-xs'
                            : 'rounded-xl border border-electricity/30 bg-gradient-to-br from-electricity/15 via-card to-card p-5 shadow-xs'
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
                                    : 'flex size-11 items-center justify-center rounded-xl bg-electricity/15 text-electricity'
                            }
                        >
                            {isWater ? <Droplets className="size-5" /> : <Zap className="size-5" />}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                {data.name || t('Meter name')}
                            </p>
                            <p className="figure truncate text-xs text-muted-foreground">
                                {data.serial_number || 'SERIAL'} ·{' '}
                                {isWater ? `${t('Water')} (m³)` : `${t('Electricity')} (kWh)`}
                            </p>
                        </div>
                    </div>
                    {data.location && (
                        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="size-3.5" /> {data.location}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 text-sm shadow-xs">
                    <p className="flex items-start gap-2 text-muted-foreground">
                        <Gauge className="mt-0.5 size-4 shrink-0 text-primary" />
                        {t('The serial number is what technicians match against the physical meter — keep it identical to the plate on the device.')}
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                        <Power className="mt-0.5 size-4 shrink-0 text-primary" />
                        {t("Inactive meters disappear from the technician's reading form but keep their full history in reports.")}
                    </p>
                </div>
            </aside>
        </form>
    );
}
