import { type NavItem, type Role } from '@/types';
import {
    BarChart3,
    Calculator,
    Fuel,
    CheckSquare,
    Clock,
    Gauge,
    History,
    LayoutGrid,
    ListChecks,
    PlusCircle,
    Users,
} from 'lucide-react';

export const navigation: Record<Role, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
        { title: 'Approvals', href: '/admin/consumptions', icon: CheckSquare },
        { title: 'Meters', href: '/admin/meters', icon: Gauge },
        { title: 'Tariff periods', href: '/admin/periods', icon: Clock },
        { title: 'Gasoil', href: '/admin/gasoil', icon: Fuel },
        { title: 'Users', href: '/admin/users', icon: Users },
        { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
        { title: 'Simulator', href: '/admin/simulator', icon: Calculator },
    ],

    technician: [
        { title: 'Dashboard', href: '/technician/dashboard', icon: LayoutGrid },
        { title: 'New reading', href: '/technician/consumptions/create', icon: PlusCircle },
        { title: 'My entries', href: '/technician/consumptions', icon: ListChecks },
    ],

    user: [
        { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid },
        { title: 'History', href: '/user/consumptions', icon: History },
        { title: 'Reports', href: '/user/reports', icon: BarChart3 },
    ],
};
