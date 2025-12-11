import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import UserStats from "@/components/user/UserStats";
import UserEntriesTable from "@/components/user/UserEntriesTable";
import type { ConsumptionRecord } from "@/types";

export default function UserDashboard({ totalMeters, totalRecords, pending, approved, recentEntries }: { totalMeters:number; totalRecords:number; pending:number; approved:number; recentEntries: ConsumptionRecord[] }) {
    return (
        <AppLayout>
            <Head title="User Dashboard" />
            <div className="p-4 flex flex-col gap-6">
                <UserStats totalMeters={totalMeters} totalRecords={totalRecords} pending={pending} approved={approved} />
                <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Records</h2>
                        <Link href="/user/consumptions" className="btn">View All</Link>
                    </div>
                    <UserEntriesTable records={recentEntries} />
                </div>
            </div>
        </AppLayout>
    );
}
