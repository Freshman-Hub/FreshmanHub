"use client";

import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  Send,
  CheckCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PostOptionsMenu } from "@/components/ui/PostOptionsMenu";
import { CommentCard } from "@/components/common/CommentCard";

// Mock data - in real app, this would come from API
const postData = {
  1: {
    id: 1,
    user: {
      name: "Sarah Mensah",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      year: "Freshman",
      verified: true,
    },
    content:
      "Just finished my first week at Ashesi! The campus is absolutely beautiful and everyone has been so welcoming. Can't wait to join the debate club! 🎓✨\n\nI've been exploring different parts of the campus and I'm amazed by the architecture and the green spaces. The library is my favorite spot so far - it's so peaceful and has everything I need for studying.\n\nAlso met some amazing people in my dorm. We're already planning study groups and weekend activities. This is going to be an incredible journey!",
    image:
      "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
    likes: 24,
    comments: 8,
    shares: 3,
    timeAgo: "2h ago",
    isLiked: false,
    category: "Campus Life",
  },
  2: {
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
    image: undefined,
    likes: 31,
    comments: 12,
    shares: 5,
    timeAgo: "4h ago",
    isLiked: true,
    category: "Study Tips",
  },
};

const commentsData = [
  {
    id: 1,
    user: {
      name: "Michael Osei",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: false,
    },
    content:
      "Welcome to Ashesi! You're going to love it here. The debate club is amazing - I was part of it last year!",
    timeAgo: "1h ago",
    likes: 5,
    isLiked: true,
    replies: [
      {
        id: 11,
        user: {
          name: "Sarah Mensah",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          verified: true,
        },
        content:
          "Thank you! I'm really excited to join. Any tips for a beginner?",
        timeAgo: "45m ago",
        likes: 2,
        isLiked: false,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Ama Asante",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: true,
    },
    content:
      "The library is definitely the best study spot! Pro tip: get there early during exam periods 📚",
    timeAgo: "30m ago",
    likes: 8,
    isLiked: false,
    replies: [],
  },
  {
    id: 3,
    user: {
      name: "Kwame Nkrumah",
      avatar:
        "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
      verified: true,
    },
    content:
      "Welcome to the Ashesi family! 🎉 If you need any help with anything, feel free to reach out. We're all here to support each other.",
    timeAgo: "15m ago",
    likes: 12,
    isLiked: true,
    replies: [],
  },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [post, setPost] = useState(
    postData[Number.parseInt(id as string) as keyof typeof postData]
  );
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    postContainer: {
      margin: theme.spacing.sm,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    userDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    userNameContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    userName: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 16,
    },
    verifiedBadge: {
      marginLeft: theme.spacing.sm,
    },
    userMeta: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontWeight: "500",
    },
    categoryBadge: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      marginTop: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    categoryText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "700",
    },
    postContent: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
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
      borderRadius: theme.borderRadius.lg,
      minWidth: 50,
      justifyContent: "center",
    },
    actionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    likedText: {
      color: "#e11d48",
      fontWeight: "700",
    },
    commentsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    commentsSectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    commentInputWrapper: {
      flex: 1,
    },
    commentInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: 16,
      maxHeight: 100,
      minHeight: 48,
      textAlignVertical: "top",
    },
    replyingToContainer: {
      backgroundColor: theme.colors.primary + "10",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    replyingToText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    cancelReplyButton: {
      padding: theme.spacing.xs,
    },
  });

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Post Not Found"
          leftIcon={ArrowLeft}
          onLeftPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      };
    });
  };

  const handleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: {
          name: "You",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
          verified: false,
        },
        content: newComment,
        timeAgo: "now",
        likes: 0,
        isLiked: false,
        replies: [],
      };

      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      setReplyingTo(null);

      // Auto-scroll to show new comment
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    const replyingComment = comments.find((c) => c.id === commentId);
    if (replyingComment) {
      setNewComment(`@${replyingComment.user.name} `);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Post"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.postContainer}>
            <Card
              style={{ padding: theme.spacing.md }}
              content={
                <View>
                  <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
                      <Avatar
                        imageUrl={post.user.avatar}
                        initials={post.user.name.charAt(0)}
                        size={45}
                      />
                      <View style={styles.userDetails}>
                        <View style={styles.userNameContainer}>
                          <Text style={styles.userName}>{post.user.name}</Text>
                          {post.user.verified && (
                            <CheckCircle
                              color={theme.colors.primary}
                              size={18}
                              style={styles.verifiedBadge}
                            />
                          )}
                        </View>
                        <Text style={styles.userMeta}>
                          {post.user.year} • {post.timeAgo}
                        </Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>
                            {post.category}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <PostOptionsMenu
                      postId={post.id}
                      isOwner={post.user.name === "Current User"} // Replace with actual logic
                      isFollowing={true}
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
                      onShare={(postId) => console.log("Share post", postId)}
                    />
                  </View>

                  <Text style={styles.postContent}>{post.content}</Text>

                  {post.image && (
                    <Card
                      image={post.image}
                      style={{ marginBottom: theme.spacing.sm, padding: 0 }}
                      headerStyle={{ padding: 0 }}
                    />
                  )}

                  <View style={styles.postActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleLike}
                    >
                      <Heart
                        color={
                          post.isLiked ? "#e11d48" : theme.colors.textSecondary
                        }
                        size={24}
                        fill={post.isLiked ? "#e11d48" : "none"}
                      />
                      <Text
                        style={[
                          styles.actionText,
                          post.isLiked && styles.likedText,
                        ]}
                      >
                        {post.likes}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <MessageCircle
                        color={theme.colors.textSecondary}
                        size={24}
                      />
                      <Text style={styles.actionText}>{post.comments}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <Share color={theme.colors.textSecondary} size={24} />
                      <Text style={styles.actionText}>{post.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            />
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>
              Comments ({comments.length})
            </Text>
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                id={comment.id}
                user={comment.user}
                content={comment.content}
                timeAgo={comment.timeAgo}
                likes={comment.likes}
                isLiked={comment.isLiked}
                replies={comment.replies}
                onLike={handleCommentLike}
                onReply={handleReply}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputWrapper}>
            {replyingTo && (
              <View style={styles.replyingToContainer}>
                <Text style={styles.replyingToText}>
                  Replying to{" "}
                  {comments.find((c) => c.id === replyingTo)?.user.name}
                </Text>
                <TouchableOpacity
                  style={styles.cancelReplyButton}
                  onPress={cancelReply}
                >
                  <Text style={[styles.replyingToText, { fontSize: 16 }]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <RNTextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={
                replyingTo ? "Write a reply..." : "Write a comment..."
              }
              placeholderTextColor={theme.colors.textSecondary}
              multiline={true}
              autoCorrect={true}
              autoCapitalize="sentences"
            />
          </View>

          <Button
            title=""
            onPress={handleSubmitComment}
            icon={Send}
            mode="contained"
            style={{
              minWidth: 48,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.borderRadius.xxxl,
            }}
            disabled={!newComment.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
