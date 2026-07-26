import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { navigation } from '@/config/navigation';
import { useI18n } from '@/lib/i18n';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const { locale } = useI18n();
    const role = auth.user.role;

    const mainNavItems: NavItem[] = navigation[role] ?? [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    ];

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            // In RTL the sidebar lives on the right; the fixed panel must
            // follow the flow side or it overlaps the content.
            side={locale === 'ar' ? 'right' : 'left'}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
