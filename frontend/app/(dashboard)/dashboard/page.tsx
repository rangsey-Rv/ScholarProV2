"use client";

import { useHeader } from "@/components/header/header-context";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";

import StatsCard from "@/components/dashboard/stats-card";
import GenderChart from "@/components/dashboard/gender-chart";
import PopularMajorsChart from "@/components/dashboard/popular-majors-chart";
import ProvinceTable from "@/components/dashboard/province-table";

import { FileText, Users, TrendingUp, UserCheck } from "lucide-react";
import BatchSelectorApi from "@/components/batch-selector-api";

export default function DashboardPage() {
  const { setTitle } = useHeader();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  useEffect(() => {
    setTitle("Dashboard Overview");
  }, [setTitle]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<DashboardResponse>(
          API_ENDPOINTS.DASHBOARD as string,
          {
            params: selectedBatchId ? { batchId: selectedBatchId } : undefined,
          },
        );

        if (!mounted) return;

        setOverview(res.data.data.overview);
        setCharts(res.data.data.charts);
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [selectedBatchId]);

  if (loading || !overview || !charts) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="w-40">
          <BatchSelectorApi
            value={selectedBatchId}
            onValueChange={setSelectedBatchId}
          />
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="New Applications"
          value={overview.newApplications}
          trend="—"
          icon={
            <div className="p-3 rounded-xl bg-slate-100">
              <FileText size={22} className="text-blue-900" />
            </div>
          }
        />

        <StatsCard
          title="Total Applicants"
          value={overview.totalApplicants}
          trend="—"
          icon={
            <div className="p-3 rounded-xl bg-slate-100">
              <Users size={22} className="text-blue-900" />
            </div>
          }
        />

        <StatsCard
          title="Female Ratio (%)"
          value={Number(overview.femaleRatio)}
          trend="—"
          icon={
            <div className="p-3 rounded-xl bg-slate-100">
              <TrendingUp size={22} className="text-blue-900" />
            </div>
          }
        />

        <StatsCard
          title="Acceptance Rate (%)"
          value={Number(overview.acceptanceRate)}
          trend="—"
          icon={
            <div className="p-3 rounded-xl bg-slate-100">
              <UserCheck size={22} className="text-blue-900" />
            </div>
          }
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart
          data={{
            female: overview.genderDistribution
              .filter((g) => g.gender.toLowerCase().startsWith("f"))
              .reduce((s, g) => s + g.count, 0),
            male: overview.genderDistribution
              .filter((g) => g.gender.toLowerCase().startsWith("m"))
              .reduce((s, g) => s + g.count, 0),
            total: overview.genderDistribution.reduce((s, g) => s + g.count, 0),
          }}
        />
        <PopularMajorsChart data={charts.popularMajors} />
      </div>

      {/* PROVINCE TABLE */}
      <ProvinceTable data={charts.studentsByProvince} />
    </div>
  );
}
