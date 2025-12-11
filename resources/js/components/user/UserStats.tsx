import React from "react";
import StatsCard from "@/components/shared/StatsCard";

export default function UserStats({ totalMeters, totalRecords, pending, approved }: { totalMeters: number; totalRecords: number; pending: number; approved:number }) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatsCard title="Total Meters" value={totalMeters} />
            <StatsCard title="Total Records" value={totalRecords} />
            <StatsCard title="Pending" value={<span className="text-yellow-600 font-bold">{pending}</span>} />
            <StatsCard title="Approved" value={<span className="text-green-600 font-bold">{approved}</span>} />
        </div>
    );
}
