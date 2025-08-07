"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  type TextStyle,
  Alert, // Import Alert for error handling
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Users, TrendingUp, Calendar, BookOpen } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { PostCard } from "@/components/common/PostCard";

import { PostsService } from "../../../services/posts.service";
import { Post } from "../../../types/post.types";
import { useUser } from "../../../contexts/UserContext";

// Import our reusable components
import { Header } from "@/components/ui/Header";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
// import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CommunityScreen() {
  const { theme } = useTheme();
  const { user } = useUser(); // Get current user
  const router = useRouter();
  const params = useLocalSearchParams();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const filters = [
    "All",
    "Campus Life",
    "Study Tips",
    "Achievements",
    "Study Groups",
  ];


  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { posts: fetchedPosts, error } = await PostsService.getPosts(20);

      if (error) {
        console.error("Error loading posts:", error);
        Alert.alert("Error", "Failed to load posts");
      } else {
        setPosts(fetchedPosts);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load posts on component mount - only if not already loaded
  useEffect(() => {
    if (!dataLoaded) {
      loadPosts();
    }
  }, [dataLoaded, loadPosts]);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDataLoaded(false); // Reset flag to force reload
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

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

  const handleLike = async (postId: string) => {
    if (!user?.id) return;

    // Optimistic update
    setPosts((prevPosts) =>
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
      await loadPosts();
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/(routes)/post/${postId}`);
  };

  const handleShare = (postId: string) => {
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

  const handleDeletePost = async (postId: string) => {
    try {
      // Show confirmation dialog
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
              // Show loading
              setLoading(true);

              const { error } = await PostsService.deletePost(postId);

              if (error) {
                Alert.alert(
                  "Error",
                  "Failed to delete post. Please try again."
                );
              } else {
                // Remove post from local state
                setPosts((prev) => prev.filter((post) => post.id !== postId));
                Alert.alert("Success", "Post deleted successfully");
              }

              setLoading(false);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post");
      setLoading(false);
    }
  };

  // Filter posts based on search query and selected filter
  const filteredPosts = posts.filter((post) => {
    const matchesFilter =
      selectedFilter === "All" || post.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.userDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      marginVertical: theme.spacing.md,
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
            user={{
              name: post.userDisplayName,
              avatar:
                post.userAvatar ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
              year: post.userYear,
              verified: post.userVerified || false,
            }}
            content={post.content}
            image={post.image}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            timeAgo={formatTimeAgo(post.createdAt)}
            isLiked={post.likedBy?.includes(user?.id || "") || false}
            category={post.category}
            isOwner={post.userId === user?.id}
            isFollowing={true}
            onLike={() => handleLike(post.id)}
            onComment={() => handleComment(post.id)}
            onShare={() => handleShare(post.id)}
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

  // Show loading spinner when loading
  if (loading && !dataLoaded) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header title="Community Feed" />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

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
            title="Community Feed"
            showSearch={true}
            onSearchPress={handleSearchPress}
            showFilter={false}
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

            <View style={styles.postsContainer}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    user={{
                      name: post.userDisplayName,
                      avatar:
                        post.userAvatar ||
                        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
                      year: post.userYear,
                      verified: post.userVerified || false,
                    }}
                    content={post.content}
                    image={post.image}
                    likes={post.likes}
                    comments={post.comments}
                    shares={post.shares}
                    timeAgo={formatTimeAgo(post.createdAt)}
                    isLiked={post.likedBy?.includes(user?.id || "") || false}
                    category={post.category}
                    isOwner={post.userId === user?.id}
                    isFollowing={true}
                    onLike={() => handleLike(post.id)}
                    onComment={() => handleComment(post.id)}
                    onShare={() => handleShare(post.id)}
                    onEdit={(postId) => console.log("Edit post", postId)}
                    onDelete={handleDeletePost}
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
