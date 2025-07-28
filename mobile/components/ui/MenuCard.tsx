"use client";

import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface MenuCardProps {
  title: string;
  description?: string; // Optional for search purposes
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  onPress: () => void;
  style?: ViewStyle;
  size?: "small" | "medium" | "large";
  showDescription?: boolean; // Control whether to show description
}

export function MenuCard({
  title,
  description,
  icon: Icon,
  color,
  onPress,
  style,
  size = "medium",
  showDescription = false,
}: MenuCardProps) {
  const { theme } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: theme.spacing.md,
          minHeight: 100,
          iconSize: 24,
          iconContainerSize: 48,
        };
      case "medium":
        return {
          padding: theme.spacing.lg,
          minHeight: 120,
          iconSize: 28,
          iconContainerSize: 56,
        };
      case "large":
        return {
          padding: theme.spacing.xl,
          minHeight: 140,
          iconSize: 32,
          iconContainerSize: 64,
        };
      default:
        return {
          padding: theme.spacing.lg,
          minHeight: 120,
          iconSize: 28,
          iconContainerSize: 56,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: sizeStyles.padding,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      minHeight: sizeStyles.minHeight,
    },
    iconContainer: {
      width: sizeStyles.iconContainerSize,
      height: sizeStyles.iconContainerSize,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      lineHeight: 20,
    },
    description: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
        lineHeight: 18,
      fontWeight: "500"
    },
  });

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
        <Icon color={color} size={sizeStyles.iconSize} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {showDescription && description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </TouchableOpacity>
  );
}
