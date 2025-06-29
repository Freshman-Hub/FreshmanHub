import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Star,
  Users,
  Target,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock coaching data
const myCoach = {
  id: 0,
  name: "Dr. Kwame Asante",
  title: "Senior Academic Coach",
  department: "Computer Science",
  experience: "8 years",
  avatar:
    "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Passionate about helping students achieve their academic and personal goals. Specializes in study strategies, time management, and career planning.",
  specializations: [
    "Study Skills",
    "Time Management",
    "Career Planning",
    "Academic Writing",
  ],
  rating: 4.9,
  studentsCoached: 156,
  isOnline: true,
  isAssigned: true,
  nextSession: "Tomorrow, 2:00 PM",
  totalSessions: 12,
  completedGoals: 8,
};

const headOfCoaches = {
  id: 1,
  name: "Yvonne Asante",
  title: "Head of Student Coaching",
  department: "Student Affairs",
  experience: "15 years",
  avatar:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  bio: "Leading the coaching program at Ashesi with over 15 years of experience in student development and mentorship.",
  specializations: [
    "Leadership Development",
    "Program Management",
    "Student Success",
    "Mentorship",
  ],
  rating: 5.0,
  studentsCoached: 500,
  isOnline: false,
  isAssigned: false,
  availability: "Available for consultation",
  price: "Free for students",
};

