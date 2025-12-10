import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

type Entry = {
    id: number;
    current_value: number;
    total_amount: number;
    reading_date: string;
    meter: { name: string };
    period: { name: string };
};

type Props = {
    totalMeters: number;
    totalRecords: number;
    pending: number;
    approved: number;
    recentEntries: Entry[];
};

export default function UserDashboard({
    totalMeters,
    totalRecords,
    pending,
    approved,
    recentEntries,
}: Props) {
    return (
        <AppLayout>
            <Head title="User Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                {/* ===== TOP CARDS ==== */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Meters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalMeters}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalRecords}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">
                                {pending}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">
                                {approved}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* ===== RECENT ENTRIES ===== */}
                <div className="rounded-xl border p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Recent Records
                        </h2>

                        <Button asChild>
                            <Link href="/user/consumptions">View All</Link>
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Meter</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {recentEntries.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-4 text-center"
                                        >
                                            No records found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {recentEntries.map((entry) => (
                                    <TableRow
                                        key={entry.id}
                                        className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                                    >
                                        <TableCell>
                                            {entry.meter.name}
                                        </TableCell>
                                        <TableCell>
                                            {entry.period.name}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {entry.current_value} Kw
                                        </TableCell>

                                        <TableCell>
                                            {entry.total_amount} MAD
                                        </TableCell>

                                        <TableCell>
                                            {new Date(entry.reading_date).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
