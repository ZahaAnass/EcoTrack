import React from "react";
import EntriesTable from "@/components/shared/EntriesTable";
import type { ConsumptionRecord } from "@/types";

export default function TechnicianEntriesTable({ records, onEdit, onDelete }: { records: ConsumptionRecord[]; onEdit: (id: number)=>void; onDelete: (id:number)=>void }) {
    return <EntriesTable records={records} showActions onEdit={onEdit} onDelete={onDelete} />;
}
