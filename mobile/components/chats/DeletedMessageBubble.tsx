"use client";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Ban } from "lucide-react-native";

interface DeletedMessageBubbleProps {
  timestamp: string;
  isOwn: boolean;
  onLongPress?: () => void;
}

export function DeletedMessageBubble({
  timestamp,
  isOwn,
  onLongPress,
}: DeletedMessageBubbleProps) {
  const { theme } = useTheme();

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
    bubble: {
      maxWidth: "80%",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderBottomRightRadius: isOwn ? theme.spacing.xs : theme.borderRadius.lg,
      borderBottomLeftRadius: isOwn ? theme.borderRadius.lg : theme.spacing.xs,
    },
    messageContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    messageText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: theme.spacing.xs,
    },
    timestamp: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontSize: 11,
    },
  });

  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      <View
        style={[
          styles.container,
          isOwn ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <View style={styles.bubble}>
          <View style={styles.messageContent}>
            <View style={styles.icon}>
              <Ban size={16} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.messageText}>You deleted this message</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
