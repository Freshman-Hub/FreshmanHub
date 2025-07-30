"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreVertical,
  UserPlus,
  // Link,
  Search,
  Heart,
  // List,
  LogOut,
  Flag,
  Settings,
  Edit,
} from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";
// import { GroupInfoModal } from "@/components/chats/GroupInfoModal";
import { MemberActionModal } from "@/components/chats/MemberActionModal";
import { ChangeGroupNameModal } from "@/components/chats/ChangeGroupNameModal";
import { AddDescriptionModal } from "@/components/chats/AddDescriptionModal";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";

// Mock group data
const mockGroupData = {
  id: "group-1",
  name: "Emma group",
  avatar: null,
  memberCount: 2,
  createdBy: "You",
  createdAt: "today at 19:58",
  description: "",
  members: [
    {
      id: "self",
      name: "You",
      subtitle: "Can't talk, WhatsApp only",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      isAdmin: true,
    },
    {
      id: "member-1",
      name: "Adoum Ouang-namou Emmanuel",
      subtitle: "",
      avatar:
        "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
      isAdmin: false,
    },
  ],
};

export default function GroupInfoScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  // const [showMoreModal, setShowMoreModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [groupData, setGroupData] = useState(mockGroupData);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const groupId = params.id as string;

  const handleAddMembers = () => {
    router.push(`/(routes)/chats/${groupId}/add-members`);
  };

  // const handleInviteLink = () => {
  //   console.log("Invite via group link");
  // };

  const handleMemberPress = (member: any) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleMakeAdmin = (memberId: string) => {
    console.log("Making admin:", memberId);
    // TODO: Update member admin status
  };

  const handleRemoveMember = (memberId: string) => {
    console.log("Removing member:", memberId);
    // TODO: Remove member from group
  };

  const handleChangeGroupName = (newName: string) => {
    setGroupData((prev) => ({ ...prev, name: newName }));
    console.log("Changed group name to:", newName);
  };

  const handleAddDescription = () => {
    setShowDescriptionModal(true);
  };

  const handleSaveDescription = (newDescription: string) => {
    setGroupData((prev) => ({ ...prev, description: newDescription }));
    console.log("Updated description:", newDescription);
  };

  const handleSearchMembers = () => {
    router.push(`/(routes)/chats/${groupId}/search-members`);
  };

  const menuOptions: DropdownOption[] = [
    {
      id: "add-members",
      title: "Add members",
      icon: UserPlus,
      onPress: () => {
        handleAddMembers();
      },
    },
    {
      id: "change-name",
      title: "Change group name",
      icon: Edit,
      onPress: () => {
        setShowChangeNameModal(true);
      },
    },
    {
      id: "group-permissions",
      title: "Group permissions",
      icon: Settings,
      onPress: () => {
        router.push(`/(routes)/chats/${groupId}/group-permissions`);
      },
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
      flexDirection: "row",
      alignItems: "center",
    },
    headerAvatar: {
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    moreButton: {
      padding: theme.spacing.xs,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    profileAvatar: {
      marginBottom: theme.spacing.md,
    },
    groupName: {
      ...theme.typography.h2,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    groupSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 8,
      borderBottomColor: theme.colors.surface,
    },
    actionButton: {
      alignItems: "center",
      flex: 1,
    },
    actionButtonIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    actionButtonText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      textAlign: "center",
      fontWeight: "500",
    },
    descriptionSection: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 8,
      borderBottomColor: theme.colors.surface,
    },
    addDescription: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "500",
    },
    createdBy: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.sm,
      fontWeight: "500",
    },
    membersSection: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 8,
      borderBottomColor: theme.colors.surface,
    },
    membersHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    membersTitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    searchButton: {
      padding: theme.spacing.xs,
    },
    memberItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    memberAvatar: {
      marginRight: theme.spacing.md,
    },
    memberContent: {
      flex: 1,
    },
    memberName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    memberSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    adminBadge: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    adminBadgeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    actionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    actionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    exitText: {
      color: "#FF3B30",
    },
    reportText: {
      color: "#FF3B30",
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
          <View style={styles.headerAvatar}>
            <Avatar
              source={groupData.avatar}
              name={groupData.name}
              size={32}
              type="group"
            />
          </View>
          <Text style={styles.headerTitle}>{groupData.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowOptionsMenu(true)}
        >
          <MoreVertical size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Avatar
              source={groupData.avatar}
              name={groupData.name}
              size={120}
              type="group"
            />
          </View>
          <Text style={styles.groupName}>{groupData.name}</Text>
          <Text style={styles.groupSubtitle}>
            Group • {groupData.memberCount} members
          </Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <TouchableOpacity onPress={handleAddDescription}>
            <Text style={styles.addDescription}>
              {groupData.description || "Add group description"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.createdBy}>
            Created by {groupData.createdBy}, {groupData.createdAt}
          </Text>
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersTitle}>
              {groupData.memberCount} members
            </Text>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchMembers}
            >
              <Search size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Add Members Button */}
          <TouchableOpacity
            style={styles.memberItem}
            onPress={handleAddMembers}
          >
            <View style={styles.memberAvatar}>
              <View
                style={[
                  styles.actionButtonIcon,
                  {
                    backgroundColor: theme.colors.primary,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  },
                ]}
              >
                <UserPlus size={20} color="white" />
              </View>
            </View>
            <View style={styles.memberContent}>
              <Text style={styles.memberName}>Add members</Text>
            </View>
          </TouchableOpacity>

          {/* Members List */}
          {groupData.members.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberItem}
              onPress={() => handleMemberPress(member)}
            >
              <View style={styles.memberAvatar}>
                <Avatar
                  source={member.avatar}
                  name={member.name}
                  size={40}
                  type="direct"
                />
              </View>
              <View style={styles.memberContent}>
                <Text style={styles.memberName}>{member.name}</Text>
                {member.subtitle && (
                  <Text style={styles.memberSubtitle}>{member.subtitle}</Text>
                )}
              </View>
              {member.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Group Admin</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Items */}
        <TouchableOpacity style={styles.actionItem}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Heart size={20} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.actionText}>Add to Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: "#FF3B3020" }]}>
            <LogOut size={20} color="#FF3B30" />
          </View>
          <Text style={[styles.actionText, styles.exitText]}>Exit group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: "#FF3B3020" }]}>
            <Flag size={20} color="#FF3B30" />
          </View>
          <Text style={[styles.actionText, styles.reportText]}>
            Report group
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <MemberActionModal
        visible={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        member={selectedMember}
        groupId={groupId}
        onMakeAdmin={handleMakeAdmin}
        onRemoveMember={handleRemoveMember}
      />

      <ChangeGroupNameModal
        visible={showChangeNameModal}
        onClose={() => setShowChangeNameModal(false)}
        currentName={groupData.name}
        onSave={handleChangeGroupName}
      />

      <AddDescriptionModal
        visible={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        currentDescription={groupData.description}
        onSave={handleSaveDescription}
      />
      <OptionsDropdown
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        options={menuOptions}
      />
    </SafeAreaView>
  );
}
