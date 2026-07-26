import AppLogoIcon from '@/components/app-logo-icon';
import { LocaleSwitcher } from '@/components/eco/locale-switcher';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    CheckSquare,
    Clock3,
    Download,
    Droplets,
    Eye,
    FileSpreadsheet,
    Gauge,
    LineChart,
    Moon,
    ShieldCheck,
    Smartphone,
    Sun,
    Wrench,
    Zap,
} from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

/* ── Theme toggle ──────────────────────────────────────────────────────── */

function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
        >
            {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
        </Button>
    );
}

/* ── Scroll-reveal helper ──────────────────────────────────────────────── */

function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn('reveal', visible && 'reveal-visible', className)}
            style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

/* ── Animated counter ──────────────────────────────────────────────────── */

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const duration = 1400;
                const tick = (now: number) => {
                    const p = Math.min((now - start) / duration, 1);
                    setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
                    if (p < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.4 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [to]);

    return (
        <span ref={ref} className="figure">
            {value.toLocaleString()}
            {suffix}
        </span>
    );
}

/* ── Hero dashboard mock ───────────────────────────────────────────────── */

const BAR_HEIGHTS = [42, 58, 38, 66, 52, 74, 60, 82, 70, 88, 78, 95];

function DashboardMock() {
    return (
        <div className="relative">
            {/* Floating badges */}
            <div className="absolute -top-5 -left-4 z-10 hidden items-center gap-2 rounded-xl border border-primary/30 bg-card/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur sm:flex">
                <CheckCircle2 className="size-4 text-primary" />
                Reading approved
            </div>
            <div className="absolute -right-3 -bottom-5 z-10 hidden items-center gap-2 rounded-xl border border-water/30 bg-card/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur sm:flex">
                <Droplets className="size-4 text-water" />
                Eau générale · +11.5 m³
            </div>

            <div className="rounded-2xl border bg-card/80 p-5 shadow-2xl backdrop-blur">
                {/* Window chrome */}
                <div className="mb-4 flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-destructive/60" />
                    <span className="size-2.5 rounded-full bg-electricity/60" />
                    <span className="size-2.5 rounded-full bg-primary/60" />
                    <span className="ml-3 text-xs text-muted-foreground">
                        ecotrack — facility overview
                    </span>
                </div>

                {/* Stat tiles */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-electricity/25 bg-gradient-to-br from-electricity/15 to-transparent p-3">
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Zap className="size-3.5 text-electricity" />{' '}
                            Electricity
                        </p>
                        <p className="figure mt-1 text-xl font-semibold text-electricity">
                            2,899{' '}
                            <span className="text-xs font-normal">kWh</span>
                        </p>
                    </div>
                    <div className="rounded-xl border border-water/25 bg-gradient-to-br from-water/15 to-transparent p-3">
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Droplets className="size-3.5 text-water" /> Water
                        </p>
                        <p className="figure mt-1 text-xl font-semibold text-water">
                            168.2{' '}
                            <span className="text-xs font-normal">m³</span>
                        </p>
                    </div>
                </div>

                {/* Animated chart */}
                <div className="mt-3 rounded-xl border p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last 30 days</span>
                        <span className="flex items-center gap-1">
                            <span className="eco-pulse inline-block size-2 rounded-full bg-primary" />
                            live
                        </span>
                    </div>
                    <div className="mt-2 flex h-24 items-end gap-1.5">
                        {BAR_HEIGHTS.map((h, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'eco-bar flex-1 rounded-t-sm',
                                    i % 3 === 2
                                        ? 'bg-water/70'
                                        : 'bg-electricity/70',
                                )}
                                style={{
                                    height: `${h}%`,
                                    animationDelay: `${i * 90}ms`,
                                }}
                            />
                        ))}
                    </div>
                    <svg
                        viewBox="0 0 300 60"
                        className="-mt-20 h-20 w-full"
                        fill="none"
                        aria-hidden
                    >
                        <path
                            d="M0 50 C 30 42, 45 30, 70 34 S 120 14, 150 22 S 210 8, 240 16 S 285 4, 300 8"
                            stroke="var(--primary)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            className="eco-draw-line"
                        />
                    </svg>
                </div>

                {/* Pending row */}
                <div className="mt-3 flex items-center justify-between rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent px-3 py-2.5">
                    <div className="flex items-center gap-2 text-xs">
                        <Clock3 className="size-4 text-amber-500" />
                        <span className="font-medium">
                            Chambre froide · +44.7 kWh
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <span className="rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                            Approve
                        </span>
                        <span className="rounded-md border px-2 py-1 text-[10px] font-semibold text-destructive">
                            Reject
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Content data ──────────────────────────────────────────────────────── */

const features = [
    {
        icon: Zap,
        chip: 'bg-electricity/15 text-electricity',
        title: 'Dual-utility tracking',
        text: 'Electricity in kWh, water in m³ — color-coded everywhere so a glance tells you which is which. Never a mixed-up axis or unit.',
    },
    {
        icon: CheckSquare,
        chip: 'bg-primary/15 text-primary',
        title: 'Approval workflow',
        text: 'Every reading passes an admin review. Rejected entries go back to the technician with a reason; approved ones are locked into history.',
    },
    {
        icon: Clock3,
        chip: 'bg-water/15 text-water',
        title: 'Time-of-day tariffs',
        text: 'Peak, off-peak and overnight windows each carry their own price. Readings snapshot the tariff, so old bills never change.',
    },
    {
        icon: BarChart3,
        chip: 'bg-electricity/15 text-electricity',
        title: 'Reports that bill',
        text: 'Trends, per-meter cost breakdowns and totals over any date range — computed only from approved, audit-ready data.',
    },
    {
        icon: FileSpreadsheet,
        chip: 'bg-primary/15 text-primary',
        title: 'One-click CSV export',
        text: 'Any filtered view exports to a clean CSV for your accountant, spreadsheet, or archive. What you see is what you get.',
    },
    {
        icon: Smartphone,
        chip: 'bg-water/15 text-water',
        title: 'Works where you work',
        text: 'Tables become cards on a phone, forms fit a technician’s pocket, and dark mode is a first-class citizen — not an afterthought.',
    },
];

const steps = [
    {
        icon: Gauge,
        title: 'Record in the field',
        text: 'The technician picks the meter and sees its last approved value on the spot — typos are caught before they are saved.',
    },
    {
        icon: CheckSquare,
        title: 'Approve with context',
        text: 'Admins review each reading with the consumption delta and cost already computed. One click to approve, a reason to reject.',
    },
    {
        icon: LineChart,
        title: 'Understand & export',
        text: 'Approved data flows into dashboards, trends and CSV exports — the numbers your bills and budgets can rely on.',
    },
];

const roles = [
    {
        icon: Wrench,
        title: 'Technician',
        accent: 'border-t-electricity',
        chip: 'bg-electricity/15 text-electricity',
        points: [
            'Guided reading form',
            'Previous value shown live',
            'Edit & resubmit rejections',
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Admin',
        accent: 'border-t-primary',
        chip: 'bg-primary/15 text-primary',
        points: [
            'Approval queue',
            'Meters, tariffs & users',
            'Full reports & exports',
        ],
    },
    {
        icon: Eye,
        title: 'Viewer',
        accent: 'border-t-water',
        chip: 'bg-water/15 text-water',
        points: [
            'Approved data only',
            'Consumption dashboards',
            'Self-serve reports',
        ],
    },
];

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const t = useT();
    const { auth } = usePage<SharedData>().props;

    const primaryCta = auth.user ? (
        <Button size="lg" asChild>
            <Link href="/dashboard">
                {t('Open dashboard')} <ArrowRight className="size-4" />
            </Link>
        </Button>
    ) : (
        <Button size="lg" asChild>
            <Link href="/login">
                {t('Log in')} <ArrowRight className="size-4" />
            </Link>
        </Button>
    );

    return (
        <>
            <Head title="EcoTrack — every meter, every drop, on the record" />

            <div className="min-h-screen scroll-smooth bg-background text-foreground">
                {/* ── Nav ── */}
                <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
                        <a href="#top" className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-5" />
                            </span>
                            <span className="font-display text-lg font-semibold tracking-tight">
                                EcoTrack
                            </span>
                        </a>
                        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                            <a
                                href="#features"
                                className="transition-colors hover:text-foreground"
                            >{t('Features')}</a>
                            <a
                                href="#how"
                                className="transition-colors hover:text-foreground"
                            >{t('How it works')}</a>
                            <a
                                href="#roles"
                                className="transition-colors hover:text-foreground"
                            >{t('Roles')}</a>
                        </nav>
                        <div className="flex items-center gap-2">
                            <LocaleSwitcher />
                            <ThemeToggle />
                            {auth.user ? (
                                <Button asChild>
                                    <Link href="/dashboard">{t('Dashboard')}</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">{t('Log in')}</Link>
                                    </Button>
                                    {canRegister && (
                                        <Button asChild>
                                            <Link href="/register">
                                                Get started
                                            </Link>
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ── Hero ── */}
                <section id="top" className="relative overflow-hidden">
                    <div className="eco-grid-bg absolute inset-0" aria-hidden />
                    <div
                        className="eco-blob -top-20 -left-20 size-105 bg-primary/25"
                        aria-hidden
                    />
                    <div
                        className="eco-blob top-40 right-0 size-80 bg-electricity/20"
                        style={{ animationDelay: '-3s' }}
                        aria-hidden
                    />
                    <div
                        className="eco-blob bottom-0 left-1/3 size-72 bg-water/20"
                        style={{ animationDelay: '-6s' }}
                        aria-hidden
                    />

                    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2">
                        <Reveal>
                            <div>
                                <p className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-electricity/12 px-3 py-1 text-electricity">
                                        <Zap className="size-3.5" /> {t('Electricity')}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-water/12 px-3 py-1 text-water">
                                        <Droplets className="size-3.5" /> {t('Water')}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-primary">
                                        <CheckCircle2 className="size-3.5" />{' '}
                                        Approved data only
                                    </span>
                                </p>
                                <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-6xl">
                                    {t('Every meter,')}
                                    <br />
                                    {t('every drop,')}
                                    <br />
                                    <span className="bg-gradient-to-r from-primary via-electricity to-water bg-clip-text text-transparent">{t('on the record.')}</span>
                                </h1>
                                <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                                    EcoTrack turns hand-read utility meters into
                                    an approved, auditable history — with
                                    time-of-day tariffs, live dashboards and
                                    costs your whole team can trust.
                                </p>
                                <div className="mt-8 flex flex-wrap gap-3">
                                    {primaryCta}
                                    {!auth.user && canRegister && (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link href="/register">
                                                Create an account
                                            </Link>
                                        </Button>
                                    )}
                                    <Button size="lg" variant="ghost" asChild>
                                        <a href="#how">{t('See how it works')}</a>
                                    </Button>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <DashboardMock />
                        </Reveal>
                    </div>
                </section>

                {/* ── Numbers band ── */}
                <section className="border-y bg-gradient-to-r from-primary/8 via-electricity/8 to-water/8">
                    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-6 py-10 text-center md:grid-cols-4">
                        {[
                            {
                                value: 2,
                                suffix: '',
                                label: 'utilities, one ledger',
                            },
                            {
                                value: 3,
                                suffix: '',
                                label: 'roles with clear duties',
                            },
                            {
                                value: 100,
                                suffix: '%',
                                label: 'of reports from approved data',
                            },
                            {
                                value: 1,
                                suffix: '-click',
                                label: 'CSV export on every view',
                            },
                        ].map((stat, i) => (
                            <Reveal key={stat.label} delay={i * 100}>
                                <div>
                                    <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                                        <CountUp
                                            to={stat.value}
                                            suffix={stat.suffix}
                                        />
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t(stat.label)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── Features ── */}
                <section
                    id="features"
                    className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
                >
                    <Reveal>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{t('Features')}</p>
                            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('Built for the way utilities are actually read')}</h2>
                            <p className="mt-3 text-muted-foreground">
                                No IoT hardware required — EcoTrack makes human
                                meter reading reliable, reviewable and
                                beautiful.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, i) => (
                            <Reveal key={t(feature.title)} delay={(i % 3) * 120}>
                                <div className="group h-full rounded-2xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg">
                                    <span
                                        className={cn(
                                            'flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                                            feature.chip,
                                        )}
                                    >
                                        <feature.icon className="size-5" />
                                    </span>
                                    <h3 className="mt-4 font-display font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {t(feature.text)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── How it works ── */}
                <section id="how" className="scroll-mt-20 border-y bg-muted/40">
                    <div className="mx-auto w-full max-w-6xl px-6 py-20">
                        <Reveal>
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-semibold tracking-wide text-primary uppercase">{t('How it works')}</p>
                                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                                    From meter dial to trusted number in three
                                    steps
                                </h2>
                            </div>
                        </Reveal>

                        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
                            <div
                                className="absolute top-7 right-[16%] left-[16%] hidden h-0.5 bg-gradient-to-r from-electricity via-primary to-water md:block"
                                aria-hidden
                            />
                            {steps.map((step, i) => (
                                <Reveal key={t(step.title)} delay={i * 150}>
                                    <div className="relative text-center">
                                        <div className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-2xl border-2 border-primary/30 bg-card shadow-md">
                                            <step.icon className="size-6 text-primary" />
                                            <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-primary-foreground">
                                                {i + 1}
                                            </span>
                                        </div>
                                        <h3 className="mt-5 font-display text-lg font-semibold">
                                            {step.title}
                                        </h3>
                                        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                                            {t(step.text)}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Roles ── */}
                <section
                    id="roles"
                    className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
                >
                    <Reveal>
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{t('Roles')}</p>
                            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('Everyone sees exactly what they need')}</h2>
                        </div>
                    </Reveal>

                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {roles.map((role, i) => (
                            <Reveal key={t(role.title)} delay={i * 120}>
                                <div
                                    className={cn(
                                        'h-full rounded-2xl border border-t-4 bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-lg',
                                        role.accent,
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                'flex size-10 items-center justify-center rounded-xl',
                                                role.chip,
                                            )}
                                        >
                                            <role.icon className="size-5" />
                                        </span>
                                        <h3 className="font-display text-lg font-semibold">
                                            {t(role.title)}
                                        </h3>
                                    </div>
                                    <ul className="mt-4 space-y-2.5">
                                        {role.points.map((point) => (
                                            <li
                                                key={t(point)}
                                                className="flex items-start gap-2 text-sm text-muted-foreground"
                                            >
                                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ── Dark mode / export strip ── */}
                <section className="mx-auto w-full max-w-6xl px-6 pb-20">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Reveal>
                            <div className="flex h-full items-center gap-4 rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                                    <Moon className="size-6" />
                                </span>
                                <div>
                                    <h3 className="font-display font-semibold">{t('Dark mode, done properly')}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        A deep-forest theme with charts
                                        validated for contrast and color-blind
                                        safety — in both modes.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={120}>
                            <div className="flex h-full items-center gap-4 rounded-2xl border bg-gradient-to-br from-water/10 via-card to-card p-6">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-water/15 text-water">
                                    <Download className="size-6" />
                                </span>
                                <div>
                                    <h3 className="font-display font-semibold">{t('Your data is never stuck')}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Every filtered list and report exports
                                        to CSV exactly as you see it. No
                                        lock-in, ever.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="mx-auto w-full max-w-6xl px-6 pb-24">
                    <Reveal>
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[oklch(0.35_0.09_180)] px-8 py-14 text-center text-primary-foreground shadow-xl">
                            <div
                                className="eco-blob -top-20 -right-10 size-64 bg-electricity/30"
                                aria-hidden
                            />
                            <div
                                className="eco-blob -bottom-24 -left-10 size-64 bg-water/30"
                                style={{ animationDelay: '-4s' }}
                                aria-hidden
                            />
                            <div className="relative">
                                <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">{t('Start putting your meters on the record')}</h2>
                                <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                                    Log in with your team account, record the
                                    first reading, and watch the dashboard come
                                    alive.
                                </p>
                                <div className="mt-7 flex flex-wrap justify-center gap-3">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                auth.user
                                                    ? '/dashboard'
                                                    : '/login'
                                            }
                                        >
                                            {auth.user
                                                ? 'Open dashboard'
                                                : 'Log in'}
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                    {!auth.user && canRegister && (
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                                            asChild
                                        >
                                            <Link href="/register">
                                                Create an account
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-4" />
                            </span>
                            <span className="font-display font-semibold">
                                EcoTrack
                            </span>
                            <span className="text-sm text-muted-foreground">
                                — {t('energy & water tracking')}
                            </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm text-muted-foreground">
                            <a
                                href="#features"
                                className="hover:text-foreground"
                            >{t('Features')}</a>
                            <a href="#how" className="hover:text-foreground">{t('How it works')}</a>
                            <a href="#roles" className="hover:text-foreground">{t('Roles')}</a>
                            <Link
                                href="/login"
                                className="hover:text-foreground"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
