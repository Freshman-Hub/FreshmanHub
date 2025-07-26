"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Filter,
  Download,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

interface SessionAnalyticsProps {
  userRole?: "head-coach" | "peer-coach" | "advisor" | "student-leader";
}

// Mock analytics data
const analyticsData = {
  overview: {
    totalSessions: 156,
    completedSessions: 142,
    cancelledSessions: 14,
    averageDuration: 52,
    successRate: 91,
    totalHours: 123,
  },
  monthlyTrends: [
    { month: "Jan", sessions: 45, completion: 89 },
    { month: "Feb", sessions: 52, completion: 92 },
    { month: "Mar", sessions: 48, completion: 87 },
    { month: "Apr", sessions: 59, completion: 94 },
    { month: "May", sessions: 62, completion: 91 },
    { month: "Jun", sessions: 58, completion: 93 },
  ],
  sessionTypes: [
    { type: "Academic Support", count: 68, percentage: 44 },
    { type: "Career Guidance", count: 42, percentage: 27 },
    { type: "Personal Development", count: 31, percentage: 20 },
    { type: "Wellness Check", count: 15, percentage: 9 },
  ],
  topPerformers: [
    { name: "Sarah Johnson", sessions: 28, rating: 4.9, completion: 96 },
    { name: "David Wilson", sessions: 24, rating: 4.7, completion: 92 },
    { name: "Lisa Thompson", sessions: 22, rating: 4.8, completion: 95 },
    { name: "Alex Kim", sessions: 19, rating: 4.6, completion: 89 },
  ],
  timeSlots: [
    { time: "9-11 AM", sessions: 32, percentage: 21 },
    { time: "11-1 PM", sessions: 45, percentage: 29 },
    { time: "1-3 PM", sessions: 38, percentage: 24 },
    { time: "3-5 PM", sessions: 28, percentage: 18 },
    { time: "5-7 PM", sessions: 13, percentage: 8 },
  ],
};

const timeFilters = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
];

export default function SessionAnalyticsScreen({
  userRole = "head-coach",
}: SessionAnalyticsProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("Last 30 Days");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

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
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.lg,
    },
    filterContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    chartCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    chartTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    chartPlaceholder: {
      height: 200,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    chartPlaceholderText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.sm,
    },
    trendItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    trendMonth: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    trendValue: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    typeItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    typeColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.md,
    },
    typeInfo: {
      flex: 1,
    },
    typeName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    typeStats: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    performerItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    performerRank: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    performerRankText: {
      ...theme.typography.bodySmall,
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
      marginBottom: 2,
    },
    performerStats: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    performerRating: {
      ...theme.typography.body,
      color: theme.colors.warning,
      fontWeight: "700",
    },
    timeSlotItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    timeSlotInfo: {
      flex: 1,
    },
    timeSlotTime: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    timeSlotStats: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    timeSlotBar: {
      width: 100,
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      marginLeft: theme.spacing.md,
      overflow: "hidden",
    },
    timeSlotFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 3,
    },
    exportButton: {
      marginTop: theme.spacing.lg,
    },
  });

  const getTypeColor = (index: number) => {
    const colors = [
      theme.colors.primary,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.info,
    ];
    return colors[index % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Session Analytics"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Filter}
        onRightPress={() => {}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Time Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {timeFilters.map((filter) => (
                <FilterChip
                  key={filter}
                  label={filter}
                  selected={selectedTimeFilter === filter}
                  onPress={() => setSelectedTimeFilter(filter)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Sessions"
              value={analyticsData.overview.totalSessions.toString()}
              icon={Calendar}
              color={theme.colors.primary}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Success Rate"
              value={`${analyticsData.overview.successRate}%`}
              icon={TrendingUp}
              color={theme.colors.success}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Avg Duration"
              value={`${analyticsData.overview.averageDuration}m`}
              icon={Clock}
              color={theme.colors.warning}
              style={{ flex: 1 }}
            />
            <StatCard
              title="Total Hours"
              value={analyticsData.overview.totalHours.toString()}
              icon={Users}
              color={theme.colors.info}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Monthly Trends Chart */}
        <View style={styles.section}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Session Trends</Text>
            <View style={styles.chartPlaceholder}>
              <BarChart3 color={theme.colors.textSecondary} size={48} />
              <Text style={styles.chartPlaceholderText}>
                Interactive chart showing{"\n"}session trends over time
              </Text>
            </View>
            {analyticsData.monthlyTrends.map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendMonth}>{trend.month}</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.trendValue}>
                    {trend.sessions} sessions
                  </Text>
                  <Text
                    style={[styles.trendValue, { color: theme.colors.success }]}
                  >
                    {trend.completion}% completion
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Session Types Distribution */}
        <View style={styles.section}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Session Types Distribution</Text>
            <View style={styles.chartPlaceholder}>
              <PieChart color={theme.colors.textSecondary} size={48} />
              <Text style={styles.chartPlaceholderText}>
                Pie chart showing{"\n"}session type breakdown
              </Text>
            </View>
            {analyticsData.sessionTypes.map((type, index) => (
              <View key={index} style={styles.typeItem}>
                <View
                  style={[
                    styles.typeColor,
                    { backgroundColor: getTypeColor(index) },
                  ]}
                />
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{type.type}</Text>
                  <Text style={styles.typeStats}>
                    {type.count} sessions • {type.percentage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Coaches</Text>
          <View style={styles.chartCard}>
            {analyticsData.topPerformers.map((performer, index) => (
              <View key={index} style={styles.performerItem}>
                <View style={styles.performerRank}>
                  <Text style={styles.performerRankText}>{index + 1}</Text>
                </View>
                <View style={styles.performerInfo}>
                  <Text style={styles.performerName}>{performer.name}</Text>
                  <Text style={styles.performerStats}>
                    {performer.sessions} sessions • {performer.completion}%
                    completion
                  </Text>
                </View>
                <Text style={styles.performerRating}>★ {performer.rating}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Popular Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Time Slots</Text>
          <View style={styles.chartCard}>
            {analyticsData.timeSlots.map((slot, index) => (
              <View key={index} style={styles.timeSlotItem}>
                <View style={styles.timeSlotInfo}>
                  <Text style={styles.timeSlotTime}>{slot.time}</Text>
                  <Text style={styles.timeSlotStats}>
                    {slot.sessions} sessions • {slot.percentage}%
                  </Text>
                </View>
                <View style={styles.timeSlotBar}>
                  <View
                    style={[
                      styles.timeSlotFill,
                      { width: `${slot.percentage * 3}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Button */}
        <View style={styles.section}>
          <Button
            title="Export Analytics Report"
            onPress={() => {}}
            icon={Download}
            mode="outlined"
            style={styles.exportButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
