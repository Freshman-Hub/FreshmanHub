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
import {
  ArrowLeft,
  Camera,
  X,
  Eye,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import * as ImagePicker from "expo-image-picker";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Modal } from "@/components/ui/Modal";
import { DateInput } from "@/components/ui/DateInput";
import { TimeInput } from "@/components/ui/TimeInput";
import { LocationInput } from "@/components/ui/LocationInput";

const categories = [
  { label: "Cultural", value: "Cultural" },
  { label: "Academic", value: "Academic" },
  { label: "Sports", value: "Sports" },
  { label: "Social", value: "Social" },
  { label: "Workshop", value: "Workshop" },
  { label: "Competition", value: "Competition" },
];

const locationOptions = [
  { label: "Main Hall", value: "Main Hall" },
  { label: "Library Conference Room", value: "Library Conference Room" },
  { label: "Sports Complex", value: "Sports Complex" },
  { label: "Innovation Hub", value: "Innovation Hub" },
  { label: "Auditorium", value: "Auditorium" },
  { label: "Student Center", value: "Student Center" },
  { label: "Outdoor Amphitheater", value: "Outdoor Amphitheater" },
  { label: "Computer Lab", value: "Computer Lab" },
  { label: "Cafeteria", value: "Cafeteria" },
  { label: "Other", value: "Other" },
];

const currentUser = {
  name: "Event Organizer",
  avatar:
    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  organization: "Student Activities",
  verified: true,
};

