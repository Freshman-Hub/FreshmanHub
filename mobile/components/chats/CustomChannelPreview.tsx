"use client";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Channel } from "stream-chat";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "@/components/chats/Avatar"; // Assuming this is a custom Avatar component
import {
  getChannelDisplayName,
  getChannelAvatar,
  formatChatTimestamp,
} from "@/utils/stream-chat.helpers";
import { useStreamChat } from "@/contexts/StreamChatContext";
import { useMemo } from "react";


interface CustomChannelPreviewProps {
  channel: Channel;
  isSelected: boolean;
  onPress: (channelId: string, channel: Channel) => void; // Updated to pass channel object
  onLongPress: (channelId: string) => void;
}

export function CustomChannelPreview({
  channel,
  isSelected,
  onPress,
  onLongPress,
}: CustomChannelPreviewProps) {
  const { theme } = useTheme();
  const { client } = useStreamChat();

  const currentUserId = client?.userID || "";

  const displayName = useMemo(
    () => getChannelDisplayName(channel, currentUserId),
    [channel, currentUserId]
  );
  const avatar = getChannelAvatar(channel, currentUserId);
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  const lastMessageText = lastMessage?.text || "";
  const timestamp = lastMessage
    ? new Date(lastMessage.created_at!).getTime()
    : channel.data?.created_at ? new Date(channel.data.created_at).getTime() : Date.now();
  const formattedTimestamp = formatChatTimestamp(timestamp);
  const unreadCount = channel.state.unreadCount || 0;
  const online =
    channel.type === "messaging" &&
    Object.values(channel.state.members).some(
      (member: any) => member.user_id !== currentUserId && member.user?.online
    );

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 2, // Slightly more vertical padding
      backgroundColor: isSelected
        ? theme.colors.primary + "20"
        : theme.colors.background,
      borderBottomWidth: StyleSheet.hairlineWidth, // Finer line
      borderBottomColor: theme.colors.border,
    },
    content: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2, // Space between name/timestamp and message
    },
    name: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600", // Bolder name
      flexShrink: 1,
      marginRight: theme.spacing.xs, // Space before timestamp
    },
    timestamp: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary, // Greyed out timestamp
        fontSize: 11, // Slightly smaller font
        fontWeight: "500", // Medium weight for timestamp
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    lastMessage: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary, // Greyed out message
      flex: 1,
        marginRight: theme.spacing.sm,
        fontSize: 13, // Slightly larger for better readability
        fontWeight: "400", // Regular weight for last message
    },
    unreadBadge: {
      backgroundColor: theme.colors.primary, // WhatsApp green
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 6,
    },
    unreadText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(channel.id!, channel)} // Pass channel object
      onLongPress={() => onLongPress(channel.id!)}
    >
      <Avatar
        source={avatar}
        name={displayName}
        size={50} // Slightly larger avatar
        online={online}
        type={channel.type === "team" ? "group" : "direct"}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.timestamp}>{formattedTimestamp}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
