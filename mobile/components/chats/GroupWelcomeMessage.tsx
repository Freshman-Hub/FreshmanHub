"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, UserPlus, Link, Lock } from "lucide-react-native";

interface GroupWelcomeMessageProps {
  groupName: string;
  memberCount: number;
  createdBy: string;
}

export function GroupWelcomeMessage({
  groupName,
  memberCount,
  createdBy,
}: GroupWelcomeMessageProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
    },
    encryptionNotice: {
      backgroundColor: "#FFF3CD",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      alignItems: "center",
    },
    encryptionText: {
      ...theme.typography.bodySmall,
      color: "#856404",
      textAlign: "center",
      lineHeight: 18,
    },
    learnMore: {
      ...theme.typography.bodySmall,
      color: "#0066CC",
      fontWeight: "500",
      marginTop: theme.spacing.xs,
    },
    groupIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    welcomeTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    groupInfo: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    addDescription: {
      ...theme.typography.body,
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      minWidth: 280,
    },
    actionButtonText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "500",
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      {/* Encryption Notice */}
      <View style={styles.encryptionNotice}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: theme.spacing.xs,
          }}
        >
          <Lock size={16} color="#856404" />
          <Text
            style={[
              styles.encryptionText,
              { marginLeft: theme.spacing.sm, marginBottom: 0 },
            ]}
          >
            Messages and calls are end-to-end encrypted. Only
          </Text>
        </View>
        <Text style={styles.encryptionText}>
          people in this chat can read, listen to, or share them.
        </Text>
        <TouchableOpacity>
          <Text style={styles.learnMore}>Learn more.</Text>
        </TouchableOpacity>
      </View>

      {/* Group Icon */}
      <View style={styles.groupIcon}>
        <Users size={40} color={theme.colors.primary} />
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcomeTitle}>You created this group</Text>
      <Text style={styles.groupInfo}>Group • {memberCount} members</Text>

      <TouchableOpacity>
        <Text style={styles.addDescription}>Add description...</Text>
      </TouchableOpacity>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton}>
        <UserPlus size={20} color={theme.colors.primary} />
        <Text style={styles.actionButtonText}>Add members</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Link size={20} color={theme.colors.primary} />
        <Text style={styles.actionButtonText}>Invite via group link</Text>
      </TouchableOpacity>
    </View>
  );
}
