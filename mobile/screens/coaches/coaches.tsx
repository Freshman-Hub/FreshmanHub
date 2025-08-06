"use client";

import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  // UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  ArrowLeft,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";

// Import services
import { UserService } from "@/services/user.service";
import { EventsService } from "@/services/events.service";
import { useSQLiteContext } from "expo-sqlite";


import { CoachProfileModal } from "@/components/ui/CoachProfileModal";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { CoachOptionsMenu } from "@/components/ui/CoachOptionsMenu";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const filterOptions = ["All", "Available", "Busy", "Offline"];

export default function ViewCoachesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const [showCoachProfileModal, setShowCoachProfileModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);

  // State for real data
  const [coaches, setCoaches] = useState<any[]>([]);
  const [, setAllUsers] = useState<any[]>([]);
  const [, setSessions] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCoaches: 0,
    availableCoaches: 0,
    studentsHelped: 0,
  });

  // Add this line to get SQLite context
  const db = useSQLiteContext();

  // Add this useEffect to set the SQLite context in UserService
  useEffect(() => {
    if (db) {
      UserService.setSQLiteContext(db);
      EventsService.setSQLiteContext(db);
      console.log("✅ SQLite context set in EventsService");
    }
  }, [db]);

  const loadCoachesData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("\n\n🔄 Loading coaches data...");

      // Fetch all users
      const { users, error: usersError } = await UserService.getAllUsers();
      if (usersError) {
        console.error("Error fetching users:", usersError);
        return;
      }

      setAllUsers(users);

      // Filter for peer coaches
      const peerCoaches = users.filter((user) => user.role === "peer_coach");

      // Fetch sessions to determine coach activity
      const { events: allSessions, error: sessionsError } =
        await EventsService.getEvents(100, undefined, "sessions");

      if (!sessionsError) {
        setSessions(allSessions);
      }

      // Process coaches data with activity status AND detailed info for modal
      const processedCoaches = peerCoaches.map((coach) => {
        // Calculate activity status based on recent sessions or last login
        const status = determineCoachStatus(coach, allSessions || []);

        // Count assigned students (freshmen assigned to this coach)
        const assignedStudents = users.filter(
          (student) =>
            student.role === "freshman" && student.assignedCoach === coach.id
        );

        // Get coach's sessions
        const coachSessions = (allSessions || []).filter(
          (session) => session.userId === coach.id
        );

        // Get recent sessions (last 5) for modal
        const recentSessions = coachSessions
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
          .map((session) => ({
            id: session.id,
            title: session.title || "Coaching Session",
            type: session.category || "Session",
            date: session.date,
            time: session.startTime || "Time TBD",
            student:
              session.attendees?.length > 0
                ? "Group Session"
                : "Individual Session",
          }));

        // Process assigned students with mock data for modal
        const processedStudents = assignedStudents.map((student) => {
          const progress = Math.floor(Math.random() * 40) + 60; // 60-100%

          return {
            id: student.id,
            name:
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              student.email?.split("@")[0] ||
              "Unknown",
            avatar: student.profileImage,
            progress: progress,
            status:
              progress >= 80
                ? "excellent"
                : progress >= 65
                  ? "good"
                  : "needs-attention",
            lastSession: "2 days ago", // Mock for now
            year: student.yearGroup || "Freshman",
            major: student.major || "Undeclared",
            country: student.country || "N/A", // Add country
          };
        });

        return {
          id: coach.id,
          name:
            `${coach.firstName || ""} ${coach.lastName || ""}`.trim() ||
            coach.email?.split("@")[0] ||
            "Unknown",
          email: coach.email,
          avatar: coach.profileImage,
          status: status,
          year: coach.yearGroup || "N/A",
          yearGroup: coach.yearGroup, // Add explicit yearGroup
          major: coach.major || "N/A",
          country: coach.country || "United States",
          studentsCount: assignedStudents.length,
          studentId: coach.studentId || "N/A", // Add studentId
          lastActive: getLastActiveText(coach, allSessions || []),
          isActive: coach.isActive,
          phone: coach.phoneNumber,
          department: coach.department,
          bio: coach.bio,
          // Add detailed data for modal
          detailedStats: {
            totalStudents: assignedStudents.length,
            successRate: 94, // Mock for now
            rating: 4.8, // Mock for now
            totalSessions: coachSessions.length,
          },
          assignedStudents: processedStudents,
          recentSessions: recentSessions,
        };
      });

      setCoaches(processedCoaches);

      // Calculate summary stats
      const totalCoaches = processedCoaches.length;
      const availableCoaches = processedCoaches.filter(
        (coach) => coach.status === "active" && coach.isActive
      ).length;

      // Count unique students helped (all freshmen assigned to any coach)
      const studentsHelped = users.filter(
        (user) => user.role === "freshman" && user.assignedCoach
      ).length;

      setSummaryStats({
        totalCoaches,
        availableCoaches,
        studentsHelped,
      });
    } catch (error) {
      console.error("Error loading coaches data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Determine coach status based on recent activity
  const determineCoachStatus = (coach: any, sessions: any[]) => {
    if (!coach.isActive) return "offline";

    // Check if coach has ongoing sessions (sessions starting within the hour)
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const ongoingSessions = sessions.filter((session) => {
      if (session.userId !== coach.id) return false;

      const sessionDateTime = new Date(session.date);
      return sessionDateTime >= now && sessionDateTime <= oneHourFromNow;
    });

    if (ongoingSessions.length > 0) return "busy";

    // For now, assume active coaches are available
    // In the future, you could check last login time, etc.
    return "active";
  };

  // Get last active text
  const getLastActiveText = (coach: any, sessions: any[]) => {
    if (!coach.isActive) return "Offline";

    // Find the most recent session by this coach
    const coachSessions = sessions
      .filter((session) => session.userId === coach.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (coachSessions.length > 0) {
      const lastSession = coachSessions[0];
      const sessionDate = new Date(lastSession.date);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Active now";
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      return "Over a week ago";
    }

    return "Recently joined";
  };

  // Load data on component mount
  useEffect(() => {
    loadCoachesData();
  }, [loadCoachesData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCoachesData();
    setRefreshing(false);
  }, [loadCoachesData]);

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

  const filteredCoaches = coaches.filter((coach) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Available")
      return coach.status === "active" && coach.isActive;
    if (activeFilter === "Busy") return coach.status === "busy";
    if (activeFilter === "Offline")
      return coach.status === "offline" || !coach.isActive;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.colors.success;
      case "busy":
        return theme.colors.warning;
      case "offline":
        return theme.colors.textSecondary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle color={theme.colors.success} size={14} />;
      case "busy":
        return <Clock color={theme.colors.warning} size={14} />;
      case "offline":
        return <AlertCircle color={theme.colors.textSecondary} size={14} />;
      default:
        return <AlertCircle color={theme.colors.textSecondary} size={14} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Available";
      case "busy":
        return "In Session";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    summaryContainer: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    summaryNumber: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    summaryLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    summaryDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    filterContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    coachesContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    coachCardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    coachInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    coachName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    coachDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    coachStatus: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    coachStatusText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    studentsCount: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    coachActions: {
      alignItems: "flex-end",
      gap: theme.spacing.sm,
    },
    viewCoachButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    viewCoachButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
      fontWeight: "500",
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
      fontWeight: "500",
    },
  });

  const handleCoachAction = (action: string, coach: any) => {
    switch (action) {
      case "assign":
        router.push("/(routes)/assign-freshman");
        break;
      case "call":
        console.log("Calling", coach.name, "at", coach.phone);
        break;
      case "message":
        console.log("Messaging", coach.name);
        break;
      case "email":
        console.log("Emailing", coach.email);
        break;
      case "schedule":
        router.push(`/schedule-session?coachId=${coach.id}`);
        break;
      case "profile":
        // Open modal instead of navigating
        setSelectedCoach(coach);
        setShowCoachProfileModal(true);
        break;
      default:
        console.log("Action:", action, "for", coach.name);
    }
  };

  const renderCoachCard = ({ item: coach }: { item: any }) => (
    <Card
      style={{ marginBottom: theme.spacing.md }}
      content={
        <View style={styles.coachCardContent}>
          <Avatar
            imageUrl={coach.avatar}
            initials={coach.name
              .split(" ")
              .map((n: string) => n.charAt(0))
              .join("")}
            size={45}
          />
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>{coach.name}</Text>
            <Text style={styles.coachDetails}>
              {coach.year} • {coach.major}
            </Text>
            <View style={styles.coachStatus}>
              {getStatusIcon(coach.status)}
              <Text
                style={[
                  styles.coachStatusText,
                  { color: getStatusColor(coach.status) },
                ]}
              >
                {getStatusText(coach.status)} • {coach.lastActive}
              </Text>
            </View>
            <Text style={styles.studentsCount}>
              {coach.studentsCount} students assigned
            </Text>
          </View>
          <View style={styles.coachActions}>
            <TouchableOpacity
              style={styles.viewCoachButton}
              onPress={() => handleCoachAction("profile", coach)}
              activeOpacity={0.8}
            >
              <Eye color="white" size={16} />
              <Text style={styles.viewCoachButtonText}>View Coach</Text>
            </TouchableOpacity>
            <CoachOptionsMenu
              coach={coach}
              onAssignFreshman={(coach) => handleCoachAction("assign", coach)}
              onCall={(coach) => handleCoachAction("call", coach)}
              onMessage={(coach) => handleCoachAction("message", coach)}
              onEmail={(coach) => handleCoachAction("email", coach)}
              onSchedule={(coach) => handleCoachAction("schedule", coach)}
              onViewProfile={(coach) => handleCoachAction("profile", coach)}
            />
          </View>
        </View>
      }
    />
  );

  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Search for peer coaches by name, major, or department...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoaches.filter(
            (coach: any) =>
              coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coach.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coach.department
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              coach.email.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderCoachCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        />
      )}
    </View>
  );

  // Show loading spinner when loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header title="Peer Coaches" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isSearchMode ? (
        <>
          <FullSearchHeader
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={handleSearchClose}
            onSubmit={handleSearchSubmit}
            placeholder="Search peer coaches..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Peer Coaches"
            showSearch={true}
            leftIcon={ArrowLeft}
            onLeftPress={() => router.back()}
            onSearchPress={handleSearchPress}
          />

          <View style={styles.content}>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {summaryStats.totalCoaches}
                </Text>
                <Text style={styles.summaryLabel}>Total Coaches</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {summaryStats.availableCoaches}
                </Text>
                <Text style={styles.summaryLabel}>Available</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {summaryStats.studentsHelped}
                </Text>
                <Text style={styles.summaryLabel}>Students Assigned</Text>
              </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {filterOptions.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={activeFilter === filter}
                      onPress={() => setActiveFilter(filter)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Coaches List */}
            <View style={styles.coachesContainer}>
              {filteredCoaches.length > 0 ? (
                <FlatList
                  data={filteredCoaches}
                  renderItem={renderCoachCard}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Users color={theme.colors.textSecondary} size={48} />
                  <Text style={styles.emptyStateText}>
                    No peer coaches found for the selected filter.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Add Coach Profile Modal */}
      <CoachProfileModal
        visible={showCoachProfileModal}
        onClose={() => {
          setShowCoachProfileModal(false);
          setSelectedCoach(null);
        }}
        coach={selectedCoach}
        userRole={
          user?.role as
            | "advisor"
            | "student_leader"
            | "peer_coach"
            | "head_of_coaches"
            | undefined
        }
        currentUserId={user?.id}
      />
    </SafeAreaView>
  );
}
