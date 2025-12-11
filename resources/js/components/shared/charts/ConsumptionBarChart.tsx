import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ConsumptionBarChart({ data }: { data: any[] }) {
    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="consumption" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
