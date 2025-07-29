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
  Modal as RNModal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  X,
  Star,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  UserPlus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import services
import { EventsService } from "@/services/events.service";

// Import reusable components
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { EventDetailModal } from "@/components/modals/EventDetailModal";

interface CoachProfileModalProps {
  visible: boolean;
  onClose: () => void;
  coach: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status: string;
    year: string;
    major: string;
    studentsCount: number;
    lastActive: string;
    isActive: boolean;
    phone?: string;
    department?: string;
    bio?: string;
    country?: string;
    yearGroup?: string;
    studentId: string;
    detailedStats?: {
      totalStudents: number;
      successRate: number;
      rating: number;
      totalSessions: number;
    };
    assignedStudents?: any[];
    recentSessions?: any[];
  } | null;
  userRole?: "head_of_coaches" | "peer_coach" | "advisor" | "student_leader";
  currentUserId?: string; // Add current user ID
}

export function CoachProfileModal({
  visible,
  onClose,
  coach,
  userRole = "head_of_coaches",
  currentUserId,
}: CoachProfileModalProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // EventDetailModal states
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionDetail, setShowSessionDetail] = useState(false);

  const coachStats = coach?.detailedStats || {
    totalStudents: 0,
    successRate: 94,
    rating: 4.8,
    totalSessions: 0,
  };

  const assignedStudents = coach?.assignedStudents || [];

  // Load recent sessions when modal opens
  useEffect(() => {
    if (visible && coach?.id) {
      loadRecentSessions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, coach?.id]);

  const loadRecentSessions = async () => {
    if (!coach?.id) return;

    try {
      setLoadingSessions(true);

      // Get sessions from the sessions collection
      const { events: sessions, error } = await EventsService.getEvents(
        50, // Get recent 50
        "All", // All categories
        "sessions" // Use sessions collection
      );

      if (error) {
        console.error("Error loading sessions:", error);
        return;
      }

      if (sessions) {
        // Filter sessions where this coach is involved (either as creator or invitee)
        const coachSessions = sessions
          .filter((session) => {
            // Session where coach is the creator (coach hosting session for student)
            const isCoachHost = session.userId === coach.id;

            // Session where coach is invited (student requested session with coach)
            const isCoachInvited = session.invitedUsers?.includes(coach.id);

            return isCoachHost || isCoachInvited;
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 10); // Get most recent 10

        setRecentSessions(coachSessions);
      }
    } catch (error) {
      console.error("Error loading recent sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecentSessions();
    setRefreshing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coach?.id]);

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

  const getProgressColor = (status: string) => {
    switch (status) {
      case "excellent":
        return theme.colors.success;
      case "good":
        return theme.colors.primary;
      case "needs-attention":
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Get session status and styling
  const getSessionStatus = (session: any) => {
    const now = new Date();
    const sessionDate = new Date(session.date);

    if (session.status === "completed") {
      return {
        label: "Completed",
        color: theme.colors.success,
        icon: CheckCircle,
        bgColor: theme.colors.success + "15",
      };
    } else if (session.status === "cancelled") {
      return {
        label: "Cancelled",
        color: theme.colors.error,
        icon: XCircle,
        bgColor: theme.colors.error + "15",
      };
    } else if (sessionDate < now) {
      return {
        label: "Past",
        color: theme.colors.textSecondary,
        icon: Clock,
        bgColor: theme.colors.textSecondary + "15",
      };
    } else {
      return {
        label: "Upcoming",
        color: theme.colors.primary,
        icon: Clock,
        bgColor: theme.colors.primary + "15",
      };
    }
  };

  const handleSessionPress = (session: any) => {
    if (userRole === "head_of_coaches") {
      setSelectedSession(session);
      setShowSessionDetail(true);
    }
  };

  const getUserRSVPStatus = (session: any): "yes" | "no" | "maybe" | "none" => {
    if (!currentUserId) return "none";
    if (session.rsvpYes?.includes(currentUserId)) return "yes";
    if (session.rsvpNo?.includes(currentUserId)) return "no";
    if (session.rsvpMaybe?.includes(currentUserId)) return "maybe";
    return "none";
  };

  const styles = StyleSheet.create({
    fullScreenContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    closeButton: {
      padding: 8,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    profileHeader: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileAvatar: {
      marginBottom: theme.spacing.md,
    },
    nameWithStatus: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    statusDotSmall: {
      width: 15,
      height: 15,
      borderRadius: 25,
    },
    profileName: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    profileDetailsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      width: "100%",
    },
    profileDetailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    profileDetailLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      flex: 1,
    },
    profileDetailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 2,
      textAlign: "right",
    },
    studentCountry: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginTop: 2,
    },
    viewStudentButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.primary + "10",
    },
    lastSessionText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginTop: theme.spacing.xs,
    },
    profileDetails: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      fontWeight: "500",
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.success + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.sm,
    },
    statusText: {
      ...theme.typography.bodySmall,
      color: theme.colors.success,
      fontWeight: "600",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    ratingText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    aboutCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    aboutText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      fontWeight: "500",
    },
    studentItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    studentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    studentInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
      marginRight: theme.spacing.sm,
    },
    studentName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    studentDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginTop: 2,
    },
    progressContainer: {
      marginTop: theme.spacing.md,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    progressLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    progressValue: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 3,
    },
    sessionItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    sessionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    sessionContent: {
      flex: 1,
    },
    sessionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.xs,
    },
    sessionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    sessionTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sessionLocation: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginTop: 2,
    },
    statusFlag: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      gap: theme.spacing.xs,
    },
    statusFlagText: {
      ...theme.typography.captionSmall,
      fontWeight: "600",
      fontSize: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      fontWeight: "500",
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      marginVertical: theme.spacing.lg,
      fontWeight: "500",
    },
  });

  const renderStudentItem = ({ item: student }: { item: any }) => {
    const progressColor = getProgressColor(student.status);

    return (
      <View style={styles.studentItem}>
        <View style={styles.studentHeader}>
          <Avatar
            imageUrl={student.avatar}
            initials={student.name.charAt(0)}
            size={50}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetails}>
              {student.year} • {student.major}
            </Text>
            {student.country && (
              <Text style={styles.studentCountry}>📍 {student.country}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.viewStudentButton}
            onPress={() => console.log("View student profile:", student.id)}
          >
            <Eye color={theme.colors.primary} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Academic Progress</Text>
            <Text style={styles.progressValue}>{student.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressColor,
                  width: `${student.progress}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.lastSessionText}>
            Last session: {student.lastSession}
          </Text>
        </View>
      </View>
    );
  };

  const renderSessionItem = ({ item: session }: { item: any }) => {
    const statusInfo = getSessionStatus(session);
    const StatusIcon = statusInfo.icon;

    return (
      <TouchableOpacity
        style={styles.sessionItem}
        onPress={() => handleSessionPress(session)}
        activeOpacity={userRole === "head_of_coaches" ? 0.8 : 1}
      >
        <View style={styles.sessionIcon}>
          <Calendar color={theme.colors.primary} size={20} />
        </View>
        <View style={styles.sessionContent}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionTitle} numberOfLines={1}>
              {session.title}
            </Text>
            {/* Status Flag */}
            <View
              style={[
                styles.statusFlag,
                { backgroundColor: statusInfo.bgColor },
              ]}
            >
              <StatusIcon color={statusInfo.color} size={12} />
              <Text
                style={[styles.statusFlagText, { color: statusInfo.color }]}
              >
                {statusInfo.label}
              </Text>
            </View>
          </View>
          <Text style={styles.sessionTime}>
            {new Date(session.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            •{" "}
            {session.allDay
              ? "All day"
              : `${session.startTime} - ${session.endTime}`}
          </Text>
          {session.location && (
            <Text style={styles.sessionLocation}>📍 {session.location}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!coach) return null;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
      hardwareAccelerated={true}
    >
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Coach Profile</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#666" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Avatar
                  imageUrl={coach.avatar}
                  initials={coach.name.charAt(0)}
                  size={80}
                />
              </View>

              <View style={styles.nameWithStatus}>
                <Text style={styles.profileName}>
                  {coach.name} {"  "}
                </Text>
                <View
                  style={[
                    styles.statusDotSmall,
                    { backgroundColor: getStatusColor(coach.status) },
                  ]}
                />
              </View>

              <View style={styles.profileDetailsContainer}>
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Student ID</Text>
                  <Text style={styles.profileDetailValue}>
                    {coach.studentId || "N/A"}
                  </Text>
                </View>
                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Class</Text>
                  <Text style={styles.profileDetailValue}>
                    {coach.yearGroup || coach.year || "N/A"}
                  </Text>
                </View>

                <View style={styles.profileDetailRow}>
                  <Text style={styles.profileDetailLabel}>Major</Text>
                  <Text style={styles.profileDetailValue}>
                    {coach.major || "N/A"}
                  </Text>
                </View>

                {coach.country && (
                  <View style={styles.profileDetailRow}>
                    <Text style={styles.profileDetailLabel}>Country</Text>
                    <Text style={styles.profileDetailValue}>
                      📍 {coach.country}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.actionButtons}>
                <Button
                  title="Assign Student"
                  onPress={() => {
                    onClose();
                    router.push("(routes)/assign-freshman");
                  }}
                  icon={UserPlus}
                  mode="contained"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Message"
                  onPress={() => console.log("Message coach:", coach.email)}
                  icon={MessageCircle}
                  mode="outlined"
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            {/* Performance Overview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Overview</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  label="Total Students"
                  value={coachStats.totalStudents.toString()}
                  icon={Users}
                  color={theme.colors.primary}
                  style={{ flex: 1 }}
                />
                <StatCard
                  label="Success Rate"
                  value={`${coachStats.successRate}%`}
                  icon={TrendingUp}
                  color={theme.colors.success}
                  style={{ flex: 1 }}
                />
                <StatCard
                  label="Rating"
                  value={coachStats.rating.toString()}
                  icon={Star}
                  color={theme.colors.warning}
                  style={{ flex: 1 }}
                />
                <StatCard
                  label="Sessions"
                  value={recentSessions.length.toString()}
                  icon={Calendar}
                  color={theme.colors.info}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.aboutCard}>
                <Text style={styles.aboutText}>
                  {coach.bio || "No bio available for this coach."}
                </Text>
              </View>
            </View>

            {/* Assigned Students */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Assigned Students ({assignedStudents.length})
              </Text>
              {assignedStudents.length > 0 ? (
                <FlatList
                  data={assignedStudents}
                  renderItem={renderStudentItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.emptyStateText}>
                  No students assigned to this coach yet.
                </Text>
              )}
            </View>

            {/* Recent Sessions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recent Sessions ({recentSessions.length})
              </Text>
              {loadingSessions ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading sessions...</Text>
                </View>
              ) : recentSessions.length > 0 ? (
                <FlatList
                  data={recentSessions}
                  renderItem={renderSessionItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text style={styles.emptyStateText}>
                  No recent sessions found between this coach and students.
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        {/* EventDetailModal for session details */}
        <EventDetailModal
          visible={showSessionDetail}
          event={selectedSession}
          onClose={() => {
            setShowSessionDetail(false);
            setSelectedSession(null);
          }}
          onEdit={() => {}} // Head of coaches can't edit sessions
          onDelete={() => {}} // Head of coaches can't delete sessions
          onRSVP={() => {}} // Head of coaches don't RSVP
          currentUserId={currentUserId}
          userRSVPStatus={
            selectedSession ? getUserRSVPStatus(selectedSession) : "none"
          }
          contentType="session"
          attendeeProfiles={[]} // Could load if needed
        />
      </SafeAreaView>
    </RNModal>
  );
}
