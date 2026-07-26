import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type RecordStatus } from '@/types';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

const styles: Record<
    RecordStatus,
    { className: string; icon: typeof Clock3; label: string }
> = {
    pending: {
        className: 'bg-amber-500/12 text-amber-700 dark:text-amber-400',
        icon: Clock3,
        label: 'Pending',
    },
    approved: {
        className: 'bg-primary/12 text-primary',
        icon: CheckCircle2,
        label: 'Approved',
    },
    rejected: {
        className: 'bg-destructive/12 text-destructive',
        icon: XCircle,
        label: 'Rejected',
    },
};

export function StatusBadge({
    status,
    className,
}: {
    status: RecordStatus;
    className?: string;
}) {
    const t = useT();
    const { className: tone, icon: Icon, label } = styles[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                tone,
                className,
            )}
        >
            <Icon className="size-3" />
            {t(label)}
        </span>
    );
}
