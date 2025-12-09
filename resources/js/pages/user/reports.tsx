import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import InertiaPagination from "@/components/inertia-pagination";

type Meter = { id: number; name: string };
type Period = { id: number; name: string };

type Record = {
    id: number;
    current_value: number;
    total_amount: number;
    created_at: string;
    meter: Meter;
    period: Period;
};

type Totals = {
    total_value: number;
    total_amount: number;
};

type Props = {
    records: {
        data: Record[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { period_id?: string; meter_id?: string };
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

    return (
        <AppLayout breadcrumbs={[{ title: "Reports", href: "/user/reports" }]}>
            <Head title="Reports" />

            <div className="p-4 space-y-4">
                {/* Filters */}
                <Card>
                    <CardHeader className="flex gap-4 flex-row items-center justify-between">
                        <Select
                            defaultValue={filters.period_id ?? "all"}
                            onValueChange={(value) => handleFilterChange("period_id", value)}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Periods" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                {periods.map((p) => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select
                            defaultValue={filters.meter_id ?? "all"}
                            onValueChange={(value) => handleFilterChange("meter_id", value)}
                        >
                            <SelectTrigger className="w-40"><SelectValue placeholder="All Meters" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Meters</SelectItem>
                                {meters.map((m) => <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                </Card>

                {/* Totals */}
                <Card>
                    <CardHeader>
                        <h2 className="font-semibold text-lg">Summary</h2>
                    </CardHeader>
                    <CardContent className="flex gap-6">
                        <div>Total Consumption: <strong>{totals.total_value ?? 0} Kw</strong></div>
                        <div>Total Amount: <strong>{totals.total_amount ?? 0} MAD</strong></div>
                    </CardContent>
                </Card>

                {/* Records Table */}
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
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
                                            <TableCell colSpan={5} className="text-center py-6">No records found.</TableCell>
                                        </TableRow>
                                    )}

                                    {records.data.map((rec) => (
                                        <TableRow key={rec.id}>
                                            <TableCell>{rec.meter.name}</TableCell>
                                            <TableCell>{rec.period.name}</TableCell>
                                            <TableCell>{rec.current_value} Kw</TableCell>
                                            <TableCell>{rec.total_amount} MAD</TableCell>
                                            <TableCell>{new Date(rec.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4">
                            <InertiaPagination data={records} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
