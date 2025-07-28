"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal as RNModal,
   Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  X,
  BarChart3,
  Download,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Import reusable components
import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";

const { width } = Dimensions.get("window");

interface PerformanceModalProps {
  visible: boolean;
  onClose: () => void;
  userRole?:
    | "head_of_coaches"
    | "peer_coach"
    | "academic_advisor"
    | "student_leader";
  dashboardStats: {
    label: string;
    value: string;
    icon: any;
    color: string;
    change: string;
  }[];
  upcomingSessions: {
    id: string;
    student: string;
    coach: string;
    time: string;
    type: string;
    avatar: string;
  }[];
  totalUsers?: number;
  activeCoaches?: number;
  availableCoaches?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage?: string;
    isActive: boolean;
  }[]; // Add this prop
}

// Mock detailed metrics for now
const detailedMetrics = [
  {
    category: "Session Quality",
    value: "4.8/5",
    change: "+0.2",
    color: "#059669",
  },
  {
    category: "Response Time",
    value: "12 min",
    change: "-3 min",
    color: "#3b82f6",
  },
  {
    category: "Student Retention",
    value: "89%",
    change: "+5%",
    color: "#7c3aed",
  },
  {
    category: "Goal Completion",
    value: "76%",
    change: "+8%",
    color: "#dc2626",
  },
  {
    category: "Attendance Rate",
    value: "92%",
    change: "+3%",
    color: "#059669",
  },
  {
    category: "Feedback Score",
    value: "4.6/5",
    change: "+0.4",
    color: "#3b82f6",
  },
];

// Mock performance metrics - will be replaced with real data later
const performanceMetrics = [
  { label: "Avg Session Rating", value: "4.8", unit: "/5", color: "#059669" },
  { label: "Response Time", value: "12", unit: "min", color: "#3b82f6" },
  { label: "Student Satisfaction", value: "96", unit: "%", color: "#7c3aed" },
  { label: "Coach Retention", value: "89", unit: "%", color: "#dc2626" },
];

