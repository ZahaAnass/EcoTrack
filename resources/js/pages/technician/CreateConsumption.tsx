import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import TechnicianForm from "@/components/technician/TechnicianForm";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import type { Meter, Period } from "@/types";

export default function CreateConsumption({ meters, periods }: { meters: Meter[]; periods: Period[] }) {
    return (
        <AppLayout>
            <Head title="Add Consumption" />
            <div className="p-4">
                <Card>
                    <CardHeader className="flex justify-between items-center"><h2 className="text-lg font-semibold">Add New Consumption</h2><Button asChild><Link href="/technician/dashboard">Back</Link></Button></CardHeader>
                    <CardContent>
                        <TechnicianForm meters={meters} periods={periods} onSuccess={() => router.visit("/technician/consumptions/mine")} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
