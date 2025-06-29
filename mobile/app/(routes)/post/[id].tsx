import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share,
  MoveHorizontal as MoreHorizontal,
  Send,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

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

  const [post, setPost] = useState(postData[parseInt(id as string) as keyof typeof postData]);
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    postContainer: {
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 2,
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
    avatar: {
      width: 45,
      height: 45,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: theme.colors.primary + "20",
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
      fontWeight: "600",
    },
    verifiedBadge: {
      marginLeft: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxxl,
      padding: 2,
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
      borderRadius: theme.borderRadius.lg,
      marginTop: theme.spacing.sm,
      alignSelf: "flex-start",
    },
    categoryText: {
      ...theme.typography.captionSmall,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    moreButton: {
      padding: theme.spacing.sm,
    },
    postContent: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    postImage: {
      width: "100%",
      height: 280,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: theme.spacing.xs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      // backgroundColor: theme.colors.background,
      minWidth: 50,
      justifyContent: "center",
    },
    actionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    likedText: {
      color: "#e11d48",
      fontWeight: "600",
    },
    commentsSection: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    commentsSectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.lg,
    },
    commentCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 1,
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    commentAvatar: {
      width: 35,
      height: 35,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    commentUserDetails: {
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    commentUserName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    commentTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "400" as const,
    },
    commentContent: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
      fontWeight: "500",
    },
    commentActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
    },
    commentActionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.xs,
    },
    commentActionText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
      fontWeight: "500",
    },
    repliesContainer: {
      marginTop: theme.spacing.md,
      marginLeft: theme.spacing.xl,
      paddingLeft: theme.spacing.md,
      borderLeftWidth: 2,
      borderLeftColor: theme.colors.border,
    },
    replyCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    showRepliesButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    showRepliesText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    commentInputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    commentInput: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.typography.body,
      color: theme.colors.text,
      maxHeight: 100,
      fontSize: 16,
      fontWeight: "500",
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xxxl,
      padding: theme.spacing.md,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
  });

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Not Found</Text>
        </View>
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
    }
  };

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderComment = (comment: any, isReply = false) => (
    <View
      key={comment.id}
      style={isReply ? styles.replyCard : styles.commentCard}
    >
      <View style={styles.commentHeader}>
        <Image
          source={{ uri: comment.user.avatar }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentUserDetails}>
          <View style={styles.userNameContainer}>
            <Text style={styles.commentUserName}>{comment.user.name}</Text>
            {comment.user.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={{ color: "white", fontSize: 8 }}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.commentTime}>{comment.timeAgo}</Text>
        </View>
      </View>

      <Text style={styles.commentContent}>{comment.content}</Text>

      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.commentActionButton}
          onPress={() => handleCommentLike(comment.id)}
        >
          <Heart
            color={comment.isLiked ? "#e11d48" : theme.colors.textSecondary}
            size={16}
            fill={comment.isLiked ? "#e11d48" : "none"}
          />
          <Text
            style={[
              styles.commentActionText,
              comment.isLiked && styles.likedText,
            ]}
          >
            {comment.likes}
          </Text>
        </TouchableOpacity>

        {!isReply && (
          <TouchableOpacity
            style={styles.commentActionButton}
            onPress={() => setReplyingTo(comment.id)}
          >
            <Reply color={theme.colors.textSecondary} size={16} />
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isReply && comment.replies && comment.replies.length > 0 && (
        <View>
          <TouchableOpacity
            style={styles.showRepliesButton}
            onPress={() => toggleCommentExpansion(comment.id)}
          >
            {expandedComments.has(comment.id) ? (
              <ChevronUp color={theme.colors.primary} size={16} />
            ) : (
              <ChevronDown color={theme.colors.primary} size={16} />
            )}
            <Text style={styles.showRepliesText}>
              {expandedComments.has(comment.id) ? "Hide" : "Show"}{" "}
              {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
            </Text>
          </TouchableOpacity>

          {expandedComments.has(comment.id) && (
            <View style={styles.repliesContainer}>
              {comment.replies.map((reply: any) => renderComment(reply, true))}
            </View>
          )}
        </View>
      )}
    </View>
  );



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
              <View style={styles.userDetails}>
                <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  {post.user.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={{ color: "white", fontSize: 10 }}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userMeta}>
                  {post.user.year} • {post.timeAgo}
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{post.category}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal color={theme.colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postContent}>{post.content}</Text>

          {post.image && (
            <Image
              source={{ uri: post.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}

          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                color={post.isLiked ? "#e11d48" : theme.colors.textSecondary}
                size={24}
                fill={post.isLiked ? "#e11d48" : "none"}
              />
              <Text
                style={[styles.actionText, post.isLiked && styles.likedText]}
              >
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle color={theme.colors.textSecondary} size={24} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share color={theme.colors.textSecondary} size={24} />
              <Text style={styles.actionText}>{post.shares}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>
            Comments ({comments.length})
          </Text>
          {comments.map((comment) => renderComment(comment))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
            placeholderTextColor={theme.colors.textSecondary}
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
          >
            <Send color="white" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
