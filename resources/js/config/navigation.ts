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
        { title: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
        { title: "Meters", href: "/admin/meters", icon: Gauge },
        { title: "Periods", href: "/admin/periods", icon: Clock },
        { title: "Consumptions", href: "/admin/consumptions", icon: Bolt },
        { title: "Technicians", href: "/admin/technicians", icon: Users },
        { title: "Users", href: "/admin/users", icon: UserCog },
        { title: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],

    technician: [
        { title: "Dashboard", href: "/technician/dashboard", icon: LayoutGrid },
        { title: "Add Consumption", href: "/technician/consumptions/create", icon: PlusCircle },
        { title: "My Entries", href: "/technician/consumptions/mine", icon: ListChecks },
    ],

    user: [
        { title: "Dashboard", href: "/user/dashboard", icon: LayoutGrid },
        { title: "History", href: "/user/consumptions", icon: History },
        { title: "Reports", href: "/user/reports", icon: BarChart3 },
    ],
};
