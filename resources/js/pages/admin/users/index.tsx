import {
    ColumnsMenu,
    SortableHead,
    useColumnVisibility,
    useSort,
} from '@/components/eco/data-table';
import { EmptyState } from '@/components/eco/empty-state';
import { PageHeader } from '@/components/eco/page-header';
import InertiaPagination from '@/components/inertia-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useFilters } from '@/hooks/use-filters';
import { useT } from '@/lib/i18n';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
    type BreadcrumbItem,
    type Paginated,
    type Role,
    type SharedData,
    type User,
} from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, PlusCircle, Search, Trash2, Users } from 'lucide-react';

interface Props {
    users: Paginated<User>;
    filters: { search?: string; role?: string };
    roleCounts: {
        all: number;
        admin: number;
        technician: number;
        user: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

const roleStyles: Record<Role, string> = {
    admin: 'bg-primary/12 text-primary',
    technician: 'bg-electricity/12 text-electricity',
    user: 'bg-muted text-muted-foreground',
};

const roleLabels: Record<Role, string> = {
    admin: 'Admin',
    technician: 'Technician',
    user: 'Viewer',
};

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'admin', label: 'Admins' },
    { key: 'technician', label: 'Technicians' },
    { key: 'user', label: 'Viewers' },
] as const;

function RoleBadge({ role }: { role: Role }) {
    const t = useT();
    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                roleStyles[role],
            )}
        >
            {t(roleLabels[role])}
        </span>
    );
}

function UserActions({ user, isSelf }: { user: User; isSelf: boolean }) {
    const t = useT();
    return (
        <div className="flex items-center justify-end gap-1.5">
            <Button size="icon" variant="ghost" asChild aria-label={t('Edit user')}>
                <Link href={`/admin/users/${user.id}/edit`} prefetch>
                    <Pencil className="size-4" />
                </Link>
            </Button>
            {!isSelf && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            aria-label={t('Delete user')}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete {user.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Their account is removed permanently. Readings
                                they recorded stay in the history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-white hover:bg-destructive/90"
                                onClick={() =>
                                    router.delete(`/admin/users/${user.id}`, {
                                        preserveScroll: true,
                                    })
                                }
                            >
                                {t('Delete user')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}

const USER_COLUMNS = [
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'readings', label: 'Readings' },
    { key: 'joined', label: 'Joined' },
];

export default function UsersIndex({ users, filters, roleCounts }: Props) {
    const t = useT();
    const { auth } = usePage<SharedData>().props;
    const sort = useSort();
    const visibility = useColumnVisibility('admin-users');

    const { values, set } = useFilters('/admin/users', {
        search: filters.search ?? '',
        role: filters.role ?? 'all',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <PageHeader
                    title={t('Users & roles')}
                    description={t('Who can record, approve, and view consumption data.')}
                    actions={
                        <Button asChild>
                            <Link href="/admin/users/create" prefetch>
                                <PlusCircle className="size-4" />
                                {t('Add user')}
                            </Link>
                        </Button>
                    }
                />

                <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1 sm:w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => set('role', tab.key)}
                            className={cn(
                                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                values.role === tab.key
                                    ? 'bg-card text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {t(tab.label)}
                            <span className="figure ml-1.5 text-xs text-muted-foreground">
                                {roleCounts[tab.key]}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="relative sm:max-w-sm">
                    <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={values.search}
                        onChange={(e) =>
                            set('search', e.target.value, { debounce: true })
                        }
                        placeholder={t('Search by name or email…')}
                        className="pl-8"
                    />
                </div>

                {users.data.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={t('No users found')}
                        description={t('Try a different search, or add a new user.')}
                    />
                ) : (
                    <>
                        <ColumnsMenu
                            columns={USER_COLUMNS}
                            visibility={visibility}
                        />

                        {/* Desktop */}
                        <div className="hidden overflow-x-auto rounded-xl border md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <SortableHead
                                            sortKey="name"
                                            label="Name"
                                            sort={sort}
                                        />
                                        {visibility.isVisible('email') && (
                                            <SortableHead
                                                sortKey="email"
                                                label="Email"
                                                sort={sort}
                                            />
                                        )}
                                        {visibility.isVisible('role') && (
                                            <SortableHead
                                                sortKey="role"
                                                label="Role"
                                                sort={sort}
                                            />
                                        )}
                                        {visibility.isVisible('readings') && (
                                            <SortableHead
                                                sortKey="readings"
                                                label={t('Readings')}
                                                sort={sort}
                                                descFirst
                                                className="text-right"
                                            />
                                        )}
                                        {visibility.isVisible('joined') && (
                                            <SortableHead
                                                sortKey="joined"
                                                label={t('Joined')}
                                                sort={sort}
                                                descFirst
                                            />
                                        )}
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                                {user.id === auth.user.id && (
                                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                                        {t('(you)')}
                                                    </span>
                                                )}
                                            </TableCell>
                                            {visibility.isVisible('email') && (
                                                <TableCell className="text-muted-foreground">
                                                    {user.email}
                                                </TableCell>
                                            )}
                                            {visibility.isVisible('role') && (
                                                <TableCell>
                                                    <RoleBadge
                                                        role={user.role}
                                                    />
                                                </TableCell>
                                            )}
                                            {visibility.isVisible(
                                                'readings',
                                            ) && (
                                                <TableCell className="figure text-right">
                                                    {user.consumption_records_count ??
                                                        0}
                                                </TableCell>
                                            )}
                                            {visibility.isVisible('joined') && (
                                                <TableCell className="text-muted-foreground">
                                                    {formatDate(
                                                        user.created_at,
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <UserActions
                                                    user={user}
                                                    isSelf={
                                                        user.id === auth.user.id
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile */}
                        <div className="flex flex-col gap-3 md:hidden">
                            {users.data.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-xl border bg-card p-4 shadow-xs"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {user.name}
                                                {user.id === auth.user.id && (
                                                    <span className="ml-1.5 text-xs text-muted-foreground">
                                                        {t('(you)')}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <RoleBadge role={user.role} />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            {t('Joined')} {formatDate(user.created_at)}
                                        </p>
                                        <UserActions
                                            user={user}
                                            isSelf={user.id === auth.user.id}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <InertiaPagination data={users} />
                    </>
                )}
            </div>
        </AppLayout>
    );
}
