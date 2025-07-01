"use client"

import type React from "react"
import type { ReactNode } from "react"
import { TouchableOpacity, View, Text, StyleSheet, type ViewStyle } from "react-native"
import { ChevronRight } from "lucide-react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface ListItemProps {
  title: string
  description?: string
  leftIcon?: React.ComponentType<{ color: string; size: number }>
  rightIcon?: React.ComponentType<{ color: string; size: number }>
  onPress?: () => void
  rightContent?: ReactNode
  style?: ViewStyle
}

export function ListItem({
  title,
  description,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onPress,
  rightContent,
  style,
}: ListItemProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    leftIconContainer: {
      marginRight: theme.spacing.md,
      width: 24,
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: description ? theme.spacing.xs : 0,
    },
    description: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    rightIconContainer: {
      width: 24,
      alignItems: "center",
    },
  })

  const Content = (
    <View style={[styles.container, style]}>
      {LeftIcon && (
        <View style={styles.leftIconContainer}>
          <LeftIcon color={theme.colors.textSecondary} size={24} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={styles.rightContainer}>
        {rightContent}
        <View style={styles.rightIconContainer}>
          {RightIcon ? (
            <RightIcon color={theme.colors.textSecondary} size={20} />
          ) : onPress ? (
            <ChevronRight color={theme.colors.textSecondary} size={20} />
          ) : null}
        </View>
      </View>
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {Content}
      </TouchableOpacity>
    )
  }

  return Content
}
