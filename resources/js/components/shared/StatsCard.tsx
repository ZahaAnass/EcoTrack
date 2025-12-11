import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value, colorClass }: { title: string; value: React.ReactNode; colorClass?: string }) {
    return (
        <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${colorClass ?? ""}`}>{value}</p>
            </CardContent>
        </Card>
    );
}
