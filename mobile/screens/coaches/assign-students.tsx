"use client";

import { useState, useCallback, useEffect } from "react";
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
import {
  Users,
  CheckCircle,
  Circle,
  UserCheck,
  Zap,
  Shuffle,
  ArrowLeft,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { useUser } from "@/contexts/UserContext";

// Import services
import { UserService } from "@/services/user.service";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { FilterChip } from "@/components/ui/FilterChip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CoachPicker } from "@/components/ui/CoachPicker";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const filterOptions = ["All", "Unassigned", "Assigned"];

// TODO: Coach capacity might change - currently set to 15
const COACH_MAX_CAPACITY = 15;

export default function AssignFreshmanScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Real data from backend
  const [freshmen, setFreshmen] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedFreshmen, setSelectedFreshmen] = useState<string[]>([]);
  const [showCoachPicker, setShowCoachPicker] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"bulk" | "single">(
    "bulk"
  );
  const [currentFreshman, setCurrentFreshman] = useState<any>(null);

  // Load data from backend
  const loadAssignmentData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all users
      const { users, error: usersError } = await UserService.getAllUsers();
      if (usersError) {
        console.error("Error fetching users:", usersError);
        Alert.alert("Error", "Failed to load users. Please try again.");
        return;
      }

      // Process freshmen
      const freshmenData = users
        .filter((u) => u.role === "freshman")
        .map((freshman) => {
          // Find assigned coach name
          const assignedCoach = users.find(
            (coach) => coach.id === freshman.assignedCoach
          );

          return {
            id: freshman.id,
            name:
              `${freshman.firstName || ""} ${freshman.lastName || ""}`.trim() ||
              freshman.email?.split("@")[0] ||
              "Unknown",
            email: freshman.email,
            avatar: freshman.profileImage,
            major: freshman.major || "Undeclared",
            country: freshman.country || "Unknown",
            assignedCoach: assignedCoach
              ? `${assignedCoach.firstName} ${assignedCoach.lastName}`.trim()
              : null,
            assignedCoachId: freshman.assignedCoach || null,
            joinDate:
              freshman.createdAt?.toDate()?.toISOString().split("T")[0] ||
              "2025-07-01",
            yearGroup: freshman.yearGroup || "Freshman",
            gender: freshman.gender || "Unknown",
            phoneNumber: freshman.phoneNumber,
            studentId: freshman.studentId,
            // Mock GPA and needs support for now - can be added to user schema later
            gpa: Math.random() * 1.5 + 2.5, // 2.5-4.0
            needsSupport: ["Academic", "Time Management"], // Mock data for now
          };
        });

      // Process coaches with capacity tracking
      const coachesData = users
        .filter((u) => u.role === "peer_coach" && u.isActive)
        .map((coach) => {
          // Count assigned students
          const assignedStudents = users.filter(
            (student) =>
              student.role === "freshman" && student.assignedCoach === coach.id
          );

          return {
            id: coach.id,
            name:
              `${coach.firstName || ""} ${coach.lastName || ""}`.trim() ||
              coach.email?.split("@")[0] ||
              "Unknown",
            capacity: COACH_MAX_CAPACITY,
            currentStudents: assignedStudents.length,
            avatar: coach.profileImage,
            email: coach.email,
            year: coach.yearGroup || "N/A",
            major: coach.major || "N/A",
            department: coach.department,
            // Mock rating and specialties for now
            rating: Math.random() * 0.5 + 4.5, // 4.5-5.0
            specialties: [
              "Academic Support",
              "Career Guidance",
              "Personal Development",
            ], // Mock
          };
        });

      setFreshmen(freshmenData);
      setCoaches(coachesData);
       setDataLoaded(true);
    } catch (error) {
      console.error("Error loading assignment data:", error);
      Alert.alert("Error", "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (!dataLoaded) {
      loadAssignmentData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDataLoaded(false);
    await loadAssignmentData();
    setRefreshing(false);
  }, [loadAssignmentData]);

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
    const matchesSearch =
      searchQuery === "" ||
      freshman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freshman.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freshman.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freshman.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = (() => {
      switch (activeFilter) {
        case "All":
          return true;
        case "Unassigned":
          return !freshman.assignedCoachId;
        case "Assigned":
          return !!freshman.assignedCoachId;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  const handleFreshmanSelect = (freshmanId: string) => {
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
    setAssignmentType("bulk");
    setShowCoachPicker(true);
  };

  const handleSingleAssign = (freshman: any) => {
    setCurrentFreshman(freshman);
    setAssignmentType("single");
    setShowCoachPicker(true);
  };

  const handleCoachSelect = async (coach: any) => {
    try {
      if (assignmentType === "bulk") {
        // Check if coach has capacity for all selected students
        const availableSlots = coach.capacity - coach.currentStudents;
        if (selectedFreshmen.length > availableSlots) {
          Alert.alert(
            "Insufficient Capacity",
            `${coach.name} only has ${availableSlots} available slots, but you selected ${selectedFreshmen.length} students.`
          );
          return;
        }

        // Bulk assignment
        let successCount = 0;
        let errorCount = 0;

        for (const freshmanId of selectedFreshmen) {
          const { error } = await UserService.updateUser(
            freshmanId,
            { assignedCoach: coach.id },
            user?.id || ""
          );

          if (error) {
            errorCount++;
            console.error(`Error assigning student ${freshmanId}:`, error);
          } else {
            successCount++;
          }
        }

        // Update local state
        const updatedFreshmen = freshmen.map((freshman: any) => {
          if (selectedFreshmen.includes(freshman.id)) {
            return {
              ...freshman,
              assignedCoach: coach.name,
              assignedCoachId: coach.id,
            };
          }
          return freshman;
        });
        setFreshmen(updatedFreshmen);
        setSelectedFreshmen([]);

        if (errorCount === 0) {
          Alert.alert(
            "Assignment Successful! 🎉",
            `${successCount} student${successCount > 1 ? "s" : ""} assigned to ${coach.name}`
          );
        } else {
          Alert.alert(
            "Partial Success",
            `${successCount} students assigned successfully. ${errorCount} assignments failed.`
          );
        }
      } else {
        // Single assignment - check capacity
        if (coach.currentStudents >= coach.capacity) {
          Alert.alert(
            "Coach at Capacity",
            `${coach.name} already has ${coach.capacity} students assigned.`
          );
          return;
        }

        // Single assignment
        const { error } = await UserService.updateUser(
          currentFreshman.id,
          { assignedCoach: coach.id },
          user?.id || ""
        );

        if (error) {
          Alert.alert("Error", "Failed to assign student. Please try again.");
          console.error("Assignment error:", error);
          return;
        }

        // Update local state
        const updatedFreshmen = freshmen.map((f) =>
          f.id === currentFreshman.id
            ? { ...f, assignedCoach: coach.name, assignedCoachId: coach.id }
            : f
        );
        setFreshmen(updatedFreshmen);

        Alert.alert(
          "Assignment Successful! 🎉",
          `${currentFreshman.name} has been assigned to ${coach.name}`
        );
      }

      // Refresh data to get updated counts
      await loadAssignmentData();
    } catch (error) {
      console.error("Assignment error:", error);
      Alert.alert("Error", "Failed to assign student(s). Please try again.");
    }

    setShowCoachPicker(false);
    setCurrentFreshman(null);
  };

  const handleAutoAssign = () => {
    // TODO: Implement smart auto-assignment algorithm
    console.log("Auto Assignment requested");
    Alert.alert(
      "Auto Assignment",
      "Automatically assign unassigned students based on coach capacity and availability?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Assign",
          onPress: () => {
            console.log("Auto assignment logic would run here");
            Alert.alert(
              "Feature Coming Soon",
              "Auto assignment will be implemented in a future update."
            );
          },
        },
      ]
    );
  };

  const handleSmartMatch = () => {
    // TODO: Implement AI-powered smart matching
    console.log("Smart Match requested");
    Alert.alert(
      "Smart Match",
      "This feature will use AI to match students with coaches based on compatibility, needs, and specialties."
    );
  };

  const clearSelection = () => {
    setSelectedFreshmen([]);
  };

  const getStats = () => {
    const total = freshmen.length;
    const assigned = freshmen.filter((f) => f.assignedCoachId).length;
    const unassigned = total - assigned;
    return { total, assigned, unassigned };
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return theme.colors.success;
    if (gpa >= 3.0) return theme.colors.warning;
    return theme.colors.error;
  };

  // Filter coaches to show only those with available capacity
  const availableCoaches = coaches.map((coach) => ({
    ...coach,
    availableSlots: coach.capacity - coach.currentStudents,
  }));

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
    quickActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    quickActionButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    quickActionText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    filterRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    selectionControls: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.borderRadius.lg,
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
    freshmanMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    freshmanCountry: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    gpaText: {
      ...theme.typography.bodySmall,
      fontWeight: "700",
    },
    supportTags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    supportTag: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    supportTagText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
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
      fontWeight: "500",
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
      fontWeight: "500",
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
              <View style={styles.freshmanMeta}>
                <Text style={styles.freshmanCountry}>
                  🌍 {freshman.country}
                </Text>
                <Text
                  style={[styles.gpaText, { color: getGPAColor(freshman.gpa) }]}
                >
                  GPA: {freshman.gpa.toFixed(1)}
                </Text>
              </View>
              {freshman.needsSupport && freshman.needsSupport.length > 0 && (
                <View style={styles.supportTags}>
                  {freshman.needsSupport
                    .slice(0, 2)
                    .map((support: string, index: number) => (
                      <View key={index} style={styles.supportTag}>
                        <Text style={styles.supportTagText}>{support}</Text>
                      </View>
                    ))}
                  {freshman.needsSupport.length > 2 && (
                    <View style={styles.supportTag}>
                      <Text style={styles.supportTagText}>
                        +{freshman.needsSupport.length - 2}
                      </Text>
                    </View>
                  )}
                </View>
              )}
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
                  freshman.assignedCoachId
                    ? styles.reassignButton
                    : styles.assignButton
                }
                onPress={() => handleSingleAssign(freshman)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {freshman.assignedCoachId ? "Reassign" : "Assign"}
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
          data={filteredFreshmen}
          renderItem={renderFreshmanCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        />
      )}
    </View>
  );

  const getPickerTitle = () => {
    if (assignmentType === "bulk") {
      return "Select Coach for Students";
    }
    return currentFreshman?.assignedCoachId ? "Reassign Coach" : "Assign Coach";
  };

  const getPickerSubtitle = () => {
    if (assignmentType === "bulk") {
      const selectedNames = freshmen
        .filter((f) => selectedFreshmen.includes(f.id))
        .map((f) => f.name)
        .join(", ");
      return `Assigning ${selectedFreshmen.length} student${selectedFreshmen.length > 1 ? "s" : ""}: ${selectedNames}`;
    }
    return currentFreshman ? `Student: ${currentFreshman.name}` : "";
  };

  // Show loading spinner when loading
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header title="Assign Freshmen" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
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
            leftIcon={ArrowLeft}
            onLeftPress={() => router.back()}
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
              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={handleAutoAssign}
                >
                  <Zap color={theme.colors.primary} size={20} />
                  <Text style={styles.quickActionText}>Auto Assign</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={handleSmartMatch}
                >
                  <Shuffle color={theme.colors.textSecondary} size={20} />
                  <Text style={styles.quickActionText}>Smart Match</Text>
                </TouchableOpacity>
              </View>

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

      {/* Coach Picker Modal */}
      <CoachPicker
        visible={showCoachPicker}
        coaches={availableCoaches}
        onSelect={handleCoachSelect}
        onCancel={() => {
          setShowCoachPicker(false);
          setCurrentFreshman(null);
        }}
        title={getPickerTitle()}
        subtitle={getPickerSubtitle()}
      />
    </SafeAreaView>
  );
}
