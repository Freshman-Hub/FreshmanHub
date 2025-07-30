"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  UserPlus,
  Users,
  Shield,
} from "lucide-react-native";

interface GroupPermissions {
  editGroupSettings: boolean;
  sendNewMessages: boolean;
  addOtherMembers: boolean;
  inviteViaGroupLink: boolean;
  approveNewMembers: boolean;
}

export default function GroupPermissionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const groupId = params.id as string;
  const groupName = "Emma group"; // This would come from props/params

  const [permissions, setPermissions] = useState<GroupPermissions>({
    editGroupSettings: true,
    sendNewMessages: true,
    addOtherMembers: true,
    inviteViaGroupLink: false,
    approveNewMembers: false,
  });

  const handlePermissionChange = (
    permission: keyof GroupPermissions,
    value: boolean
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
    // TODO: Save to backend
    console.log(`Updated ${permission} to ${value}`);
  };

  const handleEditGroupAdmins = () => {
    console.log("Edit group admins");
    // TODO: Navigate to edit admins screen
  };

  const permissionItems = [
    {
      id: "editGroupSettings",
      title: "Edit group settings",
      description:
        "This includes the name, icon, description, advanced chat privacy and the ability to pin, keep or unkeep messages.",
      icon: Edit,
      value: permissions.editGroupSettings,
      section: "members",
    },
    {
      id: "sendNewMessages",
      title: "Send new messages",
      description: "",
      icon: MessageSquare,
      value: permissions.sendNewMessages,
      section: "members",
    },
    {
      id: "addOtherMembers",
      title: "Add other members",
      description: "",
      icon: UserPlus,
      value: permissions.addOtherMembers,
      section: "members",
    },
    {
      id: "approveNewMembers",
      title: "Approve new members",
      description:
        "When turned on, admins must approve anyone who wants to join the group. Learn more",
      icon: Users,
      value: permissions.approveNewMembers,
      section: "admins",
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
    },
    headerSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    permissionItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    permissionIcon: {
      marginRight: theme.spacing.md,
      marginTop: 2,
    },
    permissionContent: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    permissionTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    permissionDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      fontWeight: "500",
    },
    learnMore: {
      color: theme.colors.primary,
    },
    switch: {
      marginTop: 2,
    },
    adminSection: {
      marginTop: theme.spacing.lg,
    },
    adminItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    adminIcon: {
      marginRight: theme.spacing.md,
    },
    adminContent: {
      flex: 1,
    },
    adminTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    adminSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Group permissions</Text>
          <Text style={styles.headerSubtitle}>{groupName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Members Can Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members can:</Text>
        </View>

        {permissionItems
          .filter((item) => item.section === "members")
          .map((item) => (
            <View key={item.id} style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <item.icon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.permissionDescription}>
                    {item.description.includes("Learn more") ? (
                      <>
                        {item.description.split("Learn more")[0]}
                        <Text style={styles.learnMore}>Learn more</Text>
                      </>
                    ) : (
                      item.description
                    )}
                  </Text>
                )}
              </View>
              <Switch
                style={styles.switch}
                value={item.value}
                onValueChange={(value) =>
                  handlePermissionChange(
                    item.id as keyof GroupPermissions,
                    value
                  )
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + "40",
                }}
                thumbColor={
                  item.value ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </View>
          ))}

        {/* Admins Can Section */}
        <View style={[styles.sectionHeader, styles.adminSection]}>
          <Text style={styles.sectionTitle}>Admins can:</Text>
        </View>

        {permissionItems
          .filter((item) => item.section === "admins")
          .map((item) => (
            <View key={item.id} style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <item.icon size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.permissionDescription}>
                    {item.description.includes("Learn more") ? (
                      <>
                        {item.description.split("Learn more")[0]}
                        <Text style={styles.learnMore}>Learn more</Text>
                      </>
                    ) : (
                      item.description
                    )}
                  </Text>
                )}
              </View>
              <Switch
                style={styles.switch}
                value={item.value}
                onValueChange={(value) =>
                  handlePermissionChange(
                    item.id as keyof GroupPermissions,
                    value
                  )
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + "40",
                }}
                thumbColor={
                  item.value ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            </View>
          ))}

        {/* Group Admins Section */}
        <View style={[styles.sectionHeader, styles.adminSection]}>
          <Text style={styles.sectionTitle}>Group admins</Text>
        </View>

        <TouchableOpacity
          style={styles.adminItem}
          onPress={handleEditGroupAdmins}
        >
          <View style={styles.adminIcon}>
            <Shield size={20} color={theme.colors.textSecondary} />
          </View>
          <View style={styles.adminContent}>
            <Text style={styles.adminTitle}>Edit group admins</Text>
            <Text style={styles.adminSubtitle}>You</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
