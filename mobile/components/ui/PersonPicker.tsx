"use client";

import { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Check,
  X,
  Search,
  Users,
  User,
  GraduationCap,
  UserCheck,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { FilterChip } from "./FilterChip";

interface Person {
  id: number;
  name: string;
  avatar?: string;
  role?: string;
  year?: string;
  major?: string;
  specialties?: string[];
  rating?: number;
  capacity?: number;
  currentStudents?: number;
  coachId?: number; // For students assigned to coaches
  email?: string;
  phone?: string;
}

interface PersonPickerProps {
  visible: boolean;
  people: Person[];
  selectedPeople?: Person[];
  onSelect: (people: Person[]) => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  type: "coach" | "student" | "all";
  allowSelectAll?: boolean;
  showCoachFilter?: boolean; // For students - filter by coach
  multiSelect?: boolean;
}

export function PersonPicker({
  visible,
  people,
  selectedPeople = [],
  onSelect,
  onCancel,
  title = "Select People",
  subtitle,
  type,
  allowSelectAll = false,
  showCoachFilter = false,
  multiSelect = true,
}: PersonPickerProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoachFilter, setSelectedCoachFilter] = useState<number | null>(
    null
  );
  const [tempSelected, setTempSelected] = useState<Person[]>(selectedPeople);

  // Get unique coaches for filter (when showing students)
  const coaches = useMemo(() => {
    if (type !== "student" || !showCoachFilter) return [];
    const coachIds = [...new Set(people.map((p) => p.coachId).filter(Boolean))];
    return people.filter((p) => p.role === "coach" || coachIds.includes(p.id));
  }, [people, type, showCoachFilter]);

  // Filter people based on search and coach filter
  const filteredPeople = useMemo(() => {
    let filtered = people;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (person) =>
          person.name.toLowerCase().includes(query) ||
          person.role?.toLowerCase().includes(query) ||
          person.major?.toLowerCase().includes(query) ||
          person.specialties?.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Apply coach filter for students
    if (type === "student" && selectedCoachFilter) {
      filtered = filtered.filter(
        (person) => person.coachId === selectedCoachFilter
      );
    }

    return filtered;
  }, [people, searchQuery, selectedCoachFilter, type]);

  const handlePersonToggle = (person: Person) => {
    if (!multiSelect) {
      setTempSelected([person]);
      return;
    }

    const isSelected = tempSelected.some((p) => p.id === person.id);
    if (isSelected) {
      setTempSelected(tempSelected.filter((p) => p.id !== person.id));
    } else {
      setTempSelected([...tempSelected, person]);
    }
  };

  const handleSelectAll = () => {
    if (tempSelected.length === filteredPeople.length) {
      setTempSelected([]);
    } else {
      setTempSelected(filteredPeople);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
  };

  const handleRemoveSelected = (personId: number) => {
    setTempSelected(tempSelected.filter((p) => p.id !== personId));
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: "90%",
      paddingTop: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.md,
    },
    selectedContainer: {
      marginBottom: theme.spacing.md,
    },
    selectedHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    selectedCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "700",
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
    },
    clearAllButton: {
      ...theme.typography.bodySmall,
      color: theme.colors.error,
      fontWeight: "600",
    },
    selectedPeopleScroll: {
      maxHeight: 80,
    },
    selectedPeopleContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    selectedPersonChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.xxxl,
      paddingLeft: theme.spacing.xs,
      paddingRight: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    selectedPersonName: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
      marginRight: theme.spacing.xs,
    },
    removeButton: {
      padding: 2,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
      marginLeft: theme.spacing.sm,
    },
    filterContainer: {
      marginBottom: theme.spacing.md,
    },
    filterLabel: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    filterChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    selectAllButton: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    selectAllText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.sm,
    },
    personList: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    personItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: "transparent",
    },
    selectedPersonItem: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    personInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    personName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    personDetails: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    personRole: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    ratingText: {
      ...theme.typography.bodySmall,
      color: theme.colors.warning,
      fontWeight: "600",
    },
    specialties: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.xs,
    },
    specialtyTag: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    specialtyText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    checkIcon: {
      marginLeft: theme.spacing.md,
    },
    footer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
    resultCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
  });

  const renderPersonItem = ({ item: person }: { item: Person }) => {
    const isSelected = tempSelected.some((p) => p.id === person.id);
    return (
      <TouchableOpacity
        style={[styles.personItem, isSelected && styles.selectedPersonItem]}
        onPress={() => handlePersonToggle(person)}
        activeOpacity={0.8}
      >
        <Avatar
          imageUrl={person.avatar}
          initials={person.name.charAt(0)}
          size={45}
        />
        <View style={styles.personInfo}>
          <Text style={styles.personName}>{person.name}</Text>
          <View style={styles.personDetails}>
            <Text style={styles.personRole}>
              {type === "student"
                ? `${person.year} • ${person.major}`
                : person.role}
            </Text>
            {person.rating && (
              <Text style={styles.ratingText}>
                ★ {person.rating.toFixed(1)}
              </Text>
            )}
          </View>
          {person.specialties && person.specialties.length > 0 && (
            <View style={styles.specialties}>
              {person.specialties.slice(0, 2).map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
              {person.specialties.length > 2 && (
                <View style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>
                    +{person.specialties.length - 2}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={styles.checkIcon}>
          {isSelected && <Check color={theme.colors.primary} size={24} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
                <X color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

            {/* Selected People */}
            {multiSelect && tempSelected.length > 0 && (
              <View style={styles.selectedContainer}>
                <View style={styles.selectedHeader}>
                  <Text style={styles.selectedCount}>
                    {tempSelected.length} selected
                  </Text>
                  <TouchableOpacity onPress={() => setTempSelected([])}>
                    <Text style={styles.clearAllButton}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.selectedPeopleScroll}
                >
                  <View style={styles.selectedPeopleContainer}>
                    {tempSelected.map((person) => (
                      <View key={person.id} style={styles.selectedPersonChip}>
                        <Avatar
                          imageUrl={person.avatar}
                          initials={person.name.charAt(0)}
                          size={24}
                        />
                        <Text style={styles.selectedPersonName}>
                          {person.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveSelected(person.id)}
                        >
                          <X color={theme.colors.primary} size={16} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Search */}
            <View style={styles.searchContainer}>
              <Search color={theme.colors.textSecondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${type === "all" ? "people" : type + "s"}...`}
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>

            {/* Coach Filter for Students */}
            {type === "student" && showCoachFilter && coaches.length > 0 && (
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Coach:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    <FilterChip
                      label="All Coaches"
                      selected={selectedCoachFilter === null}
                      onPress={() => setSelectedCoachFilter(null)}
                    />
                    {coaches.map((coach) => (
                      <FilterChip
                        key={coach.id}
                        label={coach.name}
                        selected={selectedCoachFilter === coach.id}
                        onPress={() => setSelectedCoachFilter(coach.id)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Select All Option */}
            {allowSelectAll && multiSelect && (
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={handleSelectAll}
              >
                <Users color={theme.colors.primary} size={20} />
                <Text style={styles.selectAllText}>
                  {tempSelected.length === filteredPeople.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Result Count */}
            <Text style={styles.resultCount}>
              {filteredPeople.length} {type === "all" ? "people" : type + "(s)"}{" "}
              found
            </Text>
          </View>

          {/* Person List */}
          {filteredPeople.length > 0 ? (
            <FlatList
              data={filteredPeople}
              renderItem={renderPersonItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.personList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.emptyState}>
              {type === "coach" ? (
                <Users color={theme.colors.textSecondary} size={48} />
              ) : type === "student" ? (
                <GraduationCap color={theme.colors.textSecondary} size={48} />
              ) : (
                <UserCheck color={theme.colors.textSecondary} size={48} />
              )}
              <Text style={styles.emptyText}>
                {searchQuery.trim()
                  ? `No ${type === "all" ? "people" : type + "s"} found matching "${searchQuery}"`
                  : `No ${type === "all" ? "people" : type + "s"} available`}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Button
              title={
                multiSelect
                  ? tempSelected.length > 0
                    ? `Select ${tempSelected.length} ${tempSelected.length === 1 ? "person" : "people"}`
                    : `Select ${type === "all" ? "people" : type + "s"}`
                  : tempSelected.length > 0
                    ? `Select ${tempSelected[0].name}`
                    : `Select a ${type === "all" ? "person" : type}`
              }
              onPress={handleConfirm}
              disabled={tempSelected.length === 0}
              mode="contained"
            />
            <Button title="Cancel" onPress={onCancel} mode="text" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
