import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ConsumptionRecord } from "@/types";

export default function ShowRecord({ consumptionRecord, user }: { consumptionRecord: ConsumptionRecord; user: any }) {
    return (
        <AppLayout>
            <Head title={`Record #${consumptionRecord.id}`} />
            <div className="p-4">
                <Card>
                    <CardHeader><h2 className="text-xl font-semibold">Consumption Record Details</h2></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div><h3 className="font-medium">Meter</h3><p>{consumptionRecord.meter?.name}</p></div>
                            <div><h3 className="font-medium">Period</h3><p>{consumptionRecord.period?.name} ({consumptionRecord.period?.start_time} - {consumptionRecord.period?.end_time})</p></div>
                            <div><h3 className="font-medium">Value</h3><p>{consumptionRecord.current_value} Kw</p></div>
                            <div><h3 className="font-medium">Amount</h3><p>{consumptionRecord.total_amount} MAD</p></div>
                            <div><h3 className="font-medium">Created By</h3><p>{user?.name} ({user?.email})</p></div>
                            <div><h3 className="font-medium">Created At</h3><p>{new Date(consumptionRecord.reading_date ?? consumptionRecord.created_at ?? "").toLocaleDateString()}</p></div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button variant="default" asChild><Link href="/user/consumptions">Back to Records</Link></Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
