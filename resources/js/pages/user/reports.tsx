import { ReportsView, type ReportsProps } from '@/components/eco/reports-view';

export default function UserReports(props: ReportsProps) {
    return (
        <ReportsView
            {...props}
            baseUrl="/user/reports"
            breadcrumbs={[
                { title: 'Dashboard', href: '/user/dashboard' },
                { title: 'Reports', href: '/user/reports' },
            ]}
        />
    );
}
