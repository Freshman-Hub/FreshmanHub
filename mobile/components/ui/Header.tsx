"use client";

import type React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  MessageCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  leftIcon?: React.ComponentType<{ color: string; size: number }>;
  rightIcon?: React.ComponentType<{ color: string; size: number }>;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBack?: boolean;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showMessage?: boolean; // Add showMessage prop
  onMessagePress?: () => void; // Add onMessagePress method
  showFilter?: boolean;
  onFilterPress?: () => void;
  showCreate?: boolean;
  onCreatePress?: () => void;
  createIconType?: "post" | "event";
  style?: ViewStyle;
}

export function Header({
  title,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onLeftPress,
  onRightPress,
  showBack = false,
  showSearch = false,
  onSearchPress,
  showMessage = false, // Default to false
  onMessagePress,
  showFilter = false,
  onFilterPress,
  showCreate = false,
  onCreatePress,
  createIconType = "post",
  style,
}: HeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();

  // If showBack is true and no custom leftIcon or onLeftPress is provided, use default back button
  const shouldShowBackButton = showBack && !LeftIcon && !onLeftPress;
  const shouldShowCustomLeftButton = LeftIcon && onLeftPress;

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      minHeight: 56,
    },
    leftButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    createButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Show back button if showBack is true and no custom left button */}
      {shouldShowBackButton && (
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
      )}

      {/* Show custom left button if provided */}
      {shouldShowCustomLeftButton && (
        <TouchableOpacity style={styles.leftButton} onPress={onLeftPress}>
          <LeftIcon color={theme.colors.text} size={24} />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightContainer}>
        {showSearch && onSearchPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onSearchPress}>
            <Search color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
        )}

        {showMessage && onMessagePress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onMessagePress}
          >
            <MessageCircle color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
        )}

        {showFilter && onFilterPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onFilterPress}>
            <Filter color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
        )}

        {showCreate && onCreatePress && (
          <TouchableOpacity
            style={[styles.actionButton, styles.createButton]}
            onPress={onCreatePress}
          >
            <Plus color="white" size={24} />
          </TouchableOpacity>
        )}

        {RightIcon && onRightPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onRightPress}>
            <RightIcon color={theme.colors.textSecondary} size={22} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
