"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  type ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  UserCheck,
  AlertTriangle,
  Award,
  Calendar,
  MessageSquare,
  Users,
  BookOpen,
  ArrowRight,
  Filter,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { FilterChip } from "@/components/ui/FilterChip";
import { Avatar } from "@/components/ui/Avatar";

interface ActivityItem {
  id: string | number;
  type: string;
  title: string;
  description: string;
  time: string;
  date: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  user?: {
    name: string;
    avatar?: string;
  };
  priority?: "high" | "medium" | "low";
}

interface ActivityProps {
  userRole?:
    | "head-coach"
    | "peer-coach"
    | "advisor"
    | "student-leader"
    | "student";
  userId?: string;
}

// Generate activities based on user role
const getActivitiesForRole = (role: string): ActivityItem[] => {
  const baseActivities = {
    "head-coach": [
      {
        id: 1,
        type: "session_completed",
        title: "Session completed",
        description: "Sarah Mensah completed session with Coach Michael",
        time: "2 minutes ago",
        date: "Today",
        icon: CheckCircle,
        color: "#059669",
        user: {
          name: "Sarah Mensah",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
        },
        priority: "medium",
      },
      {
        id: 2,
        type: "new_assignment",
        title: "New assignment",
        description: "3 freshmen assigned to Coach Ama Asante",
        time: "15 minutes ago",
        date: "Today",
        icon: UserCheck,
        color: "#3b82f6",
        priority: "high",
      },
      {
        id: 3,
        type: "missed_session",
        title: "Missed session alert",
        description: "John Doe missed scheduled session",
        time: "1 hour ago",
        date: "Today",
        icon: AlertTriangle,
        color: "#dc2626",
        priority: "high",
      },
      {
        id: 4,
        type: "coach_achievement",
        title: "Coach milestone",
        description: "Coach Kwame reached 50 completed sessions",
        time: "2 hours ago",
        date: "Today",
        icon: Award,
        color: "#7c3aed",
        priority: "low",
      },
      {
        id: 5,
        type: "system_update",
        title: "System update",
        description: "New coaching guidelines published",
        time: "3 hours ago",
        date: "Today",
        icon: BookOpen,
        color: "#059669",
        priority: "medium",
      },
    ],
    "peer-coach": [
      {
        id: 1,
        type: "session_reminder",
        title: "Upcoming session",
        description: "Session with Sarah Mensah in 30 minutes",
        time: "30 minutes",
        date: "Today",
        icon: Calendar,
        color: "#3b82f6",
        priority: "high",
      },
      {
        id: 2,
        type: "new_message",
        title: "New message",
        description: "Message from student about assignment help",
        time: "1 hour ago",
        date: "Today",
        icon: MessageSquare,
        color: "#7c3aed",
        priority: "medium",
      },
      {
        id: 3,
        type: "progress_update",
        title: "Progress milestone",
        description: "Student completed 5 coaching sessions",
        time: "2 hours ago",
        date: "Today",
        icon: Award,
        color: "#059669",
        priority: "low",
      },
    ],
    student: [
      {
        id: 1,
        type: "session_booked",
        title: "Session confirmed",
        description: "Coaching session booked for tomorrow 2:00 PM",
        time: "10 minutes ago",
        date: "Today",
        icon: CheckCircle,
        color: "#059669",
        priority: "high",
      },
      {
        id: 2,
        type: "event_reminder",
        title: "Event reminder",
        description: "International Night starts in 2 hours",
        time: "2 hours",
        date: "Today",
        icon: Calendar,
        color: "#3b82f6",
        priority: "medium",
      },
    ],
  };
  return (
    baseActivities[role as keyof typeof baseActivities] ||
    baseActivities["student"]
  );
};

const timeFilters = ["All", "Today", "This Week", "This Month"];
const typeFilters = [
  "All",
  "Sessions",
  "Messages",
  "Assignments",
  "Achievements",
  "Reminders",
];
const priorityFilters = ["All", "High", "Medium", "Low"];

export default function ActivityScreen({
  userRole = "head-coach",
  userId,
}: ActivityProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("All");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const allActivities = getActivitiesForRole(userRole);

  const filteredActivities = allActivities.filter((activity) => {
    const matchesTime =
      selectedTimeFilter === "All" || activity.date === selectedTimeFilter;
    const matchesType =
      selectedTypeFilter === "All" ||
      activity.type.toLowerCase().includes(selectedTypeFilter.toLowerCase());
    const matchesPriority =
      selectedPriorityFilter === "All" ||
      activity.priority === selectedPriorityFilter.toLowerCase();
    return matchesTime && matchesType && matchesPriority;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    filtersContainer: {
      marginBottom: theme.spacing.lg,
    },
    filterSection: {
      marginBottom: theme.spacing.md,
    },
    filterLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    toggleFiltersButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    toggleFiltersText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    activityItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    priorityIndicator: {
      width: 4,
      height: "100%",
      borderRadius: 2,
      marginRight: theme.spacing.md,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    activityContent: {
      flex: 1,
    },
    activityHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    activityTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    activityTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    activityDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    activityUser: {
      flexDirection: "row",
      alignItems: "center",
    },
    userName: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#059669";
      default:
        return theme.colors.border;
    }
  };

  const renderActivity: ListRenderItem<ActivityItem> = ({ item }) => (
    <TouchableOpacity style={styles.activityItem} activeOpacity={0.8}>
      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: getPriorityColor(item.priority || "low") },
        ]}
      />
      <View
        style={[styles.activityIcon, { backgroundColor: item.color + "20" }]}
      >
        <item.icon color={item.color} size={20} />
      </View>
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
        <Text style={styles.activityDescription}>{item.description}</Text>
        {item.user && (
          <View style={styles.activityUser}>
            <Avatar
              imageUrl={item.user.avatar}
              initials={item.user.name.charAt(0)}
              size={20}
            />
            <Text style={styles.userName}>{item.user.name}</Text>
          </View>
        )}
      </View>
      <ArrowRight color={theme.colors.textSecondary} size={16} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Recent Activity"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Filter}
        onRightPress={() => setShowFilters(!showFilters)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {/* Filter Toggle */}
          <TouchableOpacity
            style={styles.toggleFiltersButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter color={theme.colors.textSecondary} size={20} />
            <Text style={styles.toggleFiltersText}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Text>
          </TouchableOpacity>

          {/* Filters */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Time Period</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {timeFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedTimeFilter === filter}
                      onPress={() => setSelectedTimeFilter(filter)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Activity Type</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {typeFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedTypeFilter === filter}
                      onPress={() => setSelectedTypeFilter(filter)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Priority</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {priorityFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedPriorityFilter === filter}
                      onPress={() => setSelectedPriorityFilter(filter)}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Activity List */}
          {filteredActivities.length > 0 ? (
            <FlatList
              data={filteredActivities}
              renderItem={renderActivity}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Filter color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>
                No activities found matching your filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
