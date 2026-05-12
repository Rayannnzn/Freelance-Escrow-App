'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartPoint } from '@/hooks/useAnalytics';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-white/10">
      <div className="label-caps mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="text-sm font-semibold text-foreground">
          {p.dataKey === 'volume' ? `${p.value} SOL` : `${p.value} contract${p.value !== 1 ? 's' : ''}`}
        </div>
      ))}
    </div>
  );
}

interface ActivityChartProps {
  data?: ChartPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  // If no data passed, show an empty 6-month scaffold
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="cyber-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Escrow Activity</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your escrow volume over the last 6 months
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#39ff14]" />
            <span className="label-caps text-[10px]">Volume (SOL)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#00eefc]" />
            <span className="label-caps text-[10px]">Contracts</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground">
          No escrow activity yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gradNeon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#39ff14" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#39ff14" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00eefc" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00eefc" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#baccb0', fontFamily: 'Space Grotesk' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#baccb0', fontFamily: 'Space Grotesk' }}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(57,255,20,0.2)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#39ff14"
              strokeWidth={2}
              fill="url(#gradNeon)"
              dot={false}
              activeDot={{ r: 4, fill: '#39ff14', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="contracts"
              stroke="#00eefc"
              strokeWidth={1.5}
              fill="url(#gradBlue)"
              dot={false}
              activeDot={{ r: 3, fill: '#00eefc', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
