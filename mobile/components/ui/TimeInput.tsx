"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  type ViewStyle,
} from "react-native";
import { Clock, X } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface TimeInputProps {
  value: string;
  onChangeTime: (time: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  format24Hour?: boolean;
}

export function TimeInput({
  value,
  onChangeTime,
  label,
  placeholder = "Select time",
  disabled = false,
  style,
  format24Hour = false,
}: TimeInputProps) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("PM");

  const { width } = Dimensions.get("window");
  const clockSize = Math.min(width * 0.7, 280);
  const centerX = clockSize / 2;
  const centerY = clockSize / 2;
  const radius = clockSize * 0.35;

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
    inputButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48,
    },
    inputButtonDisabled: {
      backgroundColor: theme.colors.border + "40",
      borderColor: theme.colors.border,
    },
    inputText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
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
      padding: theme.spacing.lg,
      alignItems: "center",
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
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: theme.spacing.lg,
    },
    modalTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    clockContainer: {
      width: clockSize,
      height: clockSize,
      borderRadius: clockSize / 2,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      position: "relative",
      marginBottom: theme.spacing.lg,
    },
    clockCenter: {
      position: "absolute",
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      top: centerY - 6,
      left: centerX - 6,
      zIndex: 10,
    },
    hourHand: {
      position: "absolute",
      width: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      transformOrigin: "bottom center",
      zIndex: 5,
    },
    minuteHand: {
      position: "absolute",
      width: 2,
      backgroundColor: theme.colors.secondary,
      borderRadius: 1,
      transformOrigin: "bottom center",
      zIndex: 5,
    },
    hourNumber: {
      position: "absolute",
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
    hourNumberText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    selectedHourNumber: {
      backgroundColor: theme.colors.primary + "20",
    },
    selectedHourNumberText: {
      color: theme.colors.primary,
      fontWeight: "700",
    },
    timeDisplay: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    timeText: {
      ...theme.typography.h3,
      color: theme.colors.text,
      fontWeight: "700",
      marginHorizontal: theme.spacing.sm,
    },
    periodContainer: {
      flexDirection: "row",
      marginBottom: theme.spacing.lg,
    },
    periodButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedPeriodButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    periodButtonText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: "600",
    },
    selectedPeriodButtonText: {
      color: "white",
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    actionButton: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      minWidth: 80,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButtonText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: "600",
    },
    confirmButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "600",
    },
  });

  const formatTime = (hour: number, minute: number, period: "AM" | "PM") => {
    const formattedMinute = minute.toString().padStart(2, "0");
    if (format24Hour) {
      const hour24 =
        period === "PM" && hour !== 12
          ? hour + 12
          : hour === 12 && period === "AM"
            ? 0
            : hour;
      return `${hour24.toString().padStart(2, "0")}:${formattedMinute}`;
    }
    return `${hour}:${formattedMinute} ${period}`;
  };

  const renderClockNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle) - 15;
      const y = centerY + radius * Math.sin(angle) - 15;

      numbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.hourNumber,
            { left: x, top: y },
            selectedHour === i && styles.selectedHourNumber,
          ]}
          onPress={() => setSelectedHour(i)}
        >
          <Text
            style={[
              styles.hourNumberText,
              selectedHour === i && styles.selectedHourNumberText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  const renderClockHands = () => {
    // const hourAngle =
    //   (selectedHour * 30 + selectedMinute * 0.5 - 90) * (Math.PI / 180);
    // const minuteAngle = (selectedMinute * 6 - 90) * (Math.PI / 180);

    const hourHandLength = radius * 0.6;
    const minuteHandLength = radius * 0.8;

    return (
      <>
        <View
          style={[
            styles.hourHand,
            {
              height: hourHandLength,
              left: centerX - 2,
              top: centerY - hourHandLength,
              transform: [
                { rotate: `${selectedHour * 30 + selectedMinute * 0.5}deg` },
              ],
            },
          ]}
        />
        <View
          style={[
            styles.minuteHand,
            {
              height: minuteHandLength,
              left: centerX - 1,
              top: centerY - minuteHandLength,
              transform: [{ rotate: `${selectedMinute * 6}deg` }],
            },
          ]}
        />
      </>
    );
  };

  const handleConfirm = () => {
    const formattedTime = formatTime(
      selectedHour,
      selectedMinute,
      selectedPeriod
    );
    onChangeTime(formattedTime);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  // Replace the existing minute controls with this enhanced version
  const renderMinuteSelector = () => {
    const minuteNumbers = [];
    for (let i = 0; i < 60; i += 5) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const x = centerX + radius * 0.8 * Math.cos(angle) - 12;
      const y = centerY + radius * 0.8 * Math.sin(angle) - 12;

      minuteNumbers.push(
        <TouchableOpacity
          key={i}
          style={[
            {
              position: "absolute",
              left: x,
              top: y,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor:
                selectedMinute === i ? theme.colors.primary : "transparent",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={() => setSelectedMinute(i)}
        >
          <Text
            style={[
              {
                ...theme.typography.captionSmall,
                color:
                  selectedMinute === i ? "white" : theme.colors.textSecondary,
                fontWeight: selectedMinute === i ? "700" : "500",
                fontSize: 10,
              },
            ]}
          >
            {i.toString().padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      );
    }
    return minuteNumbers;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.inputButton, disabled && styles.inputButtonDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Clock color={theme.colors.textSecondary} size={20} />
        <Text style={[styles.inputText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCancel}
              >
                <X color={theme.colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>
                {formatTime(selectedHour, selectedMinute, selectedPeriod)}
              </Text>
            </View>

            {/* Update the periodContainer section to include minute selector */}
            <View style={styles.clockContainer}>
              {renderClockNumbers()}
              {renderMinuteSelector()}
              {renderClockHands()}
              <View style={styles.clockCenter} />
            </View>

            {/* Replace the existing minute controls with this simpler version */}
            <View style={styles.periodContainer}>
              <Text
                style={[
                  styles.timeText,
                  { fontSize: 14, marginRight: theme.spacing.md },
                ]}
              >
                Tap minute markers or use fine adjustment:
              </Text>
            </View>

            <View
              style={[styles.periodContainer, { justifyContent: "center" }]}
            >
              <TouchableOpacity
                onPress={() =>
                  setSelectedMinute(Math.max(0, selectedMinute - 1))
                }
                style={[styles.actionButton, { minWidth: 40 }]}
              >
                <Text style={styles.cancelButtonText}>-1</Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.timeText,
                  { fontSize: 16, marginHorizontal: theme.spacing.md },
                ]}
              >
                {selectedMinute.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setSelectedMinute(Math.min(59, selectedMinute + 1))
                }
                style={[styles.actionButton, { minWidth: 40 }]}
              >
                <Text style={styles.cancelButtonText}>+1</Text>
              </TouchableOpacity>
            </View>

            {!format24Hour && (
              <View style={styles.periodContainer}>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === "AM" && styles.selectedPeriodButton,
                  ]}
                  onPress={() => setSelectedPeriod("AM")}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === "AM" &&
                        styles.selectedPeriodButtonText,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    selectedPeriod === "PM" && styles.selectedPeriodButton,
                  ]}
                  onPress={() => setSelectedPeriod("PM")}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === "PM" &&
                        styles.selectedPeriodButtonText,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
