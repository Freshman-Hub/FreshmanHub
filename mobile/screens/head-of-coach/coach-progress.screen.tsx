"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingUp, BarChart3 } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";

// Mock progress data
const coachProgressData = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    studentsAssigned: 5,
    sessionsCompleted: 23,
    successRate: 94,
    avgRating: 4.8,
    totalHours: 34.5,
    improvement: "+12%",
    lastActive: "2 hours ago",
    goals: {
      completed: 8,
      total: 10,
    },
    performance: "excellent",
  },
  {
    id: 2,
    name: "David Wilson",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    studentsAssigned: 4,
    sessionsCompleted: 18,
    successRate: 89,
    avgRating: 4.6,
    totalHours: 27.0,
    improvement: "+8%",
    lastActive: "1 day ago",
    goals: {
      completed: 6,
      total: 8,
    },
    performance: "good",
  },
  {
    id: 3,
    name: "Lisa Thompson",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    studentsAssigned: 6,
    sessionsCompleted: 31,
    successRate: 97,
    avgRating: 4.9,
    totalHours: 46.5,
    improvement: "+15%",
    lastActive: "30 min ago",
    goals: {
      completed: 12,
      total: 12,
    },
    performance: "excellent",
  },
  {
    id: 4,
    name: "Alex Kim",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    studentsAssigned: 3,
    sessionsCompleted: 12,
    successRate: 75,
    avgRating: 4.2,
    totalHours: 18.0,
    improvement: "-3%",
    lastActive: "3 days ago",
    goals: {
      completed: 4,
      total: 8,
    },
    performance: "needs_improvement",
  },
  {
    id: 5,
    name: "Maria Garcia",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
    studentsAssigned: 7,
    sessionsCompleted: 42,
    successRate: 91,
    avgRating: 4.7,
    totalHours: 63.0,
    improvement: "+10%",
    lastActive: "1 hour ago",
    goals: {
      completed: 14,
      total: 16,
    },
    performance: "excellent",
  },
];

const filterOptions = ["All", "Excellent", "Good", "Needs Improvement"];

