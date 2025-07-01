"use client"

import type React from "react"
import { View, Text, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface StatCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ color: string; size: number }>
  color: string
  style?: ViewStyle
}

export function StatCard({ label, value, icon: IconComponent, color, style }: StatCardProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    icon: {
      marginBottom: theme.spacing.sm,
    },
    value: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: 4,
    },
    label: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "600",
    },
  })

  return (
    <View style={[styles.container, style]}>
      <IconComponent color={color} size={28} style={styles.icon} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}
