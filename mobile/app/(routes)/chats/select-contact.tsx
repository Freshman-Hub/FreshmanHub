"use client";
import { Avatar } from "@/components/chats/Avatar";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { StreamChatService } from "@/services/stream-chat.service";
import { UserService } from "@/services/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  MoreVertical,
  QrCode,
  RefreshCw,
  Search,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Cache key for contacts
const CONTACTS_CACHE_KEY = "cached_contacts";
const CONTACTS_CACHE_TIMESTAMP_KEY = "cached_contacts_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

type SelectMode = "chat" | "group" | "broadcast" | "community" | "add-members";

interface Contact {
  id: string;
  name: string;
  subtitle: string;
  avatar: string | null;
  type: string;
  disabled?: boolean;
}

export default function SelectContactScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { client, isConnected } = useStreamChat();
  const { user } = useUser();


  // Determine mode from params
  const mode = (params.mode as SelectMode) || "chat";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Add-members specific state
  const [existingMembers, setExistingMembers] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);

  // Function to refresh contacts from Firebase
  const refreshContacts = async () => {
    console.log("🔄 Manually refreshing contacts...");
    setLoading(true);

    try {
      // Clear cache
      await AsyncStorage.removeItem(CONTACTS_CACHE_KEY);
      await AsyncStorage.removeItem(CONTACTS_CACHE_TIMESTAMP_KEY);

      // Fetch fresh data from UserService
      const { users, error } = await UserService.getAllUsers();

      if (error) {
        console.error("Error fetching users:", error);
        Alert.alert("Error", "Failed to refresh contacts");
        return;
      }

      const contactsList: Contact[] = [
        // Don't show "self" for add-members mode
        ...(mode !== "add-members"
          ? [
              {
                id: "self",
                name: `${user?.firstName} ${user?.lastName} (You)`,
                subtitle: "Message yourself",
                avatar: user?.profileImage || null,
                type: "self",
              },
            ]
          : []),
        ...users
          .filter((u) => u.id !== user?.id)
          .map((u) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            subtitle: u.bio || u.role || "",
            avatar: u.profileImage || null,
            type: "contact",
            // Mark existing members as disabled for add-members mode
            disabled: mode === "add-members" && existingMembers.includes(u.id),
          })),
      ];

      // Cache the fresh contacts
      const now = Date.now();
      await AsyncStorage.setItem(
        CONTACTS_CACHE_KEY,
        JSON.stringify(contactsList)
      );
      await AsyncStorage.setItem(CONTACTS_CACHE_TIMESTAMP_KEY, now.toString());

      setContacts(contactsList);
      console.log("✅ Contacts refreshed and cached");
    } catch (error) {
      console.error("❌ Error refreshing contacts:", error);
      Alert.alert("Error", "Failed to refresh contacts");
    } finally {
      setLoading(false);
    }
  };

  // Fix the useEffect dependency and logic
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Handle add-members mode parameters FIRST
    const setupAddMembersMode = () => {
      if (mode === "add-members") {
        const existingMembersParam = params.existingMembers as string;
        const groupIdParam = params.groupId as string;

        if (existingMembersParam) {
          try {
            const membersList = JSON.parse(existingMembersParam);
            setExistingMembers(membersList);
            return membersList; // Return for immediate use
          } catch (error) {
            console.error("Error parsing existing members:", error);
            setExistingMembers([]);
            return [];
          }
        }

        if (groupIdParam) {
          setGroupId(groupIdParam);
        }
      }
      return [];
    };

    // Get existing members immediately
    const currentExistingMembers = setupAddMembersMode();

    const loadContacts = async () => {
      try {
        // Check cached contacts
        const cachedContacts = await AsyncStorage.getItem(CONTACTS_CACHE_KEY);
        const cacheTimestamp = await AsyncStorage.getItem(
          CONTACTS_CACHE_TIMESTAMP_KEY
        );

        const now = Date.now();
        const isCacheValid =
          cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION;

        if (cachedContacts && isCacheValid) {
          console.log("✅ Using cached contacts");
          let contactsList = JSON.parse(cachedContacts);

          // Apply add-members mode filtering with CURRENT existing members
          if (mode === "add-members") {
            contactsList = contactsList
              .filter((contact: Contact) => contact.type !== "self")
              .map((contact: Contact) => ({
                ...contact,
                disabled: currentExistingMembers.includes(contact.id),
              }));
          }

          if (isMounted) {
            setContacts(contactsList);
            setLoading(false);
          }
          return;
        }

        // Fetch fresh contacts
        const { users, error } = await UserService.getAllUsers();

        if (error) {
          console.error("Error fetching users:", error);
          if (isMounted) {
            setContacts([]);
            setLoading(false);
          }
          return;
        }

        if (isMounted && users.length > 0) {
          const contactsList: Contact[] = [
            // Don't show "self" for add-members mode
            ...(mode !== "add-members"
              ? [
                  {
                    id: "self",
                    name: `${user?.firstName} ${user?.lastName} (You)`,
                    subtitle: "Message yourself",
                    avatar: user?.profileImage || null,
                    type: "self",
                  },
                ]
              : []),
            ...users
              .filter((u) => u.id !== user?.id)
              .map((u) => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                subtitle: u.bio || u.role || "",
                avatar: u.profileImage || null,
                type: "contact",
                // Use current existing members, not state
                disabled:
                  mode === "add-members" &&
                  currentExistingMembers.includes(u.id),
              })),
          ];

          // Cache the contacts
          await AsyncStorage.setItem(
            CONTACTS_CACHE_KEY,
            JSON.stringify(contactsList)
          );
          await AsyncStorage.setItem(
            CONTACTS_CACHE_TIMESTAMP_KEY,
            now.toString()
          );

          setContacts(contactsList);
          setLoading(false);
        } else {
          if (isMounted) {
            setContacts([]);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("❌ Error loading contacts:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
    // Fix dependency array - use the actual params instead of state
  }, [user, mode, params.existingMembers, params.groupId]);

  const isMultiSelect =
    mode === "group" ||
    mode === "broadcast" ||
    mode === "community" ||
    mode === "add-members";

  const quickActions = [
    {
      id: "new-group",
      title: "New group",
      icon: Users,
      onPress: () => router.push("/(routes)/chats/select-contact?mode=group"),
      show: mode === "chat",
    },
  ].filter((action) => action.show);

  const menuOptions: DropdownOption[] = [
    {
      id: "help",
      title: "Help",
      icon: HelpCircle,
      onPress: () => console.log("Help"),
    },
    {
      id: "refresh",
      title: "Refresh",
      icon: RefreshCw,
      onPress: refreshContacts,
    },
    {
      id: "friends",
      title: "Friends",
      icon: UserCheck,
      onPress: () => console.log("Friends"),
    },
  ];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const frequentContacts = filteredContacts.filter(
    (contact) => contact.type === "frequent"
  );
  const regularContacts = filteredContacts.filter(
    (contact) => contact.type === "contact" || contact.type === "self"
  );

  const handleContactPress = async (contactId: string) => {
    // Find contact to check if disabled
    const contact = contacts.find((c) => c.id === contactId);
    if (contact?.disabled) {
      return; // Don't allow selection of disabled contacts
    }

    if (isMultiSelect) {
      setSelectedContacts((prev) =>
        prev.includes(contactId)
          ? prev.filter((id) => id !== contactId)
          : [...prev, contactId]
      );
    } else {
      if (contactId === "self") {
        router.push(`/(routes)/chats/self`);
        return;
      }

      try {
        if (!user?.id) {
          Alert.alert("Error", "User session invalid");
          return;
        }

        // Get contact details (instant)
        const contact = contacts.find((c) => c.id === contactId);
        const contactName =
          contact?.name?.replace(" (You)", "") ||
          `User ${contactId.slice(0, 8)}`;

        console.log("🔄 Checking for existing conversation with:", contactName);

        // Check if there's already an existing Stream channel with this contact
        let existingChannelId = null;

        if (isConnected && client?.userID) {
          try {
            // Query for existing channels with this contact
            const channels = await client.queryChannels({
              type: "messaging",
              members: { $in: [client.userID] },
            });

            // Find channel with exactly these 2 users
            const existingChannel = channels.find((ch) => {
              const members = Object.keys(ch.state.members || {});
              return (
                members.length === 2 &&
                members.includes(client.userID || "") &&
                members.includes(contactId)
              );
            });

            if (existingChannel) {
              existingChannelId = existingChannel.id;
              console.log("✅ Found existing channel:", existingChannelId);
            }
          } catch (error) {
            console.warn("⚠️ Failed to check for existing channels:", error);
            // Continue with pending approach
          }
        }

        if (existingChannelId) {
          // Navigate to existing channel
          router.push({
            pathname: "/(routes)/chats/[id]",
            params: {
              id: existingChannelId, // Use existing channel ID
              userName: contactName,
              userAvatar: contact?.avatar || "",
              isGroup: "false",
            },
          });
        } else {
          // Create pending chat for new conversation
          router.push({
            pathname: "/(routes)/chats/[id]",
            params: {
              id: `pending_${user.id}_${contactId}`, // Use pending ID
              userName: contactName,
              userAvatar: contact?.avatar || "",
              contactId: contactId, // Pass contact ID for channel creation later
              isGroup: "false",
            },
          });
        }
      } catch (error) {
        console.error("❌ Error navigating to chat:", error);
        Alert.alert("Error", "Failed to open chat");
      }
    }
  };

  const handleRemoveSelected = (contactId: string) => {
    setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
  };

  const handleNext = async () => {
    if (selectedContacts.length === 0) return;

    setCreating(true);

    try {
      switch (mode) {
        case "add-members":
          // Debug: Log the values to see what's missing
          console.log("🔍 Add members debug:", {
            groupId,
            groupIdFromParams: params.groupId,
            client: !!client,
            isConnected,
            selectedContacts,
          });

          // Use groupId from params as fallback
          const targetGroupId = groupId || (params.groupId as string);

          if (!targetGroupId || !client || !isConnected) {
            console.error("❌ Missing required data:", {
              groupId: targetGroupId,
              client: !!client,
              isConnected,
            });
            throw new Error(
              `Missing required data: groupId=${!!targetGroupId}, client=${!!client}, connected=${isConnected}`
            );
          }

          console.log("🔄 Adding members to group:", {
            groupId: targetGroupId,
            members: selectedContacts,
          });

          // Get the group channel
          const channel = await StreamChatService.getChannel(
            "team",
            targetGroupId
          );

          // Add members to the group
          await StreamChatService.addMembersToGroup(channel, selectedContacts);

          console.log("✅ Members added successfully");

          // Navigate back to group chat
          router.replace(`/(routes)/chats/${targetGroupId}`);
          break;

        case "group":
          router.replace({
            pathname: "/(routes)/chats/create-group/details",
            params: {
              selectedContacts: JSON.stringify(selectedContacts),
              isAnonymous: isAnonymous.toString(),
            },
          });
          break;

        case "broadcast":
          // TODO: Implement broadcast creation
          console.log("Create broadcast with:", selectedContacts);
          break;

        case "community":
          // TODO: Implement community creation
          console.log("Create community with:", selectedContacts);
          break;
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : String(error);
      Alert.alert("Error", `Failed to proceed: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchMode(true);
  };

  const handleSearchBack = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const getSelectedContactsData = () => {
    return contacts.filter((contact) => selectedContacts.includes(contact.id));
  };

  const getHeaderTitle = () => {
    switch (mode) {
      case "group":
        return "New group";
      case "add-members":
        return "Add members";
      case "broadcast":
        return "New broadcast";
      case "community":
        return "New community";
      default:
        return "Select contact";
    }
  };

  const getHeaderSubtitle = () => {
    const chatStatus = isConnected
      ? "Chat features active"
      : "Chat features limited";

    if (isMultiSelect) {
      return `${selectedContacts.length} of ${filteredContacts.filter((c) => !c.disabled).length} selected • ${chatStatus}`;
    }
    return `${filteredContacts.length} contacts • ${chatStatus}`;
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
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    searchHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "500",
    },
    selectedContactsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    selectedContactsScroll: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    selectedContact: {
      alignItems: "center",
      width: 70,
    },
    selectedContactAvatar: {
      position: "relative",
    },
    removeButton: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: theme.colors.textSecondary,
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedContactName: {
      ...theme.typography.captionSmall,
      color: theme.colors.text,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      fontWeight: "500",
    },
    quickActionsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    quickAction: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
    },
    quickActionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
    },
    quickActionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      flex: 1,
    },
    qrIcon: {
      padding: theme.spacing.xs,
    },
    sectionHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
    },
    sectionTitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    disabledContactItem: {
      opacity: 0.5,
    },
    contactContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    contactName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    contactSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    disabledText: {
      color: theme.colors.textSecondary,
    },
    disabledAvatar: {
      opacity: 0.6,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing.md,
    },
    fab: {
      position: "absolute",
      bottom: 20,
      right: theme.spacing.md,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: creating
        ? theme.colors.textSecondary
        : theme.colors.primary,
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
    fabBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: theme.colors.accent || "#FF6B6B",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    fabBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    anonymousToggle: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    anonymousIcon: {
      marginRight: theme.spacing.md,
    },
    anonymousContent: {
      flex: 1,
    },
    anonymousTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    anonymousSubtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.md,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    loadingContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 12,
      alignItems: "center",
    },
    loadingText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginTop: theme.spacing.md,
      fontWeight: "500",
    },
  });

  return (
    <SafeAreaView style={styles.container} >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Header */}
          {isSearchMode ? (
            <View style={styles.searchHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleSearchBack}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="Search name or number..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          ) : (
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={creating}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
                <Text style={styles.headerSubtitle}>{getHeaderSubtitle()}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={handleSearchToggle}
                  disabled={creating}
                >
                  <Search size={24} color={theme.colors.text} />
                </TouchableOpacity>
                {mode === "chat" && (
                  <TouchableOpacity
                    onPress={() => setShowOptionsMenu(true)}
                    disabled={creating}
                  >
                    <MoreVertical size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Anonymous Toggle (Group mode only) */}
          {mode === "group" && (
            <View style={styles.anonymousToggle}>
              <View style={styles.anonymousIcon}>
                <UserX size={24} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.anonymousContent}>
                <Text style={styles.anonymousTitle}>Anonymous Group</Text>
                <Text style={styles.anonymousSubtitle}>
                  Hide member identities in this group
                </Text>
              </View>
              <Switch
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                disabled={creating}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + "40",
                }}
                thumbColor={
                  isAnonymous
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
            </View>
          )}

          {/* Selected Contacts (Multi-select modes only) */}
          {isMultiSelect && selectedContacts.length > 0 && (
            <View style={styles.selectedContactsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedContactsScroll}
              >
                {getSelectedContactsData().map((contact) => (
                  <View key={contact.id} style={styles.selectedContact}>
                    <View style={styles.selectedContactAvatar}>
                      <Avatar
                        source={contact.avatar}
                        name={contact.name}
                        size={50}
                        type="direct"
                      />
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveSelected(contact.id)}
                        disabled={creating}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.selectedContactName} numberOfLines={1}>
                      {contact.name.split(" ")[0]}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Quick Actions (Only show in chat mode) */}
            {mode === "chat" && (
              <View style={styles.quickActionsContainer}>
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.quickAction}
                      onPress={action.onPress}
                      disabled={creating}
                    >
                      <View style={styles.quickActionIcon}>
                        <IconComponent size={20} color="white" />
                      </View>
                      <Text style={styles.quickActionText}>{action.title}</Text>
                      {action.id === "new-contact" && (
                        <TouchableOpacity
                          style={styles.qrIcon}
                          onPress={() => console.log("QR Scanner")}
                          disabled={creating}
                        >
                          <QrCode
                            size={20}
                            color={theme.colors.textSecondary}
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Frequently Contacted (Show if exists) */}
            {frequentContacts.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Frequently contacted</Text>
                </View>
                {frequentContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={[
                      styles.contactItem,
                      contact.disabled && styles.disabledContactItem,
                    ]}
                    onPress={() => handleContactPress(contact.id)}
                    disabled={creating || contact.disabled}
                  >
                    <View style={contact.disabled && styles.disabledAvatar}>
                      <Avatar
                        source={contact.avatar}
                        name={contact.name}
                        size={40}
                        type="direct"
                      />
                    </View>
                    <View style={styles.contactContent}>
                      <Text
                        style={[
                          styles.contactName,
                          contact.disabled && styles.disabledText,
                        ]}
                      >
                        {contact.name}
                      </Text>
                      {contact.subtitle && (
                        <Text
                          style={[
                            styles.contactSubtitle,
                            contact.disabled && styles.disabledText,
                          ]}
                        >
                          {contact.disabled
                            ? "Already in group"
                            : contact.subtitle}
                        </Text>
                      )}
                    </View>
                    {isMultiSelect &&
                      selectedContacts.includes(contact.id) &&
                      !contact.disabled && (
                        <View style={styles.checkmark}>
                          <Check size={16} color="white" />
                        </View>
                      )}
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {mode === "add-members"
                  ? "Available contacts"
                  : "Contacts on Freshman Hub"}
              </Text>
            </View>

            {/* Contacts List */}
            {regularContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  contact.disabled && styles.disabledContactItem,
                ]}
                onPress={() => handleContactPress(contact.id)}
                disabled={creating || contact.disabled}
              >
                <Avatar
                  source={contact.avatar}
                  name={contact.name}
                  size={40}
                  type={contact.type === "self" ? "direct" : "direct"}
                />
                <View style={styles.contactContent}>
                  <Text
                    style={[
                      styles.contactName,
                      contact.disabled && styles.disabledText,
                    ]}
                  >
                    {contact.name}
                  </Text>
                  {contact.subtitle && (
                    <Text
                      style={[
                        styles.contactSubtitle,
                        contact.disabled && styles.disabledText,
                      ]}
                    >
                      {contact.disabled ? "Already in group" : contact.subtitle}
                    </Text>
                  )}
                </View>
                {isMultiSelect &&
                  selectedContacts.includes(contact.id) &&
                  !contact.disabled && (
                    <View style={styles.checkmark}>
                      <Check size={16} color="white" />
                    </View>
                  )}
              </TouchableOpacity>
            ))}

            {/* Empty state */}
            {regularContacts.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? "No contacts found"
                    : mode === "add-members"
                      ? "All available contacts are already in this group"
                      : "No contacts available"}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Floating Action Button (Multi-select modes only) */}
          {isMultiSelect && selectedContacts.length > 0 && (
            <TouchableOpacity
              style={styles.fab}
              onPress={handleNext}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <ArrowRight size={24} color="white" />
                  <View style={styles.fabBadge}>
                    <Text style={styles.fabBadgeText}>
                      {selectedContacts.length}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Options Menu (Chat mode only) */}
          {mode === "chat" && (
            <OptionsDropdown
              visible={showOptionsMenu}
              onClose={() => setShowOptionsMenu(false)}
              options={menuOptions}
            />
          )}

          {/* Loading Overlay */}
          {creating && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                  {mode === "add-members"
                    ? "Adding members..."
                    : "Creating chat..."}
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
