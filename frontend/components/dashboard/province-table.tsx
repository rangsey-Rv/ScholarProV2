"use client";

interface Props {
  data: { province: string; count: number }[];
}

export default function ProvinceTable({ data }: Props) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <p className="text-sm font-semibold text-blue-900">
        Students by Province
      </p>
      <p className="text-xs text-gray-500 mb-4">Geographic distribution</p>

      <div className="divide-y">
        {data.map((item, index) => (
          <div
            key={`${item.province}-${index}`} // ✅ FIXED: unique key
            className="flex justify-between py-3 hover:bg-gray-50 transition"
          >
            <span>{item.province}</span>
            <span className="font-semibold text-blue-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
