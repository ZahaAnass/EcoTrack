import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useRef } from "react";
import { debounce } from "lodash";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EntriesTable from "@/components/shared/EntriesTable";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ConsumptionRecord, Period } from "@/types";

type Props = {
    records: { data: ConsumptionRecord[]; links: any[]; };
    filters: any;
    periods: Period[];
};

export default function MyEntries({ records, filters, periods }: Props) {
    const handleSearch = useRef(debounce((q:string) => {
        router.get("/technician/consumptions/mine", { ...filters, search: q }, { preserveState: true, replace: true });
    }, 500)).current;

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value);

    const onEdit = (id:number) => router.visit(`/technician/consumptions/${id}/edit`);
    const onDelete = (id:number) => {
        if (!confirm("Delete this entry?")) return;
        router.delete(`/technician/consumptions/${id}`, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="My Entries" />
            <div className="p-4">
                <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                        <div className="relative w-64">
                            <Input defaultValue={filters.search ?? ""} onChange={onSearchChange} className="peer ps-9" placeholder="Search..." />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-muted-foreground/80"><Search size={16} /></div>
                        </div>

                        <Select defaultValue={filters.status ?? "all"} onValueChange={(v)=>router.get("/technician/consumptions/mine",{...filters,status: v==="all"?null:v},{preserveState:true,replace:true})}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
                        </Select>

                        <Select defaultValue={filters.period_id ?? "all"} onValueChange={(v)=>router.get("/technician/consumptions/mine",{...filters,period_id: v==="all"?null:v},{preserveState:true,replace:true})}>
                            <SelectTrigger className="w-48"><SelectValue placeholder="All Periods" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">All Periods</SelectItem>{periods.map(p=> <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>

                        <Button asChild><Link href="/technician/consumptions/create">+ Add New</Link></Button>
                    </CardHeader>

                    <CardContent>
                        <EntriesTable records={records.data} showActions onEdit={onEdit} onDelete={onDelete} />
                        {/* pagination component if you have one */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
