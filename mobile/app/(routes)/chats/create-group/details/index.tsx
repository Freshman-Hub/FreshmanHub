"use client";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Check,
} from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";

// Mock contacts data (should match the previous screen)
const mockContacts = [
  {
    id: "1",
    name: "Mi Leilou",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "2",
    name: "+233 50 366 6630",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "3",
    name: "A. Aziz Djibrillou Manzo",
    avatar: null,
  },
  {
    id: "4",
    name: "Aaaa",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: "5",
    name: "Aangpremier Nelson David Gamé",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function GroupDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [groupName, setGroupName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    if (params.selectedContacts) {
      try {
        const contacts = JSON.parse(params.selectedContacts as string);
        setSelectedContacts(contacts);
      } catch (error) {
        console.error("Error parsing selected contacts:", error);
      }
    }
  }, [params.selectedContacts]);

  const getSelectedContactsData = () => {
    return mockContacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );
  };

  const handleCreateGroup = () => {
    if (selectedContacts.length > 0) {
      // TODO: Create group with backend
      console.log("Creating group:", {
        name: groupName,
        members: selectedContacts,
      });

      // Navigate back to chats screen
      router.push("/(routes)/chats");
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
              Members: {selectedContacts.length}
            </Text>
          </View>
          <View style={styles.membersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membersScroll}
            >
              {getSelectedContactsData().map((contact) => (
                <View key={contact.id} style={styles.memberItem}>
                  <Avatar
                    source={contact.avatar}
                    name={contact.name}
                    size={50}
                    type="direct"
                  />
                  <Text style={styles.memberName} numberOfLines={1}>
                    {contact.name.split(" ")[0]}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Create Group FAB */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateGroup}>
        <Check size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
