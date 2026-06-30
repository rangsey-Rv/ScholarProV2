"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem,
  type ChartOptions, // 1. Import ChartOptions
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: {
    female: number;
    male: number;
    total: number;
  };
}

export default function GenderChart({ data }: Props) {
  const chartData = {
    labels: ["Female", "Male"],
    datasets: [
      {
        data: [data.female, data.male],
        backgroundColor: ["#0A2A6A", "#D9DCE3"],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  // 2. Explicitly type the options object
  const options: ChartOptions<"doughnut"> = {
    cutout: "72%",
    responsive: true,
    maintainAspectRatio: false, // Added to prevent layout shifts
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) => {
            // Safety check for raw value
            const value = ctx.raw || 0;
            return `${ctx.label}: ${value}`;
          },
        },
        backgroundColor: "#ffffff",
        titleColor: "#000000",
        bodyColor: "#000000",
        borderColor: "#ddd",
        borderWidth: 1,
        bodyFont: { size: 12 },
        displayColors: false,
      },
    },
  };

  // 3. Helper to avoid NaN if total is 0
  const calculatePercentage = (value: number) => {
    if (data.total === 0) return "0.00";
    return ((value / data.total) * 100).toFixed(2);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 h-[360px] flex flex-col">
      <p className="text-sm font-semibold text-blue-900">Total Applicants</p>
      <p className="text-xs text-gray-500 mb-3">
        Gender distribution – Click to filter
      </p>

      <div className="flex items-center gap-6 h-full">
        {/* Smaller Chart */}
        <div className="w-40 h-40 relative">
          <Doughnut data={chartData} options={options} />
        </div>

        {/* Side Stats */}
        <div className="text-sm space-y-2">
          <div>
            <p className="font-medium text-blue-900">Total Students</p>
            <p className="text-xl font-bold">{data.total.toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-900" />
            <p className="text-xs text-gray-600">
              Female: {calculatePercentage(data.female)}%
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            <p className="text-xs text-gray-600">
              Male: {calculatePercentage(data.male)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
