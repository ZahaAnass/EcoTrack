import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { type SharedData } from '@/types';

/**
 * Surfaces Laravel flash messages ("success" / "error") as toasts after
 * every Inertia visit.
 */
export function useFlash(): void {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);
}
