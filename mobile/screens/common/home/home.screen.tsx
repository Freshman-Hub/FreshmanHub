"use client";

import React, { useState, useEffect } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Menu,
  Heart,
  MessageCircle,
  Users,
  ArrowRight,
  Sparkles,
  MapPin,
  BookOpen,
  Calendar,
  CheckCircle,
  Compass,
  Lightbulb,
  Plus,
  Share2,
  GraduationCap,
  Megaphone,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useUser } from "@/contexts/UserContext";

const { width } = Dimensions.get("window");

// Mock Data for Fresher Home Screen
const orientationSteps = [
  { id: 1, title: "Complete Registration", completed: true, icon: CheckCircle },
  { id: 2, title: "Campus Tour", completed: false, icon: MapPin },
  { id: 3, title: "Meet Your Peer Coach", completed: false, icon: Users },
  { id: 4, title: "Attend Welcome Gala", completed: false, icon: Sparkles },
];

const ashesiDiscoveryChallenges = [
  {
    id: 1,
    title: "Find the 'Big Six' Tree",
    description: "Locate the historic tree on campus and snap a selfie!",
    icon: Compass,
    status: "New",
    color: "#FF6B6B",
  },
  {
    id: 2,
    title: "Discover the Innovation Hub",
    description: "Explore the tech space and learn about student projects.",
    icon: Lightbulb,
    status: "New",
    color: "#4ECDC4",
  },
  {
    id: 3,
    title: "Ashesi Library Scavenger Hunt",
    description: "Uncover hidden literary gems and study spots.",
    icon: BookOpen,
    status: "New",
    color: "#A8E6CF",
  },
];

const trendingFreshers = [
  {
    id: 1,
    name: "Aisha Khan",
    major: "Computer Science",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Active now",
    mutuals: 5,
    country: "Ghana",
    groupYear: "Class of 2028",
  },
  {
    id: 2,
    name: "David Lee",
    major: "Business Administration",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    status: "Online",
    mutuals: 3,
    country: "Nigeria",
    groupYear: "Class of 2028",
  },
];

