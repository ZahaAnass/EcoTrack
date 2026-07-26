import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <Icon className="size-5 text-muted-foreground" />
            </span>
            <p className="mt-1 font-medium">{title}</p>
            {description && (
                <p className="max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
