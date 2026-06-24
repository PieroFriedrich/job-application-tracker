"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STAGE_LABELS, STATUS_LABELS, STATUSES, Stage, Status } from "@/lib/types";

const STATUS_COLORS: Record<Status, string> = {
  pending: "#f59e0b",
  active: "#3b82f6",
  inactive: "#ef4444",
};

type StatsChartsProps = {
  statusData: ({ month: string } & Record<Status, number>)[];
  stageData: { stage: Stage; count: number }[];
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string | number;
  labelFormatter?: (label: string) => string;
};

function ChartTooltip({ active, payload, label, labelFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const displayLabel = label !== undefined && labelFormatter ? labelFormatter(String(label)) : label;
  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {displayLabel !== undefined && <p className="mb-1 font-medium">{displayLabel}</p>}
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function StatsCharts({ statusData, stageData }: StatsChartsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Applications status by month
        </h2>
        <div className="text-gray-300 dark:text-gray-600">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
              <XAxis dataKey="month" stroke="currentColor" tick={{ fill: "currentColor" }} />
              <YAxis allowDecimals={false} stroke="currentColor" tick={{ fill: "currentColor" }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ color: "currentColor" }} />
              {STATUSES.map((status) => (
                <Bar
                  key={status}
                  dataKey={status}
                  name={STATUS_LABELS[status]}
                  stackId="status"
                  fill={STATUS_COLORS[status]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Applications by furthest stage reached
        </h2>
        <div className="text-gray-300 dark:text-gray-600">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
              <XAxis type="number" allowDecimals={false} stroke="currentColor" tick={{ fill: "currentColor" }} />
              <YAxis
                type="category"
                dataKey="stage"
                tickFormatter={(stage: Stage) => STAGE_LABELS[stage]}
                width={160}
                stroke="currentColor"
                tick={{ fill: "currentColor" }}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    labelFormatter={(stage) => STAGE_LABELS[stage as Stage]}
                  />
                }
              />
              <Bar
                dataKey="count"
                name="Applications"
                fill={STATUS_COLORS.active}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
