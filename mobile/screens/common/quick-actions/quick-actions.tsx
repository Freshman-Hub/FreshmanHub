"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
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
import { FilterChip } from "@/components/ui/FilterChip";

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
        route: "/coaches",
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
        title: "Schedule Sessions",
        description: "Manage coaching sessions",
        icon: Calendar,
        color: "#059669",
        route: "(routes)/schedule-session",
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

const categories = [
  "All",
  "Management",
  "Sessions",
  "Communication",
  "Analytics",
  "Academic",
  "Community",
  "Support",
];

export default function QuickActionsScreen({
  userRole = "head-coach",
  userId,
}: QuickActionsProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allActions = getActionsForRole(userRole);

  const filteredActions = allActions.filter((action) => {
    const matchesCategory =
      selectedCategory === "All" || action.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
    searchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingVertical: theme.spacing.md,
      fontWeight: "500",
    },
    filtersContainer: {
      marginBottom: theme.spacing.lg,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    actionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    actionCard: {
      width: (width - theme.spacing.md * 2 - theme.spacing.md) / 2,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 140,
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    actionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    actionDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      flex: 1,
    },
    actionCategory: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginTop: theme.spacing.sm,
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

  const handleActionPress = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Quick Actions"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

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
              onChangeText={setSearchQuery} // Change from onChange to onChangeText
            />
          </View>

          {/* Category Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersScroll}
            >
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  selected={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Actions Grid */}
          {filteredActions.length > 0 ? (
            <View style={styles.actionsGrid}>
              {filteredActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => handleActionPress(action.route)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.color + "20" },
                    ]}
                  >
                    <action.icon color={action.color} size={24} />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                  <Text style={styles.actionCategory}>{action.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Search color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>
                No actions found matching your search criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