export default function CreateEventScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [requirements, setRequirements] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    organizerSection: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    organizerDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    organizerName: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    organizerMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    basicInfoInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: theme.spacing.md,
    },
    descriptionInput: {
      minHeight: 120,
      textAlignVertical: "top",
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
    detailsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
    },
    detailInput: {
      flex: 1,
      minWidth: "45%",
    },
    fullWidthInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "500",
      marginBottom: theme.spacing.md,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: "top",
    },
    actionsContainer: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    previewContainer: {
      padding: theme.spacing.md,
    },
    previewEvent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 3,
    },
    previewImageContainer: {
      position: "relative",
      height: 200,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    previewImageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    previewCategoryBadge: {
      position: "absolute",
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    previewCategoryText: {
      ...theme.typography.button,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    previewContent: {
      padding: theme.spacing.md,
    },
    previewTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    previewDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    previewDetailText: {
      ...theme.typography.body,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "600",
    },
    previewDescription: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 22,
      marginTop: theme.spacing.md,
      fontWeight: "500",
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
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Error", "Please enter an event date");
      return;
    }
    if (!time.trim()) {
      Alert.alert("Error", "Please enter an event time");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter an event location");
      return;
    }
    setIsPreviewVisible(true);
  };

  const handleCreateEvent = async () => {
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category for your event");
      return;
    }

    setIsCreating(true);

    // Create the new event object
    const newEvent = {
      id: Date.now(),
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      attendees: 0,
      image: selectedImage,
      category: selectedCategory,
      isLiked: false,
      description: description.trim(),
      organizer: currentUser,
      capacity: Number.parseInt(capacity) || 100,
      requirements: requirements.trim() || "None",
    };

    // Simulate API call
    setTimeout(() => {
      setIsCreating(false);
      setIsPreviewVisible(false);

      Alert.alert("Success!", "Your event has been created successfully", [
        {
          text: "OK",
          onPress: () => {
            // Navigate back to events screen with the new event
            router.push({
              pathname: "/(student-tabs)/events",
              params: { newEvent: JSON.stringify(newEvent) },
            });
          },
        },
      ]);
    }, 2000);
  };

  const canCreate =
    title.trim().length > 0 &&
    date.trim().length > 0 &&
    time.trim().length > 0 &&
    location.trim().length > 0 &&
    selectedCategory;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Event"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        rightIcon={Eye}
        onRightPress={handlePreview}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Organizer Section */}
        <Card
          style={{ marginBottom: theme.spacing.lg }}
          content={
            <View style={styles.organizerSection}>
              <Avatar
                imageUrl={currentUser.avatar}
                initials={currentUser.name.charAt(0)}
                size={50}
              />
              <View style={styles.organizerDetails}>
                <Text style={styles.organizerName}>{currentUser.name}</Text>
                <Text style={styles.organizerMeta}>
                  Creating event for {currentUser.organization}
                </Text>
              </View>
            </View>
          }
        />

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Information</Text>
          <RNTextInput
            style={styles.basicInfoInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Event title *"
            placeholderTextColor={theme.colors.textSecondary}
            autoCorrect={true}
            autoCapitalize="words"
          />

          <RNTextInput
            style={[styles.basicInfoInput, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Event description..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline={true}
            autoCorrect={true}
            autoCapitalize="sentences"
          />
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          <View style={styles.detailsGrid}>
            <DateInput
              value={date}
              onChangeDate={setDate}
              label="Date *"
              placeholder="Select event date"
              style={styles.detailInput}
              minimumDate={new Date()}
            />
            <TimeInput
              value={time}
              onChangeTime={setTime}
              label="Time *"
              placeholder="Select event time"
              style={styles.detailInput}
            />
          </View>

          <LocationInput
            value={location}
            onSelect={setLocation}
            label="Location *"
            placeholder="Select event location"
            options={locationOptions}
          />

          <RNTextInput
            style={styles.fullWidthInput}
            value={capacity}
            onChangeText={setCapacity}
            placeholder="Capacity (optional)"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
          />

          <RNTextInput
            style={[styles.fullWidthInput, styles.multilineInput]}
            value={requirements}
            onChangeText={setRequirements}
            placeholder="Requirements (optional)"
            placeholderTextColor={theme.colors.textSecondary}
            multiline={true}
            autoCorrect={true}
            autoCapitalize="sentences"
          />
        </View>

        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Image (Optional)</Text>
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
              <Text style={styles.addImageText}>
                Add an image for your event
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <CustomSelect
            value={selectedCategory}
            options={categories}
            onSelect={setSelectedCategory}
            placeholder="Select event category"
          />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Preview"
            onPress={handlePreview}
            mode="outlined"
            style={{ flex: 1 }}
            disabled={!canCreate}
          />
          <Button
            title="Create Event"
            onPress={handleCreateEvent}
            mode="contained"
            style={{ flex: 1 }}
            disabled={!canCreate}
          />
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={isPreviewVisible}
        onClose={() => setIsPreviewVisible(false)}
        title="Event Preview"
        dismissable={true}
      >
        <View style={styles.previewContainer}>
          <View style={styles.previewEvent}>
            {selectedImage && (
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <View style={styles.previewImageOverlay} />
                {selectedCategory && (
                  <View style={styles.previewCategoryBadge}>
                    <Text style={styles.previewCategoryText}>
                      {selectedCategory}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>{title}</Text>

              <View style={styles.previewDetailRow}>
                <Calendar color={theme.colors.primary} size={20} />
                <Text style={styles.previewDetailText}>{date}</Text>
              </View>

              <View style={styles.previewDetailRow}>
                <Clock color={theme.colors.primary} size={20} />
                <Text style={styles.previewDetailText}>{time}</Text>
              </View>

              <View style={styles.previewDetailRow}>
                <MapPin color={theme.colors.primary} size={20} />
                <Text style={styles.previewDetailText}>{location}</Text>
              </View>

              <View style={styles.previewDetailRow}>
                <Users color={theme.colors.primary} size={20} />
                <Text style={styles.previewDetailText}>0 interested</Text>
              </View>

              {description && (
                <Text style={styles.previewDescription}>{description}</Text>
              )}
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
              title={isCreating ? "Creating..." : "Publish Event"}
              onPress={handleCreateEvent}
              mode="contained"
              style={{ flex: 1 }}
              loading={isCreating}
              disabled={isCreating}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
