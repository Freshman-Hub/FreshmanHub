"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  Calendar,
  Bell,
  MessageSquare,
  UserCheck,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Target,
  Award,
  ArrowRight,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { FilterChip } from "@/components/ui/FilterChip";

const { width } = Dimensions.get("window");

// Mock data - in real app, this would come from API
const dashboardStats = [
  {
    label: "Total Freshmen",
    value: "342",
    icon: Users,
    color: "#3b82f6",
    change: "+12",
  },
  {
    label: "Active Coaches",
    value: "28",
    icon: UserCheck,
    color: "#059669",
    change: "+3",
  },
  {
    label: "Sessions Today",
    value: "47",
    icon: Calendar,
    color: "#dc2626",
    change: "+8",
  },
  {
    label: "Completion Rate",
    value: "94%",
    icon: Target,
    color: "#7c3aed",
    change: "+2%",
  },
];

const quickActions = [
  {
    title: "Assign Students",
    description: "Assign freshmen to peer coaches",
    icon: UserCheck,
    color: "#3b82f6",
    route: "(routes)/assign-freshman",
  },
  {
    title: "View All Coaches",
    description: "Manage peer coaches",
    icon: Users,
    color: "#059669",
    route: "/coaches",
  },
  {
    title: "Session Analytics",
    description: "View detailed reports",
    icon: BarChart3,
    color: "#dc2626",
    route: "/analytics",
  },
  {
    title: "Send Announcement",
    description: "Global announcements",
    icon: MessageSquare,
    color: "#7c3aed",
    route: "/announcements",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "session_completed",
    title: "Session completed",
    description: "Sarah Mensah completed session with Coach Michael",
    time: "2 minutes ago",
    icon: CheckCircle,
    color: "#059669",
  },
  {
    id: 2,
    type: "new_assignment",
    title: "New assignment",
    description: "3 freshmen assigned to Coach Ama Asante",
    time: "15 minutes ago",
    icon: UserCheck,
    color: "#3b82f6",
  },
  {
    id: 3,
    type: "missed_session",
    title: "Missed session alert",
    description: "John Doe missed scheduled session",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "#dc2626",
  },
  {
    id: 4,
    type: "coach_achievement",
    title: "Coach milestone",
    description: "Coach Kwame reached 50 completed sessions",
    time: "2 hours ago",
    icon: Award,
    color: "#7c3aed",
  },
];

const upcomingSessions = [
  {
    id: 1,
    student: "Sarah Mensah",
    coach: "Michael Osei",
    time: "10:00 AM",
    type: "Academic Support",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    student: "Kwame Nkrumah",
    coach: "Ama Asante",
    time: "2:00 PM",
    type: "Career Guidance",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    student: "Akosua Frimpong",
    coach: "John Mensah",
    time: "4:30 PM",
    type: "Personal Development",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const performanceMetrics = [
  { label: "Avg Session Rating", value: "4.8", unit: "/5", color: "#059669" },
  { label: "Response Time", value: "12", unit: "min", color: "#3b82f6" },
  { label: "Student Satisfaction", value: "96", unit: "%", color: "#7c3aed" },
  { label: "Coach Retention", value: "89", unit: "%", color: "#dc2626" },
];

const currentUser = {
  name: "Dr. Patricia Mensah",
  role: "Head of Coaches",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  department: "Student Success Center",
};

export default function HeadCoachHomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Today");
  const [notifications, setNotifications] = useState(12);

  const timeFilters = ["Today", "This Week", "This Month", "All Time"];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    welcomeSection: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
    },
    welcomeContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    welcomeText: {
      flex: 1,
    },
    welcomeTitle: {
      ...theme.typography.h4,
      color: "white",
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    welcomeSubtitle: {
      ...theme.typography.body,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
    },
    welcomeAvatar: {
      marginLeft: theme.spacing.lg,
    },
    statsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      marginTop: -theme.spacing.xl,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    statCardWrapper: {
      width: (width - theme.spacing.md * 2 - theme.spacing.sm) / 2,
    },
    quickActionsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    sectionAction: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    quickActionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    quickActionCard: {
      width: (width - theme.spacing.md * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    quickActionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    quickActionDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    performanceSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    performanceGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.xs,
    },
    performanceCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
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
    performanceValue: {
      ...theme.typography.h5,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    performanceUnit: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
    },
    performanceLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      fontWeight: "600",
    },
    activitySection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    filtersContainer: {
      marginBottom: theme.spacing.lg,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
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
    activityTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    activityDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    activityTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sessionsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sessionItem: {
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
    sessionAvatar: {
      marginRight: theme.spacing.md,
    },
    sessionContent: {
      flex: 1,
    },
    sessionStudent: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    sessionDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    sessionTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    sessionArrow: {
      marginLeft: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title=""
        rightIcon={Bell}
        onRightPress={() => router.push("/notifications")}
        showSearch={true}
        onSearchPress={() => router.push("/search")}
        style={{ backgroundColor: "transparent", borderBottomWidth: 0 }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Good morning, Dr. Mensah!</Text>
              <Text style={styles.welcomeSubtitle}>
                Ready to support our coaching community today?
              </Text>
            </View>
            <View style={styles.welcomeAvatar}>
              <Avatar
                imageUrl={currentUser.avatar}
                initials={currentUser.name.charAt(0)}
                size={60}
              />
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
              <View key={index} style={styles.statCardWrapper}>
                <StatCard
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  style={{ height: 120 }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.performanceSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <TouchableOpacity onPress={() => router.push("/performance")}>
              <Text style={styles.sectionAction}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.performanceGrid}>
            {performanceMetrics.map((metric, index) => (
              <View key={index} style={styles.performanceCard}>
                <Text
                  style={[styles.performanceValue, { color: metric.color }]}
                >
                  {metric.value}
                  <Text
                    style={[
                      styles.performanceUnit,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {metric.unit}
                  </Text>
                </Text>
                <Text style={styles.performanceLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity onPress={() => router.push("/quick-actions")}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                  <action.icon color={action.color} size={24} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/activity")}>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filtersContainer}>
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

          {recentActivity.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityItem}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: activity.color + "20" },
                ]}
              >
                <activity.icon color={activity.color} size={20} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <ArrowRight
                color={theme.colors.textSecondary}
                size={20}
                style={styles.sessionArrow}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Sessions */}
        <View style={styles.sessionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scheduled Sessions</Text>
            <TouchableOpacity onPress={() => router.push("/sessions")}>
              <Text style={styles.sectionAction}>View Schedule</Text>
            </TouchableOpacity>
          </View>

          {upcomingSessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={styles.sessionItem}
              activeOpacity={0.8}
            >
              <Avatar
                imageUrl={session.avatar}
                initials={session.student.charAt(0)}
                size={45}
                style={styles.sessionAvatar}
              />
              <View style={styles.sessionContent}>
                <Text style={styles.sessionStudent}>{session.student}</Text>
                <Text style={styles.sessionDetails}>
                  with Coach {session.coach} • {session.type}
                </Text>
                <Text style={styles.sessionTime}>{session.time}</Text>
              </View>
              <ArrowRight
                color={theme.colors.textSecondary}
                size={20}
                style={styles.sessionArrow}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
