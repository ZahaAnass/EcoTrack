import { Button } from '@/components/ui/button';
import { useT } from '@/lib/i18n';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function InertiaPagination({ data }: { data: PaginationData }) {
    const t = useT();

    return (
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted-foreground">
                {data.total > 0
                    ? t('Showing :from to :to of :total results', {
                          from: data.from ?? 0,
                          to: data.to ?? 0,
                          total: data.total,
                      })
                    : t('No results found')}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {data.links.map((link, i) => {
                    const isDisabled = link.url === null;
                    const isDots = link.label.includes('...');
                    const label = link.label
                        .replace('&laquo; Previous', '&laquo; ' + t('Previous'))
                        .replace('Next &raquo;', t('Next') + ' &raquo;');

                    return (
                        <Button
                            key={i}
                            asChild={!isDisabled && !isDots}
                            disabled={isDisabled || isDots}
                            variant={link.active ? 'default' : 'outline'}
                            size="sm"
                            className={`min-w-[40px] ${isDots ? 'opacity-60' : ''}`}
                        >
                            {isDisabled || isDots ? (
                                <span dangerouslySetInnerHTML={{ __html: label }} />
                            ) : (
                                <Link
                                    href={link.url!}
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
