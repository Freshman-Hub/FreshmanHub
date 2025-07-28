"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  Award,
  Target,
  BookOpen,
  Search,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { MenuCard } from "@/components/ui/MenuCard";


const { width } = Dimensions.get("window");

interface QuickActionsProps {
  userRole?:
    | "head-coach"
    | "peer-coach"
    | "advisor"
    | "student-leader"
    | "student";
  userId?: string;
}

// Actions based on user role
const getActionsForRole = (role: string) => {
  const actions = {
    "head-coach": [
      {
        title: "Assign Students",
        description: "Assign freshmen to peer coaches",
        icon: UserCheck,
        color: "#3b82f6",
        route: "/assign-freshman",
        category: "Management",
      },
      {
        title: "View All Coaches",
        description: "Manage peer coaches",
        icon: Users,
        color: "#059669",
        route: "(head-coach)/coach-head",
        category: "Management",
      },
      {
        title: "Session Analytics",
        description: "View detailed reports",
        icon: BarChart3,
        color: "#dc2626",
        route: "(routes)/session-analytics",
        category: "Analytics",
      },
      {
        title: "Send Announcement",
        description: "Global announcements",
        icon: MessageSquare,
        color: "#7c3aed",
        route: "(routes)/send-announcements",
        category: "Communication",
      },
      {
        title: "Sessions",
        description: "Manage coaching sessions",
        icon: Calendar,
        color: "#059669",
        route: "(routes)/sessions",
        category: "Management",
      },
      {
        title: "Performance Reports",
        description: "Generate detailed reports",
        icon: FileText,
        color: "#3b82f6",
        route: "/reports",
        category: "Analytics",
      },
      {
        title: "Coach Training",
        description: "Training programs",
        icon: BookOpen,
        color: "#7c3aed",
        route: "(routes)/send-reminders",
        category: "Development",
      },
      {
        title: "Events",
        description: "View upcoming events",
        icon: BookOpen,
        color: "#7c3aed",
        route: "(routes)/events",
        category: "Development",
      },
      {
        title: "System Settings",
        description: "Configure system",
        icon: Settings,
        color: "#64748b",
        route: "(routes)/availability",
        category: "Administration",
      },
    ],
    "peer-coach": [
      {
        title: "My Students",
        description: "View assigned students",
        icon: Users,
        color: "#3b82f6",
        route: "/my-students",
        category: "Students",
      },
      {
        title: "Schedule Session",
        description: "Book coaching sessions",
        icon: Calendar,
        color: "#059669",
        route: "(routes)/schedule-session",
        category: "Sessions",
      },
      {
        title: "Session Notes",
        description: "Add session notes",
        icon: FileText,
        color: "#7c3aed",
        route: "/session-notes",
        category: "Sessions",
      },
      {
        title: "Progress Tracking",
        description: "Track student progress",
        icon: Target,
        color: "#dc2626",
        route: "/progress",
        category: "Tracking",
      },
      {
        title: "Send Message",
        description: "Message students",
        icon: MessageSquare,
        color: "#059669",
        route: "/messages",
        category: "Communication",
      },
      {
        title: "Resources",
        description: "Coaching resources",
        icon: BookOpen,
        color: "#3b82f6",
        route: "/resources",
        category: "Resources",
      },
    ],
    advisor: [
      {
        title: "My Advisees",
        description: "View assigned students",
        icon: Users,
        color: "#3b82f6",
        route: "/advisees",
        category: "Students",
      },
      {
        title: "Academic Planning",
        description: "Course planning",
        icon: BookOpen,
        color: "#059669",
        route: "/academic-planning",
        category: "Academic",
      },
      {
        title: "Schedule Meeting",
        description: "Book advising sessions",
        icon: Calendar,
        color: "#7c3aed",
        route: "(routes)/schedule-session",
        category: "Sessions",
      },
      {
        title: "Progress Review",
        description: "Review academic progress",
        icon: Target,
        color: "#dc2626",
        route: "/progress-review",
        category: "Academic",
      },
      {
        title: "Send Tips",
        description: "Academic tips & advice",
        icon: MessageSquare,
        color: "#059669",
        route: "/send-tips",
        category: "Communication",
      },
      {
        title: "Graduation Check",
        description: "Degree requirements",
        icon: Award,
        color: "#7c3aed",
        route: "/graduation-check",
        category: "Academic",
      },
    ],
    student: [
      {
        title: "Book Session",
        description: "Schedule coaching session",
        icon: Calendar,
        color: "#3b82f6",
        route: "/book-session",
        category: "Sessions",
      },
      {
        title: "My Progress",
        description: "View your progress",
        icon: Target,
        color: "#059669",
        route: "/my-progress",
        category: "Progress",
      },
      {
        title: "Resources",
        description: "Learning resources",
        icon: BookOpen,
        color: "#7c3aed",
        route: "/resources",
        category: "Learning",
      },
      {
        title: "Join Events",
        description: "Campus events",
        icon: Users,
        color: "#dc2626",
        route: "/events",
        category: "Community",
      },
      {
        title: "Find Study Group",
        description: "Connect with peers",
        icon: Users,
        color: "#059669",
        route: "/study-groups",
        category: "Community",
      },
      {
        title: "Get Help",
        description: "Support services",
        icon: MessageSquare,
        color: "#7c3aed",
        route: "/help",
        category: "Support",
      },
    ],
  };
  return actions[role as keyof typeof actions] || actions["student"];
};

export default function QuickActionsScreen({
  userRole = "head-coach",
  userId,
}: QuickActionsProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const allActions = getActionsForRole(userRole);

  const filteredActions = allActions.filter((action) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      action.title.toLowerCase().includes(query) ||
      action.description.toLowerCase().includes(query) ||
      action.category.toLowerCase().includes(query)
    );
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
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    searchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingVertical: theme.spacing.lg,
      fontWeight: "500",
      marginLeft: theme.spacing.md,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      justifyContent: "space-between",
    },
    menuCardWrapper: {
      width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    },
    actionCard: {
      width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
    },
    actionIcon: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    actionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      lineHeight: 20,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
      flex: 1,
      justifyContent: "center",
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.border + "30",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
      maxWidth: 250,
    },
  });

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Quick Actions" showBack={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search color={theme.colors.textSecondary} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search actions..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Actions Grid */}
          {filteredActions.length > 0 ? (
            <View style={styles.actionsGrid}>
              {filteredActions.map((action, index) => (
                <View key={index} style={styles.menuCardWrapper}>
                  <MenuCard
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    color={action.color}
                    onPress={() => handleActionPress(action.route)}
                    size="medium"
                    showDescription={false} // Only show icon and title
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Search color={theme.colors.textSecondary} size={32} />
              </View>
              <Text style={styles.emptyStateText}>
                No actions found matching &quot;{searchQuery}&quot;
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