export function PerformanceModal({
  visible,
  onClose,
  userRole = "head_of_coaches",
  dashboardStats,
  upcomingSessions,
  totalUsers = 0,
  activeCoaches = 0,
  availableCoaches = [],
}: PerformanceModalProps) {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedMetric, setSelectedMetric] = useState("All Metrics");

  const periods = ["This Week", "This Month", "This Quarter", "This Year"];
  const metricFilters = [
    "All Metrics",
    "Sessions",
    "Ratings",
    "Completion",
    "Response Time",
  ];

 const getTopPerformers = () => {
   return availableCoaches
     .filter((coach) => coach.role === "peer_coach" && coach.isActive)
     .slice(0, 5) // Show top 5 coaches
     .map((coach, index) => ({
       name: `${coach.firstName} ${coach.lastName}`,
       role: "Peer Coach",
       score: 4.9 - index * 0.1, // Mock scores for now, descending
       sessions: Math.floor(Math.random() * 20) + 15, // Mock session count
       avatar: coach.profileImage || null,
       initials: `${coach.firstName?.charAt(0) || ""}${coach.lastName?.charAt(0) || ""}`,
     }));
 };
    
  const topPerformers = getTopPerformers();

  const handleExport = () => {
    console.log("Exporting performance data...");
  };

  const styles = StyleSheet.create({
    fullScreenContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    closeButton: {
      padding: 8,
    },
    exportButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    exportText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    statCardWrapper: {
      width: (width - theme.spacing.md * 2 - theme.spacing.sm) / 2,
    },
    filtersContainer: {
      marginBottom: theme.spacing.lg,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    performanceGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    performanceCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      alignItems: "center",
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
    performanceValue: {
      ...theme.typography.h5,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    performanceUnit: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
    },
    performanceLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      fontWeight: "600",
    },
    performerAvatarImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: theme.spacing.md,
    },
    emptyStateContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
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
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    metricCard: {
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
    },
    metricCategory: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    metricValue: {
      ...theme.typography.h5,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    metricChange: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
    },
    positiveChange: {
      color: "#059669",
    },
    negativeChange: {
      color: "#dc2626",
    },
    chartContainer: {
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
    },
    chartTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    chartPlaceholder: {
      height: 200,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    chartPlaceholderText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    performersList: {
      gap: theme.spacing.md,
    },
    performerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
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
    performerAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    performerAvatarText: {
      ...theme.typography.h6,
      color: "white",
      fontWeight: "700",
    },
    performerInfo: {
      flex: 1,
    },
    performerName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    performerRole: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    performerStats: {
      alignItems: "flex-end",
    },
    performerScore: {
      ...theme.typography.h6,
      color: theme.colors.primary,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    performerSessions: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
      hardwareAccelerated={true}
    >
      <SafeAreaView style={styles.fullScreenContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Performance Analytics</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <TouchableOpacity
                style={styles.exportButton}
                onPress={handleExport}
              >
                <Download color={theme.colors.primary} size={16} />
                <Text style={styles.exportText}>Export</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X color="#666" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Key Metrics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Key Metrics</Text>
              </View>

              <View style={styles.filtersContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {periods.map((period) => (
                    <FilterChip
                      key={period}
                      label={period}
                      selected={selectedPeriod === period}
                      onPress={() => setSelectedPeriod(period)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.statsGrid}>
                {dashboardStats.map((stat, index) => (
                  <View key={index} style={styles.statCardWrapper}>
                    <StatCard
                      label={stat.label}
                      value={stat.value}
                      icon={stat.icon}
                      color={stat.color}
                      style={{ height: 120 }}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Performance Overview */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Performance Overview</Text>
              </View>
              <View style={styles.performanceGrid}>
                {performanceMetrics.map((metric, index) => (
                  <View key={index} style={styles.performanceCard}>
                    <Text
                      style={[styles.performanceValue, { color: metric.color }]}
                    >
                      {metric.value}
                      <Text
                        style={[
                          styles.performanceUnit,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {metric.unit}
                      </Text>
                    </Text>
                    <Text style={styles.performanceLabel}>{metric.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Detailed Metrics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Detailed Analytics</Text>
              </View>

              <View style={styles.filtersContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScroll}
                >
                  {metricFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={selectedMetric === filter}
                      onPress={() => setSelectedMetric(filter)}
                    />
                  ))}
                </ScrollView>
              </View>

              <View style={styles.metricsGrid}>
                {detailedMetrics.map((metric, index) => (
                  <View key={index} style={styles.metricCard}>
                    <Text style={styles.metricCategory}>{metric.category}</Text>
                    <Text style={[styles.metricValue, { color: metric.color }]}>
                      {metric.value}
                    </Text>
                    <Text
                      style={[
                        styles.metricChange,
                        metric.change.startsWith("+")
                          ? styles.positiveChange
                          : styles.negativeChange,
                      ]}
                    >
                      {metric.change}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Performance Trends Chart */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Trends</Text>
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>6-Month Overview</Text>
                <View style={styles.chartPlaceholder}>
                  <BarChart3 color={theme.colors.textSecondary} size={48} />
                  <Text style={styles.chartPlaceholderText}>
                    Interactive Chart Coming Soon
                  </Text>
                </View>
              </View>
            </View>

            {/* Top Performers (only for head_of_coaches role) */}
            {userRole === "head_of_coaches" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Coaches</Text>
                <View style={styles.performersList}>
                  {topPerformers.length > 0 ? (
                    topPerformers.map((performer, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.performerCard}
                        activeOpacity={0.8}
                      >
                        {performer.avatar ? (
                          <Image
                            source={{ uri: performer.avatar }}
                            style={styles.performerAvatarImage}
                          />
                        ) : (
                          <View style={styles.performerAvatar}>
                            <Text style={styles.performerAvatarText}>
                              {performer.initials}
                            </Text>
                          </View>
                        )}
                        <View style={styles.performerInfo}>
                          <Text style={styles.performerName}>
                            {performer.name}
                          </Text>
                          <Text style={styles.performerRole}>
                            {performer.role}
                          </Text>
                        </View>
                        <View style={styles.performerStats}>
                          <Text style={styles.performerScore}>
                            {performer.score.toFixed(1)}★
                          </Text>
                          <Text style={styles.performerSessions}>
                            {performer.sessions} sessions
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyStateContainer}>
                      <Text style={styles.emptyStateText}>
                        No active coaches found
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </RNModal>
  );
}
