"use client";

import React, { useEffect, Suspense } from "react";
import EmailPresets from "@/components/settings/EmailPresets";
// import { EmailHistory } from "@/components/settings/EmailHistory"; // TODO: Re-enable when backend API is ready
import { useHeader } from "@/components/header/header-context";
// import { useSearchParams } from "next/navigation";

// type EmailSubTab = "templates"; // | "history"; // TODO: Re-enable when backend API is ready

function EmailManagementContent() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Email Management");
  }, [setTitle]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Sub-tabs - Email History temporarily disabled until backend API is ready */}
      {/* <div className="flex gap-2 bg-white border-1 border-gray-200 rounded-xl py-1 px-1 w-max">
        <button
          onClick={() => setActiveTab("templates")}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "templates"
              ? "bg-[#0F386C] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Email Templates
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "bg-[#0F386C] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Email History
        </button>
      </div> */}

      {/* Content */}
      <EmailPresets />
      {/* {activeTab === "history" && <EmailHistory />} */}
    </div>
  );
}

export default function EmailManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 space-y-6 p-6">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <EmailManagementContent />
    </Suspense>
  );
}
