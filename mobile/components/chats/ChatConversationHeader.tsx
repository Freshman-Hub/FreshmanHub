"use client";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  MoreVertical,
  User,
  Search,
  Flag,
  Shield,
  BellOff,
  MessageSquareOff,
  Palette,
  Info,
} from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";
import {
  OptionsDropdown,
  type DropdownOption,
} from "@/components/common/OptionsDropdown";
import { useRouter } from "expo-router";

interface ChatInfo {
  id: string;
  name: string;
  subtitle?: string;
  avatar: string | null;
  isOnline: boolean;
  type: "direct" | "group" | "anonymous" | "announcement";
  isAnonymous: boolean;
  memberCount?: number;
}

interface ChatConversationHeaderProps {
  chat: ChatInfo;
  onBack: () => void;
  onOptions: () => void;
  onSearch?: () => void;
}

export function ChatConversationHeader({
  chat,
  onBack,
  onOptions,
  onSearch,
}: ChatConversationHeaderProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const isGroupChat = chat.type === "group";

  const menuOptions: DropdownOption[] = isGroupChat
    ? [
        {
          id: "search",
          title: "Search",
          icon: Search,
          onPress: () => {
            setShowOptionsMenu(false);
            onSearch?.();
          },
        },
        {
          id: "group-info",
          title: "Group info",
          icon: Info,
          onPress: () => {
            setShowOptionsMenu(false);
            router.push(`/(routes)/chats/${chat.id}/group-info`);
          },
        },
        {
          id: "mute-notifications",
          title: "Mute notifications",
          icon: BellOff,
          onPress: () => console.log("Mute notifications"),
        },
        {
          id: "disappearing-messages",
          title: "Disappearing messages",
          icon: MessageSquareOff,
          onPress: () => console.log("Disappearing messages"),
        },
        {
          id: "chat-theme",
          title: "Chat theme",
          icon: Palette,
          onPress: () => console.log("Chat theme"),
        },
        {
          id: "report",
          title: "Report",
          icon: Flag,
          onPress: () => console.log("Report"),
        },
      ]
    : [
        {
          id: "view-contact",
          title: "View contact",
          icon: User,
          onPress: () => console.log("View contact"),
        },
        {
          id: "search",
          title: "Search",
          icon: Search,
          onPress: () => {
            setShowOptionsMenu(false);
            onSearch?.();
          },
        },
        {
          id: "report",
          title: "Report",
          icon: Flag,
          onPress: () => console.log("Report"),
        },
        {
          id: "block",
          title: "Block",
          icon: Shield,
          onPress: () => console.log("Block"),
        },
        {
          id: "mute-notifications",
          title: "Mute notifications",
          icon: BellOff,
          onPress: () => console.log("Mute notifications"),
        },
        {
          id: "disappearing-messages",
          title: "Disappearing messages",
          icon: MessageSquareOff,
          onPress: () => console.log("Disappearing messages"),
        },
        {
          id: "chat-theme",
          title: "Chat theme",
          icon: Palette,
          onPress: () => console.log("Chat theme"),
        },
      ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    avatarContainer: {
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    name: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    status: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    actionButton: {
      padding: theme.spacing.xs,
    },
  });

  const getStatusText = () => {
    if (chat.isAnonymous) return "Anonymous chat";
    if (chat.type === "group")
      return chat.subtitle || `Group • ${chat.memberCount} members`;
    return chat.isOnline ? "Online" : "Last seen recently";
  };

  const handleOptionsPress = () => {
    setShowOptionsMenu(true);
    onOptions();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Avatar
          source={chat.avatar}
          name={chat.name}
          size={40}
          isOnline={chat.isOnline}
          type={chat.type}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {chat.name}
        </Text>
        <Text style={styles.status}>{getStatusText()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleOptionsPress}
        >
          <MoreVertical size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <OptionsDropdown
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        options={menuOptions}
      />
    </View>
  );
}
