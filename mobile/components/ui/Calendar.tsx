"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availableDates?: Date[];
  bookedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  mode?: "single" | "multiple";
  selectedDates?: Date[];
  onMultipleSelect?: (dates: Date[]) => void;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  availableDates = [],
  bookedDates = [],
  minDate,
  maxDate,
  mode = "single",
  selectedDates = [],
  onMultipleSelect,
}: CalendarProps) {
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
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

  const isDateSelected = (date: Date) => {
    if (mode === "single") {
      return selectedDate && isSameDay(date, selectedDate);
    }
    return selectedDates.some((d) => isSameDay(d, date));
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some((d) => isSameDay(d, date));
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some((d) => isSameDay(d, date));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const handleDatePress = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onDateSelect?.(date);
    } else {
      const newSelectedDates = isDateSelected(date)
        ? selectedDates.filter((d) => !isSameDay(d, date))
        : [...selectedDates, date];
      onMultipleSelect?.(newSelectedDates);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected = isDateSelected(date);
      const isAvailable = isDateAvailable(date);
      const isBooked = isDateBooked(date);
      const isDisabled = isDateDisabled(date);
      const isToday = isSameDay(date, today);

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isAvailable && styles.availableDay,
            isBooked && styles.bookedDay,
            isDisabled && styles.disabledDay,
            isToday && styles.todayDay,
          ]}
          onPress={() => handleDatePress(day)}
          disabled={isDisabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isAvailable && styles.availableDayText,
              isBooked && styles.bookedDayText,
              isDisabled && styles.disabledDayText,
              isToday && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    monthYear: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    navButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    dayNamesRow: {
      flexDirection: "row",
      marginBottom: theme.spacing.sm,
    },
    dayNameCell: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    dayNameText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.lg,
      marginBottom: 2,
    },
    dayText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    selectedDay: {
      backgroundColor: theme.colors.primary,
    },
    selectedDayText: {
      color: "white",
      fontWeight: "700",
    },
    availableDay: {
      backgroundColor: theme.colors.success + "20",
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
    availableDayText: {
      color: theme.colors.success,
      fontWeight: "600",
    },
    bookedDay: {
      backgroundColor: theme.colors.warning + "20",
      borderWidth: 1,
      borderColor: theme.colors.warning,
    },
    bookedDayText: {
      color: theme.colors.warning,
      fontWeight: "600",
    },
    disabledDay: {
      opacity: 0.3,
    },
    disabledDayText: {
      color: theme.colors.textSecondary,
    },
    todayDay: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    todayDayText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth("prev")}
        >
          <ChevronLeft color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth("next")}
        >
          <ChevronRight color={theme.colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.dayNamesRow}>
        {dayNames.map((dayName) => (
          <View key={dayName} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{dayName}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
    </View>
  );
}
