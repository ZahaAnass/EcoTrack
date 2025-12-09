import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Meter = {
    id: number;
    name: string;
};

type Period = {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
};

type ConsumptionRecord = {
    id: number;
    current_value: number;
    total_amount: number;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    meter: Meter;
    period: Period;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    consumptionRecord: ConsumptionRecord;
    user: User;
};

type DetailProps = {
    label: string;
    value: string | number
};

function Detail({ label, value }: DetailProps) {
    return (
        <div className="p-3 border rounded-lg">
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="text-base font-semibold mt-0.5">{value}</p>
        </div>
    );
}

export default function UserShow({ consumptionRecord, user }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const statusColor: Record<ConsumptionRecord["status"], string> = {
        pending: "bg-yellow-500",
        approved: "bg-green-600",
        rejected: "bg-red-600",
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: "All Records", href: "/user/consumptions" },
                { title: "Record #" + consumptionRecord.id, href: "" },
            ]}
        >
            <Head title={`Record #${consumptionRecord.id}`} />

            <div className="p-4">
                <Card className="shadow-md">
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Consumption Record Details
                            <Badge className={`${statusColor[consumptionRecord.status]}`}>
                                {consumptionRecord.status.toUpperCase()}
                            </Badge>
                        </h2>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <Detail label="Meter" value={consumptionRecord.meter.name} />

                            <Detail
                                label="Period"
                                value={`${consumptionRecord.period.name} (${consumptionRecord.period.start_time} → ${consumptionRecord.period.end_time})`}
                            />

                            <Detail
                                label="Value"
                                value={`${consumptionRecord.current_value} kW`}
                            />

                            <Detail
                                label="Total Amount"
                                value={`${consumptionRecord.total_amount} MAD`}
                            />

                            <Detail
                                label="Created By"
                                value={`${user.name} (${user.email})`}
                            />

                            <Detail
                                label="Created At"
                                value={formatDate(consumptionRecord.created_at)}
                            />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button asChild>
                                <Link href="/user/consumptions">Back to Records</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
