import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { TransactionVolumeChartProps } from "@/types";

export const TransactionVolumeChart: React.FC<TransactionVolumeChartProps> = ({ data }) => (
  <div className="bg-gray-800 p-3 rounded-lg">
    <h2 className="text-base font-semibold mb-2">Transaction Volume (USD)</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="amountUsd" fill="#8884d8" name="Transaction Volume" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);