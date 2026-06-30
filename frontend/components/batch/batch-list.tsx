"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/data-table/data-table";

import { Skeleton } from "@/components/ui/skeleton";
import { BatchColumns } from "../tables/batch-column";

import { API_ENDPOINTS } from "@/api/endpoint";
import { apiClient } from "@/api/api";

export default function BatchListClient() {
  const [items, setItems] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      try {
        // Fetch users filtered by admin role
        const res = await apiClient.get(`${API_ENDPOINTS.BATCH}`);
        // backend may return { success, data } or raw array
        const data = res.data?.batches || [];
        if (mounted) {
          setItems(Array.isArray(data) ? data : (data as BatchData[]));
        }
      } catch (err: unknown) {
        console.error("Failed to fetch batches (client):", err);
        if (mounted)
          setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    const cols = BatchColumns.length || 6;
    const rows = 6;
    return (
      <div className="overflow-hidden rounded-md border">
        <div className="p-4 space-y-6">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-2 items-center">
              {Array.from({ length: cols }).map((__, j) => (
                <div key={j} className="flex-1">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return <DataTable columns={BatchColumns} data={items} />;
}
