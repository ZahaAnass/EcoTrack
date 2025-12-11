import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import TechnicianForm from "@/components/technician/TechnicianForm";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import type { Meter, Period, ConsumptionRecord } from "@/types";

export default function EditConsumption({ meters, periods, entry }: { meters: Meter[]; periods: Period[]; entry: ConsumptionRecord }) {
    return (
        <AppLayout>
            <Head title="Edit Consumption" />
            <div className="p-4">
                <Card>
                    <CardHeader className="flex justify-between items-center"><h2 className="text-lg font-semibold">Edit Consumption</h2><Button asChild><Link href="/technician/consumptions/mine">Back</Link></Button></CardHeader>
                    <CardContent>
                        <TechnicianForm meters={meters} periods={periods} entry={entry} onSuccess={() => router.visit("/technician/consumptions/mine")} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
