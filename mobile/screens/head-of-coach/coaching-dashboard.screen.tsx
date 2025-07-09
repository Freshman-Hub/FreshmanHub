"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Target,
  Award,
  MessageSquare,
  Bell,
  Star,
  Zap,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";

const { width } = Dimensions.get("window");

// Mock data for dashboard
const dashboardStats = [
  {
    label: "Total Coaches",
    value: "24",
    icon: Users,
    color: "#3b82f6",
    trend: "+2",
  },
  {
    label: "Active Freshmen",
    value: "156",
    icon: UserCheck,
    color: "#059669",
    trend: "+8",
  },
  {
    label: "This Week Sessions",
    value: "47",
    icon: Calendar,
    color: "#f59e0b",
    trend: "+12",
  },
  {
    label: "Success Rate",
    value: "94%",
    icon: TrendingUp,
    color: "#8b5cf6",
    trend: "+3%",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "session_completed",
    coach: "Sarah Johnson",
    student: "Michael Chen",
    time: "2 hours ago",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
  },
  {
    id: 2,
    type: "new_assignment",
    coach: "David Wilson",
    student: "Emma Rodriguez",
    time: "4 hours ago",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: null,
  },
  {
    id: 3,
    type: "session_missed",
    coach: "Lisa Thompson",
    student: "James Park",
    time: "6 hours ago",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: null,
  },
  {
    id: 4,
    type: "session_completed",
    coach: "Alex Kim",
    student: "Sofia Martinez",
    time: "1 day ago",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4,
  },
];

const upcomingSessions = [
  {
    id: 1,
    coach: "Sarah Johnson",
    student: "Michael Chen",
    time: "Today, 2:00 PM",
    type: "Academic Support",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    priority: "high",
  },
  {
    id: 2,
    coach: "David Wilson",
    student: "Emma Rodriguez",
    time: "Today, 4:30 PM",
    type: "Wellness Check",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    priority: "medium",
  },
  {
    id: 3,
    coach: "Lisa Thompson",
    student: "James Park",
    time: "Tomorrow, 10:00 AM",
    type: "Goal Setting",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    priority: "low",
  },
];

const alertsData = [
  {
    id: 1,
    type: "missed_sessions",
    message: "3 coaches have missed sessions this week",
    priority: "high",
    count: 3,
    action: "Review Now",
  },
  {
    id: 2,
    type: "unassigned_freshmen",
    message: "8 freshmen need coach assignment",
    priority: "medium",
    count: 8,
    action: "Assign",
  },
  {
    id: 3,
    type: "low_engagement",
    message: "2 coaches showing low engagement",
    priority: "medium",
    count: 2,
    action: "Check",
  },
];

const quickInsights = [
  {
    title: "Top Performer",
    subtitle: "Sarah Johnson",
    value: "98% success rate",
    icon: Star,
    color: "#f59e0b",
  },
  {
    title: "Most Active",
    subtitle: "This Week",
    value: "47 sessions",
    icon: Zap,
    color: "#8b5cf6",
  },
];

