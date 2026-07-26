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
    currency: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash: { success?: string | null; error?: string | null };
    [key: string]: unknown;
}

export type Role = 'admin' | 'technician' | 'user';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    consumption_records_count?: number;
    [key: string]: unknown; // This allows for additional properties...
}

export type MeterType = 'electricity' | 'water';

export interface Meter {
    id: number;
    name: string;
    serial_number: string | null;
    type: MeterType;
    unit: string;
    location?: string | null;
    status: 'active' | 'inactive';
    consumption_records_count?: number;
    created_at?: string;
}

export interface Period {
    id: number;
    name: string;
    start_time?: string;
    end_time?: string;
    unit_price?: number;
    consumption_records_count?: number;
}

export type RecordStatus = 'pending' | 'approved' | 'rejected';

export interface ConsumptionRecord {
    id: number;
    meter: Meter;
    period: Period;
    user?: Pick<User, 'id' | 'name' | 'email'> | null;
    approver?: Pick<User, 'id' | 'name'> | null;
    reading_date: string;
    created_at?: string;
    updated_at?: string;
    current_value: number;
    previous_value: number;
    calculated_value: number;
    unit_price: number;
    total_amount: number;
    status: RecordStatus;
    approved_at?: string | null;
    rejection_reason?: string | null;
}

export interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
    current_page: number;
    last_page: number;
}

export interface DailyPoint {
    date: string;
    electricity: number;
    water: number;
    amount?: number;
}
