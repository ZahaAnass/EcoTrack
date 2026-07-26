import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

export function formatNumber(value: number | null | undefined, digits = 2): string {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
    });
}

export function useCurrency(): string {
    const { currency } = usePage<SharedData>().props;
    return currency ?? 'MAD';
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) return '—';
    return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function shortDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
}
