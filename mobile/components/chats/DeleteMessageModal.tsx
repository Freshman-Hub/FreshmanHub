"use client";
import {
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useRef } from "react";

interface DeleteMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDeleteForMe?: () => void;
  messageCount?: number;
  canDeleteForEveryone?: boolean;
}

export function DeleteMessageModal({
  visible,
  onClose,
  onDelete,
  onDeleteForMe,
  messageCount = 1,
  canDeleteForEveryone = false,
}: DeleteMessageModalProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleDeleteForEveryone = () => {
    onDelete();
    onClose();
  };

  const handleDeleteForMe = () => {
    onDeleteForMe?.();
    onClose();
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.lg,
      minWidth: 280,
      maxWidth: 320,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    option: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: 16,
      fontWeight: "400",
      textAlign: "center",
      color: theme.colors.primary,
    },
    deleteForEveryoneText: {
      fontSize: 16,
      fontWeight: "400",
      textAlign: "center",
      color: theme.colors.error,
    },
    cancelText: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      color: theme.colors.primary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Text style={styles.title}>
                Delete{" "}
                {messageCount > 1 ? `${messageCount} messages` : "message"}?
              </Text>

              {/* Delete for Everyone - Only show if user owns all messages */}
              {canDeleteForEveryone && (
                <TouchableOpacity
                  style={styles.option}
                  onPress={handleDeleteForEveryone}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteForEveryoneText}>
                    Delete for everyone
                  </Text>
                </TouchableOpacity>
              )}

              {/* Delete for Me - Always available */}
              <TouchableOpacity
                style={[
                  styles.option,
                  !canDeleteForEveryone && styles.lastOption,
                ]}
                onPress={handleDeleteForMe}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>Delete for me</Text>
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                style={[styles.option, styles.lastOption]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
