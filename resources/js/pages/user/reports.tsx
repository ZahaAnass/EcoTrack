import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import InertiaPagination from "@/components/inertia-pagination";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    Area, AreaChart, ResponsiveContainer
} from "recharts";
import { Button } from '@/components/ui/button';

type Meter = { id: number; name: string };
type Period = { id: number; name: string };

type Record = {
    id: number;
    current_value: number;
    total_amount: number;
    reading_date: string;
    meter: Meter;
    period: Period;
};

type Totals = {
    total_value: number | null;
    total_amount: number | null;
};

type Filter = {
    period_id?: string;
    meter_id?: string;
    date?: string;
    range_start?: string;
    range_end?: string;
};

type Props = {
    records: {
        data: Record[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: Filter;
    periods: Period[];
    meters: Meter[];
    totals: Totals;
};

export default function Reports({ records, filters, periods, meters, totals }: Props) {
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            "/user/reports",
            { ...filters, [key]: value === "all" ? null : value },
            { preserveState: true, replace: true }
        );
    };

    const chartData = records.data.map(r => ({
        name: new Date(r.reading_date).toLocaleDateString(),
        consumption: r.current_value,
        amount: r.total_amount,
    }));

    return (
        <AppLayout breadcrumbs={[{ title: "Reports", href: "/user/reports" }]}>
            <Head title="Reports" />

            <div className="p-4 space-y-4">

                {/* Filters */}
                <Card>
                    <CardHeader className="flex flex-col gap-4">
                        {/* Top Row: Select Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Select
                                defaultValue={filters.period_id ?? "all"}
                                onValueChange={(value) => handleFilterChange("period_id", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Periods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Periods</SelectItem>
                                    {periods.map((p) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                defaultValue={filters.meter_id ?? "all"}
                                onValueChange={(value) => handleFilterChange("meter_id", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Meters" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Meters</SelectItem>
                                    {meters.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                defaultValue={filters.date ?? "all"}
                                onValueChange={(value) => handleFilterChange("date", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Date Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Dates</SelectItem>
                                    <SelectItem value="day">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <span>From</span>
                                <Input
                                    type="date"
                                    className="w-full"
                                    onChange={(e) =>
                                        router.get(
                                            "/user/reports",
                                            { ...filters, range_start: e.target.value },
                                            { preserveState: true, replace: true }
                                        )
                                    }
                                />
                                <span>To</span>
                                <Input
                                    type="date"
                                    className="w-full"
                                    onChange={(e) =>
                                        router.get(
                                            "/user/reports",
                                            { ...filters, range_end: e.target.value },
                                            { preserveState: true, replace: true }
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    router.get("/user/reports", {}, { preserveState: true, replace: true })
                                }
                            >
                                Reset
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Totals */}
                <Card>
                    <CardHeader>
                        <h2 className="font-semibold text-lg">Summary</h2>
                    </CardHeader>
                    <CardContent className="flex gap-6">
                        <div>Total Consumption: <strong>{totals?.total_value ?? 0} Kw</strong></div>
                        <div>Total Amount: <strong>{totals?.total_amount ?? 0} MAD</strong></div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <Card>
                    <CardHeader>
                        <h2 className="font-semibold text-lg">Visualization</h2>
                    </CardHeader>

                    <CardContent className="grid md:grid-cols-2 gap-6">

                        {/* Bar Chart */}
                        <ResponsiveContainer width={"100%"} height={250}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="consumption" />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Area Chart */}
                        <div>
                            <ResponsiveContainer width={"100%"} height={250}>
                                <AreaChart data={chartData} margin={{ left: 20, right: 20 }}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                    </CardContent>
                </Card>

                {/* Records Table */}
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Meter</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {records.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6">
                                                No records found.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {records.data.map((rec, index) => (
                                        <TableRow key={rec.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{rec.meter.name}</TableCell>
                                            <TableCell>{rec.period.name}</TableCell>
                                            <TableCell>{rec.current_value} Kw</TableCell>
                                            <TableCell>{rec.total_amount} MAD</TableCell>
                                            <TableCell>{new Date(rec.reading_date).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4">
                            <InertiaPagination data={records} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
