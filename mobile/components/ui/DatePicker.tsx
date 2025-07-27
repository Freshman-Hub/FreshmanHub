"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
} from "react-native";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
// import { Modal } from "@/components/ui/Modal";

interface DatePickerProps {
  value: string;
  onSelect: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

export function DatePicker({
  value,
  onSelect,
  placeholder = "Select date",
  disabled = false,
  style,
}: DatePickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

   // Fill the rest of the last week with empty cells to complete the grid
   // This ensures we always have complete weeks (42 cells = 6 weeks × 7 days)
   const totalCells = 42; // 6 weeks × 7 days
   while (days.length < totalCells) {
     days.push(null);
   }

   return days;
 };

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    onSelect(dateStr);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  const quickDateOptions = [
    { label: "Today", getValue: () => new Date().toISOString().split("T")[0] },
    {
      label: "Tomorrow",
      getValue: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
      },
    },
    {
      label: "This weekend",
      getValue: () => {
        const today = new Date();
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + (6 - today.getDay()));
        return saturday.toISOString().split("T")[0];
      },
    },
  ];

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
    },
    modalContainer: {
      backgroundColor: "white",
      borderRadius: 20,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      fontSize: 24,
      color: "#666",
      fontWeight: "300",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    quickOptions: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
      flexWrap: "wrap",
    },
    quickOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: "#f5f5f5",
    },
    quickOptionSelected: {
      backgroundColor: "#e3f2fd",
    },
    quickOptionText: {
      fontSize: 14,
      color: "#333",
      fontWeight: "500",
    },
    calendarHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    monthYear: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    },
    navButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#f5f5f5",
    },
    weekDays: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingBottom: 8,
    },
    weekDay: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 8,
    },
    weekDayText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#666",
    },
    calendar: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    calendarRow: {
      flexDirection: "row",
    },
    calendarDay: {
      flex: 1,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      margin: 2,
      borderRadius: 8,
    },
    calendarDaySelected: {
      backgroundColor: "#1976d2",
    },
    calendarDayText: {
      fontSize: 16,
      color: "#333",
      fontWeight: "500",
    },
    calendarDayTextSelected: {
      color: "white",
      fontWeight: "600",
    },
    calendarDayTextDisabled: {
      color: "#ccc",
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

      <RNModal
        visible={isOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickOptions}>
              {quickDateOptions.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.quickOption,
                    value === option.getValue() && styles.quickOptionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option.getValue());
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.quickOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("prev")}
              >
                <ChevronLeft color="#666" size={20} />
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("next")}
              >
                <ChevronRight color="#666" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                </View>
              ))}
            </View>

            <View style={styles.calendar}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.calendarRow}>
                  {week.map((day, dayIndex) => (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[
                        styles.calendarDay,
                        day &&
                          value === day.toISOString().split("T")[0] &&
                          styles.calendarDaySelected,
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={!day}
                    >
                      {day && (
                        <Text
                          style={[
                            styles.calendarDayText,
                            value === day.toISOString().split("T")[0] &&
                              styles.calendarDayTextSelected,
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  );
}
