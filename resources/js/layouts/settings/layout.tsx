import Heading from '@/components/heading';
import { useT } from '@/lib/i18n';
import { cn, isSameUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, Palette, ShieldCheck, UserRound } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', href: edit(), icon: UserRound },
    { title: 'Password', href: editPassword(), icon: KeyRound },
    { title: 'Two-Factor Auth', href: show(), icon: ShieldCheck },
    { title: 'Appearance', href: editAppearance(), icon: Palette },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const t = useT();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6 sm:px-6">
            <Heading
                title={t('Settings')}
                description={t('Manage your profile and account settings')}
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-56">
                    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
                        {sidebarNavItems.map((item) => {
                            const active = isSameUrl(currentPath, item.href);

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={cn(
                                        'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-primary/10 text-primary ring-1 ring-primary/25'
                                            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'size-4',
                                                active
                                                    ? 'text-primary'
                                                    : 'text-muted-foreground',
                                            )}
                                        />
                                    )}
                                    {t(item.title)}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 lg:max-w-2xl">
                    <section className="space-y-8 rounded-xl border bg-card p-5 shadow-xs sm:p-6">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
