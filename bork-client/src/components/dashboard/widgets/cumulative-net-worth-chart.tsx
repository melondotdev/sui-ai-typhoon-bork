import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { CumulativeNetWorthChartProps } from "@/types";

export const CumulativeNetWorthChart: React.FC<CumulativeNetWorthChartProps> = ({ data }) => (
  <div className="bg-gray-800 p-3 rounded-lg">
    <h2 className="text-base font-semibold mb-2">Cumulative Net Worth</h2>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
        <Area
          type="monotone"
          dataKey="cumulativeAmountUsd"
          stroke="#00C49F"
          fill="#00C49F"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);