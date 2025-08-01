"use client";
import { Avatar } from "@/components/chats/Avatar";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useTheme } from "@/contexts/ThemeContext";
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
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

import { useUser } from "@/contexts/UserContext";
import { ChatService } from "@/services/chat.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cache key for contacts
const CONTACTS_CACHE_KEY = "cached_contacts";
const CONTACTS_CACHE_TIMESTAMP_KEY = "cached_contacts_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

type SelectMode = "chat" | "group" | "broadcast" | "community";

export default function SelectContactScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Determine mode from params
  const mode = (params.mode as SelectMode) || "chat";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // ...existing code...
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Get current user

  // Function to refresh contacts from Firestore
  const refreshContacts = async () => {
    console.log("🔄 Manually refreshing contacts...");
    setLoading(true);

    try {
      // Clear cache
      await AsyncStorage.removeItem(CONTACTS_CACHE_KEY);
      await AsyncStorage.removeItem(CONTACTS_CACHE_TIMESTAMP_KEY);

      // Fetch fresh data
      const users = await ChatService.getLocalUsers();
      console.log("Fresh users from Firestore:", users);

      const contactsList = [
        {
          id: "self",
          name: `${user?.firstName} ${user?.lastName} (You)`,
          subtitle: "Message yourself",
          avatar: user?.profileImage || null,
          type: "self",
        },
        ...users
          .filter((u) => u.id !== user?.id)
          .map((u) => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            subtitle: u.bio || "",
            avatar: u.profileImage || null,
            type: "contact",
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    console.log("Starting to load contacts...");

    const loadContacts = async () => {
      try {
        // Check if we have cached contacts
        const cachedContacts = await AsyncStorage.getItem(CONTACTS_CACHE_KEY);
        const cacheTimestamp = await AsyncStorage.getItem(
          CONTACTS_CACHE_TIMESTAMP_KEY
        );

        const now = Date.now();
        const isCacheValid =
          cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION;

        if (cachedContacts && isCacheValid) {
          console.log("✅ Using cached contacts");
          const contactsList = JSON.parse(cachedContacts);
          if (isMounted) {
            setContacts(contactsList);
            setLoading(false);
          }
          return;
        }

        console.log("🔄 Cache expired or missing, fetching from Firestore...");

        // Fetch fresh contacts from Firestore
        const users = await ChatService.getLocalUsers();
        console.log("users from Firestore:", users);
        console.log("users length:", users.length);

        if (isMounted && users.length > 0) {
          console.log("Found users in Firestore, setting contacts...");
          const contactsList = [
            {
              id: "self",
              name: `${user?.firstName} ${user?.lastName} (You)`,
              subtitle: "Message yourself",
              avatar: user?.profileImage || null,
              type: "self",
            },
            ...users
              .filter((u) => u.id !== user?.id)
              .map((u) => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                subtitle: u.bio || "",
                avatar: u.profileImage || null,
                type: "contact",
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
          console.log("✅ Contacts cached successfully");

          if (isMounted) {
            setContacts(contactsList);
            setLoading(false);
          }
        } else {
          console.log("No users found in Firestore");
          if (isMounted) {
            setContacts([]);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("❌ Error loading contacts:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isMultiSelect =
    mode === "group" || mode === "broadcast" || mode === "community";

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
    if (isMultiSelect) {
      // Toggle selection for multi-select modes
      setSelectedContacts((prev) =>
        prev.includes(contactId)
          ? prev.filter((id) => id !== contactId)
          : [...prev, contactId]
      );
    } else {
      // Create or get existing chat for direct conversation
      if (contactId === "self") {
        // Handle self-chat (if needed)
        router.push(`/(routes)/chats/${contactId}`);
        return;
      }

      try {
        console.log("Creating/finding chat with user:", contactId);

        if (!user?.id) {
          console.error("❌ User ID is undefined");
          return;
        }

        // Get the other user's info to set the chat name
        const otherUser = contacts.find((c) => c.id === contactId);
        const otherUserName = otherUser ? otherUser.name : "Unknown User";

        // Create the chat
        const chatId = await ChatService.createDirectChat(user.id, contactId);

        console.log("✅ Chat created/found:", chatId);
        router.push(`/(routes)/chats/${chatId}`);
      } catch (error) {
        console.error("❌ Error creating chat:", error);
        // Fallback to direct navigation
        router.push(`/(routes)/chats/${contactId}`);
      }
    }
  };

  const handleRemoveSelected = (contactId: string) => {
    setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
  };

  const handleNext = () => {
    if (selectedContacts.length > 0) {
      switch (mode) {
        case "group":
          router.push({
            pathname: "/(routes)/chats/create-group/details",
            params: {
              selectedContacts: JSON.stringify(selectedContacts),
              isAnonymous: isAnonymous.toString(),
            },
          });
          break;
        case "broadcast":
          // TODO: Navigate to broadcast details
          console.log("Create broadcast with:", selectedContacts);
          break;
        case "community":
          // TODO: Navigate to community details
          console.log("Create community with:", selectedContacts);
          break;
      }
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
      case "broadcast":
        return "New broadcast";
      case "community":
        return "New community";
      default:
        return "Select contact";
    }
  };

  const getHeaderSubtitle = () => {
    if (isMultiSelect) {
      return `${selectedContacts.length} of ${filteredContacts.length} selected`;
    }
    return `${filteredContacts.length} contacts`;
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
  });

  return (
    <View style={styles.container}>
      {/* Show loading spinner when loading */}
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
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
                <Text style={styles.headerSubtitle}>{getHeaderSubtitle()}</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={handleSearchToggle}>
                  <Search size={24} color={theme.colors.text} />
                </TouchableOpacity>
                {mode === "chat" && (
                  <TouchableOpacity onPress={() => setShowOptionsMenu(true)}>
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
                    >
                      <View style={styles.quickActionIcon}>
                        <IconComponent size={20} color="white" />
                      </View>
                      <Text style={styles.quickActionText}>{action.title}</Text>
                      {action.id === "new-contact" && (
                        <TouchableOpacity
                          style={styles.qrIcon}
                          onPress={() => console.log("QR Scanner")}
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
                    style={styles.contactItem}
                    onPress={() => handleContactPress(contact.id)}
                  >
                    <Avatar
                      source={contact.avatar}
                      name={contact.name}
                      size={40}
                      type="direct"
                    />
                    <View style={styles.contactContent}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      {contact.subtitle && (
                        <Text style={styles.contactSubtitle}>
                          {contact.subtitle}
                        </Text>
                      )}
                    </View>
                    {isMultiSelect && selectedContacts.includes(contact.id) && (
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
              <Text style={styles.sectionTitle}>Contacts on Freshman Hub</Text>
            </View>

            {/* Contacts List */}
            {regularContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => handleContactPress(contact.id)}
              >
                <Avatar
                  source={contact.avatar}
                  name={contact.name}
                  size={40}
                  type={contact.type === "self" ? "direct" : "direct"}
                />
                <View style={styles.contactContent}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  {contact.subtitle && (
                    <Text style={styles.contactSubtitle}>
                      {contact.subtitle}
                    </Text>
                  )}
                </View>
                {isMultiSelect && selectedContacts.includes(contact.id) && (
                  <View style={styles.checkmark}>
                    <Check size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Floating Action Button (Multi-select modes only) */}
          {isMultiSelect && selectedContacts.length > 0 && (
            <TouchableOpacity style={styles.fab} onPress={handleNext}>
              <ArrowRight size={24} color="white" />
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
        </>
      )}
    </View>
  );
}
