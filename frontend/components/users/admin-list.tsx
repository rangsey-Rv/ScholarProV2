"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/data-table/data-table";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminColumns } from "../tables/data-table/admin-column";

const ROLE = "admin";

export default function AdminClient({
  statusFilter = "all",
}: {
  statusFilter?: "all" | "active" | "inactive";
}) {
  const [items, setItems] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      try {
        // Fetch users filtered by admin role
        const res = await apiClient.get(`${API_ENDPOINTS.USER}/${ROLE}`);
        // backend may return { success, data } or raw array
        const data = res.data?.data ?? res.data ?? [];
        if (mounted) {
          setItems(Array.isArray(data) ? data : (data as Admin[]));
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
    const cols = AdminColumns.length || 6;
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

  const displayed = items.filter((it) => {
    if (statusFilter === "all") return true;
    const rawActive = (it as Admin).isActive;
    const rawStatus = (it as Admin).status;
    const isActive =
      typeof rawActive === "boolean"
        ? rawActive
        : String(rawStatus || "").toLowerCase() === "active";
    return statusFilter === "active" ? isActive : !isActive;
  });

  return <DataTable columns={AdminColumns} data={displayed} />;
}
