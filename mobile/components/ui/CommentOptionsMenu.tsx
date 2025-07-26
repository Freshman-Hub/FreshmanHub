"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { MoreVertical, Edit, Trash2 } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface CommentOptionsMenuProps {
  commentId: string;
  isOwner: boolean;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  isReply?: boolean;
}

export function CommentOptionsMenu({
  commentId,
  isOwner,
  onEdit,
  onDelete,
  isReply = false,
}: CommentOptionsMenuProps) {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const styles = StyleSheet.create({
    menuButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    menuContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      minWidth: 150,
      paddingVertical: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    menuItemText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "600",
    },
    deleteText: {
      color: "#dc2626",
    },
  });

  if (!isOwner) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowMenu(true)}
      >
        <MoreVertical color={theme.colors.textSecondary} size={16} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    onEdit(commentId);
                  }}
                >
                  <Edit color={theme.colors.text} size={18} />
                  <Text style={styles.menuItemText}>
                    Edit {isReply ? "Reply" : "Comment"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMenu(false);
                    onDelete(commentId);
                  }}
                >
                  <Trash2 color="#dc2626" size={18} />
                  <Text style={[styles.menuItemText, styles.deleteText]}>
                    Delete {isReply ? "Reply" : "Comment"}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