export default function CoachingDashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleSearchPress = () => {
    setIsSearchMode(true);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    greetingContainer: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      position: "relative",
      overflow: "hidden",
    },
    greetingGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
    },
    greetingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    greetingContent: {
      flex: 1,
    },
    greetingText: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    greetingSubtext: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      lineHeight: 22,
    },
    greetingNotification: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.xxxl,
      padding: theme.spacing.sm,
      position: "relative",
    },
    notificationDot: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.error,
    },
    greetingStats: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.background + "60",
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    greetingStatItem: {
      alignItems: "center",
      flex: 1,
    },
    greetingStatNumber: {
      ...theme.typography.h5,
      color: theme.colors.primary,
      fontWeight: "800",
      marginBottom: 2,
    },
    greetingStatLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      textAlign: "center",
    },
    greetingStatDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    insightsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    insightsRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    insightCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    insightHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    insightIcon: {
      marginRight: theme.spacing.sm,
    },
    insightTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    insightSubtitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    insightValue: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    enhancedStatCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      position: "relative",
    },
    statTrend: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      backgroundColor: theme.colors.success + "20",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    statTrendText: {
      ...theme.typography.captionSmall,
      color: theme.colors.success,
      fontWeight: "700",
      fontSize: 10,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary + "10",
    },
    seeAllText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginRight: theme.spacing.xs,
    },
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    quickActionCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      position: "relative",
    },
    quickActionIcon: {
      marginBottom: theme.spacing.sm,
    },
    quickActionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
    },
    quickActionBadge: {
      position: "absolute",
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      backgroundColor: theme.colors.error,
      borderRadius: theme.borderRadius.xxxl,
      width: 8,
      height: 8,
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    activityContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    activityTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    activitySubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    activityTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    activityRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.xs,
    },
    ratingStars: {
      flexDirection: "row",
      marginRight: theme.spacing.xs,
    },
    sessionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderLeftWidth: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sessionContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    sessionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    sessionTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    sessionType: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
      marginTop: theme.spacing.xs,
    },
    sessionTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    alertsContainer: {
      gap: theme.spacing.sm,
    },
    alertItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderLeftWidth: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    alertHigh: {
      borderLeftColor: theme.colors.error,
      backgroundColor: theme.colors.error + "05",
    },
    alertMedium: {
      borderLeftColor: theme.colors.warning,
      backgroundColor: theme.colors.warning + "05",
    },
    alertContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    alertMessage: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    alertActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    alertCount: {
      backgroundColor: theme.colors.primary,
      color: "white",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      fontSize: 12,
      fontWeight: "700",
      minWidth: 24,
      textAlign: "center",
    },
    alertActionButton: {
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    alertActionText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    searchResultsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    searchSuggestions: {
      padding: theme.spacing.md,
      alignItems: "center",
    },
    suggestionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    },
    searchResultsContent: {
      padding: theme.spacing.md,
    },
    searchResultsTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    noResultsContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "assign":
        router.push("/(routes)/head-of-coaches/assign");
        break;
      case "coaches":
        router.push("/(routes)/head-of-coaches/coaches");
        break;
      case "progress":
        router.push("/(routes)/head-of-coaches/coach-progress");
        break;
      case "sessions":
        router.push("/(routes)/head-of-coaches/coach-sessions");
        break;
      case "events":
        router.push("/(routes)/head-of-coaches/events/wellness");
        break;
      case "announcements":
        router.push("/(routes)/common/announcements/send");
        break;
      default:
        console.log("Action:", action);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "session_completed":
        return <Award color={theme.colors.success} size={20} />;
      case "new_assignment":
        return <UserCheck color={theme.colors.primary} size={20} />;
      case "session_missed":
        return <AlertCircle color={theme.colors.error} size={20} />;
      default:
        return <Clock color={theme.colors.textSecondary} size={20} />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "session_completed":
        return {
          title: "Session Completed",
          subtitle: `${activity.coach} with ${activity.student}`,
        };
      case "new_assignment":
        return {
          title: "New Assignment",
          subtitle: `${activity.student} assigned to ${activity.coach}`,
        };
      case "session_missed":
        return {
          title: "Session Missed",
          subtitle: `${activity.coach} - ${activity.student}`,
        };
      default:
        return { title: "Activity", subtitle: "Unknown activity" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return theme.colors.error;
      case "medium":
        return theme.colors.warning;
      case "low":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        color={i < rating ? theme.colors.warning : theme.colors.border}
        fill={i < rating ? theme.colors.warning : "transparent"}
      />
    ));
  };

  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Search for coaches, students, sessions, or activities...
          </Text>
        </View>
      ) : (
        <View style={styles.searchResultsContent}>
          <Text style={styles.searchResultsTitle}>
            Search Results for "{searchQuery}"
          </Text>
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No results found. Try searching for specific names or activities.
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isSearchMode ? (
        <>
          <FullSearchHeader
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={handleSearchClose}
            onSubmit={handleSearchSubmit}
            placeholder="Search coaches, students, sessions..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Coaching Dashboard"
            showSearch={true}
            onSearchPress={handleSearchPress}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            {/* Personalized Greeting Section - Now Scrollable */}
            <View style={styles.greetingContainer}>
              <View style={styles.greetingGradient} />
              <View style={styles.greetingHeader}>
                <View style={styles.greetingContent}>
                  <Text style={styles.greetingText}>
                    {getTimeBasedGreeting()}, Coach! 👋
                  </Text>
                  <Text style={styles.greetingSubtext}>
                    You have 3 sessions today and 2 pending assignments
                  </Text>
                </View>
                <TouchableOpacity style={styles.greetingNotification}>
                  <Bell color={theme.colors.primary} size={20} />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              </View>
              <View style={styles.greetingStats}>
                <View style={styles.greetingStatItem}>
                  <Text style={styles.greetingStatNumber}>94%</Text>
                  <Text style={styles.greetingStatLabel}>Success Rate</Text>
                </View>
                <View style={styles.greetingStatDivider} />
                <View style={styles.greetingStatItem}>
                  <Text style={styles.greetingStatNumber}>156</Text>
                  <Text style={styles.greetingStatLabel}>Active Students</Text>
                </View>
                <View style={styles.greetingStatDivider} />
                <View style={styles.greetingStatItem}>
                  <Text style={styles.greetingStatNumber}>3</Text>
                  <Text style={styles.greetingStatLabel}>Today's Sessions</Text>
                </View>
              </View>
            </View>

            {/* Quick Insights */}
            <View style={styles.insightsContainer}>
              <View style={styles.insightsRow}>
                {quickInsights.map((insight, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.insightCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.insightHeader}>
                      <insight.icon
                        color={insight.color}
                        size={16}
                        style={styles.insightIcon}
                      />
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                    </View>
                    <Text style={styles.insightSubtitle}>
                      {insight.subtitle}
                    </Text>
                    <Text style={styles.insightValue}>{insight.value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Enhanced Stats Overview */}
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                {dashboardStats.map((stat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.enhancedStatCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.statTrend}>
                      <Text style={styles.statTrendText}>{stat.trend}</Text>
                    </View>
                    <stat.icon
                      color={stat.color}
                      size={28}
                      style={{ marginBottom: theme.spacing.sm }}
                    />
                    <Text
                      style={{
                        ...theme.typography.h6,
                        color: theme.colors.text,
                        fontWeight: "800",
                        marginBottom: 4,
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={{
                        ...theme.typography.captionSmall,
                        color: theme.colors.textSecondary,
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      {stat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("assign")}
                  activeOpacity={0.7}
                >
                  <View style={styles.quickActionBadge} />
                  <UserCheck
                    color={theme.colors.primary}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>Assign Freshman</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("coaches")}
                  activeOpacity={0.7}
                >
                  <Users
                    color={theme.colors.success}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>View Coaches</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("progress")}
                  activeOpacity={0.7}
                >
                  <Target
                    color={theme.colors.warning}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>Track Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("sessions")}
                  activeOpacity={0.7}
                >
                  <Calendar
                    color={theme.colors.info}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>Manage Sessions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("events")}
                  activeOpacity={0.7}
                >
                  <Plus
                    color={theme.colors.accent}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>Create Event</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.quickActionCard}
                  onPress={() => handleQuickAction("announcements")}
                  activeOpacity={0.7}
                >
                  <MessageSquare
                    color={theme.colors.secondary}
                    size={24}
                    style={styles.quickActionIcon}
                  />
                  <Text style={styles.quickActionTitle}>Send Announcement</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Alerts & Notifications */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Alerts & Notifications</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>View All</Text>
                  <ArrowRight color={theme.colors.primary} size={16} />
                </TouchableOpacity>
              </View>
              <View style={styles.alertsContainer}>
                {alertsData.map((alert) => (
                  <TouchableOpacity
                    key={alert.id}
                    style={[
                      styles.alertItem,
                      alert.priority === "high"
                        ? styles.alertHigh
                        : styles.alertMedium,
                    ]}
                    activeOpacity={0.7}
                  >
                    <AlertCircle
                      color={
                        alert.priority === "high"
                          ? theme.colors.error
                          : theme.colors.warning
                      }
                      size={20}
                    />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                    </View>
                    <View style={styles.alertActions}>
                      <TouchableOpacity style={styles.alertActionButton}>
                        <Text style={styles.alertActionText}>
                          {alert.action}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.alertCount}>{alert.count}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Enhanced Recent Activities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>View All</Text>
                  <ArrowRight color={theme.colors.primary} size={16} />
                </TouchableOpacity>
              </View>
              {recentActivities.map((activity) => {
                const activityText = getActivityText(activity);
                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={styles.activityItem}
                    activeOpacity={0.7}
                  >
                    <Avatar
                      imageUrl={activity.avatar}
                      initials={activity.coach.charAt(0)}
                      size={40}
                    />
                    <View style={styles.activityContent}>
                      <Text style={styles.activityTitle}>
                        {activityText.title}
                      </Text>
                      <Text style={styles.activitySubtitle}>
                        {activityText.subtitle}
                      </Text>
                      {activity.rating && (
                        <View style={styles.activityRating}>
                          <View style={styles.ratingStars}>
                            {renderStars(activity.rating)}
                          </View>
                          <Text style={styles.activityTime}>
                            Rated {activity.rating}/5
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      {getActivityIcon(activity.type)}
                      <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Enhanced Upcoming Sessions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                <TouchableOpacity style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>View All</Text>
                  <ArrowRight color={theme.colors.primary} size={16} />
                </TouchableOpacity>
              </View>
              {upcomingSessions.map((session) => (
                <TouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionItem,
                    { borderLeftColor: getPriorityColor(session.priority) },
                  ]}
                  activeOpacity={0.7}
                >
                  <Avatar
                    imageUrl={session.avatar}
                    initials={session.coach.charAt(0)}
                    size={40}
                  />
                  <View style={styles.sessionContent}>
                    <Text style={styles.sessionTitle}>
                      {session.coach} → {session.student}
                    </Text>
                    <Text style={styles.sessionTime}>{session.time}</Text>
                    <View style={styles.sessionType}>
                      <Text style={styles.sessionTypeText}>{session.type}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Clock color={theme.colors.textSecondary} size={20} />
                    <View
                      style={[
                        styles.priorityIndicator,
                        { backgroundColor: getPriorityColor(session.priority) },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
