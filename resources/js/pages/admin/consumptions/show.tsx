import { ApprovalActions } from '@/components/eco/approval-actions';
import { PageHeader } from '@/components/eco/page-header';
import { useT } from '@/lib/i18n';
import { RecordDetail } from '@/components/eco/record-detail';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ConsumptionRecord } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface Props {
    record: ConsumptionRecord;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Approvals', href: '/admin/consumptions' },
    { title: 'Reading', href: '#' },
];

export default function AdminShowRecord({ record }: Props) {
    const t = useT();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reading — ${record.meter?.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex w-full flex-col gap-6">
                    <PageHeader
                        title={t('Reading detail')}
                        actions={
                            <>
                                <Button variant="outline" asChild>
                                    <Link href="/admin/consumptions" prefetch>
                                        <ArrowLeft className="size-4" />{t('Back')}</Link>
                                </Button>
                                <ApprovalActions
                                    record={record}
                                    size="default"
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                            {t('Delete')}</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete this reading?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {record.meter?.name} —{' '}
                                                {record.current_value}{' '}
                                                {record.meter?.unit}. Deleting
                                                removes it from all reports.
                                                This cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-white hover:bg-destructive/90"
                                                onClick={() =>
                                                    router.delete(
                                                        `/admin/consumptions/${record.id}`,
                                                    )
                                                }
                                            >
                                                {t('Delete reading')}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        }
                    />

                    <RecordDetail record={record} />
                </div>
            </div>
        </AppLayout>
    );
}
