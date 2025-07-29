"use client";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, CheckCheck } from "lucide-react-native";
import { Avatar } from "./Avatar";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
  sender?: string;
  senderAvatar?: string;
  replyTo?: {
    id: string;
    text: string;
    sender: string;
  };
}

interface MessageBubbleProps {
  message: Message;
  isSelected?: boolean;
  onLongPress?: () => void;
  onPress?: () => void;
  isHighlighted?: boolean;
  isCurrentSearchResult?: boolean;
  searchQuery?: string;
  showSender?: boolean;
}

export function MessageBubble({
  message,
  isSelected = false,
  onLongPress,
  onPress,
  isHighlighted = false,
  isCurrentSearchResult = false,
  searchQuery = "",
  showSender = false,
}: MessageBubbleProps) {
  const { theme } = useTheme();

  const getStatusIcon = () => {
    if (!message.isOwn || !message.status) return null;

    switch (message.status) {
      case "sent":
        return <Check size={16} color={theme.colors.textSecondary} />;
      case "delivered":
        return <CheckCheck size={16} color={theme.colors.textSecondary} />;
      case "read":
        return <CheckCheck size={16} color={theme.colors.primary} />;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    ownMessage: {
      justifyContent: "flex-end",
    },
    otherMessage: {
      justifyContent: "flex-start",
    },
    messageContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      maxWidth: "80%",
    },
    avatar: {
      marginRight: theme.spacing.sm,
    },
    bubble: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: message.isOwn
        ? isSelected
          ? theme.colors.primary + "40"
          : theme.colors.primary + "15"
        : isSelected
          ? theme.colors.textSecondary + "40"
          : theme.colors.surface,
      borderBottomRightRadius: message.isOwn
        ? theme.spacing.xs
        : theme.borderRadius.lg,
      borderBottomLeftRadius: message.isOwn
        ? theme.borderRadius.lg
        : theme.spacing.xs,
      borderWidth: isCurrentSearchResult ? 2 : 0,
      borderColor: isCurrentSearchResult ? theme.colors.primary : "transparent",
    },
    senderName: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.xs,
    },
    replyContainer: {
      backgroundColor: "rgba(0,0,0,0.1)",
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      paddingLeft: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },
    replySender: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: 2,
    },
    replyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    timestamp: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
  });

  // Don't render if message text is empty
  if (!message.text) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress} onPress={onPress}>
      <View
        style={[
          styles.container,
          message.isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View style={styles.messageContainer}>
          {showSender && !message.isOwn && (
            <View style={styles.avatar}>
              <Avatar
                source={message.senderAvatar || null}
                name={message.sender || "User"}
                size={32}
                type="direct"
              />
            </View>
          )}
          <View style={styles.bubble}>
            {showSender && !message.isOwn && message.sender && (
              <Text style={styles.senderName}>{message.sender}</Text>
            )}
            {message.replyTo && (
              <View style={styles.replyContainer}>
                <Text style={styles.replySender}>{message.replyTo.sender}</Text>
                <Text style={styles.replyText} numberOfLines={2}>
                  {message.replyTo.text}
                </Text>
              </View>
            )}
            <Text style={styles.messageText}>{message.text}</Text>
            <View style={styles.footer}>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
              {getStatusIcon()}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
