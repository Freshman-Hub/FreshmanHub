"use client";
import { useState, useEffect } from "react";
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
  Search,
  Heart,
  LogOut,
  Flag,
  Settings,
  Edit,
  EyeOff,
} from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";
import { MemberActionModal } from "@/components/chats/MemberActionModal";
import { ChangeGroupNameModal } from "@/components/chats/ChangeGroupNameModal";
import { AddDescriptionModal } from "@/components/chats/AddDescriptionModal";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { useUser } from "@/contexts/UserContext";
import { StreamChatService } from "@/services/stream-chat.service";
import {
  getChannelDisplayName,
  getChannelAvatar,
} from "@/utils/stream-chat.helpers";
import { Channel } from "stream-chat";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface GroupMember {
  id: string;
  name: string;
  subtitle: string;
  avatar: string | null;
  isAdmin: boolean;
  isCurrentUser: boolean;
  isAnonymous?: boolean; // For anonymous members
}

interface GroupData {
  id: string;
  name: string;
  avatar: string | null;
  memberCount: number;
  createdBy: string;
  createdAt: string;
  description: string;
  members: GroupMember[];
  isAnonymous: boolean; // Group-level anonymous flag
}

export default function GroupInfoScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { client, isConnected } = useStreamChat();
  const { user } = useUser();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);

  const groupId = params.id as string;

  useEffect(() => {
    loadGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId, client, isConnected]);

  const loadGroupData = async () => {
    if (!client || !isConnected || !groupId) return;

    setLoading(true);
    try {
      // Get the Stream channel
      const streamChannel = await StreamChatService.getChannel("team", groupId);
      setChannel(streamChannel);

      // Extract group data from Stream channel
      const members = Object.values(streamChannel.state.members || {});
      const channelData = streamChannel.data as any;

      // Check if group is anonymous
      const isAnonymousGroup =
        channelData?.anonymous || channelData?.isAnonymous || false;

      // Get display name and avatar
      const displayName = getChannelDisplayName(
        streamChannel,
        client.userID || ""
      );
      const avatar = getChannelAvatar(streamChannel, client.userID || "");

      // FIXED: Handle anonymous group creator
      let createdBy = "Someone";
      if (isAnonymousGroup) {
        createdBy = "Anonymous"; // Don't reveal creator in anonymous groups
      } else if (channelData?.created_by?.id === user?.id) {
        createdBy = "You";
      } else if (channelData?.created_by?.name) {
        createdBy = channelData.created_by.name;
      } else if (channelData?.created_by?.id) {
        createdBy = `User ${channelData.created_by.id.slice(0, 8)}`;
      }

      // Format members with anonymous handling
      const formattedMembers: GroupMember[] = members.map((member: any) => {
        const isCurrentUser = member.user_id === user?.id;

        let memberName: string;
        let memberSubtitle: string = "";
        let memberAvatar: string | null = null;

        if (isAnonymousGroup) {
          // For anonymous groups, only show current user's identity
          if (isCurrentUser) {
            memberName = "You";
            memberSubtitle = user?.bio || "";
            memberAvatar = user?.profileImage || null;
          } else {
            // Anonymous members get generic names
            const memberIndex = members.findIndex(
              (m) => m.user_id === member.user_id
            );
            memberName = `Anonymous ${memberIndex + 1}`;
            memberSubtitle = "Anonymous member";
            memberAvatar = null; // No avatar for anonymous members
          }
        } else {
          // Regular group - show normal member info
          memberName = isCurrentUser
            ? "You"
            : member.user?.name || `User ${member.user_id.slice(0, 8)}`;
          memberSubtitle = member.user?.bio || "";
          memberAvatar = member.user?.image || null;
        }

        return {
          id: member.user_id,
          name: memberName,
          subtitle: memberSubtitle,
          avatar: memberAvatar,
          isAdmin:
            member.role === "admin" ||
            member.role === "owner" ||
            member.user_id === channelData?.created_by?.id,
          isCurrentUser,
          isAnonymous: isAnonymousGroup && !isCurrentUser,
        };
      });

      // FIXED: Sort members - "You" first, then alphabetical
      const sortedMembers = formattedMembers.sort((a, b) => {
        // Put current user first
        if (a.isCurrentUser) return -1;
        if (b.isCurrentUser) return 1;

        // For anonymous groups, sort by anonymous name
        if (isAnonymousGroup) {
          return a.name.localeCompare(b.name);
        }

        // Sort others alphabetically
        return a.name.localeCompare(b.name);
      });

      // Format creation date
      const createdAt = channelData?.created_at
        ? new Date(channelData.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Unknown";

      setGroupData({
        id: streamChannel.id ?? "",
        name: displayName,
        avatar: avatar,
        memberCount: members.length,
        createdBy: createdBy,
        createdAt: createdAt,
        description: channelData?.description || "",
        members: sortedMembers,
        isAnonymous: isAnonymousGroup,
      });

      console.log("🔍 Group data loaded:", {
        isAnonymous: isAnonymousGroup,
        memberCount: members.length,
        displayName,
      });
    } catch (error) {
      console.error("❌ Error loading group data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembers = async () => {
    if (!channel) return;

    try {
      // Get existing group members to pass as disabled
      const existingMembers = Object.keys(channel.state.members || {});

      // Navigate directly to select contact with add-members mode
      router.push({
        pathname: "/(routes)/chats/select-contact",
        params: {
          mode: "add-members",
          groupId: groupId,
          existingMembers: JSON.stringify(existingMembers),
        },
      });
    } catch (error) {
      console.error("❌ Error getting group members:", error);
      // Navigate anyway, just without existing members list
      router.push({
        pathname: "/(routes)/chats/select-contact",
        params: {
          mode: "add-members",
          groupId: groupId,
          existingMembers: JSON.stringify([]),
        },
      });
    }
  };

  const handleMemberPress = (member: GroupMember) => {
    // Don't allow actions on anonymous members (except yourself)
    if (member.isAnonymous && !member.isCurrentUser) {
      return;
    }
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const handleMakeAdmin = async (memberId: string) => {
    if (!channel) return;

    try {
      await channel.addModerators([memberId]);
      await loadGroupData();
      console.log("✅ Made admin:", memberId);
    } catch (error) {
      console.error("❌ Failed to make admin:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!channel) return;

    try {
      await StreamChatService.removeMembersFromGroup(channel, [memberId]);
      await loadGroupData();
      console.log("✅ Removed member:", memberId);
    } catch (error) {
      console.error("❌ Failed to remove member:", error);
    }
  };

  const handleChangeGroupName = async (newName: string) => {
    if (!channel) return;

    try {
      await StreamChatService.updateChannel(channel, { name: newName });
      setGroupData((prev) => (prev ? { ...prev, name: newName } : null));
      console.log("✅ Changed group name to:", newName);
    } catch (error) {
      console.error("❌ Failed to change group name:", error);
    }
  };

  const handleSaveDescription = async (newDescription: string) => {
    if (!channel) return;

    try {
      await StreamChatService.updateChannel(channel, {
        description: newDescription,
      });
      setGroupData((prev) =>
        prev ? { ...prev, description: newDescription } : null
      );
      console.log("✅ Updated description:", newDescription);
    } catch (error) {
      console.error("❌ Failed to update description:", error);
    }
  };

  const handleSearchMembers = () => {
    router.push(`/(routes)/chats/${groupId}/search-members`);
  };

  const handleExitGroup = async () => {
    if (!channel || !user?.id) return;

    try {
      await StreamChatService.removeMembersFromGroup(channel, [user.id]);
      router.push("/(routes)/chats");
      console.log("✅ Left group");
    } catch (error) {
      console.error("❌ Failed to leave group:", error);
    }
  };

  const menuOptions: DropdownOption[] = [
    {
      id: "add-members",
      title: "Add members",
      icon: UserPlus,
      onPress: handleAddMembers,
    },
    {
      id: "change-name",
      title: "Change group name",
      icon: Edit,
      onPress: () => setShowChangeNameModal(true),
    },
    {
      id: "group-permissions",
      title: "Group permissions",
      icon: Settings,
      onPress: () =>
        router.push(`/(routes)/chats/${groupId}/group-permissions`),
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
      textAlign: "center",
    },
    groupSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    anonymousBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    anonymousBadgeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
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
      opacity: 1,
    },
    anonymousMemberItem: {
      opacity: 0.7, // Slightly faded for anonymous members
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
    anonymousMemberName: {
      fontStyle: "italic",
      color: theme.colors.textSecondary,
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
      borderRadius: theme.spacing.xs,
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
      paddingVertical: theme.spacing.lg,
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

  if (loading || !groupData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Group Info</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

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
              type={groupData.isAnonymous ? "anonymous" : "group"}
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
              type={groupData.isAnonymous ? "anonymous" : "group"}
            />
          </View>
          <Text style={styles.groupName}>{groupData.name}</Text>
          <Text style={styles.groupSubtitle}>
            Group • {groupData.memberCount} members
          </Text>

          {/* Anonymous Group Badge */}
          {groupData.isAnonymous && (
            <View style={styles.anonymousBadge}>
              <EyeOff size={14} color={theme.colors.primary} />
              <Text style={styles.anonymousBadgeText}>Anonymous Group</Text>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          {groupData.description ? (
            <Text style={styles.addDescription}>{groupData.description}</Text>
          ) : (
            <TouchableOpacity onPress={() => setShowDescriptionModal(true)}>
              <Text style={styles.addDescription}>Add group description</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.createdBy}>
            Created by {groupData.createdBy}, {groupData.createdAt}
          </Text>
          {groupData.isAnonymous && (
            <Text style={[styles.createdBy, { marginTop: theme.spacing.xs }]}>
              Member identities are hidden in this group
            </Text>
          )}
        </View>

        {/* Members Section */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersTitle}>
              {groupData.memberCount} members
            </Text>
            {!groupData.isAnonymous && (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchMembers}
              >
                <Search size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Add Members Button */}
          <TouchableOpacity
            style={styles.memberItem}
            onPress={handleAddMembers}
          >
            <View style={styles.memberAvatar}>
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
              style={[
                styles.memberItem,
                member.isAnonymous && styles.anonymousMemberItem,
              ]}
              onPress={() => handleMemberPress(member)}
              disabled={member.isAnonymous && !member.isCurrentUser}
            >
              <View style={styles.memberAvatar}>
                <Avatar
                  source={member.avatar}
                  name={member.name}
                  size={40}
                  type={member.isAnonymous ? "anonymous" : "direct"}
                />
              </View>
              <View style={styles.memberContent}>
                <Text
                  style={[
                    styles.memberName,
                    member.isAnonymous && styles.anonymousMemberName,
                  ]}
                >
                  {member.name}
                </Text>
                {member.subtitle && !member.isAnonymous && (
                  <Text style={styles.memberSubtitle}>{member.subtitle}</Text>
                )}
                {member.isAnonymous && !member.isCurrentUser && (
                  <Text style={styles.memberSubtitle}>Anonymous member</Text>
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

        <TouchableOpacity style={styles.actionItem} onPress={handleExitGroup}>
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
