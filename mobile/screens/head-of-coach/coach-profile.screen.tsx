"use client";

import { useState, useCallback } from "react";
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
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Clock,
  Star,
  MessageSquare,
  Edit,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Mock coach profile data
const getCoachProfile = (id: string) => ({
  id: Number.parseInt(id),
  name: "Sarah Johnson",
  email: "sarah.johnson@student.edu",
  phone: "+1 (555) 123-4567",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  year: "Junior",
  major: "Computer Science",
  gpa: 3.8,
  joinDate: "2025-01-15",
  bio: "Passionate about helping fellow students succeed in their academic journey. I specialize in computer science, mathematics, and study skills development.",
  specialties: ["Academic Support", "Career Guidance", "Study Skills"],
  languages: ["English", "Spanish", "Mandarin"],
  availability: "Mon-Fri: 2-6 PM, Sat: 10 AM-2 PM",

  // Performance metrics
  studentsAssigned: 5,
  sessionsCompleted: 23,
  successRate: 94,
  avgRating: 4.8,
  totalHours: 34.5,
  improvement: "+12%",

  // Goals and achievements
  goals: {
    completed: 8,
    total: 10,
    current: [
      "Complete 25 sessions this month",
      "Maintain 95% success rate",
      "Help 2 students improve GPA by 0.5+",
    ],
  },

  achievements: [
    { title: "Top Performer", date: "July 2025", icon: "🏆" },
    { title: "Student Favorite", date: "June 2025", icon: "⭐" },
    { title: "Perfect Attendance", date: "May 2025", icon: "📅" },
  ],

  // Recent activity
  recentSessions: [
    {
      id: 1,
      studentName: "Michael Chen",
      date: "2025-07-02",
      type: "Academic Support",
      rating: 5,
      feedback: "Very helpful with calculus problems!",
    },
    {
      id: 2,
      studentName: "Emma Rodriguez",
      date: "2025-07-01",
      type: "Career Guidance",
      rating: 5,
      feedback: "Great advice on internship applications.",
    },
    {
      id: 3,
      studentName: "James Park",
      date: "2025-06-30",
      type: "Study Skills",
      rating: 4,
      feedback: "Learned effective time management techniques.",
    },
  ],

  // Current students
  currentStudents: [
    {
      id: 1,
      name: "Michael Chen",
      major: "Engineering",
      progress: 85,
      nextSession: "2025-07-03",
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      major: "Business",
      progress: 92,
      nextSession: "2025-07-04",
    },
    {
      id: 3,
      name: "James Park",
      major: "Psychology",
      progress: 78,
      nextSession: "2025-07-05",
    },
  ],
});

