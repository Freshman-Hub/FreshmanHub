"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar as CalendarIcon,
  Clock,
  MessageSquare,
  Phone,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { WeeklyCalendar } from "@/components/ui/WeeklyCalendar";

interface TimeSlot {
  date: string;
  hour: number;
  available?: boolean;
  booked?: boolean;
  selected?: boolean;
}

// Mock sessions data with July 2025 dates
const mockSessions = [
  {
    id: "1",
    studentName: "Michael Chen",
    studentAvatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-07", // Monday
    hour: 10, // 10 AM
    duration: 60,
    type: "Academic Support",
    status: "upcoming",
    notes: "Need help with calculus homework",
    location: "Library Study Room 3",
  },
  {
    id: "2",
    studentName: "Emma Rodriguez",
    studentAvatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-08", // Tuesday
    hour: 14, // 2 PM
    duration: 45,
    type: "Career Guidance",
    status: "completed",
    notes: "Resume review and interview prep",
    location: "Virtual Meeting",
  },
  {
    id: "3",
    studentName: "James Park",
    studentAvatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-09", // Wednesday
    hour: 11, // 11 AM
    duration: 30,
    type: "Wellness Check",
    status: "cancelled",
    notes: "Student cancelled due to illness",
    location: "Student Center",
  },
  {
    id: "4",
    studentName: "Sofia Martinez",
    studentAvatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-10", // Thursday
    hour: 15, // 3 PM
    duration: 60,
    type: "Academic Support",
    status: "upcoming",
    notes: "Chemistry lab report assistance",
    location: "Science Building Room 201",
  },
  {
    id: "5",
    studentName: "Alex Kim",
    studentAvatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-11", // Friday
    hour: 9, // 9 AM
    duration: 45,
    type: "Study Skills",
    status: "upcoming",
    notes: "Time management strategies",
    location: "Academic Success Center",
  },
  {
    id: "6",
    studentName: "Lisa Wang",
    studentAvatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    date: "2025-07-14", // Next Monday
    hour: 13, // 1 PM
    duration: 60,
    type: "Academic Support",
    status: "upcoming",
    notes: "Physics problem solving",
    location: "Physics Lab",
  },
];

const filterOptions = ["All", "Upcoming", "Completed", "Cancelled"];

