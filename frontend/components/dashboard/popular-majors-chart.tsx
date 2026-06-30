"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: {
    major: string;
    count: number;
  }[];
}

export default function PopularMajorsChart({ data }: Props) {
  const chartData = {
    labels: data.map((d) => d.major),
    datasets: [
      {
        label: "",
        data: data.map((d) => d.count),
        backgroundColor: "#0A2A6A",
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false as const,
    layout: {
      padding: {
        bottom: 20, // gives breathing room for long labels
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => `${ctx.parsed.y} students`,
        },
        backgroundColor: "#0A2A6A",
        borderColor: "#ddd",
        borderWidth: 1,
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10 },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#6B7280",
          font: { size: 10 },
        },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 h-[360px] flex flex-col">
      <p className="text-sm font-semibold text-blue-900">Most Popular Majors</p>
      <p className="text-xs text-black mb-4">Distribution by program</p>

      {/* Chart wrapper (ensures space for labels) */}
      <div className="flex-1 min-h-0">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
