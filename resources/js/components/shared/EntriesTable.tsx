import React from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import type { ConsumptionRecord } from "@/types";

type Props = {
    records: ConsumptionRecord[];
    showActions?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    startIndex?: number;
};

export default function EntriesTable({ records, showActions = false, onEdit, onDelete, startIndex = 0 }: Props) {
    return (
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
                        {showActions && <TableHead className="font-semibold">Actions</TableHead>}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {records.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={showActions ? 7 : 6} className="text-center py-6 text-neutral-500">
                                No entries found.
                            </TableCell>
                        </TableRow>
                    )}

                    {records.map((r, idx) => (
                        <TableRow key={r.id} className="transition hover:bg-neutral-50 dark:hover:bg-neutral-900/40">
                            <TableCell className="font-medium">{startIndex + idx + 1}</TableCell>
                            <TableCell className="font-medium capitalize">{r.meter?.name}</TableCell>
                            <TableCell className="capitalize">{r.period?.name}</TableCell>
                            <TableCell className="font-semibold">{r.current_value} Kw</TableCell>
                            <TableCell><StatusBadge status={r.status} /></TableCell>
                            <TableCell className="text-neutral-600 dark:text-neutral-400">
                                {new Date(r.reading_date ?? r.created_at ?? "").toLocaleDateString()}
                            </TableCell>
                            {showActions && (
                                <TableCell className="space-x-2">
                                    {onEdit && <button onClick={() => onEdit(r.id)} className="btn btn-sm">Edit</button>}
                                    {onDelete && <button onClick={() => onDelete(r.id)} className="btn btn-sm btn-destructive">Delete</button>}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
