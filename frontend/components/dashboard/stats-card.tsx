"use client";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  trend: string;
}

export default function StatsCard({ icon, title, value }: StatsCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm flex space-x-4 items-center">
      <div className="text-blue-900 text-xl">{icon}</div>

      <div className="flex-1">
        <p className="text-xs text-black">{title}</p>
        <p className="text-xl font-semibold">{value.toLocaleString()}</p>
        {/* <p
          className={`text-xs mt-1 ${
            trend.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend} from last month
        </p> */}
      </div>
    </div>
  );
}
