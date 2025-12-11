import React from "react";
import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" }) {
    if (status === "pending") {
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    }
    if (status === "approved") {
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
    }
    return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
}
