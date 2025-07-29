"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Reply,
  Star,
  Trash2,
  Copy,
  Share,
  MoreVertical,
  Flag,
  Edit,
  Info,
} from "lucide-react-native";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useState } from "react";

interface MessageSelectionHeaderProps {
  selectedCount: number;
  onBack: () => void;
  onReply: () => void;
  onStar: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onForward: () => void;
  onInfo: () => void;
  canEdit?: boolean;
  onEdit?: () => void;
}

export function MessageSelectionHeader({
  selectedCount,
  onBack,
  onReply,
  onStar,
  onDelete,
  onCopy,
  onForward,
  onInfo,
  canEdit = false,
  onEdit,
}: MessageSelectionHeaderProps) {
  const { theme } = useTheme();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const menuOptions: DropdownOption[] = [
    {
      id: "report",
      title: "Report",
      icon: Flag,
      onPress: () => console.log("Report message"),
    },
    ...(canEdit
      ? [
          {
            id: "edit",
            title: "Edit",
            icon: Edit,
            onPress: onEdit || (() => {}),
          },
        ]
      : []),
    {
      id: "info",
      title: "Info",
      icon: Info,
      onPress: onInfo,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    selectedCount: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    actionButton: {
      padding: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Text style={styles.selectedCount}>{selectedCount}</Text>

      <View style={styles.actions}>
        {selectedCount === 1 && (
          <TouchableOpacity style={styles.actionButton} onPress={onReply}>
            <Reply size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={onStar}>
          <Star size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Trash2 size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onCopy}>
          <Copy size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onForward}>
          <Share size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowOptionsMenu(true)}
        >
          <MoreVertical size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <OptionsDropdown
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        options={menuOptions}
      />
    </View>
  );
}
