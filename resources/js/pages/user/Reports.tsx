import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import UserReportsFilters from "@/components/user/UserReportsFilters";
import UserReportCharts from "@/components/user/UserReportCharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import InertiaPagination from "@/components/inertia-pagination";
import type { ConsumptionRecord, Meter, Period } from "@/types";

export default function Reports({ records, filters, periods, meters, totals }: { records: { data: ConsumptionRecord[]; links:any[] }; filters:any; periods: Period[]; meters: Meter[]; totals: any }) {
    const chartData = records.data.map(r => ({
        name: new Date(r.reading_date ?? r.created_at ?? "").toLocaleDateString(),
        consumption: r.current_value,
        amount: r.total_amount,
    }));

    return (
        <AppLayout>
            <Head title="Reports" />
            <div className="p-4 space-y-4">
                <Card>
                    <CardHeader><UserReportsFilters filters={filters} periods={periods} meters={meters} /></CardHeader>
                </Card>

                <Card>
                    <CardHeader><h2 className="font-semibold text-lg">Summary</h2></CardHeader>
                    <CardContent className="flex gap-6"><div>Total Consumption: <strong>{totals?.total_value ?? 0} Kw</strong></div><div>Total Amount: <strong>{totals?.total_amount ?? 0} MAD</strong></div></CardContent>
                </Card>

                <Card>
                    <CardHeader><h2 className="font-semibold text-lg">Visualization</h2></CardHeader>
                    <CardContent><UserReportCharts data={chartData} /></CardContent>
                </Card>

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
                                    {records.data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-6">No records found.</TableCell></TableRow>}
                                    {records.data.map((r, idx) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell>{r.meter?.name}</TableCell>
                                            <TableCell>{r.period?.name}</TableCell>
                                            <TableCell>{r.current_value} Kw</TableCell>
                                            <TableCell>{r.total_amount} MAD</TableCell>
                                            <TableCell>{new Date(r.reading_date ?? r.created_at ?? "").toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4"><InertiaPagination data={records} /></div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
