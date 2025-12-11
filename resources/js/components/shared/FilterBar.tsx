import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import type { Meter, Period } from "@/types";

type Props = {
    filters: Record<string, any>;
    periods: Period[];
    meters: Meter[];
    onFilterChange?: (k: string, v: string | null) => void;
};

export default function FilterBar({ filters, periods, meters, onFilterChange }: Props) {
    const change = (k: string, v: string | null) => {
        if (onFilterChange) return onFilterChange(k, v);
        router.get(window.location.pathname, { ...filters, [k]: v }, { preserveState: true, replace: true });
    };

    return (
        <div className="flex flex-wrap gap-3 items-center">
            <Select defaultValue={filters.period_id ?? "all"} onValueChange={(v) => change("period_id", v === "all" ? null : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Period" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    {periods.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>

            <Select defaultValue={filters.meter_id ?? "all"} onValueChange={(v) => change("meter_id", v === "all" ? null : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Meter" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Meters</SelectItem>
                    {meters.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
                </SelectContent>
            </Select>

            <Input type="date" defaultValue={filters.range_start ?? ""} onChange={(e) => change("range_start", e.target.value || null)} />
            <Input type="date" defaultValue={filters.range_end ?? ""} onChange={(e) => change("range_end", e.target.value || null)} />

            <Button variant="destructive" onClick={() => router.get(window.location.pathname, {}, { preserveState: true, replace: true })}>
                Reset
            </Button>
        </div>
    );
}
