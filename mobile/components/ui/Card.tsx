"use client"

import type { ReactNode } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, type ViewStyle } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface CardProps {
  title?: string
  description?: string
  image?: string
  onPress?: () => void
  actions?: ReactNode
  content?: ReactNode
  style?: ViewStyle
  headerStyle?: ViewStyle
  footer?: ReactNode
}

export function Card({ title, description, image, onPress, actions, content, style, headerStyle, footer }: CardProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 200,
      resizeMode: "cover",
    },
    header: {
      padding: theme.spacing.md,
    },
    title: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 22,
    },
    content: {
      padding: theme.spacing.md,
    },
    actions: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    footer: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
  })

  const CardContent = (
    <View style={[styles.container, style]}>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {(title || description) && (
        <View style={[styles.header, headerStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}

      {content && <View style={styles.content}>{content}</View>}

      {actions && <View style={styles.actions}>{actions}</View>}

      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    )
  }

  return CardContent
}
