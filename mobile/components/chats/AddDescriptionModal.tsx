"use client";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface AddDescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  currentDescription: string;
  onSave: (newDescription: string) => void;
}

export function AddDescriptionModal({
  visible,
  onClose,
  currentDescription,
  onSave,
}: AddDescriptionModalProps) {
  const { theme } = useTheme();
  const [description, setDescription] = useState(currentDescription);

  const handleSave = () => {
    onSave(description.trim());
    onClose();
  };

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
      minWidth: 300,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    input: {
      ...theme.typography.body,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      minHeight: 100,
      textAlignVertical: "top",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    button: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: "600",
    },
    cancelText: {
      color: theme.colors.textSecondary,
    },
    saveText: {
      color: theme.colors.primary,
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
              <Text style={styles.title}>Add group description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a group description..."
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                autoFocus
                maxLength={512}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onClose}>
                  <Text style={[styles.buttonText, styles.cancelText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                  <Text style={[styles.buttonText, styles.saveText]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
