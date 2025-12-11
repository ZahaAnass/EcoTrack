import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import UserEntriesTable from "@/components/user/UserEntriesTable";
import type { ConsumptionRecord } from "@/types";

export default function History({ consumptionRecords }: { consumptionRecords: { data: ConsumptionRecord[]; links:any[] } }) {
    return (
        <AppLayout>
            <Head title="History" />
            <div className="p-4">
                <UserEntriesTable records={consumptionRecords.data} />
                {/* you can add pagination UI using consumptionRecords.links */}
            </div>
        </AppLayout>
    );
}
