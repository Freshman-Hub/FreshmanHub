"use client";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Search, Check, X } from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";

// Mock contacts data (excluding existing members)
const mockContacts = [
  {
    id: "2",
    name: "Mi Leilou",
    subtitle: "Hey there! I am using WhatsApp.",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "frequent",
  },
  {
    id: "3",
    name: "Jacqueline Lompo",
    subtitle: "salut",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
  {
    id: "4",
    name: "A. Aziz Djibrillou Manzo",
    subtitle: "",
    avatar: null,
    type: "contact",
  },
  {
    id: "5",
    name: "Naré Barké Noaga Mariama",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    type: "contact",
  },
];

// Existing group members (to exclude from selection)
const existingMembers = ["self", "member-1"];

export default function AddMembersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const groupId = params.id as string;

  // Filter out existing members and apply search
  const availableContacts = mockContacts.filter((contact) => {
    const notExistingMember = !existingMembers.includes(contact.id);
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    return notExistingMember && matchesSearch;
  });

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleRemoveSelected = (contactId: string) => {
    setSelectedContacts((prev) => prev.filter((id) => id !== contactId));
  };

  const handleAddMembers = () => {
    if (selectedContacts.length > 0) {
      // TODO: Add members to group via backend
      console.log("Adding members to group:", {
        groupId,
        members: selectedContacts,
      });

      // Navigate back to group chat and show system messages
      router.push(
        `/(routes)/chats/${groupId}?newMembers=${JSON.stringify(selectedContacts)}`
      );
    }
  };

  const getSelectedContactsData = () => {
    return mockContacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );
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
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      margin: theme.spacing.md,
    },
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    selectedContactsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
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
    fabText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
      marginTop: 2,
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add members</Text>
          <Text style={styles.headerSubtitle}>
            {selectedContacts.length} of {availableContacts.length} selected
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Selected Contacts */}
      {selectedContacts.length > 0 && (
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
        {/* Available Contacts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available contacts</Text>
        </View>
        {availableContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => handleContactToggle(contact.id)}
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
                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
              )}
            </View>
            {selectedContacts.includes(contact.id) && (
              <View style={styles.checkmark}>
                <Check size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Members FAB */}
      {selectedContacts.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleAddMembers}>
          <Check size={24} color="white" />
          <Text style={styles.fabText}>{selectedContacts.length}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
