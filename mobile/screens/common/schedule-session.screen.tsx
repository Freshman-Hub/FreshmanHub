"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar as CalendarIcon,
  MessageSquare,
  Send,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { WeeklyCalendar } from "@/components/ui/WeeklyCalendar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";

interface TimeSlot {
  date: string; // YYYY-MM-DD format
  hour: number; // 7-22
  available?: boolean;
  booked?: boolean;
  selected?: boolean;
}

// Mock available and booked slots with July 2025 dates - comprehensive 7 AM to 10 PM data
const mockAvailableSlots: TimeSlot[] = [
  // This week (July 6-12, 2025)
  // Monday July 7
  { date: "2025-07-07", hour: 7, available: true },
  { date: "2025-07-07", hour: 9, available: true },
  { date: "2025-07-07", hour: 10, available: true },
  { date: "2025-07-07", hour: 14, available: true },
  { date: "2025-07-07", hour: 15, available: true },
  { date: "2025-07-07", hour: 17, available: true },
  { date: "2025-07-07", hour: 19, available: true },
  { date: "2025-07-07", hour: 21, available: true },

  // Tuesday July 8
  { date: "2025-07-08", hour: 8, available: true },
  { date: "2025-07-08", hour: 11, available: true },
  { date: "2025-07-08", hour: 13, available: true },
  { date: "2025-07-08", hour: 15, available: true },
  { date: "2025-07-08", hour: 16, available: true },
  { date: "2025-07-08", hour: 18, available: true },
  { date: "2025-07-08", hour: 20, available: true },
  { date: "2025-07-08", hour: 22, available: true },

  // Wednesday July 9
  { date: "2025-07-09", hour: 7, available: true },
  { date: "2025-07-09", hour: 9, available: true },
  { date: "2025-07-09", hour: 12, available: true },
  { date: "2025-07-09", hour: 14, available: true },
  { date: "2025-07-09", hour: 16, available: true },
  { date: "2025-07-09", hour: 17, available: true },
  { date: "2025-07-09", hour: 19, available: true },
  { date: "2025-07-09", hour: 21, available: true },

  // Thursday July 10
  { date: "2025-07-10", hour: 8, available: true },
  { date: "2025-07-10", hour: 10, available: true },
  { date: "2025-07-10", hour: 13, available: true },
  { date: "2025-07-10", hour: 14, available: true },
  { date: "2025-07-10", hour: 15, available: true },
  { date: "2025-07-10", hour: 18, available: true },
  { date: "2025-07-10", hour: 20, available: true },
  { date: "2025-07-10", hour: 22, available: true },

  // Friday July 11
  { date: "2025-07-11", hour: 9, available: true },
  { date: "2025-07-11", hour: 11, available: true },
  { date: "2025-07-11", hour: 13, available: true },
  { date: "2025-07-11", hour: 15, available: true },
  { date: "2025-07-11", hour: 17, available: true },
  { date: "2025-07-11", hour: 19, available: true },
  { date: "2025-07-11", hour: 21, available: true },

  // Saturday July 12
  { date: "2025-07-12", hour: 10, available: true },
  { date: "2025-07-12", hour: 12, available: true },
  { date: "2025-07-12", hour: 14, available: true },
  { date: "2025-07-12", hour: 16, available: true },
  { date: "2025-07-12", hour: 18, available: true },

  // Next week (July 13-19, 2025)
  // Monday July 14
  { date: "2025-07-14", hour: 9, available: true },
  { date: "2025-07-14", hour: 11, available: true },
  { date: "2025-07-14", hour: 14, available: true },
  { date: "2025-07-14", hour: 16, available: true },
  { date: "2025-07-14", hour: 18, available: true },
  { date: "2025-07-14", hour: 20, available: true },

  // Tuesday July 15
  { date: "2025-07-15", hour: 8, available: true },
  { date: "2025-07-15", hour: 10, available: true },
  { date: "2025-07-15", hour: 13, available: true },
  { date: "2025-07-15", hour: 15, available: true },
  { date: "2025-07-15", hour: 17, available: true },
  { date: "2025-07-15", hour: 19, available: true },
  { date: "2025-07-15", hour: 21, available: true },

  // Future dates for testing navigation
  // August 2025
  { date: "2025-08-05", hour: 10, available: true },
  { date: "2025-08-05", hour: 14, available: true },
  { date: "2025-08-05", hour: 18, available: true },

  // September 2025
  { date: "2025-09-15", hour: 9, available: true },
  { date: "2025-09-15", hour: 13, available: true },
  { date: "2025-09-15", hour: 17, available: true },

  // Far future for testing (2027)
  { date: "2027-03-15", hour: 10, available: true },
  { date: "2027-03-15", hour: 14, available: true },
  { date: "2027-03-15", hour: 16, available: true },
  { date: "2027-03-16", hour: 11, available: true },
  { date: "2027-03-16", hour: 15, available: true },
];

