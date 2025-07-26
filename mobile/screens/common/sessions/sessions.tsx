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
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { FilterChip } from "@/components/ui/FilterChip";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

interface SessionItem {
  id: string | number;
  title: string;
  student: {
    name: string;
    avatar?: string;
    year?: string;
  };
  coach: {
    name: string;
    avatar?: string;
  };
  date: string;
  time: string;
  duration: number;
  type:
    | "Academic Support"
    | "Career Guidance"
    | "Personal Development"
    | "Wellness Check";
  format: "In-Person" | "Video Call" | "Phone Call";
  location?: string;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  notes?: string;
}

interface SessionsProps {
  userRole?:
    | "head-coach"
    | "peer-coach"
    | "advisor"
    | "student-leader"
    | "student";
  userId?: string;
}

// Generate sessions based on user role
const getSessionsForRole = (role: string): SessionItem[] => {
  const baseSessions = {
    "head-coach": [
      {
        id: 1,
        title: "Academic Support Session",
        student: {
          name: "Sarah Mensah",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          year: "Freshman",
        },
        coach: {
          name: "Michael Osei",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
        },
        date: "Today",
        time: "10:00 AM",
        duration: 60,
        type: "Academic Support" as const,
        format: "In-Person" as const,
        location: "Student Success Center",
        status: "scheduled" as const,
      },
      {
        id: 2,
        title: "Career Guidance Session",
        student: {
          name: "Kwame Nkrumah",
          avatar:
            "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
          year: "Sophomore",
        },
        coach: {
          name: "Ama Asante",
          avatar:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
        },
        date: "Today",
        time: "2:00 PM",
        duration: 45,
        type: "Career Guidance" as const,
        format: "Video Call" as const,
        status: "scheduled" as const,
      },
      {
        id: 3,
        title: "Personal Development",
        student: { name: "Akosua Frimpong", year: "Junior" },
        coach: { name: "John Mensah" },
        date: "Yesterday",
        time: "4:30 PM",
        duration: 60,
        type: "Personal Development" as const,
        format: "In-Person" as const,
        location: "Library Conference Room",
        status: "completed" as const,
        notes: "Great progress on time management skills",
      },
      {
        id: 4,
        title: "Wellness Check",
        student: { name: "Kofi Asante", year: "Freshman" },
        coach: { name: "Grace Owusu" },
        date: "Yesterday",
        time: "11:00 AM",
        duration: 30,
        type: "Wellness Check" as const,
        format: "Phone Call" as const,
        status: "missed" as const,
      },
    ],
    "peer-coach": [
      {
        id: 1,
        title: "My Session with Sarah",
        student: {
          name: "Sarah Mensah",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          year: "Freshman",
        },
        coach: { name: "You" },
        date: "Today",
        time: "10:00 AM",
        duration: 60,
        type: "Academic Support" as const,
        format: "In-Person" as const,
        location: "Student Success Center",
        status: "scheduled" as const,
      },
      {
        id: 2,
        title: "Career Discussion",
        student: { name: "Kwame Nkrumah", year: "Sophomore" },
        coach: { name: "You" },
        date: "Tomorrow",
        time: "3:00 PM",
        duration: 45,
        type: "Career Guidance" as const,
        format: "Video Call" as const,
        status: "scheduled" as const,
      },
    ],
    student: [
      {
        id: 1,
        title: "Academic Support",
        student: { name: "You" },
        coach: {
          name: "Michael Osei",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
        },
        date: "Tomorrow",
        time: "2:00 PM",
        duration: 60,
        type: "Academic Support" as const,
        format: "In-Person" as const,
        location: "Student Success Center",
        status: "scheduled" as const,
      },
    ],
  };
  return (
    baseSessions[role as keyof typeof baseSessions] || baseSessions["student"]
  );
};

const statusFilters = ["All", "Scheduled", "Completed", "Cancelled", "Missed"];
const typeFilters = [
  "All",
  "Academic Support",
  "Career Guidance",
  "Personal Development",
  "Wellness Check",
];
const formatFilters = ["All", "In-Person", "Video Call", "Phone Call"];

