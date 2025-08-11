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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Menu } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { useUser } from "@/contexts/UserContext";
import { PostsService } from "../../../services/posts.service";
import { Post } from "../../../types/post.types";
import { useSQLiteContext } from "expo-sqlite";
import { UserService } from "../../../services/user.service";
import { RelationService } from "../../../services/relation.service";
import { ConnectionsSection } from "@/components/home/ConnectionsSection";
import { CommunityFeedSection } from "@/components/home/CommunityFeedSection";
import { ClubsSection } from "@/components/home/ClubsSection";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const PADDING_HORIZONTAL = 24;
const CARD_WIDTH_HORIZONTAL = width * 0.8;

const campusInsights = [
  "Top 5 study spots you haven't discovered yet!",
  "How to ace your next group project: Tips from seniors.",
  "The ultimate guide to campus clubs and societies.",
  "Career fair prep: What employers are really looking for.",
];

const alumniSpotlight = [
  {
    id: 1,
    name: "Dr. Adwoa Mensah",
    year: "Class of '15",
    achievement: "Leading AI Research at Google DeepMind",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    name: "Kofi Boateng",
    year: "Class of '18",
    achievement: "Founder of a thriving EdTech Startup",
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

const clubsAndSocieties = [
  {
    id: 1,
    name: "Ashesi Robotics Club",
    members: 75,
    focus: "Innovation, AI, Engineering",
    logo: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400",
    isJoined: true,
  },
  {
    id: 2,
    name: "Debate Society",
    members: 40,
    focus: "Public Speaking, Critical Thinking",
    logo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    isJoined: false,
  },
  {
    id: 3,
    name: "Ashesi Green Club",
    members: 60,
    focus: "Sustainability, Environmental Action",
    logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    isJoined: true,
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

export default function ContinuousStudentHomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, loading } = useUser();
  const db = useSQLiteContext();
  const [refreshing, setRefreshing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Community Updates: last 3 posts
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  // Personalized Connections: 5 suggested users (not connected)
  const [suggestedPeers, setSuggestedPeers] = useState<any[]>([]);

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

    const insightInterval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % campusInsights.length);
    }, 10000);

    return () => {
      pulseAnimation.stop();
      clearInterval(insightInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set SQLite context for PostsService
  useEffect(() => {
    if (db) {
      PostsService.setSQLiteContext(db);
    }
  }, [db]);

  // Fetch last 3 posts for Community Updates
  useEffect(() => {
    const fetchPosts = async () => {
      const { posts } = await PostsService.getPosts(3);
      setCommunityPosts(posts);
    };
    fetchPosts();
  }, []);

  // Fetch 5 suggested peers (not connected)
  useEffect(() => {
    const fetchPeers = async () => {
      if (!user?.id) return;
      const { users } = await UserService.getAllUsers();
      const { relationships } = await RelationService.getRelationshipsForUser(
        user.id,
        "friend"
      );
      const connectedIds = relationships
        .filter((r) => r.status === "accepted")
        .map((r) => r.targetId);
      const suggestions = users
        .filter((u) => u.id !== user.id && !connectedIds.includes(u.id))
        .slice(0, 5);
      setSuggestedPeers(suggestions);
    };
    fetchPeers();
  }, [user?.id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Like, comment, share, delete, etc. handlers for CommunityFeedSection
  const handleLike = async (postId: string) => {
    if (!user?.id) return;

    // Optimistic update
    setCommunityPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likedBy?.includes(user.id) || false;
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked
              ? post.likedBy?.filter((id) => id !== user.id) || []
              : [...(post.likedBy || []), user.id],
          };
        }
        return post;
      })
    );

    // API call
    const { error } = await PostsService.toggleLike(postId, user.id);

    if (error) {
      console.error("Error toggling like:", error);
      // Optionally reload posts if error
      const { posts } = await PostsService.getPosts(3);
      setCommunityPosts(posts);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/(routes)/post/${postId}`);
  };

  const handleShare = (postId: string) => {
    console.log("Sharing post", postId);
  };

  const handleEdit = (postId: string) => {
    console.log("Edit post", postId);
  };

  const handleDelete = async (postId: string) => {
    try {
      Alert.alert(
        "Delete Post",
        "Are you sure you want to delete this post? This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const { error } = await PostsService.deletePost(postId);
              if (error) {
                Alert.alert(
                  "Error",
                  "Failed to delete post. Please try again."
                );
              } else {
                setCommunityPosts((prev) =>
                  prev.filter((post) => post.id !== postId)
                );
                Alert.alert("Success", "Post deleted successfully");
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const handleCopyLink = (postId: string) => {
    console.log("Copy link", postId);
  };

  const handleSavePost = (postId: string) => {
    console.log("Save post", postId);
  };

  const handleReportPost = (postId: string) => {
    console.log("Report post", postId);
  };

  const handleUnfollow = (postId: string) => {
    console.log("Unfollow user", postId);
  };

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
    insightCard: {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
    },
    insightTitle: {
      ...theme.typography.body,
      color: "white",
      fontWeight: "700",
      marginBottom: theme.spacing.sm,
    },
    insightText: {
      ...theme.typography.h6,
      color: "white",
      fontWeight: "600",
      textAlign: "center",
      fontStyle: "italic",
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
    peopleScroll: {
      paddingLeft: PADDING_HORIZONTAL,
    },
    alumniCard: {
      width: CARD_WIDTH_HORIZONTAL,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginRight: CARD_MARGIN,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    alumniName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    alumniYear: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    alumniAchievement: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
  });

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return postDate.toLocaleDateString();
  };

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
              fontWeight: "500",
            }}
          >
            Loading your Ashesi hub...
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
              Hey {user.firstName || "Continuous Student"}! 👋
            </Text>
            <Text style={styles.subtitle}>
              Stay connected, discover opportunities, and thrive!
            </Text>
          </View>
          <Animated.View
            style={[styles.insightCard, { transform: [{ scale: pulseAnim }] }]}
          >
            <Text style={styles.insightTitle}>💡 Campus Insight</Text>
            <Text style={styles.insightText}>
              &quot;{campusInsights[currentInsight]}&quot;
            </Text>
          </Animated.View>
        </View>

        {/* Announcements Section */}
        <AnnouncementsSection
          title="Global Announcements"
          actionText="View All"
          onActionPress={() => router.push("/(routes)/announcements")}
          announcements={globalAnnouncements.map((a) => ({
            ...a,
            onPress: () => router.push("/(routes)/announcements"),
          }))}
          emptyText="No announcements available."
        />

        {/* Connections Section */}
        <ConnectionsSection
          title="Personalized Connections"
          actionText="Find More"
          onActionPress={() => router.push("/(routes)/connect")}
          people={suggestedPeers}
          pulseAnim={pulseAnim}
          onConnect={(person) => console.log("Connect", person.firstName)}
          emptyText="No suggestions available."
        />

        {/* Alumni Spotlight */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏆 Alumni Spotlight</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleScroll}
        >
          {alumniSpotlight.map((alumni) => (
            <TouchableOpacity
              key={alumni.id}
              style={styles.alumniCard}
              activeOpacity={0.9}
            >
              <Avatar
                imageUrl={alumni.avatar}
                initials={alumni.name.charAt(0)}
                size={70}
              />
              <Text style={styles.alumniName}>{alumni.name}</Text>
              <Text style={styles.alumniYear}>{alumni.year}</Text>
              <Text style={styles.alumniAchievement}>{alumni.achievement}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Clubs Section */}
        <ClubsSection
          title="Club & Society Showcase"
          actionText="Explore Clubs"
          onActionPress={() => router.push("/(routes)/clubs")}
          clubs={clubsAndSocieties}
          onClubPress={(club) => console.log("View Club", club.name)}
          onJoinPress={(club) =>
            console.log(club.isJoined ? "View Club" : "Join Club", club.name)
          }
          emptyText="No clubs available."
        />

        {/* Community Updates Section */}
        <CommunityFeedSection
          title="Community Updates"
          actionText="Share Update"
          onActionPress={() => router.push("/(student-tabs)/community")}
          posts={communityPosts}
          userId={user?.id}
          emptyText="No community posts yet."
          formatTimeAgo={formatTimeAgo}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopyLink={handleCopyLink}
          onSavePost={handleSavePost}
          onReportPost={handleReportPost}
          onUnfollow={handleUnfollow}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
