"use client";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import type React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronRight } from "lucide-react-native";

export interface DropdownOption {
  id: string;
  title: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  onPress: () => void;
  hasSubmenu?: boolean;
}

interface OptionsDropdownProps {
  visible: boolean;
  onClose: () => void;
  options: DropdownOption[];
  anchorPosition?: { x: number; y: number };
}

export function OptionsDropdown({
  visible,
  onClose,
  options,
  anchorPosition,
}: OptionsDropdownProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "transparent",
    },
    dropdown: {
      position: "absolute",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.sm,
      minWidth: 200,
      maxWidth: 250,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      top: anchorPosition?.y || 60,
      right: theme.spacing.md,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      marginRight: theme.spacing.md,
      width: 24,
      alignItems: "center",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      flex: 1,
    },
    submenuIcon: {
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dropdown}>
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.option}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.iconContainer}>
                        {IconComponent && (
                          <IconComponent size={20} color={theme.colors.text} />
                        )}
                      </View>
                      <Text style={styles.optionText}>{option.title}</Text>
                      {option.hasSubmenu && (
                        <View style={styles.submenuIcon}>
                          <ChevronRight
                            size={16}
                            color={theme.colors.textSecondary}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
