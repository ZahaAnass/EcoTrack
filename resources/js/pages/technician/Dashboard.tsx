import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import TechnicianStats from "@/components/technician/TechnicianStats";
import TechnicianEntriesTable from "@/components/technician/TechnicianEntriesTable";
import type { ConsumptionRecord } from "@/types";

type Props = {
    metersCount: number;
    myEntriesCount: number;
    recentEntries: ConsumptionRecord[];
};

export default function Dashboard({ metersCount, myEntriesCount, recentEntries }: Props) {
    const pending = recentEntries.filter(e => e.status === "pending").length;

    const onEdit = (id: number) => window.location.href = `/technician/consumptions/${id}/edit`;
    const onDelete = (id: number) => {
        if (!confirm("Are you sure to delete?")) return;
        // use Inertia router or fetch to delete - simple redirect for now
        fetch(`/technician/consumptions/${id}`, { method: "DELETE", headers: { "X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '' } })
            .then(()=> location.reload());
    };

    return (
        <AppLayout>
            <Head title="Technician Dashboard" />
            <div className="p-4 flex flex-col gap-4">
                <TechnicianStats metersCount={metersCount} myEntriesCount={myEntriesCount} pendingCount={pending} />
                <div className="rounded-xl border p-4 border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Entries</h2>
                        <Link href="/technician/consumptions/mine" className="btn">View All</Link>
                    </div>

                    <TechnicianEntriesTable records={recentEntries} onEdit={onEdit} onDelete={onDelete} />
                </div>
            </div>
        </AppLayout>
    );
}
