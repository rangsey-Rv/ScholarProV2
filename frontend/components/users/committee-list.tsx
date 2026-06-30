"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/data-table/data-table";
import { CommitteeColumns } from "@/components/tables/data-table/commitee-column";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommitteeListClient() {
  // Make sure to import the Commitee type from the correct location

  const [items, setItems] = useState<Commitee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      try {
        // Fetch users filtered by committee role
        const res = await apiClient.get(`${API_ENDPOINTS.COMMITEE}`);
        // backend may return { success, data } or raw array
        const data = res.data?.data ?? res.data ?? [];
        if (mounted) {
          setItems(Array.isArray(data) ? data : (data as undefined[]));
        }
      } catch (err: unknown) {
        console.error("Failed to fetch users (client):", err);
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
    const cols = CommitteeColumns.length || 6;
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

  return <DataTable columns={CommitteeColumns} data={items} />;
}