const mockBookedSlots: TimeSlot[] = [
  // This week booked slots
  // Monday July 7
  { date: "2025-07-07", hour: 8, booked: true },
  { date: "2025-07-07", hour: 11, booked: true },
  { date: "2025-07-07", hour: 13, booked: true },
  { date: "2025-07-07", hour: 16, booked: true },
  { date: "2025-07-07", hour: 18, booked: true },
  { date: "2025-07-07", hour: 20, booked: true },

  // Tuesday July 8
  { date: "2025-07-08", hour: 9, booked: true },
  { date: "2025-07-08", hour: 12, booked: true },
  { date: "2025-07-08", hour: 14, booked: true },
  { date: "2025-07-08", hour: 17, booked: true },
  { date: "2025-07-08", hour: 19, booked: true },
  { date: "2025-07-08", hour: 21, booked: true },

  // Wednesday July 9
  { date: "2025-07-09", hour: 8, booked: true },
  { date: "2025-07-09", hour: 10, booked: true },
  { date: "2025-07-09", hour: 13, booked: true },
  { date: "2025-07-09", hour: 15, booked: true },
  { date: "2025-07-09", hour: 18, booked: true },
  { date: "2025-07-09", hour: 20, booked: true },

  // Thursday July 10
  { date: "2025-07-10", hour: 9, booked: true },
  { date: "2025-07-10", hour: 11, booked: true },
  { date: "2025-07-10", hour: 12, booked: true },
  { date: "2025-07-10", hour: 16, booked: true },
  { date: "2025-07-10", hour: 17, booked: true },
  { date: "2025-07-10", hour: 19, booked: true },
  { date: "2025-07-10", hour: 21, booked: true },

  // Friday July 11
  { date: "2025-07-11", hour: 8, booked: true },
  { date: "2025-07-11", hour: 10, booked: true },
  { date: "2025-07-11", hour: 12, booked: true },
  { date: "2025-07-11", hour: 14, booked: true },
  { date: "2025-07-11", hour: 16, booked: true },
  { date: "2025-07-11", hour: 18, booked: true },
  { date: "2025-07-11", hour: 20, booked: true },

  // Next week booked slots
  { date: "2025-07-14", hour: 10, booked: true },
  { date: "2025-07-14", hour: 12, booked: true },
  { date: "2025-07-14", hour: 15, booked: true },
  { date: "2025-07-14", hour: 17, booked: true },
  { date: "2025-07-14", hour: 19, booked: true },

  // Future booked slots
  { date: "2025-08-05", hour: 12, booked: true },
  { date: "2025-08-05", hour: 16, booked: true },
  { date: "2025-09-15", hour: 11, booked: true },
  { date: "2025-09-15", hour: 15, booked: true },
];

