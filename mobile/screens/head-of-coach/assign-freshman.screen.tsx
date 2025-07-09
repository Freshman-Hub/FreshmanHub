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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Users, CheckCircle, Circle, UserCheck } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Mock data for freshmen
const freshmenData = [
  {
    id: 1,
    name: "Emily Chen",
    email: "emily.chen@student.edu",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Computer Science",
    country: "Canada",
    assignedCoach: null,
    joinDate: "2025-07-01",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.johnson@student.edu",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Engineering",
    country: "USA",
    assignedCoach: "Sarah Johnson",
    joinDate: "2025-07-02",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    email: "sophia.martinez@student.edu",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Psychology",
    country: "Mexico",
    assignedCoach: null,
    joinDate: "2025-07-01",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@student.edu",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Business",
    country: "South Korea",
    assignedCoach: "David Wilson",
    joinDate: "2025-07-02",
  },
  {
    id: 5,
    name: "Isabella Rodriguez",
    email: "isabella.rodriguez@student.edu",
    avatar:
      "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Biology",
    country: "Spain",
    assignedCoach: null,
    joinDate: "2025-07-01",
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@student.edu",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Mathematics",
    country: "Egypt",
    assignedCoach: "Lisa Thompson",
    joinDate: "2025-07-01",
  },
  {
    id: 7,
    name: "Priya Patel",
    email: "priya.patel@student.edu",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Computer Science",
    country: "India",
    assignedCoach: null,
    joinDate: "2025-07-03",
  },
  {
    id: 8,
    name: "Jean-Luc Dubois",
    email: "jean.dubois@student.edu",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
    major: "Art History",
    country: "France",
    assignedCoach: null,
    joinDate: "2025-07-03",
  },
];

// Mock available coaches
const availableCoaches = [
  { id: 1, name: "Sarah Johnson", capacity: 2 },
  { id: 2, name: "David Wilson", capacity: 3 },
  { id: 3, name: "Lisa Thompson", capacity: 1 },
  { id: 4, name: "Alex Kim", capacity: 4 },
  { id: 5, name: "Maria Garcia", capacity: 2 },
];

const filterOptions = ["All", "Unassigned", "Assigned"];

