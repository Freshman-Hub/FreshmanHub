"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Menu,
  MessageSquare,
  Target,
  UserCheck,
  Users,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import services
import { PerformanceModal } from "@/components/ui/PerformanceModal";
import { EventsService } from "@/services/events.service";
import { UserService } from "@/services/user.service";
import { useSQLiteContext } from "expo-sqlite";


// Import reusable components
import { Avatar } from "@/components/ui/Avatar";
import { FilterChip } from "@/components/ui/FilterChip";
import { Header } from "@/components/ui/Header";
import { StatCard } from "@/components/ui/StatCard";
import { MenuCard } from "@/components/ui/MenuCard";


const { width } = Dimensions.get("window");

// Keep mock data for features not yet implemented
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
    route: "(head-coach)/coach-head",
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

const performanceMetrics = [
  { label: "Avg Session Rating", value: "4.8", unit: "/5", color: "#059669" },
  { label: "Response Time", value: "12", unit: "min", color: "#3b82f6" },
  { label: "Student Satisfaction", value: "96", unit: "%", color: "#7c3aed" },
  { label: "Coach Retention", value: "89", unit: "%", color: "#dc2626" },
];

export default function HeadCoachHomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Today");
  const [loading, setLoading] = useState(true);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  const [allUsers, setAllUsers] = useState<any[]>([]); // Add this state

  // State for real data
  const [dashboardStats, setDashboardStats] = useState([
    {
      label: "Total Freshmen",
      value: "0",
      icon: Users,
      color: "#3b82f6",
      change: "+0",
    },
    {
      label: "Active Coaches",
      value: "0",
      icon: UserCheck,
      color: "#059669",
      change: "+0",
    },
    {
      label: "Sessions Today",
      value: "0",
      icon: Calendar,
      color: "#dc2626",
      change: "+0",
    },
    {
      label: "Completion Rate",
      value: "0%",
      icon: Target,
      color: "#7c3aed",
      change: "+0%",
    },
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState<
    {
      id: string;
      student: string;
      coach: string;
      time: string;
      type: string;
      avatar: string;
    }[]
  >([]);

  const timeFilters = ["Today", "This Week", "This Month", "All Time"];

  // Load dashboard data

  // Add this line to get SQLite context
  const db = useSQLiteContext();

  // Add this useEffect to set the SQLite context in UserService
  useEffect(() => {
    if (db) {
      UserService.setSQLiteContext(db);
      EventsService.setSQLiteContext(db);
      console.log("✅ SQLite context set in Coach home Screen");
    }
  }, [db]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Fetch all users
      const { users, error: usersError } = await UserService.getAllUsers();
      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      setAllUsers(users); // Store all users for the modal

      // Count freshmen
      const freshmenCount = users.filter((u) => u.role === "freshman").length;

      // Count active coaches
      const coachesCount = users.filter(
        (u) => u.role === "peer_coach" && u.isActive
      ).length;

      // Get today's sessions where user is attendee or organizer
      const { events: allSessions, error: sessionsError } =
        await EventsService.getEvents(
          100, // Get more to filter properly
          undefined,
          "sessions" // Use sessions collection
        );

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        return;
      }

      // Filter sessions for today where user is involved
      const today = new Date().toISOString().split("T")[0];
      const todaySessions = allSessions.filter((session) => {
        const sessionDate = session.date.split("T")[0];
        const isToday = sessionDate === today;
        const isInvolved =
          session.userId === user.id ||
          session.attendees?.includes(user.id) ||
          session.rsvpYes?.includes(user.id);
        return isToday && isInvolved;
      });

      // Get upcoming sessions (next 3) where user is attendee OR organizer
      const now = new Date();
      // Add detailed logging for each session
      const userUpcomingSessions = allSessions
        .map((session, index) => {
          return session;
        })
        .filter((session) => {
          // Properly combine date and time
          let sessionDateTime;

          if (session.startTime && session.date) {
            // Combine date and startTime properly
            const dateStr = session.date.includes("T")
              ? session.date.split("T")[0]
              : session.date;
            sessionDateTime = new Date(
              `${dateStr}T${session.startTime}:00.000Z`
            );
          } else {
            // Fallback to just date if no time
            sessionDateTime = new Date(session.date);
          }

          const isUpcoming = sessionDateTime > now;

          // Check if user is involved as organizer OR attendee
          const isOrganizer = session.userId === user.id;
          const isAttendee =
            session.attendees?.includes(user.id) ||
            session.rsvpYes?.includes(user.id);

          const shouldInclude = isUpcoming && (isOrganizer || isAttendee);
          return shouldInclude;
        })
        .sort((a, b) => {
          // Sort by proper combined date-time
          const aDateTime = a.startTime
            ? new Date(`${a.date.split("T")[0]}T${a.startTime}:00.000Z`)
            : new Date(a.date);
          const bDateTime = b.startTime
            ? new Date(`${b.date.split("T")[0]}T${b.startTime}:00.000Z`)
            : new Date(b.date);

          return aDateTime.getTime() - bDateTime.getTime();
        })
        .slice(0, 3)
        .map((session) => {
          // Determine if the head coach is the organizer or attendee
          const isOrganizer = session.userId === user.id;

          return {
            id: session.id,
            student: session.userDisplayName || "Unknown Student",
            coach: isOrganizer
              ? session.title || "Session" // Show session title instead of "You (Organizer)"
              : session.userDisplayName || "Unknown Coach",
            time: session.startTime || "Time TBD",
            type: session.category || "Session",
            avatar:
              session.userAvatar ||
              "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          };
        });

      // Update dashboard stats
      setDashboardStats([
        {
          label: "Total Freshmen",
          value: freshmenCount.toString(),
          icon: Users,
          color: "#3b82f6",
          change: "+0", // TODO: Calculate change from previous period
        },
        {
          label: "Active Coaches",
          value: coachesCount.toString(),
          icon: UserCheck,
          color: "#059669",
          change: "+0", // TODO: Calculate change from previous period
        },
        {
          label: "Sessions Today",
          value: todaySessions.length.toString(),
          icon: Calendar,
          color: "#dc2626",
          change: "+0", // TODO: Calculate change from previous day
        },
        {
          label: "Completion Rate",
          value: "0%", // Keep as 0% as requested
          icon: Target,
          color: "#7c3aed",
          change: "+0%",
        },
      ]);

      setUpcomingSessions(userUpcomingSessions);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get user's first name for greeting
  const getDisplayName = () => {
    if (!user) return "User";
    const firstName = user.firstName || user.email?.split("@")[0] || "User";
    return firstName;
  };

  const totalUsers = parseInt(
    dashboardStats.find((stat) => stat.label === "Total Freshmen")?.value || "0"
  );
  const activeCoaches = parseInt(
    dashboardStats.find((stat) => stat.label === "Active Coaches")?.value || "0"
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      // paddingBottom: theme.spacing.xl,
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
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginVertical: theme.spacing.lg,
      fontWeight: "500",
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
      justifyContent: "space-between",
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
    menuCardWrapper: {
      width: (width - theme.spacing.md * 2 - theme.spacing.md) / 2,
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
      fontWeight: "500",
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
      fontWeight: "500",
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
      fontWeight: "500",
    },
    sessionTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    sessionArrow: {
      marginLeft: theme.spacing.md,
    },
    emptySessionsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      marginVertical: theme.spacing.lg,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
      <Header
        title=""
        leftIcon={Menu} // Add hamburger menu
        onLeftPress={() => router.push("/(routes)/menu")} // Navigate to menu
        rightIcon={Bell}
        onRightPress={() => router.push("/notifications")}
        // showSearch={false}
        // onSearchPress={() => router.push("/(routes)/chat")}
        showMessage={true}
        onMessagePress={() => router.push("/(routes)/chats")}
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
              <Text style={styles.welcomeTitle}>
                {getGreeting()}, {getDisplayName()}!
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Ready to support our coaching community today?
              </Text>
            </View>
            <View style={styles.welcomeAvatar}>
              <Avatar
                imageUrl={user?.profileImage}
                initials={
                  user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"
                }
                size={60}
              />
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {loading && (
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          )}
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
            <TouchableOpacity onPress={() => setShowPerformanceModal(true)}>
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
              <View key={index} style={styles.menuCardWrapper}>
                <MenuCard
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  color={action.color}
                  onPress={() => router.push(action.route as any)}
                  size="medium"
                  showDescription={false} // Only show icon and title
                />
              </View>
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

          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
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
                    {session.coach} • {session.type}
                  </Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                </View>
                <ArrowRight
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.sessionArrow}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptySessionsText}>
              No upcoming sessions found
            </Text>
          )}
        </View>
      </ScrollView>
      <PerformanceModal
        visible={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        userRole={
          user?.role as
            | "student_leader"
            | "peer_coach"
            | "head_of_coaches"
            | "academic_advisor"
            | undefined
        }
        dashboardStats={dashboardStats}
        upcomingSessions={upcomingSessions}
        totalUsers={totalUsers}
        activeCoaches={activeCoaches}
        availableCoaches={allUsers} // Pass all users to the modal
      />
    </SafeAreaView>
  );
}
