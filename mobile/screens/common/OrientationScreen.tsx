"use client";

import { useState, useCallback } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Users,
  Sparkles,
  BookOpen,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { WebView } from "react-native-webview"; // Import WebView

const { width } = Dimensions.get("window");
const VIDEO_CARD_WIDTH = width * 0.85; // Make video cards wider for better viewing
const VIDEO_HEIGHT = VIDEO_CARD_WIDTH * (9 / 16); // 16:9 aspect ratio for YouTube embeds

// Mock Data for Orientation Screen (can be moved to a separate data file if it grows)
const orientationSteps = [
  { id: 1, title: "Complete Registration", completed: true, icon: CheckCircle },
  { id: 2, title: "Campus Tour", completed: false, icon: MapPin },
  { id: 3, title: "Meet Your Peer Coach", completed: false, icon: Users },
  { id: 4, title: "Attend Welcome Gala", completed: false, icon: Sparkles },
  {
    id: 5,
    title: "Academic Advising Session",
    completed: false,
    icon: BookOpen,
  },
  {
    id: 6,
    title: "Student ID Card Collection",
    completed: false,
    icon: CheckCircle,
  },
];

// Updated mock video data with YouTube IDs
const allAshesiVideos = [
  {
    id: 1,
    title: "Welcome to Ashesi University",
    youtubeId: "nw23GM79HcY", // Placeholder YouTube video ID
  },
  {
    id: 2,
    title: "Life at Ashesi: Student Experience",
    youtubeId: "X_X_X_X_X_X",
  },
  {
    id: 3,
    title: "Ashesi Campus Tour",
    youtubeId: "Z_Z_Z_Z_Z_Z",
  },
  {
    id: 4,
    title: "Why Choose Ashesi?",
    youtubeId: "A_A_A_A_A_A",
  },
  {
    id: 5,
    title: "Innovation at Ashesi",
    youtubeId: "B_B_B_B_B_B",
  },
  {
    id: 6,
    title: "Ashesi Alumni Success Stories",
    youtubeId: "C_C_C_C_C_C",
  },
];

export default function OrientationScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false); // State to manage video expansion

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const displayedVideos = showAllVideos
    ? allAshesiVideos
    : allAshesiVideos.slice(0, 2);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "800",
    },
    sectionAction: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    orientationCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    orientationItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    orientationItemLast: {
      borderBottomWidth: 0, // No border for the last item
    },
    orientationText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.md,
      flex: 1, // Take up remaining space
    },
    videoListContainer: {
      // No horizontal scroll for this section, stack vertically
      gap: theme.spacing.md, // Gap between video cards
    },
    videoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
      width: "100%", // Take full width
      alignSelf: "center", // Center if there's extra space
    },
    videoPlayer: {
      width: "100%",
      height: VIDEO_HEIGHT,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: "black", // Placeholder background for video
      marginBottom: theme.spacing.md,
    },
    videoTitle: {
      ...theme.typography.body, // Slightly larger font for title
      color: theme.colors.text,
      fontWeight: "700",
      textAlign: "left",
      paddingHorizontal: theme.spacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title="Orientation Hub"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Orientation Journey */}
        <Text style={styles.sectionTitle}>🎓 Your Orientation Journey</Text>
        <View style={styles.orientationCard}>
          {orientationSteps.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.orientationItem,
                index === orientationSteps.length - 1 &&
                  styles.orientationItemLast,
              ]}
            >
              <step.icon
                color={step.completed ? "#22c55e" : theme.colors.textSecondary}
                size={24}
              />
              <Text
                style={[
                  styles.orientationText,
                  { color: step.completed ? "#22c55e" : theme.colors.text },
                  step.completed && { textDecorationLine: "line-through" },
                ]}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Ashesi Videos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>▶️ Ashesi Videos</Text>
          {allAshesiVideos.length > 2 && (
            <TouchableOpacity onPress={() => setShowAllVideos(!showAllVideos)}>
              <Text style={styles.sectionAction}>
                {showAllVideos ? "View Less" : "View More"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.videoListContainer}>
          {displayedVideos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <WebView
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{
                  uri: `https://www.youtube.com/embed/${video.youtubeId}?playsinline=1&autoplay=0&controls=1&showinfo=0&modestbranding=1`,
                }}
                allowsFullscreenVideo={true}
              />
              <Text style={styles.videoTitle}>{video.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
