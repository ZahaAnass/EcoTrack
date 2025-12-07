import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from '@inertiajs/react';

import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import React, { useEffect, useRef } from 'react';
import { debounce } from "lodash";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import DeleteDialog from '@/components/delete-dialog';

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
    id: number;
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
    filters: Filters;
    periods: Period[];
};

type Filters = {
    search?: string;
    status?: string;
    period_id?: number | string;
};

export default function MyEntries({ records, filters, periods }: Props) {

    const handleSearch = useRef(
        debounce((query: string) => {
            router.get("/consumptions/mine",
                { ...filters, search: query },
                { preserveState: true, replace: true }
            );
        }, 500)
    ).current;

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value);
    };

    const handleDelete = (id: number) => {
        router.delete(`/consumptions/${id}`, {
            preserveState: true,
            onSuccess: () => {
                toast.success("Entry deleted successfully.", { id: "entry-deleted" });
            },
        });
    }

    const { flash } = usePage<{flash: {message?: string} }>().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message, {
                id: flash.message
            });
        }
    }, [flash.message]);

    return (
        <AppLayout breadcrumbs={[{ title: "My Entries", href: "/consumptions/mine" }]}>
            <Head title="My Entries" />

            <div className="p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="relative w-64">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={onSearchChange}
                                className="peer ps-9 sm:w-auto md:w-64 lg:w-64"
                                placeholder="Search..."
                                type="search"
                            />

                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80">
                                <Search aria-hidden="true" size={16} />
                            </div>
                        </div>

                        <Select
                            defaultValue={filters.status ?? "all"}
                            onValueChange={(value) =>
                                router.get(
                                    "/consumptions/mine",
                                    {
                                        ...filters,
                                        status: value === "all" ? null : value,
                                    },
                                    { preserveState: true, replace: true }
                                )
                            }
                        >
                            <SelectTrigger className="sm:w-auto md:w-48 lg:w-48">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select
                            defaultValue={filters.period_id?.toString() ?? "all"}
                            onValueChange={(value) =>
                                router.get(
                                    "/consumptions/mine",
                                    {
                                        ...filters,
                                        period_id: value === "all" ? null : value,
                                    },
                                    { preserveState: true, replace: true }
                                )
                            }
                        >
                            <SelectTrigger className="sm:w-auto md:w-48 lg:w-48">
                                <SelectValue placeholder="All Periods" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>

                                {periods.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        <Button asChild>
                            <Link href="/consumptions/create">+ Add New</Link>
                        </Button>
                    </CardHeader>


                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <Table>
                                <TableHeader className="bg-neutral-100 dark:bg-neutral-900/50">
                                    <TableRow>
                                        <TableHead className="font-semibold">#</TableHead>
                                        <TableHead className="font-semibold">Meter</TableHead>
                                        <TableHead className="font-semibold">Period</TableHead>
                                        <TableHead className="font-semibold">Value</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Actions</TableHead>
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

                                    {records.data.map((rec, index) => (
                                        <TableRow
                                            key={rec.id}
                                            className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                                        >
                                            <TableCell className="font-medium capitalize">
                                                {index + 1}
                                            </TableCell>

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

                                            {rec.status === "pending" ? (
                                                <TableCell className={"space-x-1.5"}>
                                                    <Button size={"sm"}>
                                                        <Link href={`/consumptions/${rec.id}/edit`}>Edit</Link>
                                                    </Button>
                                                    <DeleteDialog onConfirm={() => handleDelete(rec.id)}>
                                                        <Button
                                                            variant="destructive"
                                                            size={"sm"}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DeleteDialog>
                                                </TableCell>
                                            ) : (
                                                <TableCell className={"py-4"}>No Available Action</TableCell>
                                            )}
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
