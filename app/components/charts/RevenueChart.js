// components/charts/RevenueChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No revenue data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
}
