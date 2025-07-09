"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface TimeSlot {
  date: string; // YYYY-MM-DD format
  hour: number; // 7-22
  available?: boolean;
  booked?: boolean;
  selected?: boolean;
}

interface WeeklyCalendarProps {
  selectedSlots?: TimeSlot[];
  onSlotPress?: (date: string, hour: number) => void;
  mode?: "availability" | "booking";
  bookedSlots?: TimeSlot[];
  availableSlots?: TimeSlot[];
}

export function WeeklyCalendar({
  selectedSlots = [],
  onSlotPress,
  mode = "availability",
  bookedSlots = [],
  availableSlots = [],
}: WeeklyCalendarProps) {
  const { theme } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get the start of the current week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM (22)

  const formatHour = (hour: number) => {
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} PM`;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const getSlotState = (date: string, hour: number) => {
    const isSelected = selectedSlots.some(
      (slot) => slot.date === date && slot.hour === hour
    );
    const isBooked = bookedSlots.some(
      (slot) => slot.date === date && slot.hour === hour
    );
    const isAvailable = availableSlots.some(
      (slot) => slot.date === date && slot.hour === hour
    );

    if (mode === "availability") {
      return {
        available: isSelected,
        selected: isSelected,
        booked: false,
      };
    } else {
      return {
        available: isAvailable && !isBooked,
        selected: isSelected,
        booked: isBooked,
      };
    }
  };

  const handleSlotPress = (date: string, hour: number) => {
    const slotDate = new Date(
      date + "T" + hour.toString().padStart(2, "0") + ":00:00"
    );
    const now = new Date();

    // Don't allow booking in the past
    if (slotDate < now) return;

    onSlotPress?.(date, hour);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    if (direction === "prev") {
      newWeek.setDate(currentWeek.getDate() - 7);
    } else {
      newWeek.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newWeek);
  };

  const jumpToDate = () => {
    Alert.prompt(
      "Jump to Date",
      "Enter date in YYYY-MM-DD format (e.g., 2027-03-15)",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Go",
          onPress: (dateString) => {
            if (dateString && dateString.trim()) {
              const trimmedDate = dateString.trim();
              // Validate format YYYY-MM-DD
              const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
              if (dateRegex.test(trimmedDate)) {
                const date = new Date(trimmedDate + "T12:00:00");
                if (!isNaN(date.getTime())) {
                  setCurrentWeek(date);
                } else {
                  Alert.alert(
                    "Invalid Date",
                    "Please enter a valid date in YYYY-MM-DD format"
                  );
                }
              } else {
                Alert.alert(
                  "Invalid Format",
                  "Please use YYYY-MM-DD format (e.g., 2027-03-15)"
                );
              }
            }
          },
        },
      ],
      "plain-text",
      "2025-07-02"
    );
  };

  const jumpToToday = () => {
    setCurrentWeek(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPastSlot = (date: string, hour: number) => {
    const slotDate = new Date(
      date + "T" + hour.toString().padStart(2, "0") + ":00:00"
    );
    const now = new Date();
    return slotDate < now;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    weekRange: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    navButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    jumpButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary + "15",
    },
    todayButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
    },
    todayButtonText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
    scrollContainer: {
      maxHeight: 600,
      backgroundColor: theme.colors.surface,
    },
    calendarContainer: {
      flexDirection: "row",
    },
    timeColumn: {
      width: 70,
      backgroundColor: theme.colors.background,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    timeSlot: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    timeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      fontSize: 11,
    },
    daysContainer: {
      flex: 1,
    },
    daysHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    dayHeader: {
      flex: 1,
      padding: theme.spacing.md,
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    dayName: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: 4,
    },
    dayDate: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
    },
    todayDate: {
      color: theme.colors.primary,
    },
    daysGrid: {
      flexDirection: "row",
    },
    dayColumn: {
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    hourSlot: {
      height: 50,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    availableSlot: {
      backgroundColor: theme.colors.success,
    },
    selectedSlot: {
      backgroundColor: theme.colors.primary,
    },
    bookedSlot: {
      backgroundColor: theme.colors.warning,
    },
    pastSlot: {
      backgroundColor: theme.colors.border,
      opacity: 0.6,
    },
    slotText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      fontSize: 10,
    },
    emptySlotText: {
      ...theme.typography.captionSmall,
      color: "transparent",
      fontWeight: "700",
      fontSize: 10,
    },
    legend: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendColor: {
      width: 16,
      height: 16,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    legendText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
  });

  const formatWeekRange = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateWeek("prev")}
          >
            <ChevronLeft color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.weekRange}>{formatWeekRange()}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.jumpButton} onPress={jumpToDate}>
            <Calendar color={theme.colors.primary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.todayButton} onPress={jumpToToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateWeek("next")}
          >
            <ChevronRight color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.calendarContainer}>
          {/* Time Column */}
          <View style={styles.timeColumn}>
            <View style={[styles.timeSlot, { height: 60 }]} />
            {hours.map((hour) => (
              <View key={hour} style={styles.timeSlot}>
                <Text style={styles.timeText}>{formatHour(hour)}</Text>
              </View>
            ))}
          </View>

          {/* Days Container */}
          <View style={styles.daysContainer}>
            {/* Days Header */}
            <View style={styles.daysHeader}>
              {weekDays.map((day, index) => (
                <View key={index} style={styles.dayHeader}>
                  <Text style={styles.dayName}>{dayNames[index]}</Text>
                  <Text
                    style={[styles.dayDate, isToday(day) && styles.todayDate]}
                  >
                    {day.getDate()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {weekDays.map((day, dayIndex) => {
                const dateString = formatDate(day);
                return (
                  <View key={dayIndex} style={styles.dayColumn}>
                    {hours.map((hour) => {
                      const slotState = getSlotState(dateString, hour);
                      const isPast = isPastSlot(dateString, hour);

                      let slotStyle = styles.hourSlot;
                      let textStyle = styles.emptySlotText;

                      if (isPast) {
                        slotStyle = [styles.hourSlot, styles.pastSlot];
                        textStyle = styles.emptySlotText;
                      } else if (slotState.selected) {
                        slotStyle = [styles.hourSlot, styles.selectedSlot];
                        textStyle = styles.slotText;
                      } else if (slotState.booked) {
                        slotStyle = [styles.hourSlot, styles.bookedSlot];
                        textStyle = styles.slotText;
                      } else if (slotState.available) {
                        slotStyle = [styles.hourSlot, styles.availableSlot];
                        textStyle = styles.slotText;
                      }

                      return (
                        <TouchableOpacity
                          key={hour}
                          style={slotStyle}
                          onPress={() => handleSlotPress(dateString, hour)}
                          disabled={isPast}
                          activeOpacity={0.8}
                        >
                          <Text style={textStyle}>
                            {slotState.selected ||
                            slotState.available ||
                            slotState.booked
                              ? formatHour(hour)
                              : ""}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        {mode === "availability" ? (
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: theme.colors.success },
              ]}
            />
            <Text style={styles.legendText}>Available</Text>
          </View>
        ) : (
          <>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.success },
                ]}
              />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: theme.colors.warning },
                ]}
              />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
