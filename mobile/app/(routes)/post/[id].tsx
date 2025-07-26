"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  MessageCircle,
  Send,
  Share,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EditPostModal } from "@/components/modals/EditPostModal";

// Import reusable components
import { CommentCard } from "@/components/common/CommentCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/ui/Header";
import { PostOptionsMenu } from "@/components/ui/PostOptionsMenu";

import { useUser } from "../../../contexts/UserContext";
import { PostsService } from "../../../services/posts.service";
import { Comment, Post } from "../../../types/post.types";

// Mock data - in real app, this would come from API
// const postData = {
//   1: {
//     id: 1,
//     user: {
//       name: "Sarah Mensah",
//       avatar:
//         "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
//       year: "Freshman",
//       verified: true,
//     },
//     content:
//       "Just finished my first week at Ashesi! The campus is absolutely beautiful and everyone has been so welcoming. Can't wait to join the debate club! 🎓✨\n\nI've been exploring different parts of the campus and I'm amazed by the architecture and the green spaces. The library is my favorite spot so far - it's so peaceful and has everything I need for studying.\n\nAlso met some amazing people in my dorm. We're already planning study groups and weekend activities. This is going to be an incredible journey!",
//     image:
//       "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=400",
//     likes: 24,
//     comments: 8,
//     shares: 3,
//     timeAgo: "2h ago",
//     isLiked: false,
//     category: "Campus Life",
//   },
//   2: {
//     id: 2,
//     user: {
//       name: "Michael Osei",
//       avatar:
//         "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
//       year: "Sophomore",
//       verified: false,
//     },
//     content:
//       "Pro tip for freshmen: The library has amazing study spots on the 3rd floor! Perfect for group projects and the view is incredible 📚 Also, don't forget to check out the quiet zones during exam periods.",
//     image: undefined,
//     likes: 31,
//     comments: 12,
//     shares: 5,
//     timeAgo: "4h ago",
//     isLiked: true,
//     category: "Study Tips",
//   },
// };

