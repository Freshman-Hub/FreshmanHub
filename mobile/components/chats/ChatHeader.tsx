"use client";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  MoreVertical,
  Users,
  BookOpen,
} from "lucide-react-native";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useRouter } from "expo-router";

interface ChatHeaderProps {
  title: string;
  onSearchPress: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ChatHeader({
  title,
  onSearchPress,
  searchQuery,
  onSearchChange,
}: ChatHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const menuOptions: DropdownOption[] = [
    {
      id: "new-group",
      title: "New group",
      icon: Users,
      onPress: () => router.push("/(routes)/chats/select-contact?mode=group"),
    },
    {
      id: "read-all",
      title: "Read all",
      icon: BookOpen,
      onPress: () => console.log("Read all"),
    },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    rightActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontWeight: "500"
    },
  });

  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
    onSearchPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={handleSearchToggle}>
            <Search size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptionsMenu(true)}>
            <MoreVertical size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchActive && (
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats"
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={onSearchChange}
            autoFocus
          />
        </View>
      )}

      <OptionsDropdown
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        options={menuOptions}
      />
    </View>
  );
}
