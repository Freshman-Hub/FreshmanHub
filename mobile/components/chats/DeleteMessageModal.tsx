"use client";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface DeleteMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onDeleteForEveryone?: () => void;
  onDeleteForMe: () => void;
  canDeleteForEveryone?: boolean;
  isDeletedMessage?: boolean;
}

export function DeleteMessageModal({
  visible,
  onClose,
  onDeleteForEveryone,
  onDeleteForMe,
  canDeleteForEveryone = true,
  isDeletedMessage = false,
}: DeleteMessageModalProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      marginHorizontal: theme.spacing.xl,
      minWidth: 280,
      maxWidth: 320,
    },
    title: {
      ...theme.typography.body,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    option: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
    },
    optionText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "500",
    },
    cancelText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.xs,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <Text style={styles.title}>Delete message?</Text>

              {canDeleteForEveryone &&
                !isDeletedMessage &&
                onDeleteForEveryone && (
                  <>
                    <TouchableOpacity
                      style={styles.option}
                      onPress={onDeleteForEveryone}
                    >
                      <Text style={styles.optionText}>Delete for everyone</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                  </>
                )}

              <TouchableOpacity style={styles.option} onPress={onDeleteForMe}>
                <Text style={styles.optionText}>Delete for you</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.option} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