// const commentsData = [
//   {
//     id: 1,
//     user: {
//       name: "Michael Osei",
//       avatar:
//         "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
//       verified: false,
//     },
//     content:
//       "Welcome to Ashesi! You're going to love it here. The debate club is amazing - I was part of it last year!",
//     timeAgo: "1h ago",
//     likes: 5,
//     isLiked: true,
//     replies: [
//       {
//         id: 11,
//         user: {
//           name: "Sarah Mensah",
//           avatar:
//             "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
//           verified: true,
//         },
//         content:
//           "Thank you! I'm really excited to join. Any tips for a beginner?",
//         timeAgo: "45m ago",
//         likes: 2,
//         isLiked: false,
//       },
//     ],
//   },
//   {
//     id: 2,
//     user: {
//       name: "Ama Asante",
//       avatar:
//         "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
//       verified: true,
//     },
//     content:
//       "The library is definitely the best study spot! Pro tip: get there early during exam periods 📚",
//     timeAgo: "30m ago",
//     likes: 8,
//     isLiked: false,
//     replies: [],
//   },
//   {
//     id: 3,
//     user: {
//       name: "Kwame Nkrumah",
//       avatar:
//         "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
//       verified: true,
//     },
//     content:
//       "Welcome to the Ashesi family! 🎉 If you need any help with anything, feel free to reach out. We're all here to support each other.",
//     timeAgo: "15m ago",
//     likes: 12,
//     isLiked: true,
//     replies: [],
//   },
// ];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Add this state after your existing useState declarations
  const [postingComment, setPostingComment] = useState(false);

  // Add these states after your existing useState declarations
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const { user } = useUser();

  // Fetch post data
  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);

      // Use the dedicated getPost method
      const { post: fetchedPost, error } = await PostsService.getPost(postId);

      if (error) {
        Alert.alert("Error", "Failed to load post");
        return;
      }

      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        Alert.alert("Error", "Post not found");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Error", "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async (postId: string) => {
    try {
      setCommentsLoading(true);
      const { comments: fetchedComments, error } =
        await PostsService.getComments(postId);

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(fetchedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (id) {
      fetchPost(id as string);
      fetchComments(id as string);
    }
  }, [id]);

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
      padding: theme.spacing.sm,
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
    postingIndicator: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.primary + "10",
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    postingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginRight: theme.spacing.sm,
      // Add pulsing animation
      opacity: 0.8,
    },
    postingText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      fontStyle: "italic",
    },
    commentInputDisabled: {
      opacity: 0.7,
      backgroundColor: theme.colors.background + "80",
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Post"
          leftIcon={ArrowLeft}
          onLeftPress={() => router.back()}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.colors.text }}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleLike = async () => {
    if (!post || !user?.id) return;

    // Optimistic update
    setPost((prev) => {
      if (!prev) return prev;
      const isLiked = prev.likedBy?.includes(user.id) || false;
      return {
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1,
        likedBy: isLiked
          ? prev.likedBy?.filter((id) => id !== user.id) || []
          : [...(prev.likedBy || []), user.id],
      };
    });

    // API call
    const { error } = await PostsService.toggleLike(post.id, user.id);

    if (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      await fetchPost(post.id);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!user?.id || !post) return;

    // Optimistic update
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const isLiked = comment.likedBy?.includes(user.id) || false;
          return {
            ...comment,
            likes: isLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: isLiked
              ? comment.likedBy?.filter((id) => id !== user.id) || []
              : [...(comment.likedBy || []), user.id],
          };
        }
        return comment;
      })
    );

    // API call
    const { error } = await PostsService.toggleCommentLike(
      post.id,
      commentId,
      user.id
    );

    if (error) {
      console.error("Error toggling comment like:", error);
      // Revert optimistic update on error
      await fetchComments(post.id);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post || !user) return;

    try {
      const cleanContent = newComment.trim();

      // Check if this is a reply
      if (replyingTo) {
        // Handle reply
        const replyData: any = {
          content: cleanContent,
          userId: user.id,
          userDisplayName: `${user.firstName} ${user.lastName}`,
        };

        if (user.profileImage && user.profileImage.trim() !== "") {
          replyData.userAvatar = user.profileImage;
        }

        const { reply, error } = await PostsService.addReply(
          post.id,
          replyingTo,
          replyData
        );

        if (error) {
          Alert.alert("Error", "Failed to add reply");
          return;
        }

        if (reply) {
          // Update the comment with the new reply
          setComments((prev) =>
            prev.map((comment) => {
              if (comment.id === replyingTo) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), reply],
                };
              }
              return comment;
            })
          );
        }
      } else {
        // Handle regular comment (keep existing code)
        const commentData: any = {
          content: cleanContent,
          userId: user.id,
          userDisplayName: `${user.firstName} ${user.lastName}`,
        };

        if (user.profileImage && user.profileImage.trim() !== "") {
          commentData.userAvatar = user.profileImage;
        }

        const { comment, error } = await PostsService.addComment(
          post.id,
          commentData
        );

        if (error) {
          Alert.alert("Error", "Failed to add comment");
          return;
        }

        if (comment) {
          setComments((prev) => [comment, ...prev]);
          setPost((prev) =>
            prev ? { ...prev, comments: prev.comments + 1 } : prev
          );
        }
      }

      setNewComment("");
      setReplyingTo(null);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error adding comment/reply:", error);
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setPostingComment(false); // Stop loading
    }
  };

  const handleShare = async () => {
    if (!post) return;

    try {
      // You can implement actual sharing here
      Alert.alert(
        "Share Post",
        "Share functionality would be implemented here",
        [
          { text: "Copy Link", onPress: () => console.log("Copy link") },
          { text: "Share via...", onPress: () => console.log("Share via...") },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    const replyingComment = comments.find((c) => c.id === commentId);
    if (replyingComment) {
      setNewComment(`@${replyingComment.userDisplayName} `);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setNewComment("");
  };

  // Add these new handlers after the existing ones

  const handleCommentEdit = async (commentId: string, newContent: string) => {
    if (!post) return;

    const { error } = await PostsService.editComment(
      post.id,
      commentId,
      newContent
    );

    if (error) {
      Alert.alert("Error", "Failed to edit comment");
    } else {
      // Update local state
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: newContent }
            : comment
        )
      );
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!post) return;

    const { error } = await PostsService.deleteComment(post.id, commentId);

    if (error) {
      Alert.alert("Error", "Failed to delete comment");
    } else {
      // Update local state
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setPost((prev) =>
        prev ? { ...prev, comments: prev.comments - 1 } : prev
      );
    }
  };

  const handleReplyLike = async (replyId: string) => {
    if (!post || !user?.id) return;

    // Find which comment contains this reply
    const parentComment = comments.find((comment) =>
      comment.replies?.some((reply) => reply.id === replyId)
    );

    if (!parentComment) return;

    // Optimistic update
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentComment.id) {
          return {
            ...comment,
            replies:
              comment.replies?.map((reply) => {
                if (reply.id === replyId) {
                  const isLiked = reply.isLiked || false;
                  return {
                    ...reply,
                    likes: isLiked
                      ? (reply.likes || 0) - 1
                      : (reply.likes || 0) + 1,
                    isLiked: !isLiked,
                  };
                }
                return reply;
              }) || [],
          };
        }
        return comment;
      })
    );

    // API call
    const { error } = await PostsService.toggleReplyLike(
      post.id,
      parentComment.id,
      replyId,
      user.id
    );

    if (error) {
      console.error("Error toggling reply like:", error);
      // Revert optimistic update
      await fetchComments(post.id);
    }
  };

  const handleReplyEdit = async (replyId: string, newContent: string) => {
    if (!post) return;

    // Find which comment contains this reply
    const parentComment = comments.find((comment) =>
      comment.replies?.some((reply) => reply.id === replyId)
    );

    if (!parentComment) return;

    const { error } = await PostsService.editReply(
      post.id,
      parentComment.id,
      replyId,
      newContent
    );

    if (error) {
      Alert.alert("Error", "Failed to edit reply");
    } else {
      // Update local state
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentComment.id) {
            return {
              ...comment,
              replies:
                comment.replies?.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, content: newContent }
                    : reply
                ) || [],
            };
          }
          return comment;
        })
      );
    }
  };

  const handleReplyDelete = async (replyId: string) => {
    if (!post) return;

    // Find which comment contains this reply
    const parentComment = comments.find((comment) =>
      comment.replies?.some((reply) => reply.id === replyId)
    );

    if (!parentComment) return;

    const { error } = await PostsService.deleteReply(
      post.id,
      parentComment.id,
      replyId
    );

    if (error) {
      Alert.alert("Error", "Failed to delete reply");
    } else {
      // Update local state
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentComment.id) {
            return {
              ...comment,
              replies:
                comment.replies?.filter((reply) => reply.id !== replyId) || [],
            };
          }
          return comment;
        })
      );
    }
  };

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

  // Add this handler after your existing handlers
  const handleDeletePost = async () => {
    if (!post) return;

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
            try {
              setLoading(true);

              const { error } = await PostsService.deletePost(post.id);

              if (error) {
                Alert.alert(
                  "Error",
                  "Failed to delete post. Please try again."
                );
              } else {
                Alert.alert("Success", "Post deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => {
                      // Navigate back to community
                      router.push("/(student-tabs)/community");
                    },
                  },
                ]);
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditPost = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData: {
    content: string;
    category: string;
    image?: string;
  }) => {
    if (!post) return;

    try {
      setEditLoading(true);

      const { error } = await PostsService.editPost(post.id, updatedData);

      if (error) {
        Alert.alert("Error", "Failed to update post. Please try again.");
      } else {
        // Update local state
        setPost((prev) => (prev ? { ...prev, ...updatedData } : prev));
        setShowEditModal(false);
        Alert.alert("Success", "Post updated successfully");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      Alert.alert("Error", "Failed to update post");
    } finally {
      setEditLoading(false);
    }
  };

  // Better helper function that handles full names properly
  const renderContentWithTags = (content: string, theme: any) => {
    const parts = content.split(/(@[A-Za-z]+(?:\s+[A-Za-z]+)*)/g);

    return (
      <>
        {parts.map((part, index) => {
          if (part.match(/^@[A-Za-z]+(?:\s+[A-Za-z]+)*$/)) {
            // This is a mention
            return (
              <Text
                key={index}
                style={{
                  color: theme.colors.primary,
                  fontWeight: "700",
                }}
              >
                {part}
              </Text>
            );
          }
          // This is regular text - don't apply any special styling
          return part;
        })}
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Post"
        leftIcon={ArrowLeft}
        onLeftPress={() => {
          // Smooth slide back transition
          router.push({
            pathname: "/(student-tabs)/community",
            params: { refresh: "false" },
          });
        }}
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
                        imageUrl={post.userAvatar}
                        initials={post.userDisplayName
                          .split(" ")
                          .map((n) => n.charAt(0))
                          .join("")}
                        size={45}
                      />
                      <View style={styles.userDetails}>
                        <View style={styles.userNameContainer}>
                          <Text style={styles.userName}>
                            {post.userDisplayName}
                          </Text>
                          {post.userVerified && (
                            <CheckCircle
                              color={theme.colors.primary}
                              size={18}
                              style={styles.verifiedBadge}
                            />
                          )}
                        </View>
                        <Text style={styles.userMeta}>
                          {post.userYear || "Student"} •{" "}
                          {formatTimeAgo(post.createdAt)}
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
                      isOwner={post.userId === user?.id}
                      isFollowing={true}
                      onEdit={() => handleEditPost()} // Connect to actual edit handler
                      onDelete={() => handleDeletePost()}
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

                  <Text style={styles.postContent}>
                    {renderContentWithTags(post.content, theme)}
                  </Text>

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
                          post.likedBy?.includes(user?.id || "")
                            ? "#e11d48"
                            : theme.colors.textSecondary
                        }
                        size={24}
                        fill={
                          post.likedBy?.includes(user?.id || "")
                            ? "#e11d48"
                            : "none"
                        }
                      />
                      <Text
                        style={[
                          styles.actionText,
                          post.likedBy?.includes(user?.id || "") &&
                            styles.likedText,
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

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleShare}
                    >
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
                user={{
                  name: comment.userDisplayName,
                  avatar: comment.userAvatar || "",
                  verified: false,
                }}
                content={comment.content}
                timeAgo={formatTimeAgo(comment.createdAt)}
                likes={comment.likes}
                isLiked={comment.likedBy?.includes(user?.id || "") || false}
                replies={
                  comment.replies?.map((reply) => ({
                    id: reply.id,
                    userId: reply.userId, // Add this field
                    user: {
                      name: reply.userDisplayName,
                      avatar: reply.userAvatar || "",
                      verified: false,
                    },
                    content: reply.content,
                    timeAgo: formatTimeAgo(reply.createdAt),
                    likes: reply.likes || 0,
                    isLiked: reply.isLiked || false,
                  })) || []
                }
                onLike={() => handleCommentLike(comment.id)}
                onReply={() => handleReply(comment.id)}
                onEdit={handleCommentEdit}
                onDelete={handleCommentDelete}
                onReplyLike={handleReplyLike}
                onReplyEdit={handleReplyEdit}
                onReplyDelete={handleReplyDelete}
                isOwner={comment.userId === user?.id}
                currentUserId={user?.id}
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
                  {comments.find((c) => c.id === replyingTo)?.userDisplayName}
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

            {/* Add posting indicator */}
            {postingComment && (
              <View style={styles.postingIndicator}>
                <View style={styles.postingDot} />
                <Text style={styles.postingText}>
                  {replyingTo ? "Posting reply..." : "Posting comment..."}
                </Text>
              </View>
            )}

            <RNTextInput
              style={[
                styles.commentInput,
                postingComment && styles.commentInputDisabled,
              ]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={
                replyingTo ? "Write a reply..." : "Write a comment..."
              }
              placeholderTextColor={theme.colors.textSecondary}
              multiline={true}
              autoCorrect={true}
              autoCapitalize="sentences"
              editable={!postingComment} // Disable input while posting
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
              opacity: postingComment ? 0.6 : 1, // Dim button while posting
            }}
            disabled={!newComment.trim() || postingComment} // Disable while posting
            loading={postingComment} // Show loading spinner in button
          />
        </View>
      </KeyboardAvoidingView>

      {/* Add the EditPostModal */}
      {post && (
        <EditPostModal
          visible={showEditModal}
          post={post}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          loading={editLoading}
        />
      )}
    </SafeAreaView>
  );
}
