"use client";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PostCard } from "@/components/common/PostCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

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
    shares: 5,
    timeAgo: "4h ago",
    isLiked: true,
    category: "Study Tips",
  },
];

export function CommunityHighlights() {
  const { theme } = useTheme();
  const router = useRouter();
  const [posts, setPosts] = useState(communityPosts);

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

  const handlePostPress = (postId: number) => {
    router.push(`/(routes)/post/${postId}`);
  };

  const handleViewFeed = () => {
    router.push("/(tabs)/community");
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: 0,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontWeight: "500",
    },
    viewFeedButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    viewFeedText: {
      ...theme.typography.buttonSmall,
      color: "white",
      fontWeight: "700",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Community Highlights</Text>
          <Text style={styles.subtitle}>See what your peers are sharing</Text>
        </View>
        <TouchableOpacity
          style={styles.viewFeedButton}
          onPress={handleViewFeed}
        >
          <Text style={styles.viewFeedText}>View Feed</Text>
        </TouchableOpacity>
      </View>

      {posts.map((post) => (
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
          onPress={handlePostPress}
          showViewMore={true}
          maxContentLength={120}
        />
      ))}
    </View>
  );
}