const campusBuzz = [
  {
    id: 1,
    user: "Campus Life",
    content:
      "The Freshers' Welcome Gala is going to be EPIC! Get your outfits ready! 🎉",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 1.2,
    comments: 250,
    shares: 80,
    timeAgo: "1h ago",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    user: "Ashesi Insider",
    content:
      "Don't miss the orientation session on 'Navigating Campus Resources' tomorrow at 10 AM!",
    likes: 800,
    comments: 120,
    shares: 45,
    timeAgo: "3h ago",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const peerCoachTips = [
  "Don't be afraid to ask questions! Everyone here was once a fresher.",
  "Explore different clubs and find your community early on.",
  "Time management is key! Balance academics with social life.",
  "Your peer coach is here to help – reach out anytime!",
];

const ashesiTraditions = [
  "The 'Big Six' Tree: A symbol of Ashesi's commitment to leadership.",
  "Community Weekend: A time for bonding and fun activities.",
  "The Ashesi Anthem: Learn it, sing it, live it!",
  "The Honor Code: The foundation of trust and integrity at Ashesi.",
];

const clubsAndSocieties = [
  {
    id: 1,
    name: "Ashesi Robotics Club",
    members: 75,
    focus: "Innovation, AI, Engineering",
    logo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    name: "Debate Society",
    members: 40,
    focus: "Public Speaking, Critical Thinking",
    logo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    name: "Ashesi Green Club",
    members: 60,
    focus: "Sustainability, Environmental Action",
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const globalAnnouncements = [
  {
    id: 1,
    title: "Campus-wide Power Outage Drill",
    content: "Scheduled for Oct 26, 10 AM - 11 AM. Please prepare accordingly.",
    time: "10m ago",
  },
  {
    id: 2,
    title: "New Shuttle Bus Schedule",
    content:
      "Updated routes and times effective Nov 1. Check the transport portal for details.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Student Government Elections Open!",
    content:
      "Cast your vote for the next student leaders. Voting closes Oct 30.",
    time: "3h ago",
  },
];

export default function FresherHomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, loading } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [currentTip, setCurrentTip] = useState(0);
  const [currentTradition, setCurrentTradition] = useState(0);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % peerCoachTips.length);
    }, 8000); // Increased duration

    const traditionInterval = setInterval(() => {
      setCurrentTradition((prev) => (prev + 1) % ashesiTraditions.length);
    }, 10000); // Increased duration

    return () => {
      pulseAnimation.stop();
      clearInterval(tipInterval);
      clearInterval(traditionInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    heroSection: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
      alignItems: "center",
      justifyContent: "center",
    },
    welcomeText: {
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },
    greeting: {
      ...theme.typography.h2,
      color: "white",
      fontWeight: "900",
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: "rgba(255,255,255,0.9)",
      fontWeight: "500",
      textAlign: "center",
    },
    quickLinksContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginTop: theme.spacing.lg,
    },
    quickLinkButton: {
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: "rgba(255,255,255,0.2)", // Added background
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    quickLinkText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "600",
      marginTop: theme.spacing.xs,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
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
      marginBottom: theme.spacing.sm,
    },
    orientationText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.md,
    },
    discoveryScroll: {
      paddingLeft: theme.spacing.lg,
    },
    discoveryCard: {
      width: width * 0.75,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginRight: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    discoveryHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    discoveryIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    discoveryTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "800",
      flex: 1,
    },
    discoveryDescription: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.md,
    },
    discoveryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    discoveryButtonText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
    },
    peopleScroll: {
      paddingLeft: theme.spacing.lg,
    },
    personCard: {
      width: width * 0.7, // Adjusted width to match continuous student screen
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginRight: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    onlineIndicator: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: "#22c55e",
      position: "absolute",
      top: -2,
      right: -2,
      borderWidth: 2,
      borderColor: "white",
    },
    personName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    personMetaContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    personMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    personMetaText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    connectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
    },
    connectText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      marginLeft: theme.spacing.xs,
    },
    momentsContainer: {
      gap: theme.spacing.md,
    },
    momentCard: {
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
    },
    momentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    momentUserInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    momentUserName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    momentTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    momentContent: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "500",
      lineHeight: 24,
      marginBottom: theme.spacing.md,
    },
    momentImage: {
      width: "100%",
      height: 200,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    momentActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    momentActionGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    momentAction: {
      flexDirection: "row",
      alignItems: "center",
    },
    momentActionText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    // New styles for Peer Coach Tips and Ashesi Traditions
    tipCard: {
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
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120, // Ensure consistent height
    },
    tipTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    tipText: {
      ...theme.typography.h6,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
      fontStyle: "italic",
    },
    clubCard: {
      width: width * 0.7,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginRight: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    clubLogo: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    clubName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    clubMeta: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    announcementCard: {
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
    announcementHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    announcementTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    announcementTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    announcementContent: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      lineHeight: 20,
    },
  });

  if (loading || !user) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              ...theme.typography.body,
              color: theme.colors.textSecondary,
              fontWeight: "500"
            }}
          >
            Loading your Ashesi journey...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        title=""
        leftIcon={Menu}
        onLeftPress={() => router.push("/(routes)/menu")}
        rightIcon={Bell}
        onRightPress={() => router.push("/notifications")}
        showMessage={true}
        onMessagePress={() => router.push("/(routes)/chats")}
        style={{ backgroundColor: "transparent", borderBottomWidth: 0 }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>
              Welcome, {user.firstName || "Freshman"}! 👋
            </Text>
            <Text style={styles.subtitle}>
              Your Ashesi adventure begins now!
            </Text>
          </View>
          <View style={styles.quickLinksContainer}>
            <TouchableOpacity
              style={styles.quickLinkButton}
              onPress={() =>
                router.push("/(routes)/orientation", {
                })
              }
            >
              <Calendar color="white" size={28} />
              <Text style={styles.quickLinkText}>Orientation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickLinkButton}>
              <MapPin color="white" size={28} />
              <Text style={styles.quickLinkText}>Campus Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLinkButton}
              onPress={() =>
                router.push("/(routes)/connect", {
                })
              }
            >
              <Users color="white" size={28} />
              <Text style={styles.quickLinkText}>Meet Peers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Global Announcements */}
        {globalAnnouncements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📣 Global Announcements</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(routes)/announcements", {
                  })
                }
              >
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>
            {globalAnnouncements.map((announcement) => (
              <TouchableOpacity
                key={announcement.id}
                style={styles.announcementCard}
                activeOpacity={0.8}
              >
                <View style={styles.announcementHeader}>
                  <Megaphone color={theme.colors.primary} size={20} />
                  <Text style={styles.announcementTitle}>
                    {announcement.title}
                  </Text>
                  <Text style={styles.announcementTime}>
                    {announcement.time}
                  </Text>
                </View>
                <Text style={styles.announcementContent}>
                  {announcement.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Your Orientation Journey */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎓 Your Orientation Journey</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orientationCard}>
            {orientationSteps.map((step) => (
              <View key={step.id} style={styles.orientationItem}>
                <step.icon
                  color={
                    step.completed ? "#22c55e" : theme.colors.textSecondary
                  }
                  size={20}
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
        </View>

        {/* Ashesi Discovery Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              🗺️ Ashesi Discovery Challenges
            </Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Explore More</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.discoveryScroll}
        >
          {ashesiDiscoveryChallenges.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={styles.discoveryCard}
              activeOpacity={0.9}
            >
              <View style={styles.discoveryHeader}>
                <View
                  style={[
                    styles.discoveryIcon,
                    { backgroundColor: challenge.color + "20" },
                  ]}
                >
                  <challenge.icon color={challenge.color} size={28} />
                </View>
                <Text style={styles.discoveryTitle}>{challenge.title}</Text>
              </View>
              <Text style={styles.discoveryDescription}>
                {challenge.description}
              </Text>
              <TouchableOpacity style={styles.discoveryButton}>
                <Text style={styles.discoveryButtonText}>Start Challenge</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Club & Society Showcase (for Freshers) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Club & Society Showcase</Text>
            <TouchableOpacity onPress={() => router.push("/(routes)/clubs")}>
              <Text style={styles.sectionAction}>Explore Clubs</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleScroll}
        >
          {clubsAndSocieties.map((club) => (
            <TouchableOpacity
              key={club.id}
              style={styles.clubCard}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: club.logo }}
                style={styles.clubLogo}
                resizeMode="cover"
              />
              <Text style={styles.clubName}>{club.name}</Text>
              <Text style={styles.clubMeta}>{club.members} members</Text>
              <Text style={styles.clubMeta}>{club.focus}</Text>
              <TouchableOpacity
                style={[styles.connectButton, { marginTop: theme.spacing.md }]}
              >
                <Plus color="white" size={16} />
                <Text style={styles.connectText}>Join</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Peer Coach Corner */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🗣️ Peer Coach Corner</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Meet Your Coach</Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[styles.tipCard, { transform: [{ scale: pulseAnim }] }]}
          >
            <GraduationCap
              color={theme.colors.primary}
              size={32}
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text style={styles.tipTitle}>Tip from a Peer Coach:</Text>
            <Text style={styles.tipText}>&quot;{peerCoachTips[currentTip]}&quot;</Text>
          </Animated.View>
        </View>

        {/* Ashesi Traditions & Culture */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📜 Ashesi Traditions</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Learn More</Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[styles.tipCard, { transform: [{ scale: pulseAnim }] }]}
          >
            <BookOpen
              color={theme.colors.primary}
              size={32}
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text style={styles.tipTitle}>Did you know?</Text>
            <Text style={styles.tipText}>
              &quot;{ashesiTraditions[currentTradition]}&quot;
            </Text>
          </Animated.View>
        </View>

        {/* Connect with Your Cohort */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤝 Connect with Your peers</Text>
            <TouchableOpacity
              onPress={() =>
                router.push("/(routes)/connect")
              }
            >
              <Text style={styles.sectionAction}>Find Buddies</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleScroll}
        >
          {trendingFreshers.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={styles.personCard}
              activeOpacity={0.9}
            >
              <View style={styles.avatarContainer}>
                <Avatar
                  imageUrl={person.avatar}
                  initials={person.name.charAt(0)}
                  size={70}
                />
                {person.status === "Active now" && (
                  <Animated.View
                    style={[
                      styles.onlineIndicator,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.personName}>{person.name}</Text>
              <View style={styles.personMetaContainer}>
                <View style={styles.personMetaItem}>
                  <MapPin color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.personMetaText}>{person.country}</Text>
                </View>
                <View style={styles.personMetaItem}>
                  <GraduationCap color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.personMetaText}>{person.major}</Text>
                </View>
                <View style={styles.personMetaItem}>
                  <Calendar color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.personMetaText}>{person.groupYear}</Text>
                </View>
                <View style={styles.personMetaItem}>
                  <Users color={theme.colors.textSecondary} size={16} />
                  <Text style={styles.personMetaText}>
                    {person.mutuals} mutuals
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Plus color="white" size={16} />
                <Text style={styles.connectText}>Connect</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Campus Buzz */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📢 Campus Buzz</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>Post Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.momentsContainer}>
            {campusBuzz.map((moment) => (
              <TouchableOpacity
                key={moment.id}
                style={styles.momentCard}
                activeOpacity={0.8}
              >
                <View style={styles.momentHeader}>
                  <Avatar
                    imageUrl={moment.avatar}
                    initials={moment.user.charAt(0)}
                    size={45}
                  />
                  <View style={styles.momentUserInfo}>
                    <Text style={styles.momentUserName}>{moment.user}</Text>
                    <Text style={styles.momentTime}>{moment.timeAgo}</Text>
                  </View>
                </View>

                <Text style={styles.momentContent}>{moment.content}</Text>

                {moment.image && (
                  <Image
                    source={{ uri: moment.image }}
                    style={styles.momentImage}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.momentActions}>
                  <View style={styles.momentActionGroup}>
                    <TouchableOpacity style={styles.momentAction}>
                      <Heart color={theme.colors.primary} size={20} />
                      <Text style={styles.momentActionText}>
                        {moment.likes}K
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.momentAction}>
                      <MessageCircle
                        color={theme.colors.textSecondary}
                        size={20}
                      />
                      <Text style={styles.momentActionText}>
                        {moment.comments}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.momentAction}>
                      <Share2 color={theme.colors.textSecondary} size={20} />
                      <Text style={styles.momentActionText}>
                        {moment.shares}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity>
                    <ArrowRight color={theme.colors.textSecondary} size={20} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
