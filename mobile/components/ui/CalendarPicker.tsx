"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface CalendarPickerProps {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

export function CalendarPicker({
  value,
  onSelect,
  placeholder = "Select date",
  disabled = false,
  style,
}: CalendarPickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const selectedDate = value ? new Date(value) : null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDateSelect = (date: Date) => {
    onSelect(formatDate(date));
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isDateDisabled = (date: Date) => {
    return date < today.setHours(0, 0, 0, 0);
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && formatDate(date) === formatDate(selectedDate);
  };

  const isToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    button: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.border + "40",
      borderColor: theme.colors.border,
    },
    buttonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      width: "100%",
      maxWidth: 350,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    monthYear: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "600",
    },
    navButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    dayHeaders: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    dayHeader: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    dayHeaderText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    daysGrid: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    weekRow: {
      flexDirection: "row",
    },
    dayCell: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 1,
      borderRadius: theme.borderRadius.md,
    },
    dayButton: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.md,
    },
    dayText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    todayButton: {
      backgroundColor: theme.colors.primary + "20",
    },
    todayText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
    selectedButton: {
      backgroundColor: theme.colors.primary,
    },
    selectedText: {
      color: "white",
      fontWeight: "700",
    },
    disabledButton: {
      opacity: 0.3,
    },
    disabledText: {
      color: theme.colors.textSecondary,
    },
  });

  const days = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Calendar color={theme.colors.textSecondary} size={20} />
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <X color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("prev")}
              >
                <ChevronLeft color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>

              <Text style={styles.monthYear}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>

              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("next")}
              >
                <ChevronRight color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.dayHeaders}>
              {dayNames.map((day) => (
                <View key={day} style={styles.dayHeader}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekRow}>
                  {week.map((day, dayIndex) => (
                    <View key={dayIndex} style={styles.dayCell}>
                      {day && (
                        <TouchableOpacity
                          style={[
                            styles.dayButton,
                            isToday(day) && styles.todayButton,
                            isDateSelected(day) && styles.selectedButton,
                            isDateDisabled(day) && styles.disabledButton,
                          ]}
                          onPress={() =>
                            !isDateDisabled(day) && handleDateSelect(day)
                          }
                          disabled={isDateDisabled(day)}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              isToday(day) && styles.todayText,
                              isDateSelected(day) && styles.selectedText,
                              isDateDisabled(day) && styles.disabledText,
                            ]}
                          >
                            {day.getDate()}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