const upcomingSessions = [
  {
    id: 1,
    title: "Study Strategy Review",
    coach: "Dr. Kwame Asante",
    date: "Tomorrow",
    time: "2:00 PM",
    duration: "60 min",
    type: "Video Call",
    status: "confirmed",
  },
  {
    id: 2,
    title: "Goal Setting Session",
    coach: "Dr. Kwame Asante",
    date: "Friday",
    time: "10:00 AM",
    duration: "45 min",
    type: "In-Person",
    status: "pending",
  },
];

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<"my-coach" | "head-coach">(
    "my-coach"
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleBookSession = (coachId: number) => {
    console.log("Booking session with coach:", coachId);
  };

  const handleMessage = (coachId: number) => {
    console.log("Messaging coach:", coachId);
  };

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    coachSelector: ViewStyle;
    selectorButton: ViewStyle;
    selectorButtonActive: ViewStyle;
    selectorText: TextStyle;
    selectorTextActive: TextStyle;
    scrollContent: ViewStyle;
    myCoachContainer: ViewStyle;
    sectionTitle: TextStyle;
    myCoachCard: ViewStyle;
    coachCard: ViewStyle;
    coachHeader: ViewStyle;
    coachAvatar: ImageStyle;
    onlineIndicator: ViewStyle;
    coachInfo: ViewStyle;
    coachName: TextStyle;
    coachTitle: TextStyle;
    coachDepartment: TextStyle;
    assignedBadge: ViewStyle;
    assignedBadgeText: TextStyle;
    availabilityBadge: ViewStyle;
    availabilityText: TextStyle;
    coachBio: TextStyle;
    coachStats: ViewStyle;
    statItem: ViewStyle;
    statText: TextStyle;
    specializationsContainer: ViewStyle;
    specializationsTitle: TextStyle;
    specializationsList: ViewStyle;
    specializationTag: ViewStyle;
    specializationText: TextStyle;
    progressContainer: ViewStyle;
    progressTitle: TextStyle;
    progressStats: ViewStyle;
    progressStat: ViewStyle;
    progressNumber: TextStyle;
    progressLabel: TextStyle;
    nextSessionInfo: ViewStyle;
    nextSessionText: TextStyle;
    coachActions: ViewStyle;
    actionButton: ViewStyle;
    actionButtonSecondary: ViewStyle;
    actionButtonText: TextStyle;
    actionButtonTextSecondary: TextStyle;
    sessionsContainer: ViewStyle;
    sessionCard: ViewStyle;
    sessionHeader: ViewStyle;
    sessionTitle: TextStyle;
    sessionStatus: ViewStyle;
    sessionStatusText: TextStyle;
    sessionDetails: TextStyle;
    goalsContainer: ViewStyle;
    goalCard: ViewStyle;
    goalHeader: ViewStyle;
    goalTitle: TextStyle;
    goalStatus: TextStyle;
    progressBar: ViewStyle;
    progressFill: ViewStyle;
    goalDueDate: TextStyle;
    coachesContainer: ViewStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
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
      paddingBottom: theme.spacing.md,
    },
    myCoachContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    myCoachCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 0,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    coachCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    coachHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: theme.spacing.lg,
    },
    coachAvatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
      position: "relative",
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.success,
      borderWidth: 1,
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
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    } as TextStyle,
    coachDepartment: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    } as TextStyle,
    assignedBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      alignSelf: "flex-start",
    },
    assignedBadgeText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "700",
    },
    availabilityBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      alignSelf: "flex-start",
    },
    availabilityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "700",
    },
    coachBio: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    } as TextStyle,
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
    specializationsContainer: {
      marginBottom: theme.spacing.md,
    },
    specializationsTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    specializationsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    specializationTag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    specializationText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    progressContainer: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    progressTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
    },
    progressStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    progressStat: {
      alignItems: "center",
    },
    progressNumber: {
      ...theme.typography.h5,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    progressLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    nextSessionInfo: {
      backgroundColor: theme.colors.accent + "20",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
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
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "700",
    },
    actionButtonTextSecondary: {
      color: theme.colors.text,
    },
    sessionsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    sessionCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sessionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    sessionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    sessionStatus: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    sessionStatusText: {
      ...theme.typography.bodySmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    sessionDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    } as TextStyle,
    goalsContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
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
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    goalDueDate: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    } as TextStyle,
    coachesContainer: {
      paddingHorizontal: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coaching</Text>
      </View>

      <View style={styles.coachSelector}>
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
            Head
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {selectedCoach === "my-coach" ? (
          <>
            <View style={styles.myCoachContainer}>
              <Text style={styles.sectionTitle}>Your Assigned Coach</Text>
              <View style={styles.myCoachCard}>
                <View style={styles.coachHeader}>
                  <View style={{ position: "relative" }}>
                    <Image
                      source={{ uri: myCoach.avatar }}
                      style={styles.coachAvatar}
                    />
                    {myCoach.isOnline && (
                      <View style={styles.onlineIndicator} />
                    )}
                  </View>
                  <View style={styles.coachInfo}>
                    <Text style={styles.coachName}>{myCoach.name}</Text>
                    <Text style={styles.coachTitle}>{myCoach.title}</Text>
                    <Text style={styles.coachDepartment}>
                      {myCoach.department} • {myCoach.experience} experience
                    </Text>
                    <View style={styles.assignedBadge}>
                      <Text style={styles.assignedBadgeText}>
                        Assigned Coach
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.coachBio}>{myCoach.bio}</Text>

                <View style={styles.coachStats}>
                  <View style={styles.statItem}>
                    <Star color="#f59e0b" size={16} fill="#f59e0b" />
                    <Text style={styles.statText}>{myCoach.rating}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Users color={theme.colors.textSecondary} size={16} />
                    <Text style={styles.statText}>
                      {myCoach.studentsCoached} coached
                    </Text>
                  </View>
                </View>

                <View style={styles.specializationsContainer}>
                  <Text style={styles.specializationsTitle}>
                    Specializations
                  </Text>
                  <View style={styles.specializationsList}>
                    {myCoach.specializations.map((spec, index) => (
                      <View key={index} style={styles.specializationTag}>
                        <Text style={styles.specializationText}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <Text style={styles.progressTitle}>Your Progress</Text>
                  <View style={styles.progressStats}>
                    <View style={styles.progressStat}>
                      <Text style={styles.progressNumber}>
                        {myCoach.totalSessions}
                      </Text>
                      <Text style={styles.progressLabel}>Total Sessions</Text>
                    </View>
                    <View style={styles.progressStat}>
                      <Text style={styles.progressNumber}>
                        {myCoach.completedGoals}
                      </Text>
                      <Text style={styles.progressLabel}>Goals Achieved</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.nextSessionInfo}>
                  <Text style={styles.nextSessionText}>
                    Next Session: {myCoach.nextSession}
                  </Text>
                </View>

                <View style={styles.coachActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessage(myCoach.id)}
                  >
                    <MessageCircle color="white" size={20} />
                    <Text style={styles.actionButtonText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                  >
                    <Calendar color={theme.colors.text} size={20} />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.actionButtonTextSecondary,
                      ]}
                    >
                      Schedule
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.sessionsContainer}>
              <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
              {upcomingSessions.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <View style={styles.sessionStatus}>
                      <Text style={styles.sessionStatusText}>
                        {session.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.sessionDetails}>
                    {session.coach} • {session.date} at {session.time}
                  </Text>
                  <Text style={styles.sessionDetails}>
                    {session.duration} • {session.type}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.goalsContainer}>
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
            </View>
          </>
        ) : (
          <View style={styles.coachesContainer}>
            <Text style={styles.sectionTitle}>Head of coaches</Text>
            <View style={styles.coachCard}>
              <View style={styles.coachHeader}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: headOfCoaches.avatar }}
                    style={styles.coachAvatar}
                  />
                  {headOfCoaches.isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
                <View style={styles.coachInfo}>
                  <Text style={styles.coachName}>{headOfCoaches.name}</Text>
                  <Text style={styles.coachTitle}>{headOfCoaches.title}</Text>
                  <Text style={styles.coachDepartment}>
                    {headOfCoaches.department} • {headOfCoaches.experience}{" "}
                    experience
                  </Text>
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>
                      {headOfCoaches.availability}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.coachBio}>{headOfCoaches.bio}</Text>

              <View style={styles.coachStats}>
                <View style={styles.statItem}>
                  <Star color="#f59e0b" size={16} fill="#f59e0b" />
                  <Text style={styles.statText}>{headOfCoaches.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Users color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.statText}>
                    {headOfCoaches.studentsCoached} coached
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Target color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.statText}>{headOfCoaches.price}</Text>
                </View>
              </View>

              <View style={styles.specializationsContainer}>
                <Text style={styles.specializationsTitle}>Specializations</Text>
                <View style={styles.specializationsList}>
                  {headOfCoaches.specializations.map((spec, index) => (
                    <View key={index} style={styles.specializationTag}>
                      <Text style={styles.specializationText}>{spec}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.coachActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookSession(headOfCoaches.id)}
                >
                  <Calendar color="white" size={20} />
                  <Text style={styles.actionButtonText}>Book Session</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={() => handleMessage(headOfCoaches.id)}
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
