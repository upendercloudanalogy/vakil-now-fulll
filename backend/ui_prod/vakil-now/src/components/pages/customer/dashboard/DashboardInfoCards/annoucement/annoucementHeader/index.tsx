"use client";

import { CustomButton } from "@/components/common/button";

type Tab = "offers" | "activity";

interface AnnouncementHeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function AnnouncementHeader({
  activeTab,
  onTabChange,
}: AnnouncementHeaderProps) {
  return (
    <div className="mb-4">
      {/* Wrapper */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl sm:font-bold font-semibold text-[#1565C0]">
          Announcement
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 sm:justify-end">
          <CustomButton
            text="Activity"
            onClick={() => onTabChange("activity")}
            variant={activeTab === "activity" ? "default" : "outline"}
            className={`px-4 py-2 text-sm ${
              activeTab === "activity"
                ? "bg-[#1565C0] text-white"
                : "bg-white text-[#1565C0] border border-[#1565C0]"
            }`}
          />

          <CustomButton
            text="Offers / Discounts"
            onClick={() => onTabChange("offers")}
            variant={activeTab === "offers" ? "default" : "outline"}
            className={`px-4 py-2 text-sm ${
              activeTab === "offers"
                ? "bg-[#1565C0] text-white"
                : "bg-white text-[#1565C0] border border-[#1565C0]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
