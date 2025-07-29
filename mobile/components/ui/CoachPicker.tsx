"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Check, X, Users, Star } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";

interface Coach {
  id: number;
  name: string;
  capacity: number;
  avatar?: string;
  rating?: number;
  country?: string; // Add country property
  major?: string; // Keep major for display
  currentStudents?: number;
  availableSlots?: number;
}

interface CoachPickerProps {
  visible: boolean;
  coaches: Coach[];
  selectedCoach?: Coach | null;
  onSelect: (coach: Coach) => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  loading?: boolean; // Add loading prop
}

export function CoachPicker({
  visible,
  coaches,
  selectedCoach,
  onSelect,
  onCancel,
  title = "Select a Coach",
  subtitle,
  loading = false, // Default to false
}: CoachPickerProps) {
  const { theme } = useTheme();
  const [tempSelected, setTempSelected] = useState<Coach | null>(
    selectedCoach || null
  );

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
      maxHeight: "80%",
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
    },
    coachList: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    coachItem: {
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
    selectedCoachItem: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    coachInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    coachName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    coachDetails: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    capacityText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    ratingText: {
      ...theme.typography.bodySmall,
      color: theme.colors.warning,
      fontWeight: "600",
    },
    coachMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    countryText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    majorText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
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
    assignButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.sm,
    },
    assignButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    assignButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
    assignButtonTextDisabled: {
      color: theme.colors.textSecondary,
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
      fontWeight: "500",
    },
  });

  const handleConfirm = () => {
    if (tempSelected && !loading) {
      onSelect(tempSelected);
    }
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return theme.colors.error;
    if (percentage >= 70) return theme.colors.warning;
    return theme.colors.success;
  };

  const renderCoachItem = ({ item: coach }: { item: Coach }) => {
    const isSelected = tempSelected?.id === coach.id;
    const currentStudents = coach.currentStudents || 0;
    const availableSlots =
      coach.availableSlots || coach.capacity - currentStudents;

    return (
      <TouchableOpacity
        style={[styles.coachItem, isSelected && styles.selectedCoachItem]}
        onPress={() => setTempSelected(coach)}
        activeOpacity={0.8}
        disabled={availableSlots <= 0 || loading} // Disable during loading
      >
        <Avatar
          imageUrl={coach.avatar}
          initials={coach.name.charAt(0)}
          size={45}
        />

        <View style={styles.coachInfo}>
          <Text style={styles.coachName}>{coach.name}</Text>

          <View style={styles.coachDetails}>
            <Text
              style={[
                styles.capacityText,
                {
                  color:
                    availableSlots <= 0
                      ? theme.colors.error
                      : getCapacityColor(currentStudents, coach.capacity),
                },
              ]}
            >
              {availableSlots > 0
                ? `${availableSlots} slots available`
                : "No slots available"}
            </Text>

            {coach.rating && (
              <View style={styles.ratingContainer}>
                <Star
                  color={theme.colors.warning}
                  size={12}
                  fill={theme.colors.warning}
                />
                <Text style={styles.ratingText}>{coach.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* Replace specialties with country and major */}
          <View style={styles.coachMeta}>
            {coach.country && (
              <Text style={styles.countryText}>🌍 {coach.country}</Text>
            )}
            {coach.major && <Text style={styles.majorText}>{coach.major}</Text>}
          </View>
        </View>

        <View style={styles.checkIcon}>
          {isSelected && <Check color={theme.colors.primary} size={24} />}
          {availableSlots <= 0 && (
            <Text style={{ color: theme.colors.error, fontSize: 12 }}>
              Full
            </Text>
          )}
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
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onCancel}
                disabled={loading} // Disable close during loading
              >
                <X color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {/* Coach List */}
          {coaches.length > 0 ? (
            <FlatList
              data={coaches}
              renderItem={renderCoachItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.coachList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: theme.spacing.lg }}
              scrollEnabled={!loading} // Disable scrolling during loading
            />
          ) : (
            <View style={styles.emptyState}>
              <Users color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyText}>
                No coaches available at the moment
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            {/* Custom Assign Button with Loading Spinner */}
            <TouchableOpacity
              style={[
                styles.assignButton,
                (!tempSelected || loading) && styles.assignButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!tempSelected || loading}
              activeOpacity={0.8}
            >
              {loading && <LoadingSpinner size="small" color="white" />}
              <Text
                style={[
                  styles.assignButtonText,
                  (!tempSelected || loading) && styles.assignButtonTextDisabled,
                ]}
              >
                {loading
                  ? "Assigning..."
                  : tempSelected
                    ? `Assign to ${tempSelected.name}`
                    : "Select a Coach"}
              </Text>
            </TouchableOpacity>

            <Button
              title="Cancel"
              onPress={onCancel}
              mode="text"
              disabled={loading} // Disable cancel during loading
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
