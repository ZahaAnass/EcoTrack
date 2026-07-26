import { ReportsView, type ReportsProps } from '@/components/eco/reports-view';

export default function AdminReports(props: ReportsProps) {
    return (
        <ReportsView
            {...props}
            baseUrl="/admin/reports"
            showTechnician
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reports', href: '/admin/reports' },
            ]}
        />
    );
}
