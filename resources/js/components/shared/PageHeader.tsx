import React from "react";

type Breadcrumb = { title: string; href?: string };

export default function PageHeader({ title, breadcrumbs }: { title: string; breadcrumbs?: Breadcrumb[] }) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            {breadcrumbs && (
                <nav className="text-sm text-muted-foreground mt-2">
                    {breadcrumbs.map((b, i) => (
                        <span key={i} className="after:content-['/'] after:px-2 last:after:content-['']">
                        {b.href ? <a href={b.href} className="hover:underline">{b.title}</a> : b.title}
            </span>
                    ))}
                </nav>
            )}
        </div>
    );
}
