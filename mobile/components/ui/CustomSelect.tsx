"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, type ViewStyle, Modal, ScrollView } from "react-native"
import { ChevronDown, Check } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface CustomSelectProps {
  value: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
  label?: string
  disabled?: boolean
  placeholder?: string
  style?: ViewStyle
}

export function CustomSelect({
  value,
  options,
  onSelect,
  label,
  disabled = false,
  placeholder = "Select an option",
  style,
}: CustomSelectProps) {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue)
    setIsOpen(false)
  }

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
      maxHeight: "60%",
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
  })

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.selectButton, disabled && styles.selectButtonDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[styles.selectText, !selectedOption && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown color={theme.colors.textSecondary} size={20} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || "Select an option"}</Text>
            </View>

            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.option, option.value === value && styles.selectedOption]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text style={[styles.optionText, option.value === value && styles.selectedOptionText]}>
                    {option.label}
                  </Text>
                  {option.value === value && <Check color={theme.colors.primary} size={20} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
