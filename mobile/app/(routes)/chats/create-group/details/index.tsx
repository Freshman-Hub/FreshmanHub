"use client";
import { Avatar } from "@/components/chats/Avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { ChatService } from "@/services/chat.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera, Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GroupDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContactsData, setSelectedContactsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.selectedContacts) {
      try {
        const contacts = JSON.parse(params.selectedContacts as string);
        setSelectedContacts(contacts);
        loadSelectedContactsData(contacts);
      } catch (error) {
        console.error("Error parsing selected contacts:", error);
      }
    }
  }, [params.selectedContacts]);

  const loadSelectedContactsData = async (contactIds: string[]) => {
    try {
      const users = await ChatService.getLocalUsers();
      const selectedUsers = users.filter((user) =>
        contactIds.includes(user.id)
      );
      setSelectedContactsData(selectedUsers);
    } catch (error) {
      console.error("Error loading selected contacts data:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return;
    }

    if (selectedContacts.length === 0) {
      Alert.alert("Error", "Please select at least one member");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setLoading(true);

    try {
      // Add the current user to the participants
      const allParticipants = [user.id, ...selectedContacts];

      // Create the group chat
      const groupId = await ChatService.createGroupChat(
        groupName.trim(),
        allParticipants,
        user.id,
        params.isAnonymous === "true"
      );

      console.log("✅ Group created successfully:", groupId);

      // Navigate to the new group chat
      router.push(`/(routes)/chats/${groupId}`);
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    headerTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
    },
    content: {
      flex: 1,
      paddingVertical: theme.spacing.lg,
    },
    groupInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    groupPhotoContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    groupNameContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    groupNameInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      fontWeight: "500",
    },
    emojiButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.sm,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    settingSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    settingAction: {
      padding: theme.spacing.sm,
    },
    membersSection: {
      marginTop: theme.spacing.lg,
    },
    membersHeader: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    membersTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    membersContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    membersScroll: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    memberItem: {
      alignItems: "center",
      width: 70,
    },
    memberName: {
      ...theme.typography.captionSmall,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      fontWeight: "500",
    },
    fab: {
      position: "absolute",
      bottom: 20,
      right: theme.spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New group</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Info */}
        <View style={styles.groupInfoContainer}>
          <TouchableOpacity style={styles.groupPhotoContainer}>
            <Camera size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.groupNameContainer}>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Group name"
              placeholderTextColor={theme.colors.textSecondary}
              value={groupName}
              onChangeText={setGroupName}
              autoFocus
            />
          </View>
        </View>

        {/* Members */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersTitle}>
              Members: {selectedContacts.length + 1} {/* +1 for current user */}
            </Text>
          </View>
          <View style={styles.membersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membersScroll}
            >
              {/* Show current user first */}
              {user && (
                <View style={styles.memberItem}>
                  <Avatar
                    source={user.profileImage || null}
                    name={`${user.firstName} ${user.lastName}`}
                    size={50}
                    type="direct"
                  />
                  <Text style={styles.memberName} numberOfLines={1}>
                    {user.firstName} (You)
                  </Text>
                </View>
              )}

              {/* Show selected contacts */}
              {selectedContactsData.map((contact) => (
                <View key={contact.id} style={styles.memberItem}>
                  <Avatar
                    source={contact.profileImage || null}
                    name={`${contact.firstName} ${contact.lastName}`}
                    size={50}
                    type="direct"
                  />
                  <Text style={styles.memberName} numberOfLines={1}>
                    {contact.firstName}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Create Group FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateGroup}
        disabled={loading}
      >
        {loading ? (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color="white" />
          </View>
        ) : (
          <Check size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
}
