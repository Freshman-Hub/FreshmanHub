"use client";

import { ContentScreen } from "@/components/screens/ContentScreen";

export default function SessionsScreen() {
  const getSessionFilters = (userRole?: string) => {
    if (userRole === "head_of_coaches" || userRole === "coach") {
      // Coaches see status-based filters (if you implement status filtering later)
      return ["All", "Advising Session", "Coaching Session", "Buddy Session"];
    }

    // For students/freshmen - category-based filters
    return ["All", "Advising Session", "Coaching Session", "Buddy Session"];
  };

  const getSessionCategoryOptions = (userRole?: string) => {
    return [
      {
        label: "Advising Session",
        value: "Advising Session",
        color: "#667eea",
      },
      {
        label: "Coaching Session",
        value: "Coaching Session",
        color: "#f093fb",
      },
      { label: "Buddy Session", value: "Buddy Session", color: "#4facfe" },
      { label: "Group Session", value: "Group Session", color: "#26de81" },
      { label: "One-on-One", value: "One-on-One", color: "#ff9800" },
      { label: "Workshop", value: "Workshop", color: "#9c27b0" },
    ];
  };

  const canUserCreateSessions = (userRole?: string) => {
    // Anyone can create sessions
    return true;
  };

  const getSessionFloatingActions = (userRole?: string) => {
    return [
      { type: "session", label: "Session" }, // Primary action for sessions
      { type: "task", label: "Task" },
    ];
  };

  return (
    <ContentScreen
      contentType="session"
      title="Sessions"
      collectionName="sessions"
      getFilters={getSessionFilters}
      getCategoryOptions={getSessionCategoryOptions}
      canUserCreate={canUserCreateSessions}
      getFloatingActions={getSessionFloatingActions}
    />
  );
}
