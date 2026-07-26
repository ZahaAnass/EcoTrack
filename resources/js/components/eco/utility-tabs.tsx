import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type MeterType } from '@/types';
import { Droplets, Zap } from 'lucide-react';

/**
 * Electricity and water are separate pages — this switch is the page picker,
 * not a filter.
 */
export function UtilityTabs({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: MeterType) => void;
}) {
    const t = useT();

    return (
        <div className="flex w-full gap-1 rounded-xl bg-muted p-1 sm:w-fit">
            <button
                type="button"
                onClick={() => onChange('electricity')}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none',
                    value !== 'water'
                        ? 'bg-card text-electricity shadow-sm ring-1 ring-electricity/30'
                        : 'text-muted-foreground hover:text-foreground',
                )}
            >
                <Zap className="size-4" />
                {t('Electricity')}
            </button>
            <button
                type="button"
                onClick={() => onChange('water')}
                className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none',
                    value === 'water'
                        ? 'bg-card text-water shadow-sm ring-1 ring-water/30'
                        : 'text-muted-foreground hover:text-foreground',
                )}
            >
                <Droplets className="size-4" />
                {t('Water')}
            </button>
        </div>
    );
}