export default function ScheduleSessionScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock coach data
  const coach = {
    id: params.coachId || "1",
    name: params.coachName || "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: params.role || "Peer Coach",
    major: "Computer Science",
    year: "Junior",
  };

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [scheduling, setScheduling] = useState(false);

  const handleSlotPress = (date: string, hour: number) => {
    // Check if slot is available
    const isAvailable = mockAvailableSlots.some(
      (slot) => slot.date === date && slot.hour === hour
    );
    const isBooked = mockBookedSlots.some(
      (slot) => slot.date === date && slot.hour === hour
    );

    if (!isAvailable || isBooked) return;

    // Toggle selection
    if (
      selectedSlot &&
      selectedSlot.date === date &&
      selectedSlot.hour === hour
    ) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ date, hour, selected: true });
    }
  };

  const handleScheduleSession = useCallback(async () => {
    if (!selectedSlot) {
      Alert.alert("No Time Selected", "Please select an available time slot.");
      return;
    }

    setScheduling(true);

    const formatHour = (hour: number) => {
      if (hour < 12) return `${hour}:00 AM`;
      if (hour === 12) return "12:00 PM";
      return `${hour - 12}:00 PM`;
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Simulate API call
    setTimeout(() => {
      setScheduling(false);
      Alert.alert(
        "Session Scheduled! 🎉",
        `Your session with ${coach.name} has been scheduled for ${formatDate(selectedSlot.date)} at ${formatHour(selectedSlot.hour)}.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  }, [selectedSlot, coach.name, router]);

  const getSelectedSlotText = () => {
    if (!selectedSlot) return "No time slot selected";

    const formatHour = (hour: number) => {
      if (hour < 12) return `${hour}:00 AM`;
      if (hour === 12) return "12:00 PM";
      return `${hour - 12}:00 PM`;
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    };

    return `${formatDate(selectedSlot.date)} at ${formatHour(selectedSlot.hour)}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    coachCard: {
      marginBottom: theme.spacing.lg,
    },
    coachInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    coachDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    coachName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    coachRole: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: 2,
    },
    coachMajor: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    instructionCard: {
      backgroundColor: theme.colors.success + "10",
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.success + "30",
    },
    instructionTitle: {
      ...theme.typography.h6,
      color: theme.colors.success,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    instructionText: {
      ...theme.typography.body,
      color: theme.colors.success,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 22,
    },
    selectionCard: {
      backgroundColor: selectedSlot
        ? theme.colors.primary + "10"
        : theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: selectedSlot
        ? theme.colors.primary + "30"
        : theme.colors.border,
      alignItems: "center",
    },
    selectionTitle: {
      ...theme.typography.body,
      color: selectedSlot ? theme.colors.primary : theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    selectionText: {
      ...theme.typography.h6,
      color: selectedSlot ? theme.colors.primary : theme.colors.textSecondary,
      fontWeight: "700",
      textAlign: "center",
    },
    calendarSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    sectionIcon: {
      marginRight: theme.spacing.sm,
    },
    notesSection: {
      marginBottom: theme.spacing.lg,
    },
    inputLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      minHeight: 100,
      textAlignVertical: "top",
    },
    scheduleButton: {
      marginTop: theme.spacing.md,
    },
  });

  const selectedSlots = selectedSlot ? [selectedSlot] : [];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header title="Schedule Session" showBack={true} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Coach Info Card */}
        <Card
          style={styles.coachCard}
          content={
            <View style={styles.coachInfo}>
              <Avatar
                imageUrl={coach.avatar}
                initials={coach.name.charAt(0)}
                size={50}
              />
              <View style={styles.coachDetails}>
                <Text style={styles.coachName}>{coach.name}</Text>
                <Text style={styles.coachRole}>
                  {coach.role} • {coach.year}
                </Text>
                <Text style={styles.coachMajor}>{coach.major}</Text>
              </View>
            </View>
          }
        />

        {/* Instructions */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to Schedule</Text>
          <Text style={styles.instructionText}>
            Green slots are available for booking. Yellow slots are already
            booked. Use the calendar icon to jump to any date (even 2027!). Tap
            a green slot to select it.
          </Text>
        </View>

        {/* Selection Summary */}
        <View style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>Selected Time</Text>
          <Text style={styles.selectionText}>{getSelectedSlotText()}</Text>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarSection}>
          <View style={styles.sectionTitle}>
            <CalendarIcon
              color={theme.colors.primary}
              size={20}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              Available Times (7 AM - 10 PM)
            </Text>
          </View>
          <WeeklyCalendar
            selectedSlots={selectedSlots}
            onSlotPress={handleSlotPress}
            mode="booking"
            availableSlots={mockAvailableSlots}
            bookedSlots={mockBookedSlots}
          />
        </View>

        {/* Session Notes */}
        <View style={styles.notesSection}>
          <View style={styles.sectionTitle}>
            <MessageSquare
              color={theme.colors.primary}
              size={20}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Session Notes (Optional)</Text>
          </View>
          <Text style={styles.inputLabel}>What would you like to discuss?</Text>
          <TextInput
            style={styles.textInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g., Need help with calculus homework, preparing for midterm exam..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Schedule Button */}
        <Button
          title="Schedule Session"
          onPress={handleScheduleSession}
          icon={Send}
          loading={scheduling}
          disabled={!selectedSlot}
          style={styles.scheduleButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
