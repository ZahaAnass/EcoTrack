import { type NavItem } from "@/types";
import {
    LayoutGrid,
    Gauge,
    Clock,
    Bolt,
    Users,
    UserCog,
    BarChart3,
    PlusCircle,
    ListChecks,
    History
} from "lucide-react";

export const navigation: Record<string, NavItem[]> = {
    admin: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
        { title: "Meters", href: "/meters", icon: Gauge },
        { title: "Periods", href: "/periods", icon: Clock },
        { title: "Consumptions", href: "/consumptions", icon: Bolt },
        { title: "Technicians", href: "/technicians", icon: Users },
        { title: "Users", href: "/users", icon: UserCog },
        { title: "Reports", href: "/reports", icon: BarChart3 },
    ],

    technician: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
        { title: "Add Consumption", href: "/consumptions/create", icon: PlusCircle },
        { title: "My Entries", href: "/consumptions/mine", icon: ListChecks },
    ],

    user: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutGrid },
        { title: "History", href: "/history", icon: History },
        { title: "Reports", href: "/reports", icon: BarChart3 },
    ],
};
