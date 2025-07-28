"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  MessageCircle,
  Calendar,
  Star,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  GraduationCap,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";

// Import components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { CreateEventModal } from "@/components/ui/CreateEventModal";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { EditEventModal } from "@/components/modals/EditEventModal";
import { Loader } from "@/components/ui/Loader";

// Import services
import { UserService } from "@/services/user.service";
import { EventsService } from "@/services/events.service";
import { Event, CreateEventData } from "@/types/event.types";
import { User } from "@/types/user.types";
import { ContentItem, CreateContentData } from "@/services/content.service";

const coachingGoals = [
  {
    id: 1,
    title: "Improve Study Habits",
    progress: 75,
    status: "In Progress",
    dueDate: "End of Month",
  },
  {
    id: 2,
    title: "Build Resume",
    progress: 100,
    status: "Completed",
    dueDate: "Last Week",
  },
  {
    id: 3,
    title: "Develop Leadership Skills",
    progress: 40,
    status: "In Progress",
    dueDate: "Next Month",
  },
];

export default function CoachingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState<
    "my-coach" | "head-coach" | "my-coachees"
  >("my-coach");

  // Data states
  const [assignedCoach, setAssignedCoach] = useState<User | null>(null);
  const [myCoachees, setMyCoachees] = useState<User[]>([]);
  const [headCoach, setHeadCoach] = useState<User | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Event[]>([]);
  const [pastSessions, setPastSessions] = useState<Event[]>([]);

  // Modal states
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [preselectedCoach, setPreselectedCoach] = useState<any[]>([]);

  // Check if user can see different tabs based on role
  const canSeeMyCoach = user?.role === "freshman";
  const canSeeMyCoachees = user?.role === "peer_coach";
  const canSeeHeadCoach = true;

  // Load coachees for peer coaches
  const loadMyCoachees = useCallback(async () => {
    if (user?.role !== "peer_coach" || !user?.id) {
      setMyCoachees([]);
      return;
    }

    try {
      const { users, error } = await UserService.getAllUsers();
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      if (users) {
        const coachees = users.filter(
          (u) => u.assignedCoach === user.id && u.isActive
        );
        setMyCoachees(coachees);
      }
    } catch (error) {
      console.error("Error loading coachees:", error);
      setMyCoachees([]);
    }
  }, [user?.id, user?.role]);

  // Load head coach
  const loadHeadCoach = useCallback(async () => {
    try {
      const { users, error } = await UserService.getAllUsers();
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      if (users) {
        const headCoachUser = users.find(
          (u) => u.role === "head_of_coaches" && u.isActive
        );
        setHeadCoach(headCoachUser || null);
      }
    } catch (error) {
      console.error("Error loading head coach:", error);
      setHeadCoach(null);
    }
  }, []);

  // Load assigned coach
  const loadAssignedCoach = useCallback(async () => {
    if (!user?.assignedCoach || !canSeeMyCoach) {
      setAssignedCoach(null);
      return;
    }

    try {
      const { user: coach, error } = await UserService.getUserById(
        user.assignedCoach
      );
      if (error) {
        console.error("Error fetching assigned coach:", error);
        return;
      }

      setAssignedCoach(coach || null);
    } catch (error) {
      console.error("Error loading assigned coach:", error);
      setAssignedCoach(null);
    }
  }, [user?.assignedCoach, canSeeMyCoach]);

  // Load sessions
  const loadSessions = useCallback(async () => {
    if (!user?.id) {
      setUpcomingSessions([]);
      setPastSessions([]);
      return;
    }

    try {
      const { events: allSessions, error } = await EventsService.getEvents(
        100,
        "All",
        "sessions"
      );

      if (error) {
        console.error("Error fetching sessions:", error);
        return;
      }

      if (!allSessions) {
        setUpcomingSessions([]);
        setPastSessions([]);
        return;
      }

      // Filter sessions where user is involved
      const userSessions = allSessions.filter(
        (session) =>
          session.userId === user.id ||
          session.invitedUsers?.includes(user.id) ||
          session.attendees?.includes(user.id)
      );

      // Additional privacy filter for one-on-one sessions
      const filteredSessions = userSessions.filter((session) => {
        if (session.category === "One-on-One") {
          return (
            session.userId === user.id ||
            session.invitedUsers?.includes(user.id) ||
            session.attendees?.includes(user.id)
          );
        }
        return true;
      });

      // Separate upcoming and past sessions
      const now = new Date();
      const upcoming: Event[] = [];
      const past: Event[] = [];

      filteredSessions.forEach((session) => {
        const sessionDate = new Date(session.date);
        if (session.status === "completed" || sessionDate < now) {
          past.push(session);
        } else {
          upcoming.push(session);
        }
      });

      // Sort by date
      upcoming.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      past.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setUpcomingSessions(upcoming);
      setPastSessions(past);
    } catch (error) {
      console.error("Error loading sessions:", error);
      setUpcomingSessions([]);
      setPastSessions([]);
    }
  }, [user?.id]);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAssignedCoach(),
        loadHeadCoach(),
        loadSessions(),
        loadMyCoachees(),
      ]);
    } catch (error) {
      console.error("Error loading coaching data:", error);
    } finally {
      setLoading(false);
    }
  }, [loadAssignedCoach, loadHeadCoach, loadSessions, loadMyCoachees]);

  // Initial data load
  useEffect(() => {
    if (user?.id) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.id, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // Initialize selected coach based on user role
  useEffect(() => {
    if (canSeeMyCoach) {
      setSelectedCoach("my-coach");
    } else if (canSeeMyCoachees) {
      setSelectedCoach("my-coachees");
    } else {
      setSelectedCoach("head-coach");
    }
  }, [canSeeMyCoach, canSeeMyCoachees]);

  const handleScheduleSession = (coach: User) => {
    const person = {
      id: coach.id,
      name: `${coach.firstName} ${coach.lastName}`,
      email: coach.email,
      type: "person" as const,
      avatar: coach.profileImage,
      role: coach.role,
    };

    setPreselectedCoach([person]);
    setCreateModalVisible(true);
  };

  const handleCreateSession = async (sessionData: any) => {
    if (!user) {
      Alert.alert("Error", "Please log in to create sessions");
      return;
    }

    try {
      const createData: CreateEventData = {
        title: sessionData.title,
        description: sessionData.description,
        date: sessionData.date,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        allDay: sessionData.allDay,
        location: sessionData.location,
        category: sessionData.category || "One-on-One",
        color: sessionData.color,
        repeat: sessionData.repeat,
        status: "upcoming",
        isPublic: false,
        invitedUsers: sessionData.attendeeIds || [],
      };

      const { event, error } = await EventsService.createEvent(
        createData,
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.profileImage,
        "sessions"
      );

      if (error) {
        Alert.alert("Error", "Failed to create session");
      } else if (event) {
        Alert.alert("Success", "Session created successfully");
        setCreateModalVisible(false);
        setPreselectedCoach([]);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error creating session:", error);
      Alert.alert("Error", "Failed to create session");
    }
  };

  const handleSessionPress = (session: Event) => {
    setSelectedEvent(session);
    setShowEventDetail(true);
  };

  const handleEditSession = (session: Event | ContentItem) => {
    setSelectedEvent(session as Event);
    setShowEventDetail(false);
    setShowEditModal(true);
  };

  const handleUpdateSession = async (
    sessionId: string,
    updateData: Partial<CreateEventData | CreateContentData>
  ) => {
    try {
      const { error } = await EventsService.updateEvent(
        sessionId,
        updateData as Partial<CreateEventData>,
        "sessions"
      );

      if (error) {
        Alert.alert("Error", "Failed to update session");
      } else {
        Alert.alert("Success", "Session updated successfully");
        setShowEditModal(false);
        setSelectedEvent(null);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error updating session:", error);
      Alert.alert("Error", "Failed to update session");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await EventsService.deleteEvent(sessionId, "sessions");

      if (error) {
        Alert.alert("Error", "Failed to delete session");
      } else {
        Alert.alert("Success", "Session deleted successfully");
        setShowEventDetail(false);
        setSelectedEvent(null);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      Alert.alert("Error", "Failed to delete session");
    }
  };

  // Add these handlers in the CoachingScreen component
  const handleCancelSession = async (sessionId: string) => {
    try {
      const { error } = await EventsService.updateEvent(
        sessionId,
        { status: "cancelled" },
        "sessions"
      );

      if (error) {
        Alert.alert("Error", "Failed to cancel session");
      } else {
        Alert.alert("Success", "Session cancelled successfully");
        setShowEventDetail(false);
        setSelectedEvent(null);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error cancelling session:", error);
      Alert.alert("Error", "Failed to cancel session");
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      const { error } = await EventsService.updateEvent(
        sessionId,
        { status: "completed" },
        "sessions"
      );

      if (error) {
        Alert.alert("Error", "Failed to mark session as complete");
      } else {
        Alert.alert("Success", "Session marked as complete");
        setShowEventDetail(false);
        setSelectedEvent(null);
        await loadSessions();
      }
    } catch (error) {
      console.error("Error completing session:", error);
      Alert.alert("Error", "Failed to mark session as complete");
    }
  };

  const checkAndUpdatePastSessions = useCallback(async () => {
    const now = new Date();
    const sessionsToUpdate = upcomingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate < now && session.status === "upcoming";
    });

    for (const session of sessionsToUpdate) {
      try {
        await EventsService.updateEvent(
          session.id,
          { status: "completed" },
          "sessions"
        );
      } catch (error) {
        console.error("Error auto-completing session:", error);
      }
    }

    if (sessionsToUpdate.length > 0) {
      await loadSessions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingSessions]);

  useEffect(() => {
    if (upcomingSessions.length > 0) {
      checkAndUpdatePastSessions();
    }
  }, [upcomingSessions, checkAndUpdatePastSessions]);


  const handleRSVP = async (
    sessionId: string,
    response: "yes" | "no" | "maybe"
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await EventsService.rsvpToEvent(
        sessionId,
        user.id,
        response,
        "sessions"
      );

      if (error) {
        Alert.alert("Error", "Failed to update RSVP");
      } else {
        await loadSessions();
      }
    } catch (error) {
      console.error("Error handling RSVP:", error);
      Alert.alert("Error", "Failed to update RSVP");
    }
  };

  const handleMessage = (coachId: string) => {
    router.push(`/(routes)/chat?userId=${coachId}`);
  };

  const getUserRSVPStatus = (
    session: Event
  ): "yes" | "no" | "maybe" | "none" => {
    if (!user?.id) return "none";
    if (session.rsvpYes?.includes(user.id)) return "yes";
    if (session.rsvpNo?.includes(user.id)) return "no";
    if (session.rsvpMaybe?.includes(user.id)) return "maybe";
    return "none";
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return theme.colors.success;
      case "cancelled":
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const renderSessionCard = (session: Event) => {
    const StatusIcon = getStatusIcon(session.status);
    const statusColor = getStatusColor(session.status);

    return (
      <TouchableOpacity
        key={session.id}
        style={styles.sessionCard}
        onPress={() => handleSessionPress(session)}
      >
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <View
            style={[
              styles.sessionStatus,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <StatusIcon color={statusColor} size={12} />
            <Text style={[styles.sessionStatusText, { color: statusColor }]}>
              {session.status || "upcoming"}
            </Text>
          </View>
        </View>
        <Text style={styles.sessionDetails}>
          {new Date(session.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          • {session.startTime} - {session.endTime}
        </Text>
        {session.location && (
          <Text style={styles.sessionDetails}>📍 {session.location}</Text>
        )}
        <Text style={styles.sessionDetails}>
          {session.category} • {session.attendeeCount || 0} participant
          {(session.attendeeCount || 0) !== 1 ? "s" : ""}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCoachCard = (coach: User, isHeadCoach: boolean = false) => {
    return (
      <View style={styles.coachCard}>
        <View style={styles.coachHeader}>
          <View style={{ position: "relative" }}>
            <Avatar
              imageUrl={coach.profileImage}
              initials={`${coach.firstName?.charAt(0)}${coach.lastName?.charAt(0)}`}
              size={60}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>
              {coach.firstName} {coach.lastName}
            </Text>
            <Text style={styles.coachTitle}>
              {isHeadCoach ? "Head of Student Coaching" : "Peer Coach"}
            </Text>
            {coach.department && (
              <Text style={styles.coachDepartment}>{coach.department}</Text>
            )}
            <View
              style={
                isHeadCoach ? styles.availabilityBadge : styles.assignedBadge
              }
            >
              <Text
                style={
                  isHeadCoach
                    ? styles.availabilityText
                    : styles.assignedBadgeText
                }
              >
                {isHeadCoach ? "Available for consultation" : "Assigned Coach"}
              </Text>
            </View>
          </View>
        </View>

        {coach.bio && <Text style={styles.coachBio}>{coach.bio}</Text>}

        <View style={styles.coachDetails}>
          {coach.major && (
            <View style={styles.detailItem}>
              <GraduationCap color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>{coach.major}</Text>
            </View>
          )}
          {coach.yearGroup && (
            <View style={styles.detailItem}>
              <Users color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>Class of {coach.yearGroup}</Text>
            </View>
          )}
          {coach.country && (
            <View style={styles.detailItem}>
              <MapPin color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>{coach.country}</Text>
            </View>
          )}
        </View>

        {isHeadCoach && (
          <View style={styles.coachStats}>
            <View style={styles.statItem}>
              <Star color="#f59e0b" size={16} fill="#f59e0b" />
              <Text style={styles.statText}>5.0</Text>
            </View>
            <View style={styles.statItem}>
              <Users color={theme.colors.textSecondary} size={16} />
              <Text style={styles.statText}>500+ coached</Text>
            </View>
            <View style={styles.statItem}>
              <Target color={theme.colors.textSecondary} size={16} />
              <Text style={styles.statText}>Free for students</Text>
            </View>
          </View>
        )}

        {!isHeadCoach && upcomingSessions.length > 0 && (
          <View style={styles.nextSessionInfo}>
            <Text style={styles.nextSessionText}>
              Next Session:{" "}
              {new Date(upcomingSessions[0].date).toLocaleDateString()} at{" "}
              {upcomingSessions[0].startTime}
            </Text>
          </View>
        )}

        <View style={styles.coachActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleScheduleSession(coach)}
          >
            <Calendar color="white" size={20} />
            <Text style={styles.actionButtonText}>
              {isHeadCoach ? "Book Session" : "Schedule"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleMessage(coach.id)}
          >
            <MessageCircle color={theme.colors.text} size={20} />
            <Text
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Message
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCoacheeCard = (coachee: User) => {
    return (
      <View key={coachee.id} style={styles.coachCard}>
        <View style={styles.coachHeader}>
          <View style={{ position: "relative" }}>
            <Avatar
              imageUrl={coachee.profileImage}
              initials={`${coachee.firstName?.charAt(0)}${coachee.lastName?.charAt(0)}`}
              size={50}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>
              {coachee.firstName} {coachee.lastName}
            </Text>
            <Text style={styles.coachTitle}>
              {coachee.role === "freshman" ? "Freshman" : "Student"}
            </Text>
            {coachee.major && (
              <Text style={styles.coachDepartment}>{coachee.major}</Text>
            )}
            <View style={styles.assignedBadge}>
              <Text style={styles.assignedBadgeText}>Your Coachee</Text>
            </View>
          </View>
        </View>

        {coachee.bio && <Text style={styles.coachBio}>{coachee.bio}</Text>}

        <View style={styles.coachDetails}>
          {coachee.major && (
            <View style={styles.detailItem}>
              <GraduationCap color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>{coachee.major}</Text>
            </View>
          )}
          {coachee.yearGroup && (
            <View style={styles.detailItem}>
              <Users color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>
                Class of {coachee.yearGroup}
              </Text>
            </View>
          )}
          {coachee.country && (
            <View style={styles.detailItem}>
              <MapPin color={theme.colors.textSecondary} size={16} />
              <Text style={styles.detailText}>{coachee.country}</Text>
            </View>
          )}
        </View>

        <View style={styles.coachActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleScheduleSession(coachee)}
          >
            <Calendar color="white" size={20} />
            <Text style={styles.actionButtonText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => handleMessage(coachee.id)}
          >
            <MessageCircle color={theme.colors.text} size={20} />
            <Text
              style={[
                styles.actionButtonText,
                styles.actionButtonTextSecondary,
              ]}
            >
              Message
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    coachSelector: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    selectorButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    selectorButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    selectorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    selectorTextActive: {
      color: "white",
      fontWeight: "700",
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    coachCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    coachHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: "white",
    },
    coachInfo: {
      flex: 1,
    },
    coachName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    coachTitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    coachDepartment: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      fontWeight: "500",
    },
    assignedBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
    },
    assignedBadgeText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
    },
    availabilityBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
    },
    availabilityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    coachBio: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
      fontWeight: "500",
    },
    coachDetails: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    coachStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    statText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    nextSessionInfo: {
      backgroundColor: theme.colors.accent + "15",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    nextSessionText: {
      ...theme.typography.body,
      color: theme.colors.accent,
      fontWeight: "600",
      textAlign: "center",
    },
    coachActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    sessionCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    sessionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    sessionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    sessionStatus: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      gap: 4,
    },
    sessionStatusText: {
      ...theme.typography.captionSmall,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    sessionDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 2,
      fontWeight: "500",
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    goalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    goalTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    goalStatus: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    goalDueDate: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    noCoachState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
    },
    noCoachText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    contactSupportButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    contactSupportText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Coaching" showBack={true} />
        <Loader visible={true} message="Loading coaching data..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Coaching" showBack={true} />

      {/* Coach Selector */}
      <View style={styles.coachSelector}>
        {canSeeMyCoach && (
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedCoach === "my-coach" && styles.selectorButtonActive,
            ]}
            onPress={() => setSelectedCoach("my-coach")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedCoach === "my-coach" && styles.selectorTextActive,
              ]}
            >
              My Coach
            </Text>
          </TouchableOpacity>
        )}

        {canSeeMyCoachees && (
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedCoach === "my-coachees" && styles.selectorButtonActive,
            ]}
            onPress={() => setSelectedCoach("my-coachees")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedCoach === "my-coachees" && styles.selectorTextActive,
              ]}
            >
              My Coachees
            </Text>
          </TouchableOpacity>
        )}

        {canSeeHeadCoach && (
          <TouchableOpacity
            style={[
              styles.selectorButton,
              selectedCoach === "head-coach" && styles.selectorButtonActive,
            ]}
            onPress={() => setSelectedCoach("head-coach")}
          >
            <Text
              style={[
                styles.selectorText,
                selectedCoach === "head-coach" && styles.selectorTextActive,
              ]}
            >
              Head Coach
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {selectedCoach === "head-coach" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Head of Coaches</Text>
            {headCoach ? (
              renderCoachCard(headCoach, true)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Head coach information not available
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(renderSessionCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No upcoming sessions</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Past Sessions</Text>
            {pastSessions.length > 0 ? (
              pastSessions.slice(0, 5).map(renderSessionCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No past sessions</Text>
              </View>
            )}
          </View>
        ) : selectedCoach === "my-coachees" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Coachees</Text>

            {myCoachees.length > 0 ? (
              <>
                {myCoachees.map(renderCoacheeCard)}

                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map(renderSessionCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No upcoming sessions</Text>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Past Sessions</Text>
                {pastSessions.length > 0 ? (
                  pastSessions.slice(0, 5).map(renderSessionCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No past sessions</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  You don&apos;t have any assigned coachees yet.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Assigned Coach</Text>

            {assignedCoach ? (
              <>
                {renderCoachCard(assignedCoach, false)}

                <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map(renderSessionCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No upcoming sessions</Text>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Past Sessions</Text>
                {pastSessions.length > 0 ? (
                  pastSessions.slice(0, 5).map(renderSessionCard)
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No past sessions</Text>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Your Goals</Text>
                {coachingGoals.map((goal) => (
                  <View key={goal.id} style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalStatus}>{goal.status}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${goal.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.goalDueDate}>Due: {goal.dueDate}</Text>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.noCoachState}>
                <Text style={styles.noCoachText}>
                  You don&apos;t have an assigned coach yet. Please contact
                  support for assistance.
                </Text>
                <TouchableOpacity style={styles.contactSupportButton}>
                  <Text style={styles.contactSupportText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => {
          setCreateModalVisible(false);
          setPreselectedCoach([]);
        }}
        onSave={handleCreateSession}
        contentType="session"
        initialEvent={{
          category: "One-on-One",
          selectedPeople: preselectedCoach,
        }}
      />

      <EventDetailModal
        visible={showEventDetail}
        event={selectedEvent}
        onClose={() => {
          setShowEventDetail(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditSession}
        onDelete={handleDeleteSession}
        onRSVP={handleRSVP}
        onCancel={handleCancelSession} // Add this
        onComplete={handleCompleteSession} // Add this
        currentUserId={user?.id}
        userRSVPStatus={
          selectedEvent ? getUserRSVPStatus(selectedEvent) : "none"
        }
        contentType="session"
      />

      <EditEventModal
        visible={showEditModal}
        event={selectedEvent}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleUpdateSession}
        contentType="session"
      />
    </SafeAreaView>
  );
}
