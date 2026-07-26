import { useT } from '@/lib/i18n';

export default function Heading({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    const t = useT();

    return (
        <div className="mb-8 space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">{t(title)}</h2>
            {description && (
                <p className="text-sm text-muted-foreground">{t(description)}</p>
            )}
        </div>
    );
}
