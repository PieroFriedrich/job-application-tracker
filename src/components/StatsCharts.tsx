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
import { STATUS_LABELS, STATUSES, Status } from "@/lib/types";

const STATUS_COLORS: Record<Status, string> = {
  wishlist: "#9ca3af",
  applied: "#3b82f6",
  interview: "#f59e0b",
  offer: "#22c55e",
  rejected: "#ef4444",
};

const CHART_STATUSES = STATUSES.filter((status) => status !== "wishlist");

type StatsChartsProps = {
  statusData: ({ month: string } & Record<Exclude<Status, "wishlist">, number>)[];
};

export function StatsCharts({ statusData }: StatsChartsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-sm font-medium text-gray-700">
          Applications status by month
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {CHART_STATUSES.map((status) => (
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
  );
}
