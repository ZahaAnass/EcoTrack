import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n';
import { formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellOff,
    CheckCircle2,
    Clock3,
    Fuel,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import { useEffect } from 'react';

interface NotificationItem {
    id: string;
    read: boolean;
    created_at: string;
    kind:
        | 'reading_submitted'
        | 'reading_resubmitted'
        | 'reading_approved'
        | 'reading_rejected'
        | 'gasoil_low';
    meter?: string;
    meter_type?: 'electricity' | 'water';
    unit?: string;
    consumption?: number;
    technician?: string;
    reason?: string | null;
    remaining_liters?: number;
    url?: string;
}

interface NotificationsProp {
    items: NotificationItem[];
    unread: number;
}

const kindConfig = {
    reading_submitted: { icon: Clock3, tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    reading_resubmitted: { icon: RefreshCw, tone: 'bg-water/15 text-water' },
    reading_approved: { icon: CheckCircle2, tone: 'bg-primary/15 text-primary' },
    reading_rejected: { icon: XCircle, tone: 'bg-destructive/15 text-destructive' },
    gasoil_low: { icon: Fuel, tone: 'bg-gasoil/15 text-gasoil' },
} as const;

function timeAgo(iso: string, locale: string): string {
    const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (seconds < 60) return rtf.format(-seconds, 'second');
    if (seconds < 3600) return rtf.format(-Math.round(seconds / 60), 'minute');
    if (seconds < 86400) return rtf.format(-Math.round(seconds / 3600), 'hour');
    return rtf.format(-Math.round(seconds / 86400), 'day');
}

export function NotificationBell() {
    const { t, locale } = useI18n();
    const page = usePage();
    const notifications = (page.props.notifications as NotificationsProp | undefined) ?? {
        items: [],
        unread: 0,
    };

    // Keep the bell fresh while the user stays on one screen.
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['notifications'] });
        }, 60_000);
        return () => clearInterval(interval);
    }, []);

    const open = (item: NotificationItem) => {
        router.post(
            `/notifications/${item.id}/read`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (item.url) router.visit(item.url);
                },
            },
        );
    };

    const message = (item: NotificationItem): string => {
        const amount = `${formatNumber(item.consumption)} ${item.unit ?? ''}`.trim();

        switch (item.kind) {
            case 'reading_submitted':
                return t(':technician recorded :amount on :meter', {
                    technician: item.technician ?? t('A technician'),
                    amount,
                    meter: item.meter ?? '—',
                });
            case 'reading_resubmitted':
                return t(':technician resubmitted :amount on :meter', {
                    technician: item.technician ?? t('A technician'),
                    amount,
                    meter: item.meter ?? '—',
                });
            case 'reading_approved':
                return t('Your reading of :amount on :meter was approved', {
                    amount,
                    meter: item.meter ?? '—',
                });
            case 'reading_rejected':
                return t('Your reading of :amount on :meter was rejected', {
                    amount,
                    meter: item.meter ?? '—',
                });
            case 'gasoil_low':
                return t('Gasoil stock is low: :liters L remaining', {
                    liters: formatNumber(item.remaining_liters ?? 0),
                });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('Notifications')} className="relative">
                    <Bell className="size-4.5" />
                    {notifications.unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                            {notifications.unread > 9 ? '9+' : notifications.unread}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-88 p-0">
                <div className="flex items-center justify-between border-b px-4 py-2.5">
                    <p className="text-sm font-semibold">{t('Notifications')}</p>
                    {notifications.unread > 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                router.post('/notifications/read-all', {}, { preserveScroll: true })
                            }
                            className="text-xs font-medium text-primary hover:underline"
                        >
                            {t('Mark all as read')}
                        </button>
                    )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notifications.items.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                            <BellOff className="size-6 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {t('Nothing here yet — new activity will show up in this bell.')}
                            </p>
                        </div>
                    ) : (
                        notifications.items.map((item) => {
                            const config = kindConfig[item.kind] ?? kindConfig.reading_submitted;
                            const Icon = config.icon;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => open(item)}
                                    className={cn(
                                        'flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-accent/60',
                                        !item.read && 'bg-primary/[0.05]',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                                            config.tone,
                                        )}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm leading-snug">
                                            {message(item)}
                                        </span>
                                        {item.reason && (
                                            <span className="mt-0.5 block text-xs text-destructive">
                                                {t('Reason')}: {item.reason}
                                            </span>
                                        )}
                                        <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {timeAgo(item.created_at, locale)}
                                        </span>
                                    </span>
                                    {!item.read && (
                                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
