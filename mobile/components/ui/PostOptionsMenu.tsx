"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import {
  Edit3,
  Trash2,
  Bookmark,
  Flag,
  UserX,
  Copy,
  Share,
  MoreHorizontal,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

interface PostOptionsMenuProps {
  postId: number;
  isOwner?: boolean;
  isFollowing?: boolean;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onCopyLink?: (postId: number) => void;
  onSavePost?: (postId: number) => void;
  onReportPost?: (postId: number) => void;
  onUnfollow?: (postId: number) => void;
  onShare?: (postId: number) => void;
  style?: ViewStyle;
}

export function PostOptionsMenu({
  postId,
  isOwner = false,
  isFollowing = false,
  onEdit,
  onDelete,
  onCopyLink,
  onSavePost,
  onReportPost,
  onUnfollow,
  onShare,
  style,
}: PostOptionsMenuProps) {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const handleOptionPress = (action: () => void) => {
    setIsVisible(false);
    setTimeout(() => action(), 100); // Small delay for smooth UX
  };

  const styles = StyleSheet.create({
    triggerButton: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    optionsContainer: {
      paddingVertical: theme.spacing.sm,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    destructiveOption: {
      backgroundColor: "#fee2e2",
    },
    optionIcon: {
      marginRight: theme.spacing.md,
      width: 24,
      alignItems: "center",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    destructiveText: {
      color: "#dc2626",
    },
    sectionDivider: {
      height: 8,
      backgroundColor: theme.colors.background,
      marginVertical: theme.spacing.xs,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    closeButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
  });

  const ownerOptions = [
    {
      icon: Edit3,
      label: "Edit post",
      action: () => onEdit?.(postId),
      destructive: false,
    },
    {
      icon: Trash2,
      label: "Delete post",
      action: () => onDelete?.(postId),
      destructive: true,
    },
  ];

  const generalOptions = [
    {
      icon: Copy,
      label: "Copy link",
      action: () => onCopyLink?.(postId),
      destructive: false,
    },
    {
      icon: Bookmark,
      label: "Save post",
      action: () => onSavePost?.(postId),
      destructive: false,
    },
    {
      icon: Share,
      label: "Share post",
      action: () => onShare?.(postId),
      destructive: false,
    },
  ];

  const reportOptions = [
    ...(isFollowing
      ? [
          {
            icon: UserX,
            label: "Unfollow",
            action: () => onUnfollow?.(postId),
            destructive: false,
          },
        ]
      : []),
    {
      icon: Flag,
      label: "Report post",
      action: () => onReportPost?.(postId),
      destructive: true,
    },
  ];

  const renderOption = (option: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.optionItem,
        isLast && styles.lastOption,
        option.destructive && styles.destructiveOption,
      ]}
      onPress={() => handleOptionPress(option.action)}
      activeOpacity={0.7}
    >
      <View style={styles.optionIcon}>
        <option.icon
          color={option.destructive ? "#dc2626" : theme.colors.textSecondary}
          size={20}
        />
      </View>
      <Text
        style={[
          styles.optionText,
          option.destructive && styles.destructiveText,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.triggerButton, style]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <MoreHorizontal color={theme.colors.textSecondary} size={22} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        dismissable={true}
        showCloseIcon={false}
        style={{ justifyContent: "flex-end", margin: 0 }}
        contentStyle={{ padding: 0, borderRadius: theme.borderRadius.xl }}
      >
        <View style={styles.optionsContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <X color={theme.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
          {/* Owner Options */}
          {isOwner && (
            <>
              {ownerOptions.map((option, index) =>
                renderOption(option, index, index === ownerOptions.length - 1)
              )}
              <View style={styles.sectionDivider} />
            </>
          )}

          {/* General Options */}
          {generalOptions.map((option, index) =>
            renderOption(option, index, index === generalOptions.length - 1)
          )}

          {/* Report/Unfollow Options */}
          {!isOwner && (
            <>
              <View style={styles.sectionDivider} />
              {reportOptions.map((option, index) =>
                renderOption(option, index, index === reportOptions.length - 1)
              )}
            </>
          )}
        </View>
      </Modal>
    </>
  );
}
