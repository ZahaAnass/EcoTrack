import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

type Entry = {
    id: number;
    current_value: number;
    status: string;
    created_at: string;
    meter: { name: string };
    period: { name: string };
};

type DashboardProps = {
    metersCount: number;
    myEntriesCount: number;
    recentEntries: Entry[];
};

export default function Dashboard({ metersCount, myEntriesCount, recentEntries }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* ===== TOP CARDS ===== */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 text-center">
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Total Meters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{metersCount}</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>My Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{myEntriesCount}</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">
                                {recentEntries.filter(e => e.status === 'pending').length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                                Add Consumption
                            </CardTitle>

                            <Button>
                                <Link href="/consumptions/create">
                                    + Add
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                {/* ===== RECENT ENTRIES SECTION ===== */}
                <div className="rounded-xl border p-4 border-sidebar-border/70 bg-white dark:bg-neutral-900 dark:border-sidebar-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Entries</h2>

                        <Link
                            href="/consumptions/mine"
                            className="text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                            View All
                        </Link>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Meter</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {/* Empty state */}
                                {recentEntries.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-neutral-500">
                                            No entries found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Entries */}
                                {recentEntries.map((entry) => (
                                    <TableRow key={entry.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                                        <TableCell className="font-medium">{entry.meter.name}</TableCell>
                                        <TableCell>{entry.period.name}</TableCell>
                                        <TableCell className="font-semibold">{entry.current_value} Kw</TableCell>

                                        <TableCell>
                                            {entry.status === "pending" && (
                                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                                    Pending
                                                </Badge>
                                            )}
                                            {entry.status === "approved" && (
                                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                                    Approved
                                                </Badge>
                                            )}
                                            {entry.status === "rejected" && (
                                                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                                    Rejected
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-neutral-600 dark:text-neutral-400">
                                            {new Date(entry.created_at).toLocaleDateString()}
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
