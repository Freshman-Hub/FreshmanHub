"use client";
import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Animated,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  Plus,
  X,
  Users,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { PostCard } from "@/components/common/PostCard";

const communityPosts = [
  {
    id: 1,
    user: {
      name: "Sarah Mensah",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      year: "Freshman",
      verified: true,
    },
    content:
      "Just finished my first week at Ashesi! The campus is absolutely beautiful and everyone has been so welcoming. Can't wait to join the debate club! 🎓✨ I've been exploring different parts of the campus and I'm amazed by the architecture and the green spaces.",
    image:
      "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 24,
    comments: 8,
    shares: 3,
    timeAgo: "2h ago",
    isLiked: false,
    category: "Campus Life",
  },
  {
    id: 2,
    user: {
      name: "Michael Osei",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      year: "Sophomore",
      verified: false,
    },
    content:
      "Pro tip for freshmen: The library has amazing study spots on the 3rd floor! Perfect for group projects and the view is incredible 📚 Also, don't forget to check out the quiet zones during exam periods.",
    likes: 31,
    comments: 12,
    shares: 7,
    timeAgo: "4h ago",
    isLiked: true,
    category: "Study Tips",
  },
  {
    id: 3,
    user: {
      name: "Ama Asante",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      year: "Junior",
      verified: true,
    },
    content:
      "Excited to announce that our robotics team just won first place at the regional competition! 🤖🏆 Proud to represent Ashesi! The months of hard work and dedication have finally paid off.",
    image:
      "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 89,
    comments: 23,
    shares: 15,
    timeAgo: "6h ago",
    isLiked: false,
    category: "Achievements",
  },
  {
    id: 4,
    user: {
      name: "Kwame Nkrumah",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
      year: "Senior",
      verified: true,
    },
    content:
      "Looking for study partners for Advanced Algorithms! Let's form a study group and tackle these problems together. DM me if interested! 💻 We can meet twice a week and work through the challenging assignments.",
    likes: 18,
    comments: 9,
    shares: 4,
    timeAgo: "8h ago",
    isLiked: true,
    category: "Study Groups",
  },
];

const trendingTopics = [
  { id: 1, name: "#FreshmanLife", posts: 234 },
  { id: 2, name: "#StudyTips", posts: 189 },
  { id: 3, name: "#CampusEvents", posts: 156 },
  { id: 4, name: "#AshesiPride", posts: 142 },
];

const communityStats = [
  { label: "Active Members", value: "2.4K", icon: Users, color: "#3b82f6" },
  { label: "Posts Today", value: "47", icon: TrendingUp, color: "#059669" },
  { label: "Events This Week", value: "12", icon: Calendar, color: "#dc2626" },
  { label: "Study Groups", value: "28", icon: BookOpen, color: "#7c3aed" },
];

export default function CommunityScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [posts, setPosts] = useState(communityPosts);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const filters = [
    "All",
    "Campus Life",
    "Study Tips",
    "Achievements",
    "Study Groups",
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 44,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
    });
  };

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: number) => {
    router.push(`/(routes)/post/${postId}`);
  };

  const handleShare = (postId: number) => {
    console.log("Sharing post", postId);
  };

  // Filter posts based on search query and selected filter
  const filteredPosts = posts.filter((post) => {
    const matchesFilter =
      selectedFilter === "All" || post.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 24,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    searchContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xxxl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      paddingHorizontal: theme.spacing.sm,
      fontWeight: "500",
    },
    searchButton: {
      padding: theme.spacing.sm,
    },
    createPostButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    filterButton: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    statsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.05)",
    },
    statIcon: {
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: 4,
    },
    statLabel: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "600",
    },
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOpacity: 0.3,
    },
    filterChipText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    filterChipTextActive: {
      color: "white",
      fontWeight: "700",
    },
    trendingContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    trendingTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    trendingList: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
    },
    trendingTag: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    trendingTagText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    trendingTagCount: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    postsContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    noResultsContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    noResultsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    } as TextStyle,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Community</Text>
          <View style={styles.headerActions}>
            <Animated.View
              style={[styles.searchContainer, { width: searchWidth }]}
            >
              {!isSearchExpanded ? (
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={expandSearch}
                >
                  <Search color={theme.colors.textSecondary} size={22} />
                </TouchableOpacity>
              ) : (
                <>
                  <Animated.View style={{ opacity: searchOpacity, flex: 1 }}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search posts, people, topics..."
                      placeholderTextColor={theme.colors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoFocus
                    />
                  </Animated.View>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={collapseSearch}
                  >
                    <X color={theme.colors.textSecondary} size={20} />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>

            <TouchableOpacity style={styles.filterButton}>
              <Filter color={theme.colors.textSecondary} size={22} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.createPostButton}>
              <Plus color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {communityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <IconComponent
                    color={stat.color}
                    size={28}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.trendingContainer}>
          <Text style={styles.trendingTitle}>Trending Topics</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          >
            {trendingTopics.map((topic) => (
              <TouchableOpacity key={topic.id} style={styles.trendingTag}>
                <Text style={styles.trendingTagText}>{topic.name}</Text>
                <Text style={styles.trendingTagCount}>{topic.posts} posts</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.postsContainer}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                user={post.user}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                timeAgo={post.timeAgo}
                isLiked={post.isLiked}
                category={post.category}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                showViewMore={true}
                maxContentLength={150}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {searchQuery
                  ? `No posts found for "${searchQuery}"`
                  : `No posts found in ${selectedFilter} category`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