export default function ManageSessionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [sessions, setSessions] = useState(mockSessions);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const filteredSessions = sessions.filter((session) => {
    if (activeFilter === "All") return true;
    return session.status === activeFilter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return theme.colors.primary;
      case "completed":
        return theme.colors.success;
      case "cancelled":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock color={theme.colors.primary} size={16} />;
      case "completed":
        return <CheckCircle color={theme.colors.success} size={16} />;
      case "cancelled":
        return <XCircle color={theme.colors.error} size={16} />;
      default:
        return <AlertCircle color={theme.colors.textSecondary} size={16} />;
    }
  };

  const formatTime = (hour: number) => {
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const handleSessionAction = (action: string, session: any) => {
    switch (action) {
      case "edit":
        router.push(`/(routes)/common/edit-session/${session.id}`);
        break;
      case "cancel":
        Alert.alert(
          "Cancel Session",
          `Are you sure you want to cancel the session with ${session.studentName}?`,
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes, Cancel",
              style: "destructive",
              onPress: () => {
                const updatedSessions = sessions.map((s) =>
                  s.id === session.id ? { ...s, status: "cancelled" } : s
                );
                setSessions(updatedSessions);
                Alert.alert(
                  "Session Cancelled",
                  "The session has been cancelled successfully."
                );
              },
            },
          ]
        );
        break;
      case "complete":
        const updatedSessions = sessions.map((s) =>
          s.id === session.id ? { ...s, status: "completed" } : s
        );
        setSessions(updatedSessions);
        Alert.alert(
          "Session Completed",
          "The session has been marked as completed."
        );
        break;
      case "call":
        console.log("Calling", session.studentName);
        break;
      case "message":
        console.log("Messaging", session.studentName);
        break;
      default:
        console.log("Action:", action, "for session", session.id);
    }
  };

  // Convert sessions to time slots for calendar view
  const getSessionSlots = (): TimeSlot[] => {
    return filteredSessions.map((session) => ({
      date: session.date,
      hour: session.hour,
      booked: true,
    }));
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
    controlsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    viewToggle: {
      flexDirection: "row",
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
    },
    viewToggleButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    viewToggleButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    viewToggleText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    viewToggleTextActive: {
      color: "white",
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    sessionsContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    calendarContainer: {
      flex: 1,
      padding: theme.spacing.md,
    },
    sessionCard: {
      marginBottom: theme.spacing.md,
    },
    sessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    sessionInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    studentName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    sessionDateTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    sessionStatus: {
      flexDirection: "row",
      alignItems: "center",
    },
    sessionStatusText: {
      ...theme.typography.captionSmall,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
      textTransform: "capitalize",
    },
    sessionDetails: {
      marginBottom: theme.spacing.md,
    },
    sessionType: {
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    sessionTypeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    sessionNotes: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginBottom: theme.spacing.sm,
    },
    sessionLocation: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sessionActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    actionButton: {
      flex: 1,
      minWidth: 100,
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
    },
  });

  const renderSessionCard = ({ item: session }: { item: any }) => (
    <Card
      style={styles.sessionCard}
      content={
        <View>
          <View style={styles.sessionHeader}>
            <Avatar
              imageUrl={session.studentAvatar}
              initials={session.studentName.charAt(0)}
              size={45}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.studentName}>{session.studentName}</Text>
              <Text style={styles.sessionDateTime}>
                {getDayName(session.date)} at {formatTime(session.hour)} (
                {session.duration} min)
              </Text>
              <View style={styles.sessionStatus}>
                {getStatusIcon(session.status)}
                <Text
                  style={[
                    styles.sessionStatusText,
                    { color: getStatusColor(session.status) },
                  ]}
                >
                  {session.status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sessionDetails}>
            <View style={styles.sessionType}>
              <Text style={styles.sessionTypeText}>{session.type}</Text>
            </View>
            {session.notes && (
              <Text style={styles.sessionNotes}>"{session.notes}"</Text>
            )}
            <Text style={styles.sessionLocation}>📍 {session.location}</Text>
          </View>

          <View style={styles.sessionActions}>
            {session.status === "upcoming" && (
              <>
                <Button
                  title="Complete"
                  onPress={() => handleSessionAction("complete", session)}
                  icon={CheckCircle}
                  mode="contained"
                  style={styles.actionButton}
                />
                <Button
                  title="Edit"
                  onPress={() => handleSessionAction("edit", session)}
                  icon={Edit3}
                  mode="outlined"
                  style={styles.actionButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => handleSessionAction("cancel", session)}
                  icon={Trash2}
                  mode="text"
                  style={styles.actionButton}
                />
              </>
            )}
            {session.status === "completed" && (
              <>
                <Button
                  title="Call"
                  onPress={() => handleSessionAction("call", session)}
                  icon={Phone}
                  mode="outlined"
                  style={styles.actionButton}
                />
                <Button
                  title="Message"
                  onPress={() => handleSessionAction("message", session)}
                  icon={MessageSquare}
                  mode="outlined"
                  style={styles.actionButton}
                />
              </>
            )}
          </View>
        </View>
      }
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header title="Manage Sessions" showBack={true} />

      <View style={styles.content}>
        {/* Summary Stats */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{sessions.length}</Text>
            <Text style={styles.summaryLabel}>Total Sessions</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {sessions.filter((s) => s.status === "upcoming").length}
            </Text>
            <Text style={styles.summaryLabel}>Upcoming</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {sessions.filter((s) => s.status === "completed").length}
            </Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* View Toggle */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === "list" && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode("list")}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === "list" && styles.viewToggleTextActive,
                ]}
              >
                List View
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewToggleButton,
                viewMode === "calendar" && styles.viewToggleButtonActive,
              ]}
              onPress={() => setViewMode("calendar")}
            >
              <Text
                style={[
                  styles.viewToggleText,
                  viewMode === "calendar" && styles.viewToggleTextActive,
                ]}
              >
                Calendar View
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Chips */}
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

        {/* Content */}
        {viewMode === "list" ? (
          <View style={styles.sessionsContainer}>
            {filteredSessions.length > 0 ? (
              <FlatList
                data={filteredSessions.sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime() ||
                    a.hour - b.hour
                )}
                renderItem={renderSessionCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
              />
            ) : (
              <View style={styles.emptyState}>
                <CalendarIcon color={theme.colors.textSecondary} size={48} />
                <Text style={styles.emptyStateText}>
                  No sessions found for the selected filter.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.calendarContainer}>
            <WeeklyCalendar
              selectedSlots={[]}
              onSlotPress={() => {}}
              mode="booking"
              bookedSlots={getSessionSlots()}
              availableSlots={[]}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
