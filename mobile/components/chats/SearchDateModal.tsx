"use client";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, X } from "lucide-react-native";
import { useState } from "react";

interface SearchDateModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  onClearFilter: () => void;
  currentFilter: Date | null;
}

export function SearchDateModal({
  visible,
  onClose,
  onDateSelect,
  onClearFilter,
  currentFilter,
}: SearchDateModalProps) {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(currentFilter);

  // Generate some quick date options
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const quickDates = [
    { label: "Today", date: today },
    { label: "Yesterday", date: yesterday },
    { label: "Last week", date: lastWeek },
    { label: "Last month", date: lastMonth },
  ];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onClearFilter();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      maxHeight: "70%",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    clearButton: {
      padding: theme.spacing.sm,
    },
    content: {
      padding: theme.spacing.lg,
    },
    currentFilter: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
    },
    currentFilterText: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: "center",
    },
    sectionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: theme.spacing.md,
    },
    dateOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    selectedDateOption: {
      backgroundColor: theme.colors.primary + "15",
    },
    dateLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    dateValue: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Search by date</Text>
            {currentFilter && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {currentFilter && (
              <View style={styles.currentFilter}>
                <Text style={styles.currentFilterText}>
                  Current filter: {formatDate(currentFilter)}
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Quick dates</Text>
            {quickDates.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateOption,
                  selectedDate?.toDateString() === item.date.toDateString() &&
                    styles.selectedDateOption,
                ]}
                onPress={() => handleDateSelect(item.date)}
              >
                <Text style={styles.dateLabel}>{item.label}</Text>
                <Text style={styles.dateValue}>{formatDate(item.date)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
