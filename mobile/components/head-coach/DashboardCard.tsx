"use client";

import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
  onPress?: () => void;
  style?: ViewStyle;
  showArrow?: boolean;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: IconComponent,
  color,
  onPress,
  style,
  showArrow = true,
}: DashboardCardProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    value: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  const CardContent = (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <IconComponent color={color} size={24} />
        </View>
        {showArrow && onPress && (
          <ArrowRight color={theme.colors.textSecondary} size={20} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
}
