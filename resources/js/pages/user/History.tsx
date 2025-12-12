import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import UserEntriesTable from "@/components/user/UserEntriesTable";
import type { ConsumptionRecord } from "@/types";
import InertiaPagination from '@/components/inertia-pagination';

type LaravelPagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
};

export default function History({ consumptionRecords }: { consumptionRecords: LaravelPagination<ConsumptionRecord> }) {
    return (
        <AppLayout breadcrumbs={[{ title: "All Records", href: "/user/consumptions" }]}>
            <Head title="History" />
            <div className="p-4">
                <UserEntriesTable records={consumptionRecords.data} />
                <InertiaPagination data={consumptionRecords} />
            </div>
        </AppLayout>
    );
}
