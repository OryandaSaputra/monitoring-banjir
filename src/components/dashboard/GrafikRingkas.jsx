import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPersen } from "../../utils/format";

export default function GrafikRingkas({ data }) {
  return (
    <div className="h-72 sm:h-80 lg:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.slice(-16)}>
          <defs>
            <linearGradient id="floodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
          <XAxis
            dataKey="shortLabel"
            stroke="#cbd5e1"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#cbd5e1"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              color: "#fff",
            }}
            formatter={(value) => [formatPersen(value), "Ketinggian"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.fullLabel || "-"
            }
          />
          <Area
            type="monotone"
            dataKey="persen"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#floodGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}