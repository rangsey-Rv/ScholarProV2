"use client";

import { useEffect, useState } from "react";
import ScheduleTabs from "@/components/schedule/common/ScheduleTabs";
import { ExamSchedule } from "@/components/schedule/exam/ExamSchedule";
import { InterviewSchedule } from "@/components/schedule/interview/InterviewSchedule";
import { useHeader } from "@/components/header/header-context";

export default function ExamSchedulePage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Schedule");
  }, [setTitle]);
  const [activeTab, setActiveTab] = useState("exam");

  return (
    <div className="min-h-screen py-6 px-2">
      <div className="mx-auto max-w-full">
        {/* Navigation Tabs */}
        <ScheduleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content with conditional layout */}
        {activeTab === "exam" ? (
          // Exam tab uses its own internal layout
          <ExamSchedule />
        ) : activeTab === "interview" ? (
          // Interview tab uses its own internal layout
          <InterviewSchedule />
        ) : null}
      </div>
    </div>
  );
}
