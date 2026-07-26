import { formatNumber, shortDate } from '@/lib/format';
import { type DailyPoint, type MeterType } from '@/types';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const SERIES: Record<
    MeterType,
    { color: string; label: string; unit: string }
> = {
    electricity: {
        color: 'var(--electricity)',
        label: 'Electricity',
        unit: 'kWh',
    },
    water: { color: 'var(--water)', label: 'Water', unit: 'm³' },
};

function ChartTooltip({
    active,
    payload,
    label,
    unit,
}: {
    active?: boolean;
    payload?: { value: number; name: string; color?: string }[];
    label?: string;
    unit?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
            <p className="mb-1 font-medium text-popover-foreground">
                {label ? shortDate(label) : ''}
            </p>
            {payload.map((entry) => (
                <p
                    key={entry.name}
                    className="flex items-center gap-1.5 text-muted-foreground"
                >
                    <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="figure font-medium text-popover-foreground">
                        {formatNumber(entry.value)}
                    </span>
                    {unit}
                </p>
            ))}
        </div>
    );
}

/**
 * Single-utility consumption trend. Electricity (kWh) and water (m³) have
 * different units, so they are never drawn on one axis — render two of
 * these side by side instead.
 */
export function UtilityTrendChart({
    data,
    type,
    height = 200,
}: {
    data: DailyPoint[];
    type: MeterType;
    height?: number;
}) {
    const series = SERIES[type];

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id={`fill-${type}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor={series.color}
                                stopOpacity={0.25}
                            />
                            <stop
                                offset="100%"
                                stopColor={series.color}
                                stopOpacity={0.02}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        stroke="var(--border)"
                        strokeWidth={1}
                    />
                    <XAxis
                        dataKey="date"
                        tickFormatter={shortDate}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={32}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        width={52}
                        tickFormatter={(v: number) => formatNumber(v, 0)}
                    />
                    <Tooltip
                        content={<ChartTooltip unit={series.unit} />}
                        cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey={type}
                        name={series.label}
                        stroke={series.color}
                        strokeWidth={2}
                        fill={`url(#fill-${type})`}
                        dot={false}
                        activeDot={{
                            r: 4,
                            strokeWidth: 2,
                            stroke: 'var(--card)',
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export interface MeterSlice {
    meter: { id: number; name: string; type: MeterType; unit: string };
    consumption: number;
    amount: number;
}

/** Horizontal per-meter breakdown; bar color follows the meter's utility. */
export function MeterBreakdownChart({
    data,
    dataKey = 'amount',
    unit,
    height,
}: {
    data: MeterSlice[];
    dataKey?: 'amount' | 'consumption';
    unit?: string;
    height?: number;
}) {
    const rows = data.slice(0, 10);
    const chartHeight = height ?? Math.max(140, rows.length * 36);

    return (
        <div style={{ height: chartHeight }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={rows}
                    layout="vertical"
                    margin={{ top: 0, right: 12, left: 8, bottom: 0 }}
                    barCategoryGap={6}
                >
                    <CartesianGrid
                        horizontal={false}
                        stroke="var(--border)"
                        strokeWidth={1}
                    />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => formatNumber(v, 0)}
                    />
                    <YAxis
                        type="category"
                        dataKey={(row: MeterSlice) => row.meter.name}
                        tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                        tickLine={false}
                        axisLine={false}
                        width={110}
                    />
                    <Tooltip
                        content={<ChartTooltip unit={unit} />}
                        cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
                    />
                    <Bar
                        dataKey={dataKey}
                        radius={[0, 4, 4, 0]}
                        maxBarSize={18}
                    >
                        {rows.map((row) => (
                            <Cell
                                key={row.meter.id}
                                fill={SERIES[row.meter.type].color}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
