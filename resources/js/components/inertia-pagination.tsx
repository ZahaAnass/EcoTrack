import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

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
    return (
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">

            {/* Showing X to Y of Z */}
            <div className="text-sm text-muted-foreground">
                {data.total > 0 ? (
                    <>Showing <strong>{data.from}</strong> to <strong>{data.to}</strong> of <strong>{data.total}</strong> results</>
                ) : (
                    <>No results found</>
                )}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2">
                {data.links.map((link, i) => {
                    const isDisabled = link.url === null;
                    const isDots = link.label.includes("...");

                    return (
                        <Button
                            key={i}
                            asChild={!isDisabled && !isDots}
                            disabled={isDisabled || isDots}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            className={`min-w-[40px] ${isDots ? "opacity-60" : ""}`}
                        >
                            {isDisabled || isDots ? (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <Link
                                    href={link.url!}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
