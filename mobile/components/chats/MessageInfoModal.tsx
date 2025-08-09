"use client";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, CheckCheck } from "lucide-react-native";

interface MessageInfo {
  id: string;
  text: string;
  timestamp: string;
  deliveredAt?: string;
  readAt?: string;
  status: "sent" | "delivered" | "read";
}

interface MessageInfoModalProps {
  visible: boolean;
  onClose: () => void;
  message: MessageInfo | null;
}

export function MessageInfoModal({
  visible,
  onClose,
  message,
}: MessageInfoModalProps) {
  const { theme } = useTheme();

  if (!message) return null;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
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
      padding: theme.spacing.lg,
    },
    messageBubble: {
      backgroundColor: theme.colors.primary + "15",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderBottomRightRadius: theme.spacing.xs,
      alignSelf: "flex-end",
      maxWidth: "80%",
      marginBottom: theme.spacing.xl,
    },
    messageText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 20,
      fontWeight: "400",
    },
    messageFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    messageTimestamp: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontSize: 11,
      fontWeight: "400",
    },
    statusSection: {
      marginBottom: theme.spacing.lg,
    },
    statusItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    statusIcon: {
      marginRight: theme.spacing.md,
    },
    statusContent: {
      flex: 1,
    },
    statusTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
    },
    statusTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "400",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.sm,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Message info</Text>
        </View>

        <View style={styles.content}>
          {/* Message Preview */}
          <View style={styles.messageBubble}>
            <Text style={styles.messageText}>{message.text}</Text>
            <View style={styles.messageFooter}>
              <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
              <CheckCheck size={16} color={theme.colors.primary} />
            </View>
          </View>

          {/* Status Information */}
          <View style={styles.statusSection}>
            {message.readAt && (
              <>
                <View style={styles.statusItem}>
                  <View style={styles.statusIcon}>
                    <CheckCheck size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.statusContent}>
                    <Text style={styles.statusTitle}>Read</Text>
                    <Text style={styles.statusTime}>—</Text>
                  </View>
                </View>
                <View style={styles.divider} />
              </>
            )}

            <View style={styles.statusItem}>
              <View style={styles.statusIcon}>
                <CheckCheck size={20} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>Delivered</Text>
                <Text style={styles.statusTime}>
                  {message.deliveredAt || message.timestamp}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
