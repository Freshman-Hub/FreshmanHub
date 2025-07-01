"use client";

import type { ReactNode } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { ArrowLeft, Search, Loader } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface FullSearchHeaderProps {
  query: string;
  onChangeQuery: (text: string) => void;
  onClose: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  loading?: boolean;
  showResults?: boolean;
  resultComponent?: ReactNode;
  style?: ViewStyle;
}

export function FullSearchHeader({
  query,
  onChangeQuery,
  onClose,
  onSubmit,
  placeholder = "Search posts, people, topics...",
  autoFocus = true,
  loading = false,
  showResults = false,
  resultComponent,
  style,
}: FullSearchHeaderProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.md,
      minHeight: 56,
    },
    backButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
        ...theme.typography.body,
      fontWeight: "400",
    },
    loadingIcon: {
      marginLeft: theme.spacing.sm,
    },
    resultsContainer: {
      backgroundColor: theme.colors.background,
      maxHeight: 400,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Search
            color={theme.colors.textSecondary}
            size={20}
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            value={query}
            onChangeText={onChangeQuery}
            onSubmitEditing={onSubmit}
            autoFocus={autoFocus}
            returnKeyType="search"
          />

          {loading && (
            <Loader
              color={theme.colors.textSecondary}
              size={20}
              style={styles.loadingIcon}
            />
          )}
        </View>
      </View>

      {showResults && resultComponent && (
        <View style={styles.resultsContainer}>{resultComponent}</View>
      )}
    </View>
  );
}
