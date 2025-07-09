"use client";

import { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar as CalendarIcon, Save, RotateCcw } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { WeeklyCalendar } from "@/components/ui/WeeklyCalendar";
import { Button } from "@/components/ui/Button";

interface TimeSlot {
  date: string; // YYYY-MM-DD format
  hour: number; // 7-22
  available?: boolean;
  booked?: boolean;
  selected?: boolean;
}

export default function SetAvailabilityScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSlotPress = (date: string, hour: number) => {
    const existingSlotIndex = selectedSlots.findIndex(
      (slot) => slot.date === date && slot.hour === hour
    );

    if (existingSlotIndex >= 0) {
      // Remove slot if already selected
      const newSlots = selectedSlots.filter(
        (_, index) => index !== existingSlotIndex
      );
      setSelectedSlots(newSlots);
    } else {
      // Add new slot
      const newSlot: TimeSlot = { date, hour, available: true, selected: true };
      setSelectedSlots([...selectedSlots, newSlot]);
    }
  };

  const handleSaveAvailability = useCallback(async () => {
    if (selectedSlots.length === 0) {
      Alert.alert(
        "No Availability Set",
        "Please select at least one time slot to set your availability."
      );
      return;
    }

    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        "Availability Saved! ✅",
        `You've set availability for ${selectedSlots.length} time slots across multiple weeks.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  }, [selectedSlots, router]);

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Availability",
      "Are you sure you want to clear all selected time slots?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => setSelectedSlots([]),
        },
      ]
    );
  };

  const getSelectedSlotsText = () => {
    if (selectedSlots.length === 0) return "No time slots selected";
    if (selectedSlots.length === 1) return "1 time slot selected";
    return `${selectedSlots.length} time slots selected`;
  };

  const getSelectedDaysCount = () => {
    const uniqueDates = new Set(selectedSlots.map((slot) => slot.date));
    return uniqueDates.size;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    instructionCard: {
      backgroundColor: theme.colors.primary + "10",
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    instructionTitle: {
      ...theme.typography.h6,
      color: theme.colors.primary,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    instructionText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "500",
      textAlign: "center",
      lineHeight: 22,
    },
    calendarSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    sectionIcon: {
      marginRight: theme.spacing.sm,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryLeft: {
      flex: 1,
    },
    summaryNumber: {
      ...theme.typography.h4,
      color: theme.colors.primary,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    summaryText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    summaryRight: {
      alignItems: "flex-end",
    },
    summaryDays: {
      ...theme.typography.h5,
      color: theme.colors.success,
      fontWeight: "700",
      marginBottom: 2,
    },
    summaryDaysText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    actionButtons: {
      gap: theme.spacing.md,
    },
    buttonRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header title="Set Your Availability" showBack={true} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Instructions */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to Set Availability</Text>
          <Text style={styles.instructionText}>
            Tap any time slot to make yourself available. The entire slot will
            turn green. Navigate between weeks to set availability for future
            dates. Tap again to remove.
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryNumber}>{selectedSlots.length}</Text>
              <Text style={styles.summaryText}>{getSelectedSlotsText()}</Text>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.summaryDays}>{getSelectedDaysCount()}</Text>
              <Text style={styles.summaryDaysText}>days covered</Text>
            </View>
          </View>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.calendarSection}>
          <View style={styles.sectionTitle}>
            <CalendarIcon
              color={theme.colors.primary}
              size={20}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              Weekly Schedule (7 AM - 10 PM)
            </Text>
          </View>
          <WeeklyCalendar
            selectedSlots={selectedSlots}
            onSlotPress={handleSlotPress}
            mode="availability"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Save Availability"
            onPress={handleSaveAvailability}
            icon={Save}
            loading={saving}
            disabled={selectedSlots.length === 0}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Clear All"
              onPress={handleClearAll}
              icon={RotateCcw}
              mode="outlined"
              disabled={selectedSlots.length === 0}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
