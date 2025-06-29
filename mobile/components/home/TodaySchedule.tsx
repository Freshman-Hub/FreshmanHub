"use client";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

const todayEvents = [
  {
    id: 1,
    time: "9:00 AM",
    title: "Freshman Assembly",
    location: "Main Auditorium",
    type: "orientation",
    attendees: 120,
    duration: "1h 30m",
  },
  {
    id: 2,
    time: "11:30 AM",
    title: "Campus Tour - Academic Block",
    location: "Meet at Library",
    type: "tour",
    attendees: 25,
    duration: "45m",
  },
  {
    id: 3,
    time: "2:00 PM",
    title: "Study Group - Mathematics",
    location: "Room 204",
    type: "academic",
    attendees: 8,
    duration: "2h",
  },
  {
    id: 4,
    time: "4:30 PM",
    title: "Cultural Exchange Mixer",
    location: "Student Center",
    type: "social",
    attendees: 45,
    duration: "1h 30m",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "orientation":
      return "#3b82f6";
    case "tour":
      return "#059669";
    case "academic":
      return "#dc2626";
    case "social":
      return "#7c3aed";
    default:
      return "#64748b";
  }
};

const getTypeBgColor = (type: string) => {
  switch (type) {
    case "orientation":
      return "#eff6ff";
    case "tour":
      return "#ecfdf5";
    case "academic":
      return "#fef2f2";
    case "social":
      return "#f3e8ff";
    default:
      return "#f8fafc";
  }
};

export function TodaySchedule() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    headerIcon: {
      marginRight: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    viewAllButton: {
      paddingVertical: theme.spacing.xs,
    },
    viewAllText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    eventCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      width: 320,
      marginRight: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    eventHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    typeBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    typeText: {
      ...theme.typography.buttonSmall,
      textTransform: "capitalize",
      fontWeight: "700",
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    timeText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    eventTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: "700",
      lineHeight: 28,
    },
    eventDetails: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "500",
    },
    joinButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    joinButtonText: {
      ...theme.typography.buttonSmall,
      color: "white",
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CalendarIcon
            color={theme.colors.primary}
            size={28}
            style={styles.headerIcon}
          />
          <View style={styles.headerText}>
            <Text style={styles.title}>Today&apos;s Schedule</Text>
            <Text style={styles.subtitle}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {todayEvents.map((event) => (
          <TouchableOpacity key={event.id} activeOpacity={0.9}>
            <View style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeBgColor(event.type) },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: getTypeColor(event.type) },
                    ]}
                  >
                    {event.type}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Clock color={theme.colors.primary} size={18} />
                  <Text style={styles.timeText}>{event.time}</Text>
                </View>
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <MapPin color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Users color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.detailText}>
                    {event.attendees} attending
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.detailText}>
                    {event.duration} duration
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Event</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
