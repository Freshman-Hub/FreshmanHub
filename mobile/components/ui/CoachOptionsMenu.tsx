"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import {
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  User,
  UserPlus,
  MoreHorizontal,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal.1";

interface CoachOptionsMenuProps {
  coach: {
    id: number;
    name: string;
    email: string;
  };
  onAssignFreshman?: (coach: any) => void;
  onCall?: (coach: any) => void;
  onMessage?: (coach: any) => void;
  onEmail?: (coach: any) => void;
  onSchedule?: (coach: any) => void;
  onViewProfile?: (coach: any) => void;
  style?: ViewStyle;
}

export function CoachOptionsMenu({
  coach,
  onAssignFreshman,
  onCall,
  onMessage,
  onEmail,
  onSchedule,
  onViewProfile,
  style,
}: CoachOptionsMenuProps) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const handleOptionPress = (action: () => void) => {
    setIsVisible(false);
    setTimeout(() => action(), 100);
  };

  const styles = StyleSheet.create({
    triggerButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    optionsContainer: {
      paddingVertical: theme.spacing.sm,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    optionIcon: {
      marginRight: theme.spacing.md,
      width: 24,
      alignItems: "center",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
  });

  const options = [
    {
      icon: UserPlus,
      label: "Assign Freshman",
      action: () => onAssignFreshman?.(coach),
    },
    {
      icon: Phone,
      label: "Call",
      action: () => onCall?.(coach),
    },
    {
      icon: MessageCircle,
      label: "Message",
      action: () => onMessage?.(coach),
    },
    {
      icon: Mail,
      label: "Email",
      action: () => onEmail?.(coach),
    },
    {
      icon: Calendar,
      label: "Schedule",
      action: () => onSchedule?.(coach),
    },
    {
      icon: User,
      label: "View Profile",
      action: () => onViewProfile?.(coach),
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={[styles.triggerButton, style]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <MoreHorizontal color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        dismissable={true}
        showCloseIcon={false}
        style={{ justifyContent: "flex-end", margin: 0 }}
        contentStyle={{ padding: 0, borderRadius: theme.borderRadius.xl }}
      >
        <View style={styles.optionsContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <X color={theme.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                index === options.length - 1 && styles.lastOption,
              ]}
              onPress={() => handleOptionPress(option.action)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIcon}>
                <option.icon color={theme.colors.textSecondary} size={20} />
              </View>
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </>
  );
}
