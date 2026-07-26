import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/lib/i18n';
import { type ConsumptionRecord } from '@/types';
import { router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Approve / reject controls for a pending reading. Rejecting asks for an
 * optional reason that the technician will see on their entry.
 */
export function ApprovalActions({
    record,
    size = 'sm',
}: {
    record: ConsumptionRecord;
    size?: 'sm' | 'default';
}) {
    const t = useT();
    const [rejectOpen, setRejectOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [busy, setBusy] = useState(false);

    if (record.status === 'approved') return null;

    const approve = () => {
        setBusy(true);
        router.post(
            `/admin/consumptions/${record.id}/approve`,
            {},
            { preserveScroll: true, onFinish: () => setBusy(false) },
        );
    };

    const reject = () => {
        setBusy(true);
        router.post(
            `/admin/consumptions/${record.id}/reject`,
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => setRejectOpen(false),
                onFinish: () => setBusy(false),
            },
        );
    };

    return (
        <div className="flex items-center gap-1.5">
            <Button size={size} onClick={approve} disabled={busy}>
                <Check className="size-4" />
                {t('Approve')}
            </Button>

            {record.status !== 'rejected' && (
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size={size}
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            disabled={busy}
                        >
                            <X className="size-4" />
                            {t('Reject')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Reject this reading?')}</DialogTitle>
                            <DialogDescription>
                                {t(
                                    ':meter — :value :unit, recorded by :technician. They will see your reason and can correct and resubmit.',
                                    {
                                        meter: record.meter?.name ?? '—',
                                        value: record.current_value,
                                        unit: record.meter?.unit ?? '',
                                        technician: record.user?.name ?? t('a technician'),
                                    },
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                            <Label htmlFor={`reason-${record.id}`}>
                                {t('Reason (optional)')}
                            </Label>
                            <Input
                                id={`reason-${record.id}`}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={t('e.g. Value does not match the meter photo')}
                                maxLength={255}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
                                {t('Cancel')}
                            </Button>
                            <Button variant="destructive" onClick={reject} disabled={busy}>
                                {t('Reject reading')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
