"use client";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    // Handle different date formats
    let date: Date;

    if (dateString === "Today") {
      date = new Date();
    } else if (dateString === "Yesterday") {
      date = new Date();
      date.setDate(date.getDate() - 1);
    } else {
      // Try to parse the date string - handle ISO format first
      date = new Date(dateString);

      // If invalid date, try different parsing approaches
      if (isNaN(date.getTime())) {
        // Handle formats like "June 25, 2025" or "July 2, 2025"
        const parts = dateString.split(" ");
        if (parts.length >= 3) {
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
          const monthIndex = monthNames.indexOf(parts[0]);
          if (monthIndex !== -1) {
            const day = Number.parseInt(parts[1].replace(",", ""));
            const year = Number.parseInt(parts[2]);
            date = new Date(year, monthIndex, day);
          }
        }

        // Try MM/DD/YYYY format
        if (isNaN(date.getTime()) && dateString.includes("/")) {
          const parts = dateString.split("/");
          if (parts.length === 3) {
            const month = Number.parseInt(parts[0]) - 1; // Month is 0-indexed
            const day = Number.parseInt(parts[1]);
            const year = Number.parseInt(parts[2]);
            if (year < 100) {
              // Handle 2-digit years
              date = new Date(2000 + year, month, day);
            } else {
              date = new Date(year, month, day);
            }
          }
        }
      }
    }

    // If still invalid, return a fallback
    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return dateString;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Compare dates without time
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      marginVertical: theme.spacing.md,
    },
    dateContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
    },
    dateText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
    </View>
  );
}
