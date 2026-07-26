import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

const tones = {
    default: {
        card: 'bg-card',
        value: 'text-foreground',
        icon: 'bg-muted text-muted-foreground',
    },
    electricity: {
        card: 'border-electricity/25 bg-gradient-to-br from-electricity/12 via-card to-card',
        value: 'text-electricity',
        icon: 'bg-electricity/15 text-electricity',
    },
    water: {
        card: 'border-water/25 bg-gradient-to-br from-water/12 via-card to-card',
        value: 'text-water',
        icon: 'bg-water/15 text-water',
    },
    pending: {
        card: 'border-amber-500/25 bg-gradient-to-br from-amber-500/12 via-card to-card',
        value: 'text-amber-600 dark:text-amber-400',
        icon: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    success: {
        card: 'border-primary/25 bg-gradient-to-br from-primary/12 via-card to-card',
        value: 'text-primary',
        icon: 'bg-primary/15 text-primary',
    },
    danger: {
        card: 'border-destructive/25 bg-gradient-to-br from-destructive/10 via-card to-card',
        value: 'text-destructive',
        icon: 'bg-destructive/12 text-destructive',
    },
} as const;

export function StatCard({
    label,
    value,
    unit,
    icon: Icon,
    tone = 'default',
    hint,
    className,
}: {
    label: string;
    value: string | number;
    unit?: string;
    icon?: LucideIcon;
    tone?: keyof typeof tones;
    hint?: string;
    className?: string;
}) {
    const t = tones[tone];

    return (
        <div
            className={cn(
                'rounded-xl border p-4 shadow-xs transition-shadow hover:shadow-md',
                t.card,
                className,
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                {Icon && (
                    <span
                        className={cn(
                            'flex size-9 shrink-0 items-center justify-center rounded-lg',
                            t.icon,
                        )}
                    >
                        <Icon className="size-4.5" />
                    </span>
                )}
            </div>
            <p
                className={cn(
                    'figure mt-2 text-2xl font-semibold sm:text-3xl',
                    t.value,
                )}
            >
                {value}
                {unit && (
                    <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                        {unit}
                    </span>
                )}
            </p>
            {hint && (
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            )}
        </div>
    );
}
