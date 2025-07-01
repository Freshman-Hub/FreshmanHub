"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle, View } from "react-native"
import { Loader } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  icon?: React.ComponentType<{ color: string; size: number }>
  loading?: boolean
  disabled?: boolean
  mode?: "text" | "outlined" | "contained"
  style?: ViewStyle
  contentStyle?: ViewStyle
  labelStyle?: TextStyle
}

export function Button({
  title,
  onPress,
  icon: IconComponent,
  loading = false,
  disabled = false,
  mode = "contained",
  style,
  contentStyle,
  labelStyle,
}: ButtonProps) {
  const { theme } = useTheme()

  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: theme.spacing.sm,
      minHeight: 48,
    }

    switch (mode) {
      case "contained":
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
        }
      case "outlined":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: disabled ? theme.colors.border : theme.colors.primary,
        }
      case "text":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        }
      default:
        return baseStyle
    }
  }

  const getTextColor = () => {
    if (disabled) return theme.colors.textSecondary

    switch (mode) {
      case "contained":
        return "white"
      case "outlined":
      case "text":
        return theme.colors.primary
      default:
        return theme.colors.text
    }
  }

  const styles = StyleSheet.create({
    button: getButtonStyle(),
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    text: {
      ...theme.typography.button,
      color: getTextColor(),
      fontWeight: "600",
    },
  })

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={[styles.content, contentStyle]}>
        {loading ? (
          <Loader color={getTextColor()} size={20} />
        ) : (
          IconComponent && <IconComponent color={getTextColor()} size={20} />
        )}
        <Text style={[styles.text, labelStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}
