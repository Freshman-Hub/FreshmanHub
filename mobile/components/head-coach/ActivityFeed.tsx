"use client";

import type React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  type ListRenderItem,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ActivityItem {
  id: string | number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ComponentType<{ color: string; size: number }>;
  color: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onItemPress?: (item: ActivityItem) => void;
  showHeader?: boolean;
  maxItems?: number;
}

export function ActivityFeed({
  activities,
  onItemPress,
  showHeader = true,
  maxItems,
}: ActivityFeedProps) {
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
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    viewAllButton: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    activityDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    activityTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });

  const displayActivities = maxItems
    ? activities.slice(0, maxItems)
    : activities;

  const renderActivity: ListRenderItem<ActivityItem> = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.activityItem,
        index === displayActivities.length - 1 && styles.lastItem,
      ]}
      onPress={() => onItemPress?.(item)}
      activeOpacity={0.8}
    >
      <View
        style={[styles.activityIcon, { backgroundColor: item.color + "20" }]}
      >
        <item.icon color={item.color} size={20} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
      <ArrowRight color={theme.colors.textSecondary} size={16} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={displayActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
