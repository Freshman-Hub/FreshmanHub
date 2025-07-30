"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Users,
  QrCode,
  HelpCircle,
  RefreshCw,
  UserCheck,
  X,
  ArrowRight,
  Check,
  UserX,
} from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";

// TODO: Replace with actual backend data
const mockContacts = [
  {
    id: "self",
    name: "Adoum Ouang-namou Emmanuel (You)",
    subtitle: "Message yourself",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "self",
  },
  {
    id: "1",
    name: "Mi Leilou",
    subtitle: "Hey there! I am using WhatsApp.",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "frequent",
  },
  {
    id: "2",
    name: "A. Aziz Djibrillou Manzo",
    subtitle: "",
    avatar: null,
    type: "contact",
  },
  {
    id: "3",
    name: "Aaaa",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
  {
    id: "4",
    name: "Aangpremier Nelson David Gamé",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
  {
    id: "5",
    name: "Aaron Amarh Ashitey Eng Inov Competition",
    subtitle: "Available",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
  {
    id: "6",
    name: "Abakar Djido",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
];

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
      onPress: () => console.log("Refresh"),
    },
    {
      id: "friends",
      title: "Friends",
      icon: UserCheck,
      onPress: () => console.log("Friends"),
    },
  ];

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const frequentContacts = filteredContacts.filter(
    (contact) => contact.type === "frequent"
  );
  const regularContacts = filteredContacts.filter(
    (contact) => contact.type === "contact" || contact.type === "self"
  );

  const handleContactPress = (contactId: string) => {
    if (isMultiSelect) {
      // Toggle selection for multi-select modes
      setSelectedContacts((prev) =>
        prev.includes(contactId)
          ? prev.filter((id) => id !== contactId)
          : [...prev, contactId]
      );
    } else {
      // Direct navigation for single select
      router.push(`/(routes)/chats/${contactId}`);
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
    return mockContacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );
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
              isAnonymous ? theme.colors.primary : theme.colors.textSecondary
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
                      <QrCode size={20} color={theme.colors.textSecondary} />
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
                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
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
    </View>
  );
}
