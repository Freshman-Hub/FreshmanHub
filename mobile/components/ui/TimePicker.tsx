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
import { Clock, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface TimePickerProps {
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

export function TimePicker({
  value,
  onSelect,
  placeholder = "Select time",
  disabled = false,
  style,
}: TimePickerProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Generate time slots from 8 AM to 8 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const time12 = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;

        slots.push({
          value: time24,
          label: time12,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(":").map(Number);
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleTimeSelect = (timeValue: string) => {
    onSelect(timeValue);
    setIsOpen(false);
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
      maxWidth: 300,
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
    timeList: {
      maxHeight: 300,
    },
    timeSlot: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    selectedTimeSlot: {
      backgroundColor: theme.colors.primary + "10",
    },
    timeText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      textAlign: "center",
    },
    selectedTimeText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Clock color={theme.colors.textSecondary} size={20} />
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value ? formatTime(value) : placeholder}
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
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOpen(false)}
              >
                <X color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.timeList}
              showsVerticalScrollIndicator={false}
            >
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.value}
                  style={[
                    styles.timeSlot,
                    value === slot.value && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(slot.value)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      value === slot.value && styles.selectedTimeText,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
