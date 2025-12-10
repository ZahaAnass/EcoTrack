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

type AddConsumptionProps = {
    meters: Meter[];
    periods: Period[];
};

export default function AddConsumption({ meters, periods }: AddConsumptionProps ) {

    const { data, setData, post, processing, errors, reset } = useForm({
        meter_id: '',
        period_id: '',
        consumption_current: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        post('/technician/consumptions', {
            onSuccess: () => {
                toast.success('Consumption recorded successfully');
                reset();
            },
            onError: () => {
                toast.error('Please fix the errors');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Add Consumption', href: '/consumptions/create' }]}>
            <Head title="Add Consumption" />

            <div className="p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border w-full mx-auto">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Add New Consumption</CardTitle>
                        <Button><Link href="/technician/dashboard">Back</Link></Button>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Meter */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Meter</label>
                                <Select
                                    value={data.meter_id}
                                    onValueChange={(v) => setData('meter_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select meter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {meters.map(meter => (
                                            <SelectItem key={meter.id} value={meter.id.toString()}>
                                                    {meter.name ? meter.name.replace(/^./, (s) => s.toUpperCase()) : meter.name}
                                                    - {meter.location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.meter_id} />
                            </div>

                            {/* Period */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Period</label>
                                <Select
                                    value={data.period_id}
                                    onValueChange={(v) => setData('period_id', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periods.map(p => (
                                            <SelectItem key={p.id} value={p.id.toString()}>
                                                {p.name} - {p.start_time} to {p.end_time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.period_id} />
                            </div>

                            {/* Consumption */}
                            <div>
                                <label className="block mb-1 text-sm font-medium">Current Value</label>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Enter current value"
                                    value={data.consumption_current}
                                    onChange={(e) => setData('consumption_current', e.target.value)}
                                />
                                <InputError message={errors.consumption_current} />
                            </div>

                            <Button type="submit" disabled={processing} size="lg">
                                Save Consumption
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
