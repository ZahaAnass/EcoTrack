import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type MeterType } from '@/types';
import { Droplets, Zap } from 'lucide-react';

export function UtilityBadge({
    type,
    className,
    label,
}: {
    type: MeterType;
    className?: string;
    label?: string;
}) {
    const t = useT();
    const isWater = type === 'water';
    const Icon = isWater ? Droplets : Zap;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                isWater
                    ? 'bg-water/12 text-water'
                    : 'bg-electricity/12 text-electricity',
                className,
            )}
        >
            <Icon className="size-3" />
            {label ?? (isWater ? t('Water') : t('Electricity'))}
        </span>
    );
}
