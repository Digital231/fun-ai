import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useChatStore from "../store/chatStore";
import { format } from "date-fns";

const TokenUsageChart = () => {
  const tokenUsage = useChatStore((state) => state.tokenUsage);
  const [timeframe, setTimeframe] = useState("hourly"); // 'hourly' | 'daily' | 'weekly' | 'monthly'

  const processedData = useMemo(() => {
    const usagePoints = new Map();

    Object.values(tokenUsage).forEach(({ history }) => {
      history.forEach(({ timestamp, input, output }) => {
        const keyFormat = {
          hourly: "yyyy-MM-dd HH:00",
          daily: "yyyy-MM-dd",
          weekly: "yyyy-ww",
          monthly: "yyyy-MM",
        }[timeframe];

        const dateKey = format(new Date(timestamp), keyFormat);

        if (!usagePoints.has(dateKey)) {
          usagePoints.set(dateKey, { date: dateKey, input: 0, output: 0 });
        }

        const point = usagePoints.get(dateKey);
        point.input += input;
        point.output += output;
      });
    });

    const sorted = Array.from(usagePoints.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let cumulativeInput = 0;
    let cumulativeOutput = 0;

    return sorted.map(({ date, input, output }) => {
      cumulativeInput += input;
      cumulativeOutput += output;
      return {
        date,
        input: cumulativeInput,
        output: cumulativeOutput,
      };
    });
  }, [tokenUsage, timeframe]);

  return (
    <div className="w-full h-screen bg-base-100 rounded-2xl shadow-lg p-6 flex flex-col">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6 relative">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-zinc-400 hover:text-white transition-colors absolute left-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
            viewBox="0 0 24 24"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Centered Title */}
        <h2 className="text-2xl font-bold mx-auto text-center">
          📊 Token Usage Over Time
        </h2>

        {/* Timeframe Selector */}
        <div className="absolute right-0">
          <select
            className="select select-sm select-bordered"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={processedData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="input"
              stackId="1"
              stroke="#2563eb"
              fill="url(#inputGradient)"
              name="Input Tokens"
            />
            <Area
              type="monotone"
              dataKey="output"
              stackId="1"
              stroke="#10b981"
              fill="url(#outputGradient)"
              name="Output Tokens"
            />
            <defs>
              <linearGradient
                id="inputGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="outputGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#10b981"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TokenUsageChart;
