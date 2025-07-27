"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

interface MonthPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthPicker({ selectedDate, onDateChange }: MonthPickerProps) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const months = [
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthSelect = (monthIndex: number, year: number) => {
    const newDate = new Date(year, monthIndex, 1);
    onDateChange(newDate);
    setShowPicker(false);
  };

  const styles = StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    triggerText: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginRight: theme.spacing.sm,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      maxHeight: 400,
      minWidth: 300,
    },
    title: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    yearContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    yearButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    yearButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    yearText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: "600",
    },
    yearTextActive: {
      color: "white",
    },
    monthsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    monthButton: {
      width: "30%",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      alignItems: "center",
    },
    monthButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    monthText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: "600",
    },
    monthTextActive: {
      color: "white",
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.triggerText}>
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <ChevronDown color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        position="center"
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Month</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.yearContainer}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    selectedDate.getFullYear() === year &&
                      styles.yearButtonActive,
                  ]}
                  onPress={() => {
                    const newDate = new Date(year, selectedDate.getMonth(), 1);
                    onDateChange(newDate);
                  }}
                >
                  <Text
                    style={[
                      styles.yearText,
                      selectedDate.getFullYear() === year &&
                        styles.yearTextActive,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.monthsGrid}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedDate.getMonth() === index && styles.monthButtonActive,
                ]}
                onPress={() =>
                  handleMonthSelect(index, selectedDate.getFullYear())
                }
              >
                <Text
                  style={[
                    styles.monthText,
                    selectedDate.getMonth() === index && styles.monthTextActive,
                  ]}
                >
                  {month.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
