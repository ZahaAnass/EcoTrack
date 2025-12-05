import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import InertiaPagination from "@/components/inertia-pagination";

type LaravelPagination<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number | null;
    to: number | null;
    total: number;
};

type Meter = {
    name: string;
};

type Period = {
    name: string;
};

type Entry = {
    id: number;
    consumption_current: number;
    status: "pending" | "approved" | "rejected";
    current_value: number;
    created_at: string;
    meter: Meter;
    period: Period;
};

type Props = {
    records: LaravelPagination<Entry>;
};

export default function MyEntries({ records }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: "My Entries", href: "/consumptions/mine" }]}>
            <Head title="My Entries" />

            <div className="p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            My Consumption Entries
                        </CardTitle>

                        <Button asChild>
                            <Link href="/consumptions/create">+ Add New</Link>
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <Table>
                                <TableHeader className="bg-neutral-100 dark:bg-neutral-900/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">Meter</TableHead>
                                        <TableHead className="font-semibold">Period</TableHead>
                                        <TableHead className="font-semibold">Value</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {records.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-6 text-neutral-500"
                                            >
                                                No entries yet.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {records.data.map((rec) => (
                                        <TableRow
                                            key={rec.id}
                                            className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                                        >
                                            <TableCell className="font-medium capitalize">
                                                {rec.meter.name}
                                            </TableCell>

                                            <TableCell className="capitalize">
                                                {rec.period.name}
                                            </TableCell>

                                            <TableCell className="font-semibold">
                                                {rec.current_value} Kw
                                            </TableCell>

                                            <TableCell>
                                                {rec.status === "pending" && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-yellow-100 text-yellow-800 border-yellow-300"
                                                    >
                                                        Pending
                                                    </Badge>
                                                )}

                                                {rec.status === "approved" && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-100 text-green-800 border-green-300"
                                                    >
                                                        Approved
                                                    </Badge>
                                                )}

                                                {rec.status === "rejected" && (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-red-100 text-red-800 border-red-300"
                                                    >
                                                        Rejected
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell className="text-neutral-600 dark:text-neutral-400">
                                                {new Date(rec.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <InertiaPagination data={records} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
