"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Pin,
  Trash2,
  BellOff,
  Archive,
  MoreVertical,
  Plus,
  Eye,
  CheckCheck,
  CheckSquare,
  Lock,
  Heart,
  List,
  Shield,
} from "lucide-react-native";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useState } from "react";

interface ChatSelectionHeaderProps {
  selectedCount: number;
  totalCount?: number;
  onBack: () => void;
  onPin: () => void;
  onDelete: () => void;
  onMute: () => void;
  onArchive: () => void;
  onMarkAsRead?: () => void;
  onSelectAll?: () => void;
  onUnselectAll?: () => void;
}

export function ChatSelectionHeader({
  selectedCount,
  totalCount = 0,
  onBack,
  onPin,
  onDelete,
  onMute,
  onArchive,
  onMarkAsRead = () => {},
  onSelectAll = () => {},
  onUnselectAll = () => {},
}: ChatSelectionHeaderProps) {
  const { theme } = useTheme();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  const menuOptions: DropdownOption[] = [
    {
      id: "add-shortcut",
      title: "Add chat shortcut",
      icon: Plus,
      onPress: () => console.log("Add chat shortcut"),
    },
    {
      id: "view-contact",
      title: "View contact",
      icon: Eye,
      onPress: () => console.log("View contact"),
    },
    {
      id: "mark-read",
      title: "Mark as read",
      icon: CheckCheck,
      onPress: () => {
        onMarkAsRead();
        console.log("Mark as read");
      },
    },
    {
      id: "select-toggle",
      title: isAllSelected ? "Unselect all" : "Select all",
      icon: CheckSquare,
      onPress: () => {
        if (isAllSelected) {
          onUnselectAll();
          console.log("Unselect all");
        } else {
          onSelectAll();
          console.log("Select all");
        }
      },
    },
    {
      id: "lock-chat",
      title: "Lock chat",
      icon: Lock,
      onPress: () => console.log("Lock chat"),
    },
    {
      id: "add-favorites",
      title: "Add to Favorites",
      icon: Heart,
      onPress: () => console.log("Add to Favorites"),
    },
    {
      id: "add-list",
      title: "Add to list",
      icon: List,
      onPress: () => console.log("Add to list"),
    },
    {
      id: "block",
      title: "Block",
      icon: Shield,
      onPress: () => console.log("Block"),
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
      gap: theme.spacing.lg,
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
        <TouchableOpacity style={styles.actionButton} onPress={onPin}>
          <Pin size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Trash2 size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onMute}>
          <BellOff size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onArchive}>
          <Archive size={24} color={theme.colors.text} />
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
