import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ================= TYPES ================= */

type RecordStatus = 'pending' | 'approved' | 'rejected';

type ConsumptionRecord = {
    id: number;
    current_value: number;
    status: RecordStatus;
    reading_date: string;
    meter: { name: string };
    period: { name: string };
    user: { name: string };
};

type Props = {
    totalMeters: number;
    totalPeriods: number;
    totalRecords: number;
    pendingCount: number;
    recentRecords: ConsumptionRecord[];
};

/* ================= PAGE ================= */

export default function AdminDashboard({
    totalMeters,
    totalPeriods,
    totalRecords,
    pendingCount,
    recentRecords,
}: Props) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                {/* ===== STATS ===== */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Meters"
                        value={totalMeters}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Periods"
                        value={totalPeriods}
                        color="text-green-600"
                    />
                    <StatCard
                        title="Records"
                        value={totalRecords}
                        color="text-red-600"
                    />
                    <StatCard
                        title="Pending"
                        value={pendingCount}
                        color={
                            pendingCount > 0
                                ? 'text-yellow-600'
                                : 'text-neutral-900'
                        }
                    />
                </div>

                {/* ===== QUICK ACTIONS ===== */}
                <div className="flex flex-wrap gap-4">
                    <Button asChild>
                        <Link href="/admin/meters/create">+ Add Meter</Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/admin/periods/create">+ Add Period</Link>
                    </Button>

                    <Button asChild variant="secondary">
                        <Link href="/admin/consumptions/create">
                            + Add Consumption
                        </Link>
                    </Button>

                    <Button asChild variant="secondary">
                        <Link href="/admin/consumptions/pending">
                            Pending Consumptions
                        </Link>
                    </Button>
                </div>

                {/* ===== RECENT RECORDS ===== */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Consumption Records</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Meter</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {recentRecords.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-6 text-center text-muted-foreground"
                                            >
                                                No records found.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {recentRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {record.meter.name}
                                            </TableCell>
                                            <TableCell>
                                                {record.period.name}
                                            </TableCell>
                                            <TableCell>
                                                {record.user.name}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {record.current_value} kWh
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge
                                                    status={record.status}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    record.reading_date,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="default"
                                                >
                                                    <Link
                                                        href={`/admin/consumptions/${record.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({
    title,
    value,
    color = 'text-neutral-900',
}: {
    title: string;
    value: number;
    color?: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </CardContent>
        </Card>
    );
}

const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }: { status: RecordStatus }) {
    return (
        <Badge className={statusStyles[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
