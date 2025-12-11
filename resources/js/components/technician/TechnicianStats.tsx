import React from "react";
import StatsCard from "@/components/shared/StatsCard";

export default function TechnicianStats({ metersCount, myEntriesCount, pendingCount }: { metersCount: number; myEntriesCount: number; pendingCount: number; }) {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 text-center">
            <StatsCard title="Total Meters" value={metersCount} />
            <StatsCard title="My Entries" value={myEntriesCount} />
            <StatsCard title="Pending Approvals" value={<span className="text-yellow-600 font-bold">{pendingCount}</span>} />
        </div>
    );
}
