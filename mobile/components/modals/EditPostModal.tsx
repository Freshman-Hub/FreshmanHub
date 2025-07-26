"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { X, Check, Image as ImageIcon } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/Card";
import { Post } from "@/types/post.types";

interface EditPostModalProps {
  visible: boolean;
  post: Post;
  onClose: () => void;
  onSave: (updatedData: {
    content: string;
    category: string;
    image?: string;
  }) => void;
  loading?: boolean;
}

export function EditPostModal({
  visible,
  post,
  onClose,
  onSave,
  loading = false,
}: EditPostModalProps) {
  const { theme } = useTheme();
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState(post.category);
  const [image, setImage] = useState(post.image);

  const categories = [
    "Campus Life",
    "Study Tips",
    "Achievements",
    "Study Groups",
    "Events",
    "General",
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      ...theme.typography.h6,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      fontWeight: "600",
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      color: theme.colors.text,
      fontSize: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 120,
      textAlignVertical: "top",
    },
    categoriesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selectedCategoryChip: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    selectedCategoryText: {
      color: "white",
    },
    imageContainer: {
      marginBottom: theme.spacing.lg,
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    removeImageButton: {
      backgroundColor: theme.colors.error + "20",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    removeImageText: {
      color: theme.colors.error,
      fontWeight: "600",
    },
    addImageButton: {
      backgroundColor: theme.colors.primary + "10",
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
    },
    addImageText: {
      color: theme.colors.primary,
      fontWeight: "600",
      marginTop: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: "row",
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: "600",
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    saveButtonText: {
      color: "white",
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }

    onSave({
      content: content.trim(),
      category,
      image,
    });
  };

  const handleAddImage = () => {
    // In a real app, you would implement image picker here
    Alert.alert("Add Image", "Image picker would be implemented here", [
      { text: "Camera", onPress: () => console.log("Camera") },
      { text: "Gallery", onPress: () => console.log("Gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleRemoveImage = () => {
    setImage(undefined);
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) {
      setContent(post.content);
      setCategory(post.category);
      setImage(post.image);
    }
  }, [visible, post]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <Header
          title="Edit Post"
          leftIcon={X}
          onLeftPress={onClose}
          rightIcon={Check}
          onRightPress={handleSave}
          rightDisabled={loading || !content.trim()}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.textInput}
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={500}
              editable={!loading}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setCategory(cat)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.selectedCategoryText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Image</Text>
            {image ? (
              <View style={styles.imageContainer}>
                <Card
                  image={image}
                  style={{ padding: 0 }}
                  headerStyle={{ padding: 0 }}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                  disabled={loading}
                >
                  <Text style={styles.removeImageText}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleAddImage}
                disabled={loading}
              >
                <ImageIcon color={theme.colors.primary} size={32} />
                <Text style={styles.addImageText}>Add Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              (!content.trim() || loading) && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={!content.trim() || loading}
          >
            <Text style={[styles.buttonText, styles.saveButtonText]}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
