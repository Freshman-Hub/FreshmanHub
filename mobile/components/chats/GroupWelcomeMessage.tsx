"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, UserPlus } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface GroupWelcomeMessageProps {
  groupName: string;
  memberCount: number;
  createdBy: string;
  isAnonymous: boolean;
}

export function GroupWelcomeMessage({
  groupName,
  memberCount,
  createdBy,
}: GroupWelcomeMessageProps) {
  const { theme } = useTheme();
  const router = useRouter();
   const params = useLocalSearchParams();

    const groupId = params.id as string;

   const handleAddMembers = () => {
     router.push(`/(routes)/chats/${groupId}/add-members`);
   };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
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
      fontWeight: "500",
    },
    addDescription: {
      ...theme.typography.body,
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      fontWeight: "500",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxl,
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

      {/* Group Icon */}
      <View style={styles.groupIcon}>
        <Users size={40} color={theme.colors.primary} />
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcomeTitle}>You created this group</Text>
      <Text style={styles.groupInfo}>Group • {memberCount} members</Text>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton} onPress={handleAddMembers}>
        <UserPlus size={20} color={theme.colors.primary} />
        <Text style={styles.actionButtonText}>Add members</Text>
      </TouchableOpacity>
    </View>
  );
}