export default function CoachProgressScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleSearchPress = () => {
    setIsSearchMode(true);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
  };

  const filteredCoaches = coachProgressData.filter((coach) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Excellent") return coach.performance === "excellent";
    if (activeFilter === "Good") return coach.performance === "good";
    if (activeFilter === "Needs Improvement")
      return coach.performance === "needs_improvement";
    return true;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return theme.colors.success;
      case "good":
        return theme.colors.primary;
      case "needs_improvement":
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "needs_improvement":
        return "Needs Improvement";
      default:
        return "Unknown";
    }
  };

  const getImprovementColor = (improvement: string) => {
    if (improvement.startsWith("+")) return theme.colors.success;
    if (improvement.startsWith("-")) return theme.colors.error;
    return theme.colors.textSecondary;
  };

  const calculateOverallStats = () => {
    const totalStudents = coachProgressData.reduce(
      (sum, coach) => sum + coach.studentsAssigned,
      0
    );
    const totalSessions = coachProgressData.reduce(
      (sum, coach) => sum + coach.sessionsCompleted,
      0
    );
    const avgSuccessRate = Math.round(
      coachProgressData.reduce((sum, coach) => sum + coach.successRate, 0) /
        coachProgressData.length
    );
    const avgRating = (
      coachProgressData.reduce((sum, coach) => sum + coach.avgRating, 0) /
      coachProgressData.length
    ).toFixed(1);

    return { totalStudents, totalSessions, avgSuccessRate, avgRating };
  };

  const overallStats = calculateOverallStats();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    summaryContainer: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    summaryItem: {
      flex: 1,
      alignItems: "center",
    },
    summaryNumber: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    summaryLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    summaryDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    filterContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    coachesContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    coachCardContent: {
      paddingBottom: theme.spacing.md,
    },
    coachHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    coachInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    coachName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    coachPerformance: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    performanceText: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    lastActive: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    improvementBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
    },
    improvementText: {
      ...theme.typography.captionSmall,
      fontWeight: "700",
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    metricItem: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    metricNumber: {
      ...theme.typography.h6,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: 2,
    },
    metricLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      textAlign: "center",
    },
    goalsProgress: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
    },
    goalsHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    goalsTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
    },
    goalsCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    progressBar: {
      height: 6,
      backgroundColor: theme.colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.success,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
    searchResultsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
    },
    searchSuggestions: {
      padding: theme.spacing.md,
      alignItems: "center",
    },
    suggestionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    },
  });

  const renderCoachCard = ({ item: coach }: { item: any }) => {
    const progressPercentage =
      (coach.goals.completed / coach.goals.total) * 100;

    return (
      <Card
        style={{ marginBottom: theme.spacing.md }}
        content={
          <View style={styles.coachCardContent}>
            <View style={styles.coachHeader}>
              <Avatar
                imageUrl={coach.avatar}
                initials={coach.name.charAt(0)}
                size={45}
              />
              <View style={styles.coachInfo}>
                <Text style={styles.coachName}>{coach.name}</Text>
                <View style={styles.coachPerformance}>
                  <TrendingUp
                    color={getPerformanceColor(coach.performance)}
                    size={14}
                  />
                  <Text
                    style={[
                      styles.performanceText,
                      { color: getPerformanceColor(coach.performance) },
                    ]}
                  >
                    {getPerformanceText(coach.performance)}
                  </Text>
                </View>
                <Text style={styles.lastActive}>
                  Last active: {coach.lastActive}
                </Text>
              </View>
              <View
                style={[
                  styles.improvementBadge,
                  {
                    backgroundColor:
                      getImprovementColor(coach.improvement) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.improvementText,
                    { color: getImprovementColor(coach.improvement) },
                  ]}
                >
                  {coach.improvement}
                </Text>
              </View>
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>
                  {coach.studentsAssigned}
                </Text>
                <Text style={styles.metricLabel}>Students</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>
                  {coach.sessionsCompleted}
                </Text>
                <Text style={styles.metricLabel}>Sessions</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>{coach.successRate}%</Text>
                <Text style={styles.metricLabel}>Success Rate</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>{coach.avgRating}</Text>
                <Text style={styles.metricLabel}>Avg Rating</Text>
              </View>
            </View>

            <View style={styles.goalsProgress}>
              <View style={styles.goalsHeader}>
                <Text style={styles.goalsTitle}>Goals Progress</Text>
                <Text style={styles.goalsCount}>
                  {coach.goals.completed}/{coach.goals.total}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        }
        onPress={() =>
          router.push(`/(routes)/head-of-coaches/coach-profile/${coach.id}`)
        }
      />
    );
  };

  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Search for coaches by name or performance...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoaches.filter((coach) =>
            coach.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderCoachCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isSearchMode ? (
        <>
          <FullSearchHeader
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={handleSearchClose}
            onSubmit={handleSearchSubmit}
            placeholder="Search coaches..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Coach Progress"
            showBack={true}
            showSearch={true}
            onSearchPress={handleSearchPress}
          />

          <View style={styles.content}>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {overallStats.totalStudents}
                </Text>
                <Text style={styles.summaryLabel}>Total Students</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {overallStats.totalSessions}
                </Text>
                <Text style={styles.summaryLabel}>Total Sessions</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {overallStats.avgSuccessRate}%
                </Text>
                <Text style={styles.summaryLabel}>Avg Success</Text>
              </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {filterOptions.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      selected={activeFilter === filter}
                      onPress={() => setActiveFilter(filter)}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Coaches List */}
            <View style={styles.coachesContainer}>
              {filteredCoaches.length > 0 ? (
                <FlatList
                  data={filteredCoaches}
                  renderItem={renderCoachCard}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
                />
              ) : (
                <View style={styles.emptyState}>
                  <BarChart3 color={theme.colors.textSecondary} size={48} />
                  <Text style={styles.emptyStateText}>
                    No coaches found for the selected filter.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
