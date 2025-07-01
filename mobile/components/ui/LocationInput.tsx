"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  Modal,
  ScrollView,
  TextInput as RNTextInput,
} from "react-native";
import { ChevronDown, Check, MapPin } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface LocationInputProps {
  value: string;
  onSelect: (value: string) => void;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  style?: ViewStyle;
  options: { label: string; value: string }[];
}

export function LocationInput({
  value,
  onSelect,
  label,
  disabled = false,
  placeholder = "Select location",
  style,
  options,
}: LocationInputProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const isCustomSelected = value && !selectedOption;

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
    selectButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 48,
    },
    selectButtonDisabled: {
      backgroundColor: theme.colors.border + "40",
      borderColor: theme.colors.border,
    },
    selectText: {
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
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    optionsList: {
      maxHeight: 300,
    },
    option: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
        flex: 1,
        fontWeight: "500",
    },
    selectedOption: {
      backgroundColor: theme.colors.primary + "10",
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    otherOption: {
      backgroundColor: theme.colors.accent + "10",
      borderBottomWidth: 0,
    },
    otherOptionText: {
      color: theme.colors.accent,
      fontWeight: "600",
    },
    customInputContainer: {
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    customInputLabel: {
      ...theme.typography.label,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: "600",
    },
    customInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: 16,
      marginBottom: theme.spacing.md,
    },
    customInputActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    confirmButton: {
      backgroundColor: theme.colors.accent,
    },
    actionButtonText: {
      ...theme.typography.button,
      fontWeight: "600",
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    confirmButtonText: {
      color: "white",
    },
  });

  const handleSelect = (optionValue: string) => {
    if (optionValue === "Other") {
      setShowCustomInput(true);
      setCustomLocation("");
    } else {
      onSelect(optionValue);
      setIsOpen(false);
      setShowCustomInput(false);
    }
  };

  const handleCustomLocationConfirm = () => {
    if (customLocation.trim()) {
      onSelect(customLocation.trim());
      setIsOpen(false);
      setShowCustomInput(false);
      setCustomLocation("");
    }
  };

  const handleCustomLocationCancel = () => {
    setShowCustomInput(false);
    setCustomLocation("");
  };

  const displayValue = () => {
    if (isCustomSelected) {
      return value;
    }
    return selectedOption ? selectedOption.label : "";
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selectButton, disabled && styles.selectButtonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <MapPin color={theme.colors.textSecondary} size={20} />
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {displayValue() || placeholder}
        </Text>
        <ChevronDown color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={() => {}}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || "Select location"}
              </Text>
            </View>

            {!showCustomInput ? (
              <ScrollView style={styles.optionsList}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      option.value === value && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option.value === value && styles.selectedOptionText,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.value === value && (
                      <Check color={theme.colors.primary} size={20} />
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[styles.option, styles.otherOption]}
                  onPress={() => handleSelect("Other")}
                >
                  <Text style={[styles.optionText, styles.otherOptionText]}>
                    Other (Custom Location)
                  </Text>
                  <MapPin color={theme.colors.accent} size={20} />
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>
                  Enter Custom Location
                </Text>
                <RNTextInput
                  style={styles.customInput}
                  value={customLocation}
                  onChangeText={setCustomLocation}
                  placeholder="Type your custom location..."
                  placeholderTextColor={theme.colors.textSecondary}
                  autoFocus={true}
                  autoCorrect={true}
                  autoCapitalize="words"
                />

                <View style={styles.customInputActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCustomLocationCancel}
                  >
                    <Text
                      style={[styles.actionButtonText, styles.cancelButtonText]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.confirmButton]}
                    onPress={handleCustomLocationConfirm}
                    disabled={!customLocation.trim()}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.confirmButtonText,
                      ]}
                    >
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
