"use client";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Check, X, Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

interface RSVPModalProps {
  visible: boolean;
  onClose: () => void;
  onRSVP: (response: "yes" | "no" | "maybe") => void;
  eventTitle: string;
}

export function RSVPModal({
  visible,
  onClose,
  onRSVP,
  eventTitle,
}: RSVPModalProps) {
  const { theme } = useTheme();

  const handleRSVP = (response: "yes" | "no" | "maybe") => {
    onRSVP(response);
    onClose();
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      minWidth: 280,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    title: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    eventTitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      fontWeight: "500"
    },
    optionsContainer: {
      gap: theme.spacing.sm,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionIcon: {
      marginRight: theme.spacing.md,
    },
    optionText: {
      ...theme.typography.button,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    yesOption: {
      backgroundColor: "#e8f5e8",
      borderColor: "#4caf50",
    },
    yesText: {
      color: "#2e7d32",
    },
    noOption: {
      backgroundColor: "#ffebee",
      borderColor: "#f44336",
    },
    noText: {
      color: "#c62828",
    },
    maybeOption: {
      backgroundColor: "#fff3e0",
      borderColor: "#ff9800",
    },
    maybeText: {
      color: "#ef6c00",
    },
  });

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      dismissable={true}
      animationType="fade"
    >
      <View style={styles.container}>
        <Text style={styles.title}>RSVP to Event</Text>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {eventTitle}
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.option, styles.yesOption]}
            onPress={() => handleRSVP("yes")}
          >
            <Check color="#2e7d32" size={20} style={styles.optionIcon} />
            <Text style={[styles.optionText, styles.yesText]}>
              Yes, I&apos;ll attend
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.maybeOption]}
            onPress={() => handleRSVP("maybe")}
          >
            <Clock color="#ef6c00" size={20} style={styles.optionIcon} />
            <Text style={[styles.optionText, styles.maybeText]}>Maybe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, styles.noOption]}
            onPress={() => handleRSVP("no")}
          >
            <X color="#c62828" size={20} style={styles.optionIcon} />
            <Text style={[styles.optionText, styles.noText]}>Can&apos;t attend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
