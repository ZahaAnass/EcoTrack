import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALES, useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Check, Languages } from 'lucide-react';

export function LocaleSwitcher() {
    const { locale, setLocale } = useI18n();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Language" className="gap-1.5">
                    <Languages className="size-4" />
                    <span className="text-xs font-semibold uppercase">{locale}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                {LOCALES.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => {
                            setLocale(option.value);
                            // Refresh server-provided props (flash, errors) in
                            // the new language on the next interaction.
                            router.reload();
                        }}
                        className="flex items-center justify-between"
                    >
                        <span className={cn(option.value === 'ar' && 'font-medium')}>
                            {option.label}
                        </span>
                        {locale === option.value && <Check className="size-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
