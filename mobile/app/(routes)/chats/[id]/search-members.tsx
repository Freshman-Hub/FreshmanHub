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
import { ArrowLeft } from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";

// Mock group members data
const mockMembers = [
  {
    id: "self",
    name: "You",
    subtitle: "Can't talk, WhatsApp only",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAdmin: true,
    isCurrentUser: true,
  },
  {
    id: "member-1",
    name: "Adoum Ouang-namou Emmanuel",
    subtitle: "",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    isAdmin: false,
    isCurrentUser: false,
  },
];

export default function SearchMembersScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const groupId = params.id as string;

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    searchInput: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "500",
    },
    memberItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
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
  });

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>

      {/* Members List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredMembers.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={styles.memberItem}
            onPress={() => {
              // Navigate to member's conversation if not current user
              if (!member.isCurrentUser) {
                router.push(`/(routes)/chats/${member.id}`);
              }
            }}
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
      </ScrollView>
    </View>
  );
}
