import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableHead } from '@/components/ui/table';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronsUpDown, Settings2 } from 'lucide-react';
import { useCallback, useState } from 'react';

/* ── Server-side sorting ───────────────────────────────────────────────── */

export interface SortState {
    activeSort: string | null;
    activeDir: 'asc' | 'desc';
    applySort: (key: string, descFirst?: boolean) => void;
}

/**
 * Reads sort/dir from the current URL and produces visits that re-query the
 * server — a sort always covers the whole filtered dataset, not one page.
 */
export function useSort(): SortState {
    const { url } = usePage();

    const query = new URLSearchParams(url.split('?')[1] ?? '');
    const activeSort = query.get('sort');
    const activeDir = query.get('dir') === 'asc' ? 'asc' : 'desc';

    const applySort = useCallback(
        (key: string, descFirst = false) => {
            const params = new URLSearchParams(url.split('?')[1] ?? '');
            const nextDir =
                activeSort === key
                    ? activeDir === 'asc'
                        ? 'desc'
                        : 'asc'
                    : descFirst
                      ? 'desc'
                      : 'asc';
            params.set('sort', key);
            params.set('dir', nextDir);
            params.delete('page'); // a new sort starts from the first page

            router.get(
                `${url.split('?')[0]}?${params.toString()}`,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        },
        [url, activeSort, activeDir],
    );

    return { activeSort, activeDir, applySort };
}

export function SortableHead({
    sortKey,
    label,
    sort,
    descFirst = false,
    className,
}: {
    sortKey: string;
    label: string;
    sort: SortState;
    /** Numbers/dates read best highest/newest first on the first click. */
    descFirst?: boolean;
    className?: string;
}) {
    const isActive = sort.activeSort === sortKey;
    const Icon = isActive
        ? sort.activeDir === 'asc'
            ? ArrowUp
            : ArrowDown
        : ChevronsUpDown;

    return (
        <TableHead className={className}>
            <button
                type="button"
                onClick={() => sort.applySort(sortKey, descFirst)}
                className={cn(
                    '-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:text-foreground',
                    isActive && 'font-semibold text-foreground',
                    className?.includes('text-right') && 'flex-row-reverse',
                )}
                aria-label={`Sort by ${label.toLowerCase()}`}
            >
                {label}
                <Icon className={cn('size-3.5', !isActive && 'opacity-50')} />
            </button>
        </TableHead>
    );
}

/* ── Column visibility ─────────────────────────────────────────────────── */

export interface ColumnVisibility {
    isVisible: (key: string) => boolean;
    toggle: (key: string) => void;
}

function loadHidden(storageKey: string): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
        const raw = window.localStorage.getItem(`columns:${storageKey}`);
        return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
        return new Set();
    }
}

/** Hidden-column set persisted per table in localStorage. */
export function useColumnVisibility(storageKey: string): ColumnVisibility {
    const [hidden, setHidden] = useState<Set<string>>(() =>
        loadHidden(storageKey),
    );

    const toggle = useCallback(
        (key: string) => {
            setHidden((prev) => {
                const next = new Set(prev);
                if (next.has(key)) {
                    next.delete(key);
                } else {
                    next.add(key);
                }
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(
                        `columns:${storageKey}`,
                        JSON.stringify([...next]),
                    );
                }
                return next;
            });
        },
        [storageKey],
    );

    const isVisible = useCallback((key: string) => !hidden.has(key), [hidden]);

    return { isVisible, toggle };
}

export function ColumnsMenu({
    columns,
    visibility,
}: {
    /** Hideable columns only — always-on columns don't belong in the menu. */
    columns: { key: string; label: string }[];
    visibility: ColumnVisibility;
}) {
    const t = useT();

    return (
        <div className="hidden justify-end md:flex">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings2 className="size-4" />
                        {t('Columns')}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>{t('Show columns')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.key}
                            checked={visibility.isVisible(column.key)}
                            onCheckedChange={() =>
                                visibility.toggle(column.key)
                            }
                            onSelect={(e) => e.preventDefault()}
                        >
                            {t(column.label)}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
