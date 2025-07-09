"use client";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  booked?: boolean;
}

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlots?: string[];
  onSlotSelect?: (slotId: string) => void;
  onMultipleSelect?: (slotIds: string[]) => void;
  mode?: "single" | "multiple";
  title?: string;
}

export function TimeSlotPicker({
  timeSlots,
  selectedSlots = [],
  onSlotSelect,
  onMultipleSelect,
  mode = "single",
  title = "Available Time Slots",
}: TimeSlotPickerProps) {
  const { theme } = useTheme();

  const handleSlotPress = (slotId: string) => {
    const slot = timeSlots.find((s) => s.id === slotId);
    if (!slot?.available || slot.booked) return;

    if (mode === "single") {
      onSlotSelect?.(slotId);
    } else {
      const newSelectedSlots = selectedSlots.includes(slotId)
        ? selectedSlots.filter((id) => id !== slotId)
        : [...selectedSlots, slotId];
      onMultipleSelect?.(newSelectedSlots);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginLeft: theme.spacing.sm,
    },
    slotsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    timeSlot: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
      minWidth: 80,
      alignItems: "center",
    },
    availableSlot: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.success,
    },
    selectedSlot: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    bookedSlot: {
      backgroundColor: theme.colors.warning + "20",
      borderColor: theme.colors.warning,
      opacity: 0.6,
    },
    unavailableSlot: {
      opacity: 0.4,
    },
    slotText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    availableSlotText: {
      color: theme.colors.success,
    },
    selectedSlotText: {
      color: "white",
      fontWeight: "700",
    },
    bookedSlotText: {
      color: theme.colors.warning,
    },
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    legendText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock color={theme.colors.primary} size={20} />
        <Text style={styles.title}>{title}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.slotsGrid}>
          {timeSlots.map((slot) => {
            const isSelected = selectedSlots.includes(slot.id);
            const isBooked = slot.booked;
            const isAvailable = slot.available && !isBooked;

            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.timeSlot,
                  isAvailable && styles.availableSlot,
                  isSelected && styles.selectedSlot,
                  isBooked && styles.bookedSlot,
                  !slot.available && styles.unavailableSlot,
                ]}
                onPress={() => handleSlotPress(slot.id)}
                disabled={!isAvailable}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.slotText,
                    isAvailable && styles.availableSlotText,
                    isSelected && styles.selectedSlotText,
                    isBooked && styles.bookedSlotText,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: theme.colors.success },
            ]}
          />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: theme.colors.primary },
            ]}
          />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              { backgroundColor: theme.colors.warning },
            ]}
          />
          <Text style={styles.legendText}>Booked</Text>
        </View>
      </View>
    </View>
  );
}
