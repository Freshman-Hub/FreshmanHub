"use client";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  type TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Users, TrendingUp, Calendar, BookOpen } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { PostCard } from "@/components/common/PostCard";

// Import our reusable components
import { Header } from "@/components/ui/Header";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";

const initialCommunityPosts = [
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
  { id: 5, name: "#FreshmanLife", posts: 234 },
  { id: 6, name: "#StudyTips", posts: 189 },
  { id: 7, name: "#CampusEvents", posts: 156 },
  { id: 8, name: "#AshesiPride", posts: 142 },
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
  const params = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [posts, setPosts] = useState(initialCommunityPosts);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const filters = [
    "All",
    "Campus Life",
    "Study Tips",
    "Achievements",
    "Study Groups",
  ];

  // Handle new post when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (params.newPost) {
        try {
          const parsedPost = JSON.parse(params.newPost as string);
          setPosts((prevPosts) => {
            // Check if post already exists to prevent duplicates
            const postExists = prevPosts.some(
              (post) => post.id === parsedPost.id
            );
            if (!postExists) {
              return [parsedPost, ...prevPosts];
            }
            return prevPosts;
          });
        } catch (error) {
          console.error("Error parsing new post:", error);
        }
      }
    }, [params.newPost])
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleSearchPress = () => {
    setIsSearchMode(true);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
      // Simulate search API call
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
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

  const handleCreatePost = () => {
    console.log("Creating new post");
    // Navigate to create post screen
    router.push("/(routes)/create-post");
  };

  const handleFilterPress = () => {
    console.log("Opening filter options");
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
    scrollContent: {
      paddingBottom: theme.spacing.md,
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
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
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
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    searchResultsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
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
    searchSuggestions: {
      padding: theme.spacing.md,
    },
    suggestionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    } as TextStyle,
  });

  // Search Results Component
  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Try searching for posts, people, or topics...
          </Text>
        </View>
      ) : filteredPosts.length > 0 ? (
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
            isOwner={post.user.name === "Current User"} // Replace with actual logic
            isFollowing={true} // Replace with actual logic
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onEdit={(postId) => console.log("Edit post", postId)}
            onDelete={(postId) => console.log("Delete post", postId)}
            onCopyLink={(postId) => console.log("Copy link", postId)}
            onSavePost={(postId) => console.log("Save post", postId)}
            onReportPost={(postId) => console.log("Report post", postId)}
            onUnfollow={(postId) => console.log("Unfollow user", postId)}
            showViewMore={true}
            maxContentLength={150}
          />
        ))
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No results found for &quot;{searchQuery}&quot;
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isSearchMode ? (
        <>
          <FullSearchHeader
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={handleSearchClose}
            onSubmit={handleSearchSubmit}
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Community"
            showSearch={true}
            onSearchPress={handleSearchPress}
            showFilter={true}
            onFilterPress={handleFilterPress}
            showCreate={true}
            onCreatePress={handleCreatePost}
            createIconType="post"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                {communityStats.map((stat, index) => (
                  <StatCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filtersContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScroll}
              >
                {filters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedFilter === filter}
                    onPress={() => setSelectedFilter(filter)}
                  />
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
                    <Text style={styles.trendingTagCount}>
                      {topic.posts} posts
                    </Text>
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
                    isOwner={post.user.name === "Current User"} // Replace with actual logic
                    isFollowing={true} // Replace with actual logic
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    onEdit={(postId) => console.log("Edit post", postId)}
                    onDelete={(postId) => console.log("Delete post", postId)}
                    onCopyLink={(postId) => console.log("Copy link", postId)}
                    onSavePost={(postId) => console.log("Save post", postId)}
                    onReportPost={(postId) =>
                      console.log("Report post", postId)
                    }
                    onUnfollow={(postId) =>
                      console.log("Unfollow user", postId)
                    }
                    showViewMore={true}
                    maxContentLength={150}
                  />
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    No posts found in {selectedFilter} category
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
