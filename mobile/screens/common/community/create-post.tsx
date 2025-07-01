"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Camera, X, Eye } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import * as ImagePicker from "expo-image-picker";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Modal } from "@/components/ui/Modal";

const categories = [
  { label: "Campus Life", value: "Campus Life" },
  { label: "Study Tips", value: "Study Tips" },
  { label: "Achievements", value: "Achievements" },
  { label: "Study Groups", value: "Study Groups" },
  { label: "Events", value: "Events" },
  { label: "General", value: "General" },
];

const currentUser = {
  name: "Current User",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  year: "Junior",
  verified: false,
};

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    userSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    userDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    userName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    userMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
        marginTop: 2,
      fontWeight: "500",
    },
    contentSection: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    contentInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: 16,
      minHeight: 120,
      textAlignVertical: "top",
      fontWeight: "500",
    },
    imageSection: {
      marginBottom: theme.spacing.lg,
    },
    imagePreview: {
      width: "100%",
      height: 200,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
      position: "relative",
    },
    removeImageButton: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: "rgba(0,0,0,0.7)",
      borderRadius: theme.borderRadius.xxxl,
      padding: theme.spacing.sm,
    },
    addImageButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
    },
    addImageText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    categorySection: {
      marginBottom: theme.spacing.xl,
    },
    actionsContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    previewContainer: {
      padding: theme.spacing.md,
    },
    previewPost: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    postUserDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    postUserName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
    },
    postUserMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
        marginTop: 2,
        fontWeight: "500",
    },
    categoryBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      marginTop: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    categoryBadgeText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "700",
    },
    postContent: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
        marginBottom: theme.spacing.sm,
        fontWeight: "500",
    },
    postImage: {
      width: "100%",
      height: 200,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.sm,
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    actionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera roll permissions to add images."
      );
      return false;
    }
    return true;
  };

  const handleAddImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Add Image", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: openCamera },
      { text: "Photo Library", onPress: openImageLibrary },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera permissions to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handlePreview = () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write some content for your post");
      return;
    }
    setIsPreviewVisible(true);
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please write some content for your post");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category for your post");
      return;
    }

    setIsPosting(true);

    // Create the new post object
    const newPost = {
      id: Date.now(),
      user: currentUser,
      content: content.trim(),
      image: selectedImage,
      likes: 0,
      comments: 0,
      shares: 0,
      timeAgo: "now",
      isLiked: false,
      category: selectedCategory,
    };

    // Simulate API call
    setTimeout(() => {
      setIsPosting(false);
      setIsPreviewVisible(false);

      Alert.alert("Success!", "Your post has been published successfully", [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to community screen with the new post
            router.push({
              pathname: "/(student-tabs)/community",
              params: { newPost: JSON.stringify(newPost) },
            });
          },
        },
      ]);
    }, 2000);
  };

  const canPost = content.trim().length > 0 && selectedCategory;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Post"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Eye}
        onRightPress={handlePreview}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Section */}
        <Card
          style={{ marginBottom: theme.spacing.lg }}
          content={
            <View style={styles.userSection}>
              <Avatar
                imageUrl={currentUser.avatar}
                initials={currentUser.name.charAt(0)}
                size={50}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <Text style={styles.userMeta}>Posting to Community</Text>
              </View>
            </View>
          }
        />

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>What&apos;s on your mind?</Text>
          <RNTextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Share your thoughts, experiences, or ask questions..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline={true}
            autoCorrect={true}
            autoCapitalize="sentences"
          />
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Add Image (Optional)</Text>
          {selectedImage ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <X color="white" size={20} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleAddImage}
            >
              <Camera color={theme.colors.textSecondary} size={24} />
              <Text style={styles.addImageText}>Add an image to your post</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Section */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <CustomSelect
            value={selectedCategory}
            options={categories}
            onSelect={setSelectedCategory}
            placeholder="Select a category"
          />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Preview"
            onPress={handlePreview}
            mode="outlined"
            style={{ flex: 1 }}
            disabled={!canPost}
          />
          <Button
            title="Post"
            onPress={handlePost}
            mode="contained"
            style={{ flex: 1 }}
            disabled={!canPost}
          />
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        title="Post Preview"
        dismissable={true}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewPost}>
            <View style={styles.postHeader}>
              <Avatar
                imageUrl={currentUser.avatar}
                initials={currentUser.name.charAt(0)}
                size={40}
              />
              <View style={styles.postUserDetails}>
                <Text style={styles.postUserName}>{currentUser.name}</Text>
                <Text style={styles.postUserMeta}>
                  {currentUser.year} • now
                </Text>
                {selectedCategory && (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {selectedCategory}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.postContent}>{content}</Text>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.postActions}>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>0 likes</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>0 comments</Text>
              </View>
              <View style={styles.actionButton}>
                <Text style={styles.actionText}>0 shares</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: theme.spacing.lg,
              flexDirection: "row",
              gap: theme.spacing.md,
            }}
          >
            <Button
              title="Edit"
              onPress={() => setIsPreviewVisible(false)}
              mode="outlined"
              style={{ flex: 1 }}
            />
            <Button
              title={isPosting ? "Posting..." : "Publish"}
              onPress={handlePost}
              mode="contained"
              style={{ flex: 1 }}
              loading={isPosting}
              disabled={isPosting}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