export default function SessionsScreen({
  userRole = "head-coach",
  userId,
}: SessionsProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [selectedFormatFilter, setSelectedFormatFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const allSessions = getSessionsForRole(userRole);

  const filteredSessions = allSessions.filter((session) => {
    const matchesStatus =
      selectedStatusFilter === "All" ||
      session.status === selectedStatusFilter.toLowerCase();
    const matchesType =
      selectedTypeFilter === "All" || session.type === selectedTypeFilter;
    const matchesFormat =
      selectedFormatFilter === "All" || session.format === selectedFormatFilter;
    return matchesStatus && matchesType && matchesFormat;
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
    createButton: {
      marginBottom: theme.spacing.lg,
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
    sessionItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
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
    sessionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    sessionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
    },
    statusText: {
      ...theme.typography.captionSmall,
      fontWeight: "700",
    },
    sessionContent: {
      gap: theme.spacing.sm,
    },
    participantRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    participantInfo: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    participantName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    participantRole: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sessionDetail: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    sessionDetailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "500",
    },
    sessionNotes: {
      backgroundColor: theme.colors.primary + "10",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.sm,
    },
    sessionNotesText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontStyle: "italic",
    },
    sessionActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return { bg: "#3b82f6" + "20", text: "#3b82f6" };
      case "completed":
        return { bg: "#059669" + "20", text: "#059669" };
      case "cancelled":
        return { bg: "#64748b" + "20", text: "#64748b" };
      case "missed":
        return { bg: "#dc2626" + "20", text: "#dc2626" };
      default:
        return { bg: theme.colors.border, text: theme.colors.textSecondary };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return AlertCircle;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      case "missed":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Video Call":
        return Video;
      case "Phone Call":
        return Phone;
      case "In-Person":
        return MapPin;
      default:
        return MapPin;
    }
  };

  const renderSession: ListRenderItem<SessionItem> = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const StatusIcon = getStatusIcon(item.status);
    const FormatIcon = getFormatIcon(item.format);

    return (
      <TouchableOpacity style={styles.sessionItem} activeOpacity={0.8}>
        <View style={styles.sessionHeader}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.sessionContent}>
          {/* Student */}
          <View style={styles.participantRow}>
            <Avatar
              imageUrl={item.student.avatar}
              initials={item.student.name.charAt(0)}
              size={40}
            />
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>{item.student.name}</Text>
              <Text style={styles.participantRole}>
                {item.student.year || "Student"}
              </Text>
            </View>
          </View>

          {/* Coach (if not the current user) */}
          {item.coach.name !== "You" && (
            <View style={styles.participantRow}>
              <Avatar
                imageUrl={item.coach.avatar}
                initials={item.coach.name.charAt(0)}
                size={40}
              />
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>{item.coach.name}</Text>
                <Text style={styles.participantRole}>Coach</Text>
              </View>
            </View>
          )}

          {/* Session Details */}
          <View style={styles.sessionDetail}>
            <Calendar color={theme.colors.primary} size={20} />
            <Text style={styles.sessionDetailText}>
              {item.date} at {item.time} ({item.duration} min)
            </Text>
          </View>

          <View style={styles.sessionDetail}>
            <FormatIcon color={theme.colors.textSecondary} size={20} />
            <Text style={styles.sessionDetailText}>
              {item.format} {item.location && `• ${item.location}`}
            </Text>
          </View>

          {/* Notes */}
          {item.notes && (
            <View style={styles.sessionNotes}>
              <Text style={styles.sessionNotesText}>"{item.notes}"</Text>
            </View>
          )}

          {/* Actions */}
          {item.status === "scheduled" && (
            <View style={styles.sessionActions}>
              <Button
                title="Join"
                onPress={() => {router.push(`(routes)/join-session/${item.id}`)}}
                mode="contained"
                style={{ flex: 1 }}
              />
              <Button
                title="Reschedule"
                onPress={() => {router.push(`(routes)/reschedule-session/${item.id}`);}}
                mode="outlined"
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Sessions"
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
          {/* Create Session Button */}
          {(userRole === "head-coach" ||
            userRole === "peer-coach" ||
            userRole === "advisor") && (
            <Button
              title="Schedule New Session"
              onPress={() => router.push("(routes)/schedule-session")}
              icon={Plus}
              mode="contained"
              style={styles.createButton}
            />
          )}

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
                <Text style={styles.filterLabel}>Status</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {statusFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedStatusFilter === filter}
                      onPress={() => setSelectedStatusFilter(filter)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Session Type</Text>
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
                <Text style={styles.filterLabel}>Format</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {formatFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedFormatFilter === filter}
                      onPress={() => setSelectedFormatFilter(filter)}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Sessions List */}
          {filteredSessions.length > 0 ? (
            <FlatList
              data={filteredSessions}
              renderItem={renderSession}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Calendar color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>
                No sessions found matching your filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
