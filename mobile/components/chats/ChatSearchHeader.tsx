"use client";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react-native";

interface ChatSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onCalendar: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentResult?: number;
  totalResults?: number;
}

export function ChatSearchHeader({
  searchQuery,
  onSearchChange,
  onBack,
  onCalendar,
  onPrevious,
  onNext,
  currentResult,
  totalResults,
}: ChatSearchHeaderProps) {
  const { theme } = useTheme();

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
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
    searchCounter: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
      minWidth: 40,
      textAlign: "center",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.xs,
    },
  });

  const getSearchCounterText = () => {
    if (!searchQuery || searchQuery.length < 2) return "";
    if (totalResults === 0) return "0/0";
    return `${currentResult}/${totalResults}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={theme.colors.textSecondary}
        value={searchQuery}
        onChangeText={onSearchChange}
        autoFocus
      />

      <Text style={styles.searchCounter}>{getSearchCounterText()}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCalendar}>
          <Calendar size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onPrevious}>
          <ChevronUp size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onNext}>
          <ChevronDown size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
