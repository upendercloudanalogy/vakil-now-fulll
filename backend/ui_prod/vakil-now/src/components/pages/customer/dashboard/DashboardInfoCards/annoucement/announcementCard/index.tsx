"use client";

import { CustomButton } from "@/components/common/button";
import { cn } from "@/lib/utils";

export type AnnouncementType = "offer" | "activity";
export type AnnouncementStatus = "active" | "expired";

interface AnnouncementCardProps {
  type: AnnouncementType;
  status?: AnnouncementStatus;
  date?: string;
  badgeText?: string;
  title: string;
  description: string;
  startDate?: string | Date;
  endDate?: string;
  isRead?: boolean;
  className?: string;
}

export function AnnouncementCard({
  type,
  status = "active",
  date,
  badgeText,
  title,
  endDate = "",
  description,
  isRead = false,
  className,
}: AnnouncementCardProps) {
  const isOffer = type === "offer";
  const isExpired = isOffer && status === "expired";

  return (
    <div
      className={cn(
        "w-full rounded-md px-4 py-4 transition-all bg-white",
        isRead
          ? "border border-[#1565C0]"
          : "border border-[#4FC3F7]",
        isExpired && "border-[#999999] bg-gray-50",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "mb-1",
          type === "offer"
            ? "flex items-center justify-between"
            : "flex flex-col"
        )}
      >
        <div className="flex gap-2">
          {badgeText && (
            <span
              // className="text-xs bg-[#C8ECFD] text-blue-800 p-2 rounded"
              className={cn(
                "text-xs p-2 rounded",
                // type === "activity" ? "mt-1 text-[#4FC3F7]" : "",
                isExpired ? "text-[#B8B8B8] bg-[#E8E8E8]" : " bg-[#C8ECFD] text-[#4FC3F7]"
              )}
            >
              Valid till {endDate}
            </span>
          )}
        </div>

        {/* Date */}
        <span
          className={cn(
            "text-sm",
            type === "activity" ? "mt-1 text-[#4FC3F7]" : "",
            isExpired ? "text-[#B8B8B8]" : "text-[#4FC3F7]"
          )}
        >
          {date}
        </span>
      </div>

      {/* Title */}
      <h3 className="sm:text-2xl text-xl font-semibold text-[#0A2342]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-1 text-sm text-[#000000]">
        {description}
      </p>

      {/* Offer Actions */}
      {isOffer && !isExpired && (
        <div className="mt-3 flex gap-2">
          <CustomButton
            text="Apply Offer"
            onClick={() => console.log("Apply Offer")}
            className="px-3 py-1 text-sm font-normal"
          />
          <CustomButton
            text="View Details"
            onClick={() => console.log("View Details")}
            variant="outline"
            className="px-3 py-1 text-sm font-normal"
          />
        </div>
      )}

      {/* Expired */}
      {isExpired && (
        <div className="mt-3">
          <span className="text-sm font-normal bg-[#B8B8B8] text-gray-700 p-2 rounded">
            Expired
          </span>
        </div>
      )}
    </div>
  );
}