export default function AssignFreshmanScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [freshmen, setFreshmen] = useState(freshmenData);
  const [selectedFreshmen, setSelectedFreshmen] = useState<number[]>([]);

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

  const filteredFreshmen = freshmen.filter((freshman) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unassigned") return !freshman.assignedCoach;
    if (activeFilter === "Assigned") return !!freshman.assignedCoach;
    return true;
  });

  const handleFreshmanSelect = (freshmanId: number) => {
    setSelectedFreshmen((prev) => {
      if (prev.includes(freshmanId)) {
        return prev.filter((id) => id !== freshmanId);
      } else {
        return [...prev, freshmanId];
      }
    });
  };

  const handleBulkAssign = () => {
    if (selectedFreshmen.length === 0) {
      Alert.alert(
        "No Selection",
        "Please select at least one freshman to assign."
      );
      return;
    }

    const selectedNames = freshmen
      .filter((f) => selectedFreshmen.includes(f.id))
      .map((f) => f.name)
      .join(", ");

    Alert.alert(
      "Assign Coach",
      `Select a coach for ${selectedFreshmen.length} student${selectedFreshmen.length > 1 ? "s" : ""}:\n${selectedNames}`,
      availableCoaches
        .map((coach) => ({
          text: `${coach.name} (${coach.capacity} slots available)`,
          onPress: () => {
            // Update freshmen with assigned coach
            const updatedFreshmen = freshmen.map((freshman) => {
              if (selectedFreshmen.includes(freshman.id)) {
                return { ...freshman, assignedCoach: coach.name };
              }
              return freshman;
            });
            setFreshmen(updatedFreshmen);
            setSelectedFreshmen([]);
            Alert.alert(
              "Assignment Successful! 🎉",
              `${selectedFreshmen.length} student${selectedFreshmen.length > 1 ? "s" : ""} assigned to ${coach.name}`
            );
          },
        }))
        .concat([{ text: "Cancel", style: "cancel" }])
    );
  };

  const handleSingleAssign = (freshman: any) => {
    Alert.alert(
      freshman.assignedCoach ? "Reassign Coach" : "Assign Coach",
      `Select a coach for ${freshman.name}${freshman.assignedCoach ? ` (currently assigned to ${freshman.assignedCoach})` : ""}`,
      availableCoaches
        .map((coach) => ({
          text: `${coach.name} (${coach.capacity} slots available)`,
          onPress: () => {
            const updatedFreshmen = freshmen.map((f) =>
              f.id === freshman.id ? { ...f, assignedCoach: coach.name } : f
            );
            setFreshmen(updatedFreshmen);
            Alert.alert(
              "Assignment Successful! 🎉",
              `${freshman.name} has been assigned to ${coach.name}`
            );
          },
        }))
        .concat([{ text: "Cancel", style: "cancel" }])
    );
  };

  const clearSelection = () => {
    setSelectedFreshmen([]);
  };

  const getStats = () => {
    const total = freshmen.length;
    const assigned = freshmen.filter((f) => f.assignedCoach).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  };

  const stats = getStats();

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
    controlsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    selectionControls: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    selectionText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    selectionButtons: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    freshmenContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    freshmanCardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    freshmanInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    freshmanName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 2,
    },
    freshmanDetails: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    freshmanCountry: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    assignedCoach: {
      ...theme.typography.captionSmall,
      color: theme.colors.success,
      fontWeight: "600",
      backgroundColor: theme.colors.success + "15",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-start",
      marginTop: theme.spacing.xs,
    },
    freshmanActions: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    selectionCircle: {
      padding: theme.spacing.xs,
    },
    assignButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    reassignButton: {
      backgroundColor: theme.colors.warning,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    buttonText: {
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

  const renderFreshmanCard = ({ item: freshman }: { item: any }) => {
    const isSelected = selectedFreshmen.includes(freshman.id);

    return (
      <Card
        style={{ marginBottom: theme.spacing.md }}
        content={
          <View style={styles.freshmanCardContent}>
            <Avatar
              imageUrl={freshman.avatar}
              initials={freshman.name.charAt(0)}
              size={45}
            />
            <View style={styles.freshmanInfo}>
              <Text style={styles.freshmanName}>{freshman.name}</Text>
              <Text style={styles.freshmanDetails}>{freshman.major}</Text>
              <Text style={styles.freshmanCountry}>🌍 {freshman.country}</Text>
              {freshman.assignedCoach && (
                <Text style={styles.assignedCoach}>
                  Coach: {freshman.assignedCoach}
                </Text>
              )}
            </View>
            <View style={styles.freshmanActions}>
              <TouchableOpacity
                style={styles.selectionCircle}
                onPress={() => handleFreshmanSelect(freshman.id)}
              >
                {isSelected ? (
                  <CheckCircle color={theme.colors.primary} size={24} />
                ) : (
                  <Circle color={theme.colors.border} size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  freshman.assignedCoach
                    ? styles.reassignButton
                    : styles.assignButton
                }
                onPress={() => handleSingleAssign(freshman)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {freshman.assignedCoach ? "Reassign" : "Assign"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    );
  };

  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Search for freshmen by name, major, or country...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFreshmen.filter(
            (freshman) =>
              freshman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              freshman.major
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              freshman.country.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          renderItem={renderFreshmanCard}
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
            placeholder="Search freshmen..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Assign Freshmen"
            showBack={true}
            showSearch={true}
            onSearchPress={handleSearchPress}
          />

          <View style={styles.content}>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{stats.total}</Text>
                <Text style={styles.summaryLabel}>Total Freshmen</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{stats.unassigned}</Text>
                <Text style={styles.summaryLabel}>Unassigned</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{stats.assigned}</Text>
                <Text style={styles.summaryLabel}>Assigned</Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
              {/* Filter Chips */}
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

              {/* Selection Controls */}
              {selectedFreshmen.length > 0 && (
                <View style={styles.selectionControls}>
                  <Text style={styles.selectionText}>
                    {selectedFreshmen.length} selected
                  </Text>
                  <View style={styles.selectionButtons}>
                    <Button
                      title="Clear"
                      onPress={clearSelection}
                      mode="text"
                    />
                    <Button
                      title="Assign Selected"
                      onPress={handleBulkAssign}
                      icon={UserCheck}
                      mode="contained"
                    />
                  </View>
                </View>
              )}
            </View>

            {/* Freshmen List */}
            <View style={styles.freshmenContainer}>
              {filteredFreshmen.length > 0 ? (
                <FlatList
                  data={filteredFreshmen}
                  renderItem={renderFreshmanCard}
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
                    No freshmen found for the selected filter.
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
