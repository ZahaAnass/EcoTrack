import React from "react";
import ConsumptionBarChart from "@/components/shared/charts/ConsumptionBarChart";
import AmountAreaChart from "@/components/shared/charts/AmountAreaChart";

export default function UserReportCharts({ data }: { data: any[] }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div><ConsumptionBarChart data={data} /></div>
            <div><AmountAreaChart data={data} /></div>
        </div>
    );
}
