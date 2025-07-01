"use client"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface FilterChipProps {
  label: string
  selected: boolean
  onPress: () => void
  style?: ViewStyle
}

export function FilterChip({ label, selected, onPress, style }: FilterChipProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    chip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.3,
    },
    chipText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    chipTextActive: {
      color: "white",
      fontWeight: "700",
    },
  })

  return (
    <TouchableOpacity style={[styles.chip, selected && styles.chipActive, style]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}
