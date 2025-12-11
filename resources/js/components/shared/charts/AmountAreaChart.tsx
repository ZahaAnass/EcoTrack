import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AmountAreaChart({ data }: { data: any[] }) {
    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <Tooltip />
                    <Area type="natural" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
