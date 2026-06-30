interface ScheduleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ScheduleTabs({
  activeTab,
  setActiveTab,
}: ScheduleTabsProps) {
  const tabs = [
    { id: "exam", label: "Exam" },
    { id: "interview", label: "Interview" },
  ];

  return (
    <div className="mb-6 flex gap-2 bg-white border-1 border-gray-200 rounded-xl py-1 px-1 w-max">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`rounded-lg px-6 py-2.5 text-[14px] font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-[#0F386C] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
