"use client";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import {
  CircleCheck as CheckCircle,
  Clock,
  Play,
  Trophy,
  Target,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

export function OrientationProgress() {
  const { theme } = useTheme();
  const progress = 0.85;
  const completedTasks = 17;
  const totalTasks = 20;

  const styles = StyleSheet.create<{
    container: ViewStyle;
    card: ViewStyle;
    header: ViewStyle;
    headerLeft: ViewStyle;
    trophy: ViewStyle;
    headerText: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    badge: ViewStyle;
    badgeText: TextStyle;
    progressContainer: ViewStyle;
    progressBar: ViewStyle;
    progressFill: ViewStyle;
    progressInfo: ViewStyle;
    progressText: ViewStyle;
    progressLabel: TextStyle;
    remainingText: TextStyle;
    tasksSection: ViewStyle;
    tasksList: ViewStyle;
    taskItem: ViewStyle;
    taskContent: ViewStyle;
    taskText: TextStyle;
    completedTask: ViewStyle;
    actionButton: ViewStyle;
    actionButtonText: TextStyle;
  }>({
    container: {
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.xxl,
      marginBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xl,
      borderRadius: theme.borderRadius.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.05)",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    trophy: {
      marginRight: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: 4,
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: undefined,
    },
    badge: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      shadowColor: theme.colors.accent,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    badgeText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "700",
    },
    progressContainer: {
      marginBottom: theme.spacing.xl,
    },
    progressBar: {
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.accent,
      width: `${progress * 100}%`,
      borderRadius: theme.borderRadius.lg,
    },
    progressInfo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    progressText: {
      flexDirection: "row",
      alignItems: "center",
    },
    progressLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    remainingText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    tasksSection: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.lg,
    },
    tasksList: {
      gap: theme.spacing.lg,
    },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    taskContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    taskText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.lg,
      flex: 1,
      fontWeight: "500",
    },
    completedTask: {
      opacity: 0.7,
    },
    actionButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    actionButtonText: {
      ...theme.typography.button,
      color: "white",
      marginLeft: theme.spacing.xs,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Trophy
              color={theme.colors.accent}
              size={28}
              style={styles.trophy}
            />
            <View style={styles.headerText}>
              <Text style={styles.title}>Orientation Journey</Text>
              <Text style={styles.subtitle}>You&apos;re almost there!</Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{Math.round(progress * 100)}%</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressInfo}>
            <View style={styles.progressText}>
              <Target color={theme.colors.accent} size={20} />
              <Text style={styles.progressLabel}>
                {completedTasks} of {totalTasks} completed
              </Text>
            </View>
            <Text style={styles.remainingText}>
              {totalTasks - completedTasks} left
            </Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <View style={styles.tasksList}>
            <View style={[styles.taskItem, styles.completedTask]}>
              <View style={styles.taskContent}>
                <CheckCircle color={theme.colors.accent} size={24} />
                <Text style={styles.taskText}>Campus Tour & Facilities</Text>
              </View>
            </View>

            <View style={[styles.taskItem, styles.completedTask]}>
              <View style={styles.taskContent}>
                <CheckCircle color={theme.colors.accent} size={24} />
                <Text style={styles.taskText}>Academic Registration</Text>
              </View>
            </View>

            <View style={styles.taskItem}>
              <View style={styles.taskContent}>
                <Clock color={theme.colors.textSecondary} size={24} />
                <Text style={styles.taskText}>Student ID Collection</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Play color="white" size={16} />
                <Text style={styles.actionButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
