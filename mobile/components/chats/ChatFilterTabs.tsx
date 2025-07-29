"use client"
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native"
import { useTheme } from "@/contexts/ThemeContext"

interface ChatFilterTabsProps {
  filters: string[]
  selectedFilter: string
  onFilterSelect: (filter: string) => void
}

export function ChatFilterTabs({ filters, selectedFilter, onFilterSelect }: ChatFilterTabsProps) {
  const { theme } = useTheme()

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    filtersRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    filterTab: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    activeFilterTab: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "500",
    },
    activeFilterText: {
      color: "white",
      fontWeight: "600",
    },
  })

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.filtersRow}>
          {filters.map((filter) => {
            const isActive = selectedFilter === filter
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, isActive && styles.activeFilterTab]}
                onPress={() => onFilterSelect(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
