"use client";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Bell, MessageSquare} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { HelloWave } from "../HelloWave";

// Hardcoded values
const userName = "Kwame";
const userAvatar =
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400";
const eventsThisWeek = 12;
const orientationComplete = 85;
const newFriends = 24;

export function WelcomeHeader() {
  const { theme } = useTheme();
  const router = useRouter();

  const getGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return "Good morning";
    if (currentTime < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleNotificationPress = () => {
    router.push("/(routes)/notifications");
  };

  const handleChatPress = () => {
    router.push("/(routes)/chat");
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
    gradient: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xxl,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.sm,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: theme.spacing.md,
    },
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 28,
      marginRight: theme.spacing.md,
      borderWidth: 3,
      borderColor: theme.colors.border,
    },
    userTextContainer: {
      flex: 1,
    },
    greeting: {
      ...theme.typography.bodySmall,
      color: "rgba(255, 255, 255, 0.85)",
      marginBottom: 4,
      fontSize: 13,
      fontWeight: "400" as const,
    },
    userName: {
      ...theme.typography.h4,
      color: "white",
      fontWeight: "700",
      fontSize: 20,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    actionButton: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 0.5,
      borderColor: theme.colors.border,
    },
    notificationDot: {
      position: "absolute",
      top: -2,
      right: -2,
      backgroundColor: "#ef4444",
      width: 12,
      height: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    welcomeCard: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      backdropFilter: "blur(20px)",
      borderWidth: 0.25,
      borderColor: theme.colors.border,
    },
    welcomeTitle: {
      ...theme.typography.h5,
      color: "white",
      marginBottom: theme.spacing.sm,
      fontWeight: "700",
      fontSize: 18,
    },
    welcomeText: {
      ...theme.typography.body,
      color: "rgba(255, 255, 255, 0.9)",
      lineHeight: 24,
      fontSize: 14,
      fontWeight: "400",
    },
    statsContainer: {
      position: "absolute",
      bottom: -20,
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      zIndex: 10,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: "white",
      padding: theme.spacing.sm,
      alignItems: "center",
      borderRadius: theme.borderRadius.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statNumber: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      fontWeight: "800",
      fontSize: 24,
      marginBottom: 4,
    },
    statNumberAccent: {
      ...theme.typography.h3,
      color: theme.colors.accent,
      fontWeight: "800",
      fontSize: 22,
      marginBottom: 4,
    },
    statNumberSecondary: {
      ...theme.typography.h3,
      color: "#f59e0b",
      fontWeight: "800",
      fontSize: 22,
      marginBottom: 4,
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "600",
      fontSize: 10,
      lineHeight: 14,
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.gradient}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
            <View style={styles.userTextContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{userName}! <HelloWave/></Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleChatPress}
            >
              <MessageSquare color="white" size={22} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNotificationPress}
            >
              <Bell color="white" size={22} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Ashesi! 🎓</Text>
          <Text style={styles.welcomeText}>
            Your journey to belonging starts here. Explore campus, connect with
            peers, and make the most of your freshman experience.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{eventsThisWeek}</Text>
            <Text style={styles.statLabel}>Events This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumberAccent}>{orientationComplete}%</Text>
            <Text style={styles.statLabel}>Orientation Complete</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumberSecondary}>{newFriends}</Text>
            <Text style={styles.statLabel}>New Friends</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
