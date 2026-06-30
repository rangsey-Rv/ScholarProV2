"use client";

import { useEffect, useState } from "react";
import EvaluationCriteria from "@/components/settings/EvaluationCriteria";
import { useHeader } from "@/components/header/header-context";
import EvaluationTabs from "@/components/settings/Evaluation-tab";
import SubjectCriteria from "@/components/settings/Subject";

export default function EvaluationSettingsPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Evaluation Settings");
  }, [setTitle]);
  const [activeTab, setActiveTab] = useState("criteria");
  return (
    <div className="flex-1 space-y-6 p-6">
      <EvaluationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "criteria" ? (
        // Exam tab uses its own internal layout
        <EvaluationCriteria />
      ) : activeTab === "subject" ? (
        // Interview tab uses its own internal layout
        <SubjectCriteria />
      ) : null}
    </div>
  );
}
