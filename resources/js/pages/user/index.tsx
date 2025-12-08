import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useRef } from "react";
import { debounce } from "lodash";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import InertiaPagination from "@/components/inertia-pagination";
import { Button } from '@/components/ui/button';

type LaravelPagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
};

type Meter = { name: string };
type Period = { id: number; name: string, start_time: string; end_time: string };

type Entry = {
    id: number;
    current_value: number;
    total_amount: number;
    created_at: string;
    meter: Meter;
    period: Period;
};

type Filters = {
    search?: string;
    period_id?: number | string;
};

type Props = {
    consumptionRecords: LaravelPagination<Entry>;
    filters: Filters;
    periods: Period[];
};

export default function UserIndex({ consumptionRecords, filters, periods }: Props) {
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get(
                "/user/consumptions",
                { ...filters, search: query },
                { preserveState: true, replace: true }
            );
        }, 500)
    ).current;

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleSearch(e.target.value);

    return (
        <AppLayout breadcrumbs={[{ title: "All Records", href: "/user/consumptions" }]}>
            <Head title="All Records" />

            <div className="p-4">
                <Card>
                    {/* HEADER + FILTERS */}
                    <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                        {/* Search */}
                        <div className="relative w-64">
                            <Input
                                defaultValue={filters.search ?? ""}
                                onChange={onSearchChange}
                                className="peer ps-9"
                                placeholder="Search..."
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80">
                                <Search size={16} />
                            </div>
                        </div>

                        {/* Period */}
                        <Select
                            defaultValue={filters.period_id ?? "all"}
                            onValueChange={(value) =>
                                router.get(
                                    "/user/consumptions",
                                    { ...filters, period_id: value === "all" ? null : value },
                                    { preserveState: true, replace: true }
                                )
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Periods" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Periods</SelectItem>
                                {periods.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        {p.name} ({p.start_time} - {p.end_time})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>

                    <CardContent>
                        {/* TABLE */}
                        <div className="rounded-lg border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Meter</TableHead>
                                        <TableHead>Period</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {consumptionRecords.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6">
                                                No records found.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {consumptionRecords.data.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.meter.name}</TableCell>
                                            <TableCell>{record.period.name}</TableCell>
                                            <TableCell className={"font-semibold"}>{record.current_value} Kw</TableCell>
                                            <TableCell>{record.total_amount} MAD</TableCell>

                                            <TableCell>
                                                {new Date(record.created_at).toLocaleDateString()}
                                            </TableCell>

                                            <TableCell>
                                                <Button size={"sm"} variant={"default"}>
                                                    <Link
                                                        href={`/user/consumptions/${record.id}`}
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

                        {/* PAGINATION */}
                        <div className="mt-4">
                            <InertiaPagination data={consumptionRecords} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
