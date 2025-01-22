import { api } from "@/utils/api";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function Overview() {
  const { data: monlyRevenue } = api.dashboard.getMonthlyRevenue.useQuery();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monlyRevenue}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
