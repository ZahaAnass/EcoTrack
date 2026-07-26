import { useT } from '@/lib/i18n';

export default function HeadingSmall({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    const t = useT();

    return (
        <header>
            <h3 className="mb-0.5 text-base font-medium">{t(title)}</h3>
            {description && (
                <p className="text-sm text-muted-foreground">{t(description)}</p>
            )}
        </header>
    );
}
