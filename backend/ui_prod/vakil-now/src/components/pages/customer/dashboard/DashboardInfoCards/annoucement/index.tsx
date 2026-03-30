"use client"
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../../redux/hook";
import {
  fetchAnnouncements,
  markAllAnnouncementsRead,
} from "../../../../../../../redux/slices/announcement/announcementThunk";
import { AnnouncementHeader } from "./annoucementHeader";
import { AnnouncementCard } from "./announcementCard";

type Tab = "offers" | "activity";

export default function AnnouncementSection() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<Tab>("activity");

  const { items: announcements } = useAppSelector(
    (state) => state.announcementReducer
  );

  // 1️⃣ Fetch & Mark All Read on mount
  useEffect(() => {
    dispatch(fetchAnnouncements());
    // Mark all as read in backend immediately, but UI stays "unread" until next fetch/visit
    const typeToMark = activeTab === "offers" ? "offer" : "activity";
    dispatch(markAllAnnouncementsRead(typeToMark));
  }, [dispatch, activeTab]);

  // Removed local update logic to decouple UI state from backend state


  const offers = announcements.filter((a) => a.type === "offer");
  const activities = announcements.filter((a) => a.type === "activity");

  return (
    <div className="w-full">
      <AnnouncementHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-4">
        {activeTab === "offers" &&
          offers.map((item) => (
            <AnnouncementCard
              key={item.id}
              type="offer"
              // endDate={item.endDate}
              status={item.status}
              // ✅ USE endDate, NOT createdAt
              endDate={
                item.endDate
                  ? new Date(item.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "-"
              }

              // ✅ Badge should be a label, not a date
              badgeText={item.status === "active" ? "Valid till" : "Expired"}
              title={item.title}
              description={item.description}
              isRead={item.isRead}
            />
          ))}


        {activeTab === "activity" &&
          activities.map((item) => (
            <AnnouncementCard
              key={item.id}
              type="activity"
              date={new Date(item.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              title={item.title}
              description={item.description}
              isRead={item.isRead}
            />
          ))}
      </div>
    </div>
  );
}
