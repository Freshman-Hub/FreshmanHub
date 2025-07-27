"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  SafeAreaView,
  Animated,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string;
  title?: string;
}

export function TimePickerModal({
  visible,
  onClose,
  onSelect,
  initialTime = "12:00",
  title = "Select Time",
}: TimePickerModalProps) {
  const { theme } = useTheme();
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Generate hour options (1-23)
  const hourOptions = Array.from({ length: 23 }, (_, i) => {
    const hour = i + 1;
    return {
      label: hour.toString(),
      value: hour.toString().padStart(2, "0"),
    };
  });

  // Generate all minute options (0-59) for more precision
  const allMinuteOptions = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));

  useEffect(() => {
    if (visible) {
      // Parse initial time
      if (initialTime) {
        const [hourStr, minuteStr] = initialTime.split(":");
        setSelectedHour(hourStr);
        setSelectedMinute(minuteStr);
      }

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialTime]);

  const handleDone = () => {
    const timeString = `${selectedHour}:${selectedMinute}`;

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSelect(timeString);
      onClose();
    });
  };

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      width: 340,
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.3,
      shadowRadius: 30,
      elevation: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
    },
    content: {
      paddingHorizontal: 24,
      paddingVertical: 24,
    },
    currentTimeContainer: {
      alignItems: "center",
      marginBottom: 24,
      backgroundColor: theme.colors.background,
      paddingVertical: 20,
      borderRadius: 16,
    },
    currentTimeLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
    },
    currentTimeText: {
      fontSize: 36,
      fontWeight: "700",
      color: theme.colors.primary,
      fontFamily: "monospace",
    },
    timeSelectContainer: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    selectColumn: {
      flex: 1,
    },
    quickTimesContainer: {
      marginBottom: 24,
    },
    quickTimesLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    quickTimesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 8,
    },
    quickTimeButton: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: 70,
      alignItems: "center",
    },
    quickTimeButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    doneButton: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    doneButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <X color={theme.colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                {/* Current time display */}
                <View style={styles.currentTimeContainer}>
                  <Text style={styles.currentTimeLabel}>Selected Time</Text>
                  <Text style={styles.currentTimeText}>
                    {selectedHour}:{selectedMinute}
                  </Text>
                </View>

                {/* Time selectors */}
                <View style={styles.timeSelectContainer}>
                  <View style={styles.selectColumn}>
                    <CustomSelect
                      label="Hour"
                      value={selectedHour}
                      options={hourOptions}
                      onSelect={setSelectedHour}
                      placeholder="Select hour"
                    />
                  </View>

                  <View style={styles.selectColumn}>
                    <CustomSelect
                      label="Minute"
                      value={selectedMinute}
                      options={allMinuteOptions}
                      onSelect={setSelectedMinute}
                      placeholder="Select minute"
                    />
                  </View>
                </View>

                <View style={styles.sectionDivider} />

                {/* Quick time selection */}
                {/* <View style={styles.quickTimesContainer}>
                  <Text style={styles.quickTimesLabel}>Quick Select</Text>
                  <View style={styles.quickTimesGrid}>
                    {quickTimes.map((time) => (
                      <TouchableOpacity
                        key={time.value}
                        style={styles.quickTimeButton}
                        onPress={() => handleQuickTime(time.value)}
                      >
                        <Text style={styles.quickTimeButtonText}>
                          {time.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View> */}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Check color="white" size={18} />
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>
    </RNModal>
  );
}
