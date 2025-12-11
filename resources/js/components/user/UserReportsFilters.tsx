import React from "react";
import FilterBar from "@/components/shared/FilterBar";
import type { Meter, Period } from "@/types";

export default function UserReportsFilters({ filters, periods, meters, onChange }: { filters: any; periods: Period[]; meters: Meter[]; onChange?: (k:string,v:string|null)=>void }) {
    return (
        <div>
            <FilterBar filters={filters} periods={periods} meters={meters} onFilterChange={onChange} />
        </div>
    );
}
