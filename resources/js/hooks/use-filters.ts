import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Server-side filter state for index pages. Text changes are debounced,
 * select changes apply immediately; both reload only the current page's
 * props while preserving scroll. Query params this hook does not manage
 * (e.g. sort/dir) are preserved; the page number resets on every change.
 */
export function useFilters<T extends Record<string, string>>(url: string, initial: T) {
    const [values, setValues] = useState<T>(initial);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const managedKeys = useRef(Object.keys(initial));

    const visit = useCallback(
        (next: T) => {
            const params = new URLSearchParams(
                typeof window !== 'undefined' ? window.location.search : '',
            );

            for (const key of managedKeys.current) params.delete(key);
            params.delete('page'); // filters changed — back to the first page

            for (const [key, value] of Object.entries(next)) {
                if (value !== '' && value !== 'all') params.set(key, value);
            }

            const queryString = params.toString();
            router.get(queryString ? `${url}?${queryString}` : url, {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        [url],
    );

    const set = useCallback(
        (key: keyof T, value: string, { debounce = false }: { debounce?: boolean } = {}) => {
            setValues((prev) => {
                const next = { ...prev, [key]: value };

                if (debounceRef.current) clearTimeout(debounceRef.current);
                if (debounce) {
                    debounceRef.current = setTimeout(() => visit(next), 350);
                } else {
                    visit(next);
                }

                return next;
            });
        },
        [visit],
    );

    /** Update several filters in one visit (e.g. switching utility resets meter/period). */
    const setMany = useCallback(
        (updates: Partial<T>) => {
            setValues((prev) => {
                const next = { ...prev, ...updates };
                if (debounceRef.current) clearTimeout(debounceRef.current);
                visit(next);
                return next;
            });
        },
        [visit],
    );

    useEffect(() => () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
    }, []);

    return { values, set, setMany };
}
