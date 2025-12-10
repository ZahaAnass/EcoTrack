import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import React from 'react';

type Meter = {
    id: number;
    name: string;
    location: string;
    unit_price: number;
};

type Period = {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
};

type EditProps = {
    meters: Meter[];
    periods: Period[];
    entry: {
        id: number;
        meter_id: number;
        period_id: number;
        consumption_current: number;
    };
};

export default function EditConsumption({ meters, periods, entry }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        meter_id: entry.meter_id,
        period_id: entry.period_id,
        consumption_current: entry.consumption_current,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(`/technician/consumptions/${entry.id}`, {
            onSuccess: () => {
                toast.success('Consumption updated successfully');
            },
            onError: () => {
                toast.error('Please fix the errors');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: "My Entries", href: "/consumptions/mine" },
            { title: "Edit Consumption", href: `/consumptions/${entry.id}/edit` }
        ]}>
            <Head title="Edit Consumption" />

            <div className="p-4">
                <Card className="border border-sidebar-border dark:border-sidebar-border w-full mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Consumption</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Meter */}
                            <div>
                                <Select
                                    defaultValue={data.meter_id}
                                    onValueChange={(value) => setData('meter_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select meter" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {meters.map(meter => (
                                            <SelectItem
                                                key={meter.id}
                                                value={meter.id}
                                            >
                                                {meter.name} - {meter.location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.meter_id} />
                            </div>

                            {/* Period */}
                            <div>
                                <Select
                                    defaultValue={data.period_id}
                                    onValueChange={(value) => setData('period_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {periods.map(period => (
                                            <SelectItem key={period.id} value={period.id}>
                                                {period.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.period_id} />
                            </div>

                            {/* Value */}
                            <div>
                                <Input
                                    type="number"
                                    value={data.consumption_current}
                                    onChange={(e) => setData('consumption_current', e.target.value)}
                                    placeholder="Current Consumption"
                                />
                                <InputError message={errors.consumption_current} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button disabled={processing} type="submit">
                                    Update
                                </Button>

                                <Button variant="secondary" asChild>
                                    <Link href="/technician/consumptions/mine">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