export default function CoachProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const coachId = (params.id as string) || "1";
  const coach = getCoachProfile(coachId);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleAction = (action: string) => {
    switch (action) {
      case "call":
        Alert.alert("Call Coach", `Calling ${coach.name} at ${coach.phone}`);
        break;
      case "email":
        Alert.alert("Email Coach", `Sending email to ${coach.email}`);
        break;
      case "message":
        Alert.alert("Message Coach", `Opening chat with ${coach.name}`);
        break;
      case "schedule":
        router.push(
          `/(routes)/common/schedule-session?coachId=${coach.id}&coachName=${coach.name}`
        );
        break;
      case "edit":
        Alert.alert("Edit Profile", "Opening edit profile screen...");
        break;
      default:
        console.log("Action:", action);
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

    // Profile Header
    profileHeader: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    profileInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    profileDetails: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    profileName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    profileRole: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    profileMajor: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
    },

    // Quick Stats
    quickStats: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statNumber: {
      ...theme.typography.h6,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: 2,
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      textAlign: "center",
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },

    // Content sections
    section: {
      padding: theme.spacing.md,
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

    // Bio section
    bioText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
    },
    detailsGrid: {
      gap: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailIcon: {
      marginRight: theme.spacing.md,
      width: 20,
    },
    detailText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      flex: 1,
    },

    // Specialties
    specialtiesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    specialtyTag: {
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    specialtyText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },

    // Goals section
    goalItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    goalText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      marginLeft: theme.spacing.md,
      flex: 1,
    },

    // Achievements
    achievementItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    achievementIcon: {
      fontSize: 24,
      marginRight: theme.spacing.md,
    },
    achievementInfo: {
      flex: 1,
    },
    achievementTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    achievementDate: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },

    // Recent sessions
    sessionItem: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    sessionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    sessionStudent: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    sessionRating: {
      flexDirection: "row",
      alignItems: "center",
    },
    ratingText: {
      ...theme.typography.bodySmall,
      color: theme.colors.warning,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    sessionType: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    sessionFeedback: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },

    // Current students
    studentItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    studentInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    studentName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    studentMajor: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginRight: theme.spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.success,
      borderRadius: 2,
    },
    progressText: {
      ...theme.typography.captionSmall,
      color: theme.colors.success,
      fontWeight: "600",
    },
    nextSession: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title="Coach Profile"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => handleAction("edit")}>
            <Edit color={theme.colors.primary} size={24} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Avatar
              imageUrl={coach.avatar}
              initials={coach.name.charAt(0)}
              size={60}
            />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{coach.name}</Text>
              <Text style={styles.profileRole}>Peer Coach • {coach.year}</Text>
              <Text style={styles.profileMajor}>
                {coach.major} • GPA: {coach.gpa}
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Call"
              onPress={() => handleAction("call")}
              icon={Phone}
              mode="outlined"
              style={styles.actionButton}
            />
            <Button
              title="Message"
              onPress={() => handleAction("message")}
              icon={MessageSquare}
              mode="outlined"
              style={styles.actionButton}
            />
            <Button
              title="Schedule"
              onPress={() => handleAction("schedule")}
              icon={Calendar}
              mode="contained"
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{coach.studentsAssigned}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{coach.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{coach.successRate}%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{coach.avgRating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* About Section */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <User
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>About</Text>
              </View>
              <Text style={styles.bioText}>{coach.bio}</Text>

              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <Mail
                    color={theme.colors.textSecondary}
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{coach.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone
                    color={theme.colors.textSecondary}
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{coach.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Clock
                    color={theme.colors.textSecondary}
                    size={20}
                    style={styles.detailIcon}
                  />
                  <Text style={styles.detailText}>{coach.availability}</Text>
                </View>
              </View>
            </View>
          }
        />

        {/* Specialties */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <Award
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Specialties</Text>
              </View>
              <View style={styles.specialtiesContainer}>
                {coach.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          }
        />

        {/* Current Goals */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <TrendingUp
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>
                  Current Goals ({coach.goals.completed}/{coach.goals.total})
                </Text>
              </View>
              {coach.goals.current.map((goal, index) => (
                <View key={index} style={styles.goalItem}>
                  <TrendingUp color={theme.colors.success} size={16} />
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))}
            </View>
          }
        />

        {/* Achievements */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <Award
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Recent Achievements</Text>
              </View>
              {coach.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDate}>
                      {achievement.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          }
        />

        {/* Current Students */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <Users
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Current Students</Text>
              </View>
              {coach.currentStudents.map((student) => (
                <View key={student.id} style={styles.studentItem}>
                  <Avatar initials={student.name.charAt(0)} size={40} />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentMajor}>{student.major}</Text>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${student.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        {student.progress}%
                      </Text>
                    </View>
                    <Text style={styles.nextSession}>
                      Next session: {student.nextSession}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          }
        />

        {/* Recent Sessions */}
        <Card
          style={styles.section}
          content={
            <View>
              <View style={styles.sectionTitle}>
                <Calendar
                  color={theme.colors.primary}
                  size={20}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Recent Sessions</Text>
              </View>
              {coach.recentSessions.map((session) => (
                <View key={session.id} style={styles.sessionItem}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionStudent}>
                      {session.studentName}
                    </Text>
                    <View style={styles.sessionRating}>
                      <Star
                        color={theme.colors.warning}
                        size={16}
                        fill={theme.colors.warning}
                      />
                      <Text style={styles.ratingText}>{session.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionFeedback}>
                    "{session.feedback}"
                  </Text>
                </View>
              ))}
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
