"use client";

import { ContentScreen } from "@/components/screens/ContentScreen";

export default function EventsScreen() {
  const getEventFilters = (userRole?: string) => {
    return ["All", "Cultural", "Academic", "Sports", "Social"];
  };

  const getEventCategoryOptions = (userRole?: string) => {
    return [
      { label: "Cultural", value: "Cultural", color: "#667eea" },
      { label: "Academic", value: "Academic", color: "#f093fb" },
      { label: "Sports", value: "Sports", color: "#4facfe" },
      { label: "Social", value: "Social", color: "#26de81" },
      { label: "Workshop", value: "Workshop", color: "#ff9800" },
      { label: "Meeting", value: "Meeting", color: "#9c27b0" },
    ];
  };

  const canUserCreateEvents = (userRole?: string) => {
    // Students and freshmen can't create events
    return userRole !== "continuous" && userRole !== "freshman";
  };

  const getEventFloatingActions = (userRole?: string) => {
    return [
      { type: "event", label: "Event" }, // Primary action for events
      { type: "task", label: "Task" },
    ];
  };

  return (
    <ContentScreen
      contentType="event"
      title="Events"
      collectionName="events"
      getFilters={getEventFilters}
      getCategoryOptions={getEventCategoryOptions}
      canUserCreate={canUserCreateEvents}
      getFloatingActions={getEventFloatingActions}
    />
  );
}
