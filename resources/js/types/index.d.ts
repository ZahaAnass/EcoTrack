import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Meter = { id: number; name: string; location?: string; unit_price?: number };
export type Period = { id: number; name: string; start_time?: string; end_time?: string; unit_price?: number };
export type ConsumptionRecord = {
    id: number;
    meter: Meter;
    period: Period;
    user?: { id: number; name?: string; email?: string } | null;
    reading_date?: string;
    created_at?: string;
    updated_at?: string;
    current_value: number;
    previous_value?: number;
    calculated_value?: number;
    unit_price?: number;
    total_amount?: number;
    status: "pending" | "approved" | "rejected";
};

