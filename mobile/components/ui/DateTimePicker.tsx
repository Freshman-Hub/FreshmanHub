"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Calendar, Clock, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./Button";

interface DateTimePickerProps {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  type: "date" | "time";
  disabled?: boolean;
  style?: any;
}

export function DateTimePicker({
  value,
  onSelect,
  placeholder = "Select",
  type,
  disabled = false,
  style,
}: DateTimePickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Generate date options (next 30 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const displayString = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      dates.push({ value: dateString, label: displayString });
    }

    return dates;
  };

  // Generate time options (30-minute intervals)
  const generateTimes = () => {
    const times = [];

    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayString = new Date(
          `2000-01-01T${timeString}`
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        times.push({ value: timeString, label: displayString });
      }
    }

    return times;
  };

  const options = type === "date" ? generateDates() : generateTimes();

  const handleConfirm = () => {
    onSelect(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;

    if (type === "date") {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } else {
      const time = new Date(`2000-01-01T${value}`);
      return time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
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
      maxHeight: "70%",
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
    optionsList: {
      maxHeight: 300,
    },
    option: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + "10",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    modalFooter: {
      flexDirection: "row",
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  });

  const Icon = type === "date" ? Calendar : Clock;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Icon color={theme.colors.textSecondary} size={20} />
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {getDisplayValue()}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {type === "date" ? "Date" : "Time"}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <X color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    tempValue === option.value && styles.selectedOption,
                  ]}
                  onPress={() => setTempValue(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      tempValue === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                mode="outlined"
                style={{ flex: 1 }}
              />
              <Button
                title="Confirm"
                onPress={handleConfirm}
                mode="contained"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
