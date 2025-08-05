"use client";
import { Avatar } from "@/components/chats/Avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { StreamChatService } from "@/services/stream-chat.service";
import { UserService } from "@/services/user.service";
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

interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  name: string;
}

export default function GroupDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const { client, isConnected } = useStreamChat();

  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContactsData, setSelectedContactsData] = useState<
    ContactData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);

  useEffect(() => {
    if (params.selectedContacts) {
      try {
        const contacts = JSON.parse(params.selectedContacts as string);
        setSelectedContacts(contacts);
        loadSelectedContactsData(contacts);
      } catch (error) {
        console.error("Error parsing selected contacts:", error);
        setLoadingContacts(false);
      }
    } else {
      setLoadingContacts(false);
    }
  }, [params.selectedContacts]);

  const loadSelectedContactsData = async (contactIds: string[]) => {
    try {
      setLoadingContacts(true);

      // Load contact data from UserService
      const contactsData: ContactData[] = [];

      for (const contactId of contactIds) {
        try {
          const userData = await UserService.getUserById(contactId);
          if (userData.user) {
            contactsData.push({
              id: userData.user.id,
              firstName: userData.user.firstName,
              lastName: userData.user.lastName,
              profileImage: userData.user.profileImage,
              name: `${userData.user.firstName} ${userData.user.lastName}`,
            });
          }
        } catch (error) {
          console.warn(`Failed to load user ${contactId}:`, error);
          // Add placeholder data for failed contacts
          contactsData.push({
            id: contactId,
            firstName: "Unknown",
            lastName: "User",
            name: `User ${contactId.slice(0, 8)}`,
          });
        }
      }

      setSelectedContactsData(contactsData);
    } catch (error) {
      console.error("Error loading selected contacts data:", error);
      Alert.alert("Error", "Failed to load contact details");
    } finally {
      setLoadingContacts(false);
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

    if (!user?.id || !client?.userID || !isConnected) {
      Alert.alert("Error", "Not connected to chat service");
      return;
    }

    setLoading(true);

    try {
      // Add the current user to the participants
      const allParticipants = [user.id, ...selectedContacts];

      console.log("🔄 Creating Stream Chat group:", {
        name: groupName.trim(),
        members: allParticipants,
        createdBy: user.id,
        isAnonymous: params.isAnonymous === "true",
      });

      // Create the group chat using Stream Chat
      const groupChannel = await StreamChatService.createGroupChat(
        groupName.trim(),
        allParticipants,
        user.id,
        params.isAnonymous === "true"
      );

      console.log(
        "✅ Stream Chat group created successfully:",
        groupChannel.id
      );

      // Navigate to the new group chat
      router.replace({
        pathname: "/(routes)/chats/[id]",
        params: {
          id: groupChannel.id ?? "",
          userName: groupName.trim(),
          isGroup: "true",
        },
      });
    } catch (error) {
      console.error("❌ Error creating group:", error);
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
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      textTransform: "uppercase",
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
    },
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
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
    disabledFab: {
      backgroundColor: theme.colors.textSecondary,
    },
    connectionWarning: {
      backgroundColor: theme.colors.warning + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderRadius: theme.spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.warning,
    },
    connectionWarningText: {
      ...theme.typography.bodySmall,
      color: theme.colors.warning,
      fontWeight: "500",
    },
  });

  if (loadingContacts) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New group</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </View>
    );
  }

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

      {/* Connection Warning */}
      {!isConnected && (
        <View style={styles.connectionWarning}>
          <Text style={styles.connectionWarningText}>
            Not connected to chat service. Please check your connection.
          </Text>
        </View>
      )}

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
              maxLength={50}
            />
          </View>
        </View>

        {/* Members */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeader}>
            <Text style={styles.membersTitle}>
              Participants: {selectedContacts.length + 1}
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
                    You
                  </Text>
                </View>
              )}

              {/* Show selected contacts */}
              {selectedContactsData.map((contact) => (
                <View key={contact.id} style={styles.memberItem}>
                  <Avatar
                    source={contact.profileImage || null}
                    name={contact.name}
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
        style={[styles.fab, (!isConnected || loading) && styles.disabledFab]}
        onPress={handleCreateGroup}
        disabled={loading || !isConnected}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Check size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
}
