"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { MonthPicker } from "@/components/ui/MonthPicker";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  category: string;
  color?: string; // Add color property
  isRSVP: boolean;
}

interface CalendarViewProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotPress: (date: Date, time: string) => void;
}

export function CalendarView({
  events,
  onEventPress,
  selectedDate,
  onDateChange,
  onTimeSlotPress,
}: CalendarViewProps) {
  const { theme } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates(selectedDate));

  function getWeekDates(date: Date) {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    const newWeek = getWeekDates(newDate);
    setCurrentWeek(newWeek);
    onDateChange(newDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateString && event.isRSVP);
  };

  // Update to use event's color property with fallback to category colors
  const getEventColor = (event: Event) => {
    // Use the event's selected color if available
    if (event.color) {
      return event.color;
    }

    // Fallback to category-based colors if no color is set
    switch (event.category.toLowerCase()) {
      case "cultural":
        return "#667eea";
      case "academic":
        return "#f093fb";
      case "sports":
        return "#4facfe";
      case "social":
        return "#26de81";
      case "workshop":
        return "#ff9800";
      case "meeting":
        return "#9c27b0";
      // Session categories
      case "advising session":
        return "#667eea";
      case "coaching session":
        return "#f093fb";
      case "buddy session":
        return "#4facfe";
      case "group session":
        return "#26de81";
      case "one-on-one":
        return "#ff9800";
      default:
        return theme.colors.primary;
    }
  };

  const timeSlots = Array.from({ length: 23 }, (_, i) => i + 1); // 1 AM to 11 PM

  const handleTimeSlotPress = (date: Date, hour: number) => {
    const timeString = `${hour.toString().padStart(2, "0")}:00`;
    onTimeSlotPress(date, timeString);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    navButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    weekHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    // Add a spacer for the time column
    timeColumnSpacer: {
      width: 60, // Match the timeColumn width exactly
      backgroundColor: theme.colors.surface,
    },
    dayHeader: {
      flex: 1, // Equal flex for remaining space after time column
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
    },
    dayName: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: 4,
      textAlign: "center",
    },
    dayNumber: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
    },
    selectedDayNumber: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
    calendarGrid: {
      flex: 1,
      flexDirection: "row",
    },
    timeColumn: {
      width: 60,
      backgroundColor: theme.colors.surface,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    timeSlot: {
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    timeText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    daysGrid: {
      flex: 1,
      flexDirection: "row",
    },
    dayColumn: {
      flex: 1, // Equal flex for all day columns
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    hourSlot: {
      height: 60,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      position: "relative",
    },
    eventBlock: {
      position: "absolute",
      left: 2,
      right: 2,
      borderRadius: 6,
      padding: 2,
      minHeight: 24,
      justifyContent: "flex-start", // Align content to start
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
    },
    eventTitle: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "500",
      fontSize: 9,
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
      lineHeight: 14,
      textAlignVertical: "top", // Start text at top on Android
      includeFontPadding: false, // Remove extra font padding
    },
    eventTime: {
      ...theme.typography.bodySmall,
      color: "white",
      fontSize: 10,
      opacity: 0.95, // Slightly more opaque
      fontWeight: "500",
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
  });


  const getEventPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    // Calculate minutes from 1 AM (hour 1)
    const startMinutes = (startHour - 1) * 60 + startMin;
    const endMinutes = (endHour - 1) * 60 + endMin;
    const duration = endMinutes - startMinutes;

    return {
      top: (startMinutes / 60) * 60,
      height: Math.max((duration / 60) * 60, 24), // Increased minimum height
    };
  };

  useEffect(() => {
    setCurrentWeek(getWeekDates(selectedDate));
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek("prev")}
        >
          <ChevronLeft color={theme.colors.textSecondary} size={24} />
        </TouchableOpacity>

        <MonthPicker selectedDate={selectedDate} onDateChange={onDateChange} />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek("next")}
        >
          <ChevronRight color={theme.colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {/* Add spacer to match time column */}
        <View style={styles.timeColumnSpacer} />

        {currentWeek.map((date, index) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

          return (
            <TouchableOpacity
              key={`${date.toISOString()}-${index}`}
              style={styles.dayHeader}
              onPress={() => onDateChange(date)}
            >
              <Text style={styles.dayName}>{dayNames[index]}</Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.selectedDayNumber,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarGrid}>
          <View style={styles.timeColumn}>
            {timeSlots.map((hour) => (
              <View key={hour} style={styles.timeSlot}>
                <Text style={styles.timeText}>{hour}:00</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {currentWeek.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date);

              return (
                <View key={dayIndex} style={styles.dayColumn}>
                  {timeSlots.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.hourSlot}
                      onPress={() => handleTimeSlotPress(date, hour)}
                      activeOpacity={0.1}
                    />
                  ))}

                  {dayEvents.map((event) => {
                    const position = getEventPosition(
                      event.startTime,
                      event.endTime
                    );

                    // Calculate how many lines can fit based on height with proper validation
                    const availableHeight = Math.max(0, position.height - 12); // Ensure non-negative
                    const lineHeight = 14;

                    // Ensure maxLines is always a valid positive number
                    const maxLines =
                      Math.max(1, Math.floor(availableHeight / lineHeight)) ||
                      1;

                    return (
                      <TouchableOpacity
                        key={event.id}
                        style={[
                          styles.eventBlock,
                          {
                            backgroundColor: getEventColor(event),
                            top: position.top,
                            height: position.height,
                          },
                        ]}
                        onPress={() => onEventPress(event)}
                      >
                        <Text
                          style={[
                            styles.eventTitle,
                            {
                              height: Math.max(lineHeight, availableHeight), // Ensure minimum height
                            },
                          ]}
                          numberOfLines={maxLines}
                          ellipsizeMode="tail"
                        >
                          {event.title}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
