import React from "react";
import EntriesTable from "@/components/shared/EntriesTable";
import type { ConsumptionRecord } from "@/types";

export default function UserEntriesTable({ records }: { records: ConsumptionRecord[] }) {
    return <EntriesTable records={records} showActions={false} />;
}
