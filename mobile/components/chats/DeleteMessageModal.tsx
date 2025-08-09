"use client";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Trash2, Eye, Users } from "lucide-react-native";
import { useEffect, useRef } from "react";

interface DeleteMessageModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onDeleteForMe?: () => void;
  messageCount?: number;
  canDeleteForEveryone?: boolean; // NEW: Determines if user can delete for everyone
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
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.xl,
      marginHorizontal: theme.spacing.xl,
      minWidth: 300,
      maxWidth: 340,
      elevation: 10,
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
    },
    iconContainer: {
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.error + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      fontWeight: "700",
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      lineHeight: 20,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    deleteForEveryoneButton: {
      backgroundColor: theme.colors.error,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      marginBottom: theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "center",
    },
    deleteForMeButton: {
      backgroundColor: theme.colors.warning || "#F59E0B",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      marginBottom: theme.spacing.sm,
      flexDirection: "row",
      justifyContent: "center",
    },
    buttonIcon: {
      marginRight: theme.spacing.xs,
    },
    deleteForEveryoneText: {
      ...theme.typography.body,
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 16,
    },
    deleteForMeText: {
      ...theme.typography.body,
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 16,
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cancelButtonText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      fontSize: 16,
    },
    optionDescription: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xs,
      fontSize: 12,
      fontWeight: "400",
    },
  });

  const modalTransform = {
    transform: [
      {
        scale: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.modal, modalTransform]}>
              <View style={styles.iconContainer}>
                <View style={styles.iconWrapper}>
                  <Trash2
                    size={28}
                    color={theme.colors.error}
                    strokeWidth={2}
                  />
                </View>
              </View>

              <Text style={styles.title}>
                Delete{" "}
                {messageCount > 1 ? `${messageCount} messages` : "message"}?
              </Text>

              <Text style={styles.subtitle}>
                Choose how you want to delete{" "}
                {messageCount > 1 ? "these messages" : "this message"}.
              </Text>

              <View style={styles.buttonContainer}>
                {/* Delete for Everyone - Only show if user owns all messages */}
                {canDeleteForEveryone && (
                  <>
                    <TouchableOpacity
                      style={styles.deleteForEveryoneButton}
                      onPress={handleDeleteForEveryone}
                      activeOpacity={0.8}
                    >
                      <Users
                        size={20}
                        color="#FFFFFF"
                        style={styles.buttonIcon}
                      />
                      <View>
                        <Text style={styles.deleteForEveryoneText}>
                          Delete for Everyone
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.optionDescription}>
                      This will delete the{" "}
                      {messageCount > 1 ? "messages" : "message"} for all
                      participants in this chat
                    </Text>
                  </>
                )}

                {/* Delete for Me - Always available */}
                <TouchableOpacity
                  style={[
                    styles.deleteForMeButton,
                    { marginTop: canDeleteForEveryone ? theme.spacing.md : 0 },
                  ]}
                  onPress={handleDeleteForMe}
                  activeOpacity={0.8}
                >
                  <Eye size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <View>
                    <Text style={styles.deleteForMeText}>Delete for Me</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.optionDescription}>
                  This will only delete the{" "}
                  {messageCount > 1 ? "messages" : "message"} from your view
                </Text>

                <TouchableOpacity
                  style={[styles.cancelButton, { marginTop: theme.spacing.md }]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
