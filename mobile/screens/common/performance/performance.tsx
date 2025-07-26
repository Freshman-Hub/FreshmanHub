"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Award,
  Clock,
  Star,
  BarChart3,
  Download,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

interface PerformanceProps {
  userRole?: "head-coach" | "peer-coach" | "advisor" | "student-leader";
  userId?: string;
}

// Mock data that can be adapted based on user role
const getPerformanceData = (role: string) => {
  const baseMetrics = {
    "head-coach": [
      {
        label: "Total Coaches",
        value: "28",
        icon: Users,
        color: "#3b82f6",
        trend: "+3",
      },
      {
        label: "Active Sessions",
        value: "156",
        icon: Calendar,
        color: "#059669",
        trend: "+12",
      },
      {
        label: "Completion Rate",
        value: "94%",
        icon: Target,
        color: "#dc2626",
        trend: "+2%",
      },
      {
        label: "Avg Rating",
        value: "4.8",
        icon: Star,
        color: "#7c3aed",
        trend: "+0.2",
      },
    ],
    "peer-coach": [
      {
        label: "Assigned Students",
        value: "12",
        icon: Users,
        color: "#3b82f6",
        trend: "+2",
      },
      {
        label: "Sessions This Month",
        value: "24",
        icon: Calendar,
        color: "#059669",
        trend: "+6",
      },
      {
        label: "Success Rate",
        value: "96%",
        icon: Target,
        color: "#dc2626",
        trend: "+4%",
      },
      {
        label: "Student Rating",
        value: "4.9",
        icon: Star,
        color: "#7c3aed",
        trend: "+0.1",
      },
    ],
    advisor: [
      {
        label: "Students Advised",
        value: "45",
        icon: Users,
        color: "#3b82f6",
        trend: "+8",
      },
      {
        label: "Sessions Completed",
        value: "89",
        icon: Calendar,
        color: "#059669",
        trend: "+15",
      },
      {
        label: "Goal Achievement",
        value: "87%",
        icon: Target,
        color: "#dc2626",
        trend: "+5%",
      },
      {
        label: "Satisfaction Score",
        value: "4.7",
        icon: Star,
        color: "#7c3aed",
        trend: "+0.3",
      },
    ],
  };
  return (
    baseMetrics[role as keyof typeof baseMetrics] || baseMetrics["head-coach"]
  );
};

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

const performanceTrends = [
  { month: "Jan", sessions: 45, rating: 4.5, completion: 85 },
  { month: "Feb", sessions: 52, rating: 4.6, completion: 88 },
  { month: "Mar", sessions: 48, rating: 4.7, completion: 90 },
  { month: "Apr", sessions: 61, rating: 4.8, completion: 94 },
  { month: "May", sessions: 58, rating: 4.8, completion: 92 },
  { month: "Jun", sessions: 65, rating: 4.9, completion: 96 },
];

const topPerformers = [
  {
    name: "Michael Osei",
    role: "Peer Coach",
    score: 4.9,
    sessions: 34,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Ama Asante",
    role: "Peer Coach",
    score: 4.8,
    sessions: 28,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Kwame Nkrumah",
    role: "Academic Advisor",
    score: 4.7,
    sessions: 42,
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function PerformanceScreen({
  userRole = "head-coach",
  userId,
}: PerformanceProps) {
  const { theme } = useTheme();
  const router = useRouter();
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
  const performanceMetrics = getPerformanceData(userRole);

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

  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting performance data...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Performance Analytics"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Download}
        onRightPress={handleExport}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Key Metrics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={handleExport}
            >
              <Download color={theme.colors.primary} size={16} />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
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
            {performanceMetrics.map((metric, index) => (
              <View key={index} style={styles.statCardWrapper}>
                <StatCard
                  label={metric.label}
                  value={metric.value}
                  icon={metric.icon}
                  color={metric.color}
                  style={{ height: 120 }}
                />
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

        {/* Top Performers (only for head-coach role) */}
        {userRole === "head-coach" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            <View style={styles.performersList}>
              {topPerformers.map((performer, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.performerCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.performerAvatar}>
                    <Text style={styles.performerAvatarText}>
                      {performer.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerName}>{performer.name}</Text>
                    <Text style={styles.performerRole}>{performer.role}</Text>
                  </View>
                  <View style={styles.performerStats}>
                    <Text style={styles.performerScore}>
                      {performer.score}★
                    </Text>
                    <Text style={styles.performerSessions}>
                      {performer.sessions} sessions
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
