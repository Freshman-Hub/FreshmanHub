"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Users, UserX, Megaphone } from "lucide-react-native";
import { Avatar } from "@/components/chats/Avatar";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string | null;
  isOnline: boolean;
  type: "direct" | "group" | "anonymous" | "announcement";
  isVerified: boolean;
}

interface ChatListItemProps {
  chat: Chat;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

export function ChatListItem({
  chat,
  onPress,
  onLongPress,
  isSelected = false,
}: ChatListItemProps) {
  const { theme } = useTheme();

  const getTypeIcon = () => {
    switch (chat.type) {
      case "group":
        return <Users size={16} color={theme.colors.textSecondary} />;
      case "anonymous":
        return <UserX size={16} color={theme.colors.textSecondary} />;
      case "announcement":
        return <Megaphone size={16} color={theme.colors.primary} />;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: isSelected
        ? theme.colors.primary + "20"
        : theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    avatarContainer: {
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.xs,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    name: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginRight: theme.spacing.xs,
    },
    timestamp: {
      ...theme.typography.captionSmall,
      color:
        chat.unreadCount > 0
          ? theme.colors.primary
          : theme.colors.textSecondary,
      fontWeight: chat.unreadCount > 0 ? "600" : "400",
    },
    messageContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    lastMessage: {
      ...theme.typography.bodySmall,
      color:
        chat.unreadCount > 0 ? theme.colors.text : theme.colors.textSecondary,
      flex: 1,
      marginRight: theme.spacing.sm,
      fontWeight: chat.unreadCount > 0 ? "500" : "400",
    },
    unreadBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxxl,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    unreadText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontSize: 10,
      fontWeight: "600",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.avatarContainer}>
        <Avatar
          source={chat.avatar}
          name={chat.name}
          size={50}
          isOnline={chat.isOnline}
          type={chat.type}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {chat.name}
            </Text>
            {getTypeIcon()}
          </View>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
