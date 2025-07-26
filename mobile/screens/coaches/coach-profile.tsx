"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
  UserPlus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";

interface CoachProfileProps {
  userRole?: "head-coach" | "peer-coach" | "advisor" | "student-leader";
}

// Mock coach data
const getCoachData = (id: string) => ({
  id: parseInt(id),
  name: "Sarah Johnson",
  email: "sarah.johnson@student.edu",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  status: "active",
  year: "Junior",
  major: "Computer Science",
  bio: "Passionate about helping freshmen navigate their first year. Specializes in academic planning, time management, and tech career guidance.",
  rating: 4.8,
  totalStudents: 12,
  successRate: 94,
  totalSessions: 48,
  joinDate: "2024-01-15",
  specialties: [
    "Academic Planning",
    "Time Management",
    "Career Guidance",
    "Tech Industry",
  ],
  currentStudents: [
    {
      id: 1,
      name: "Emily Chen",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      progress: 85,
      status: "excellent",
      lastSession: "2 days ago",
      gpa: 3.7,
    },
    {
      id: 2,
      name: "Marcus Johnson",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      progress: 72,
      status: "good",
      lastSession: "1 week ago",
      gpa: 3.2,
    },
    {
      id: 3,
      name: "Sophia Martinez",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
      progress: 45,
      status: "needs-attention",
      lastSession: "3 days ago",
      gpa: 2.8,
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: "session",
      title: "Academic Support Session with Emily Chen",
      time: "2 hours ago",
      icon: Calendar,
    },
    {
      id: 2,
      type: "assignment",
      title: "New student Marcus Johnson assigned",
      time: "1 day ago",
      icon: UserPlus,
    },
    {
      id: 3,
      type: "achievement",
      title: "Helped Sophia improve GPA by 0.5 points",
      time: "3 days ago",
      icon: TrendingUp,
    },
    {
      id: 4,
      type: "session",
      title: "Career Guidance Session with David Kim",
      time: "5 days ago",
      icon: Calendar,
    },
  ],
});

export default function CoachProfileScreen({
  userRole = "head-coach",
}: CoachProfileProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const coach = getCoachData(id as string);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "session":
        return Calendar;
      case "assignment":
        return UserPlus;
      case "achievement":
        return TrendingUp;
      default:
        return Calendar;
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
    profileName: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    profileDetails: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
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
      marginBottom: theme.spacing.md,
    },
    specialtiesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    specialtyTag: {
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
    },
    specialtyText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
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
    },
    studentGPA: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
      marginTop: theme.spacing.xs,
    },
    progressContainer: {
      marginBottom: theme.spacing.sm,
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
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "15",
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: 2,
    },
    activityTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  const renderStudentItem = ({ item: student }: { item: any }) => {
    const progressColor = getProgressColor(student.status);
    const gpaColor =
      student.gpa >= 3.5
        ? theme.colors.success
        : student.gpa >= 3.0
          ? theme.colors.warning
          : theme.colors.error;

    return (
      <View style={styles.studentItem}>
        <View style={styles.studentHeader}>
          <Avatar
            imageUrl={student.avatar}
            initials={student.name.charAt(0)}
            size={45}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetails}>
              Last session: {student.lastSession}
            </Text>
            <Text style={[styles.studentGPA, { color: gpaColor }]}>
              GPA: {student.gpa}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/student-profile/${student.id}`)}
          >
            <Eye color={theme.colors.primary} size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
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
        </View>
      </View>
    );
  };

  const renderActivityItem = ({ item: activity }: { item: any }) => {
    const ActivityIcon = getActivityIcon(activity.type);

    return (
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <ActivityIcon color={theme.colors.primary} size={20} />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityTime}>{activity.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Coach Profile"
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Avatar
              imageUrl={coach.avatar}
              initials={coach.name.charAt(0)}
              size={80}
            />
          </View>
          <Text style={styles.profileName}>{coach.name}</Text>
          <Text style={styles.profileDetails}>
            {coach.year} • {coach.major}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(coach.status) },
              ]}
            />
            <Text style={styles.statusText}>Available</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star
              color={theme.colors.warning}
              size={20}
              fill={theme.colors.warning}
            />
            <Text style={styles.ratingText}>{coach.rating} Rating</Text>
          </View>
          <View style={styles.actionButtons}>
            <Button
              title="Assign Student"
              onPress={() => router.push("/assign-students")}
              icon={UserPlus}
              mode="contained"
              style={{ flex: 1 }}
            />
            <Button
              title="Message"
              onPress={() => {}}
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
              title="Total Students"
              value={coach.totalStudents.toString()}
              icon={Users}
              color={theme.colors.primary}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Success Rate"
              value={`${coach.successRate}%`}
              icon={TrendingUp}
              color={theme.colors.success}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Rating"
              value={coach.rating.toString()}
              icon={Star}
              color={theme.colors.warning}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Sessions"
              value={coach.totalSessions.toString()}
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
            <Text style={styles.aboutText}>{coach.bio}</Text>
            <View style={styles.specialtiesContainer}>
              {coach.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Current Students */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Current Students ({coach.currentStudents.length})
          </Text>
          <FlatList
            data={coach.currentStudents}
            renderItem={renderStudentItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={coach.recentActivity}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
