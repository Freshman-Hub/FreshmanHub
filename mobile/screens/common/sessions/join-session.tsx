"use client";

import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Clock,
  User,
  MessageCircle,
  CheckCircle,
  FileText,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Avatar } from "@/components/ui/Avatar";

interface JoinSessionProps {
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
    phone: "+1 (555) 123-4567",
    email: "emily.chen@university.edu",
  },
  coach: {
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    phone: "+1 (555) 987-6543",
    email: "sarah.johnson@university.edu",
  },
  scheduledTime: "2024-01-15T14:00:00",
  duration: "60 min",
  type: "Academic Support",
  format: "In-Person",
  location: "Student Success Center, Room 101",
  agenda: [
    "Review current academic progress",
    "Discuss time management strategies",
    "Set goals for next semester",
    "Q&A session",
  ],
  notes: "Focus on time management and study strategies for upcoming finals",
  status: "scheduled", // scheduled, confirmed, completed
});

export default function JoinSessionScreen({
  userRole = "student",
}: JoinSessionProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [timeUntilSession, setTimeUntilSession] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<
    "pending" | "confirmed" | "declined"
  >("pending");

  const session = getSessionData(id as string);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Calculate time until session
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const sessionTime = new Date(session.scheduledTime);
      const timeDiff = sessionTime.getTime() - now.getTime();

      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          setTimeUntilSession(`${hours}h ${minutes}m`);
        } else {
          setTimeUntilSession(`${minutes}m`);
        }
      } else {
        setTimeUntilSession("Session time has passed");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session.scheduledTime]);

  const handleRSVP = (status: "confirmed" | "declined") => {
    setRsvpStatus(status);

    Alert.alert(
      "RSVP Updated",
      `You have ${status} your attendance for this session.`,
      [{ text: "OK", style: "default" }]
    );

    console.log(`RSVP status updated to: ${status}`);
  };

  const handleCompleteSession = () => {
    if (!sessionNotes.trim()) {
      Alert.alert(
        "Session Notes Required",
        "Please add some notes about the session before completing."
      );
      return;
    }

    Alert.alert("Complete Session", "Mark this session as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => {
          console.log("Session completed with notes:", sessionNotes);
          alert("Session completed successfully!");
          router.back();
        },
      },
    ]);
  };

  const handleContactParticipant = (type: "call" | "message") => {
    const participant =
      userRole === "student" ? session.coach : session.student;

    if (type === "call") {
      console.log(`Calling ${participant.name} at ${participant.phone}`);
      Alert.alert("Call", `Calling ${participant.name}...`);
    } else {
      console.log(`Messaging ${participant.name} at ${participant.email}`);
      Alert.alert("Message", `Opening message to ${participant.name}...`);
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
    sessionCard: {
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
    timerCard: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
      alignItems: "center",
    },
    timerText: {
      ...theme.typography.h5,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    timerSubtext: {
      ...theme.typography.body,
      color: theme.colors.primary,
      textAlign: "center",
    },
    rsvpCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    rsvpTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    rsvpButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    rsvpButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      borderWidth: 2,
    },
    confirmButton: {
      backgroundColor: theme.colors.success + "15",
      borderColor: theme.colors.success,
    },
    declineButton: {
      backgroundColor: theme.colors.error + "15",
      borderColor: theme.colors.error,
    },
    selectedRsvpButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    rsvpButtonText: {
      ...theme.typography.body,
      fontWeight: "600",
    },
    confirmButtonText: {
      color: theme.colors.success,
    },
    declineButtonText: {
      color: theme.colors.error,
    },
    selectedRsvpButtonText: {
      color: "white",
    },
    contactButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    agendaCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    agendaItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    agendaBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginTop: 8,
      marginRight: theme.spacing.md,
    },
    agendaText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
    },
    notesCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    existingNotes: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
    },
    completeButton: {
      marginTop: theme.spacing.lg,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      alignSelf: "flex-start",
      marginTop: theme.spacing.sm,
    },
    confirmedBadge: {
      backgroundColor: theme.colors.success + "15",
    },
    declinedBadge: {
      backgroundColor: theme.colors.error + "15",
    },
    pendingBadge: {
      backgroundColor: theme.colors.warning + "15",
    },
    statusBadgeText: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
    },
    confirmedBadgeText: {
      color: theme.colors.success,
    },
    declinedBadgeText: {
      color: theme.colors.error,
    },
    pendingBadgeText: {
      color: theme.colors.warning,
    },
  });

  const participant = userRole === "student" ? session.coach : session.student;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Session RSVP"
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
        {/* Session Info */}
        <View style={styles.section}>
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Avatar
                imageUrl={participant.avatar}
                initials={participant.name.charAt(0)}
                size={45}
              />
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionParticipant}>
                  with {participant.name}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    rsvpStatus === "confirmed" && styles.confirmedBadge,
                    rsvpStatus === "declined" && styles.declinedBadge,
                    rsvpStatus === "pending" && styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      rsvpStatus === "confirmed" && styles.confirmedBadgeText,
                      rsvpStatus === "declined" && styles.declinedBadgeText,
                      rsvpStatus === "pending" && styles.pendingBadgeText,
                    ]}
                  >
                    {rsvpStatus === "confirmed"
                      ? "Confirmed"
                      : rsvpStatus === "declined"
                        ? "Declined"
                        : "Pending Response"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.sessionDetails}>
              <View style={styles.sessionDetail}>
                <Calendar color={theme.colors.primary} size={20} />
                <Text style={styles.sessionDetailText}>
                  {new Date(session.scheduledTime).toLocaleDateString()} at{" "}
                  {new Date(session.scheduledTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  ({session.duration})
                </Text>
              </View>
              <View style={styles.sessionDetail}>
                <MapPin color={theme.colors.textSecondary} size={20} />
                <Text style={styles.sessionDetailText}>
                  {session.format} • {session.location}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timer */}
        <View style={styles.section}>
          <View style={styles.timerCard}>
            <Text style={styles.timerText}>{timeUntilSession}</Text>
            <Text style={styles.timerSubtext}>until your session</Text>
          </View>
        </View>

        {/* RSVP Section */}
        <View style={styles.section}>
          <View style={styles.rsvpCard}>
            <Text style={styles.rsvpTitle}>Will you attend this session?</Text>
            <View style={styles.rsvpButtons}>
              <TouchableOpacity
                style={[
                  styles.rsvpButton,
                  styles.confirmButton,
                  rsvpStatus === "confirmed" && styles.selectedRsvpButton,
                ]}
                onPress={() => handleRSVP("confirmed")}
              >
                <Text
                  style={[
                    styles.rsvpButtonText,
                    styles.confirmButtonText,
                    rsvpStatus === "confirmed" && styles.selectedRsvpButtonText,
                  ]}
                >
                  Yes, I'll attend
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.rsvpButton,
                  styles.declineButton,
                  rsvpStatus === "declined" && styles.selectedRsvpButton,
                ]}
                onPress={() => handleRSVP("declined")}
              >
                <Text
                  style={[
                    styles.rsvpButtonText,
                    styles.declineButtonText,
                    rsvpStatus === "declined" && styles.selectedRsvpButtonText,
                  ]}
                >
                  Can't attend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Buttons */}
        <View style={styles.section}>
          <View style={styles.contactButtons}>
            <Button
              title="Call"
              onPress={() => handleContactParticipant("call")}
              icon={Phone}
              mode="outlined"
              style={{ flex: 1 }}
            />
            <Button
              title="Message"
              onPress={() => handleContactParticipant("message")}
              icon={MessageCircle}
              mode="outlined"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Session Agenda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Agenda</Text>
          <View style={styles.agendaCard}>
            {session.agenda.map((item, index) => (
              <View key={index} style={styles.agendaItem}>
                <View style={styles.agendaBullet} />
                <Text style={styles.agendaText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Session Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Notes</Text>
          <View style={styles.notesCard}>
            {session.notes && (
              <View>
                <Text
                  style={{
                    ...theme.typography.bodySmall,
                    color: theme.colors.text,
                    fontWeight: "600",
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Prepared Notes:
                </Text>
                <Text style={styles.existingNotes}>{session.notes}</Text>
              </View>
            )}

            <Text
              style={{
                ...theme.typography.bodySmall,
                color: theme.colors.text,
                fontWeight: "600",
                marginBottom: theme.spacing.sm,
              }}
            >
              Your Notes:
            </Text>
            <TextInput
              placeholder="Add your notes or questions for the session..."
              value={sessionNotes}
              onChangeText={setSessionNotes}
              multiline
              numberOfLines={6}
              leftIcon={FileText}
            />
          </View>
        </View>

        {/* Complete Session Button - Only show if confirmed */}
        {rsvpStatus === "confirmed" && (
          <View style={styles.section}>
            <Button
              title="Mark Session Complete"
              onPress={handleCompleteSession}
              icon={CheckCircle}
              mode="contained"
              style={styles.completeButton}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
