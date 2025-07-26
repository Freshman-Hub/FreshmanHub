"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Save,
  AlertCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Avatar } from "@/components/ui/Avatar";
import { FilterChip } from "@/components/ui/FilterChip";
import { CalendarPicker } from "@/components/ui/CalendarPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { LocationInput } from "@/components/ui/LocationInput";

interface RescheduleSessionProps {
  userRole?:
    | "head-coach"
    | "peer-coach"
    | "advisor"
    | "student-leader"
    | "student";
}

// Mock session data
const getSessionData = (id: string) => ({
  id: parseInt(id),
  title: "Academic Support Session",
  student: {
    name: "Emily Chen",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    year: "Freshman",
  },
  coach: {
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  originalDate: "2024-01-15",
  originalTime: "2:00 PM",
  duration: "60 min",
  type: "Academic Support",
  format: "In-Person",
  location: "Student Success Center",
  notes: "Focus on time management and study strategies",
});

const durations = ["30 min", "45 min", "60 min", "90 min"];
const sessionFormats = ["In-Person", "Video Call", "Phone Call"];

// Location options for the LocationInput
const locationOptions = [
  { label: "Student Success Center", value: "Student Success Center" },
  { label: "Library Study Room A", value: "Library Study Room A" },
  { label: "Library Study Room B", value: "Library Study Room B" },
  { label: "Library Study Room C", value: "Library Study Room C" },
  { label: "Academic Advising Office", value: "Academic Advising Office" },
  { label: "Career Services Center", value: "Career Services Center" },
  { label: "Counseling Center", value: "Counseling Center" },
  { label: "Tutoring Center", value: "Tutoring Center" },
  { label: "Student Union Lounge", value: "Student Union Lounge" },
  { label: "Coffee Shop Meeting Area", value: "Coffee Shop Meeting Area" },
  { label: "Outdoor Pavilion", value: "Outdoor Pavilion" },
  { label: "Conference Room A", value: "Conference Room A" },
  { label: "Conference Room B", value: "Conference Room B" },
  { label: "Peer Mentor Office", value: "Peer Mentor Office" },
  { label: "Group Study Area", value: "Group Study Area" },
];

export default function RescheduleSessionScreen({
  userRole = "head-coach",
}: RescheduleSessionProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const session = getSessionData(id as string);

  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [duration, setDuration] = useState(session.duration);
  const [sessionFormat, setSessionFormat] = useState(session.format);
  const [location, setLocation] = useState(session.location);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [notifyParticipants, setNotifyParticipants] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      alert("Please select a new date and time");
      return;
    }

    if (!rescheduleReason.trim()) {
      alert("Please provide a reason for rescheduling");
      return;
    }

    if (sessionFormat === "In-Person" && !location.trim()) {
      alert("Please select a location for in-person sessions");
      return;
    }

    const rescheduleData = {
      sessionId: session.id,
      originalDate: session.originalDate,
      originalTime: session.originalTime,
      newDate,
      newTime,
      duration,
      format: sessionFormat,
      location: sessionFormat === "In-Person" ? location : "",
      reason: rescheduleReason,
      notifyParticipants,
    };

    console.log("Rescheduling session:", rescheduleData);

    alert("Session rescheduled successfully!");
    router.back();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
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
    currentSessionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
    sessionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    sessionParticipant: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sessionDetails: {
      gap: theme.spacing.sm,
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
    warningCard: {
      backgroundColor: theme.colors.warning + "15",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.warning + "30",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    warningText: {
      ...theme.typography.body,
      color: theme.colors.warning,
      fontWeight: "600",
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    formGroup: {
      marginBottom: theme.spacing.lg,
    },
    formLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    required: {
      color: theme.colors.error,
    },
    dateTimeRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    dateTimeInput: {
      flex: 1,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      marginRight: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    checkedBox: {
      backgroundColor: theme.colors.primary,
    },
    checkboxText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      flex: 1,
    },
    rescheduleButton: {
      marginTop: theme.spacing.lg,
    },
  });

  const FormatIcon = getFormatIcon(session.format);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Reschedule Session"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Current Session Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          <View style={styles.currentSessionCard}>
            <View style={styles.sessionHeader}>
              <Avatar
                imageUrl={session.student.avatar}
                initials={session.student.name.charAt(0)}
                size={45}
              />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionParticipant}>
                  {session.student.name} & {session.coach.name}
                </Text>
              </View>
            </View>
            <View style={styles.sessionDetails}>
              <View style={styles.sessionDetail}>
                <Calendar color={theme.colors.primary} size={20} />
                <Text style={styles.sessionDetailText}>
                  {session.originalDate} at {session.originalTime} (
                  {session.duration})
                </Text>
              </View>
              <View style={styles.sessionDetail}>
                <FormatIcon color={theme.colors.textSecondary} size={20} />
                <Text style={styles.sessionDetailText}>
                  {session.format} {session.location && `• ${session.location}`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.section}>
          <View style={styles.warningCard}>
            <AlertCircle color={theme.colors.warning} size={24} />
            <Text style={styles.warningText}>
              Rescheduling will notify all participants and update their
              calendars. Please provide a reason for the change.
            </Text>
          </View>
        </View>

        {/* New Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Schedule</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              New Date & Time <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.dateTimeRow}>
              <CalendarPicker
                value={newDate}
                onSelect={setNewDate}
                placeholder="Select new date"
                style={styles.dateTimeInput}
              />
              <TimePicker
                value={newTime}
                onSelect={setNewTime}
                placeholder="Select new time"
                style={styles.dateTimeInput}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Duration</Text>
            <View style={styles.chipContainer}>
              {durations.map((dur) => (
                <FilterChip
                  key={dur}
                  label={dur}
                  selected={duration === dur}
                  onPress={() => setDuration(dur)}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Format</Text>
            <View style={styles.chipContainer}>
              {sessionFormats.map((format) => (
                <FilterChip
                  key={format}
                  label={format}
                  selected={sessionFormat === format}
                  onPress={() => setSessionFormat(format)}
                />
              ))}
            </View>
          </View>

          {sessionFormat === "In-Person" && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <LocationInput
                value={location}
                onSelect={setLocation}
                placeholder="Select meeting location"
                options={locationOptions}
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Reason for Rescheduling <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder="Please explain why you need to reschedule"
              value={rescheduleReason}
              onChangeText={setRescheduleReason}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setNotifyParticipants(!notifyParticipants)}
            >
              <View
                style={[
                  styles.checkbox,
                  notifyParticipants && styles.checkedBox,
                ]}
              >
                {notifyParticipants && (
                  <Text style={{ color: "white", fontSize: 12 }}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxText}>
                Send notification to all participants about the schedule change
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reschedule Button */}
        <View style={styles.section}>
          <Button
            title="Reschedule Session"
            onPress={handleReschedule}
            icon={Save}
            mode="contained"
            style={styles.rescheduleButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
