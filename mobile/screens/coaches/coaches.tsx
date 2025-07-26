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
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { CoachOptionsMenu } from "@/components/ui/CoachOptionsMenu";

// Mock data for peer coaches
const coachesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@student.edu",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "active",
    year: "Junior",
    major: "Computer Science",
    studentsCount: 5,
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "David Wilson",
    email: "david.wilson@student.edu",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "busy",
    year: "Senior",
    major: "Psychology",
    studentsCount: 4,
    lastActive: "In session",
  },
  {
    id: 3,
    name: "Lisa Thompson",
    email: "lisa.thompson@student.edu",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "active",
    year: "Sophomore",
    major: "Business",
    studentsCount: 6,
    lastActive: "5 min ago",
  },
  {
    id: 4,
    name: "Alex Kim",
    email: "alex.kim@student.edu",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "offline",
    year: "Junior",
    major: "Engineering",
    studentsCount: 3,
    lastActive: "2 hours ago",
  },
  {
    id: 5,
    name: "Maria Garcia",
    email: "maria.garcia@student.edu",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "active",
    year: "Senior",
    major: "Education",
    studentsCount: 7,
    lastActive: "1 min ago",
  },
];

const filterOptions = ["All", "Available", "Busy", "Offline"];

export default function ViewCoachesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [coaches, setCoaches] = useState(coachesData);

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

  const filteredCoaches = coaches.filter((coach) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Available") return coach.status === "active";
    if (activeFilter === "Busy") return coach.status === "busy";
    if (activeFilter === "Offline") return coach.status === "offline";
    return true;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle color={theme.colors.success} size={14} />;
      case "busy":
        return <Clock color={theme.colors.warning} size={14} />;
      case "offline":
        return <AlertCircle color={theme.colors.textSecondary} size={14} />;
      default:
        return <AlertCircle color={theme.colors.textSecondary} size={14} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Available";
      case "busy":
        return "In Session";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

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
      flexDirection: "row",
      alignItems: "center",
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
    coachDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    coachStatus: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    coachStatusText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    studentsCount: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    coachActions: {
      alignItems: "flex-end",
      gap: theme.spacing.sm,
    },
    viewCoachButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    viewCoachButtonText: {
      ...theme.typography.bodySmall,
      color: "white",
      fontWeight: "600",
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

  const handleCoachAction = (action: string, coach: any) => {
    switch (action) {
      case "assign":
        router.push(`/assign-students?coachId=${coach.id}`);
        break;
      case "call":
        console.log("Calling", coach.name);
        break;
      case "message":
        console.log("Messaging", coach.name);
        break;
      case "email":
        console.log("Emailing", coach.email);
        break;
      case "schedule":
        router.push(`/schedule-session?coachId=${coach.id}`);
        break;
      case "profile":
        router.push(`/coach-profile/${coach.id}`);
        break;
      default:
        console.log("Action:", action, "for", coach.name);
    }
  };

  const renderCoachCard = ({ item: coach }: { item: any }) => (
    <Card
      style={{ marginBottom: theme.spacing.md }}
      content={
        <View style={styles.coachCardContent}>
          <Avatar
            imageUrl={coach.avatar}
            initials={coach.name.charAt(0)}
            size={45}
          />
          <View style={styles.coachInfo}>
            <Text style={styles.coachName}>{coach.name}</Text>
            <Text style={styles.coachDetails}>
              {coach.year} • {coach.major}
            </Text>
            <View style={styles.coachStatus}>
              {getStatusIcon(coach.status)}
              <Text
                style={[
                  styles.coachStatusText,
                  { color: getStatusColor(coach.status) },
                ]}
              >
                {getStatusText(coach.status)}
              </Text>
            </View>
            <Text style={styles.studentsCount}>
              {coach.studentsCount} students
            </Text>
          </View>
          <View style={styles.coachActions}>
            <TouchableOpacity
              style={styles.viewCoachButton}
              onPress={() => handleCoachAction("profile", coach)}
              activeOpacity={0.8}
            >
              <Eye color="white" size={16} />
              <Text style={styles.viewCoachButtonText}>View Coach</Text>
            </TouchableOpacity>
            <CoachOptionsMenu
              coach={coach}
              onAssignFreshman={(coach) => handleCoachAction("assign", coach)}
              onCall={(coach) => handleCoachAction("call", coach)}
              onMessage={(coach) => handleCoachAction("message", coach)}
              onEmail={(coach) => handleCoachAction("email", coach)}
              onSchedule={(coach) => handleCoachAction("schedule", coach)}
              onViewProfile={(coach) => handleCoachAction("profile", coach)}
            />
          </View>
        </View>
      }
    />
  );

  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Search for peer coaches by name or major...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoaches.filter(
            (coach) =>
              coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coach.major.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Search peer coaches..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Peer Coaches"
            showSearch={true}
            onSearchPress={handleSearchPress}
            rightComponent={
              <TouchableOpacity onPress={() => router.push("/add-coach")}>
                <UserPlus color={theme.colors.primary} size={24} />
              </TouchableOpacity>
            }
          />

          <View style={styles.content}>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>5</Text>
                <Text style={styles.summaryLabel}>Total Coaches</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>3</Text>
                <Text style={styles.summaryLabel}>Available</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>25</Text>
                <Text style={styles.summaryLabel}>Students Helped</Text>
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
                  <Users color={theme.colors.textSecondary} size={48} />
                  <Text style={styles.emptyStateText}>
                    No peer coaches found for the selected filter.
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
