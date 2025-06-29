"use client";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import {
  Heart,
  ReplyIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface User {
  name: string;
  avatar: string;
  verified?: boolean;
}

interface Reply {
  id: number;
  user: User;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

interface CommentCardProps {
  id: number;
  user: User;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies?: Reply[];
  onLike?: (id: number) => void;
  onReply?: (id: number) => void;
  isReply?: boolean;
}

export function CommentCard({
  id,
  user,
  content,
  timeAgo,
  likes,
  isLiked,
  replies = [],
  onLike,
  onReply,
  isReply = false,
}: CommentCardProps) {
  const { theme } = useTheme();
  const [showReplies, setShowReplies] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: isReply ? theme.colors.background : theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: isReply ? 2 : 4,
      },
      shadowOpacity: isReply ? 0.05 : 0.1,
      shadowRadius: isReply ? 6 : 12,
      elevation: isReply ? 3 : 6,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.05)",
    },
    commentHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    avatar: {
      width: isReply ? 30 : 40,
      height: isReply ? 36 : 44,
      borderRadius: isReply ? 18 : 22,
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
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: isReply ? 15 : 16,
    },
    verifiedBadge: {
      marginLeft: theme.spacing.sm,
    },
    timeText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 2,
      fontWeight: "500",
    },
    content: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: theme.spacing.sm,
      fontSize: isReply ? 15 : 16,
      fontWeight: "500"
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xl,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    actionText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
    },
    likedText: {
      color: "#e11d48",
      fontWeight: "700",
    },
    repliesContainer: {
      marginTop: theme.spacing.lg,
      marginLeft: theme.spacing.xl,
      paddingLeft: theme.spacing.lg,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary + "30",
    },
    showRepliesButton: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary + "10",
    },
    showRepliesText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "700",
      marginLeft: theme.spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userDetails}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.verified && (
              <CheckCircle
                color={theme.colors.primary}
                size={16}
                style={styles.verifiedBadge}
              />
            )}
          </View>
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
      </View>

      <Text style={styles.content}>{content}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike?.(id)}
        >
          <Heart
            color={isLiked ? "#e11d48" : theme.colors.textSecondary}
            size={18}
            fill={isLiked ? "#e11d48" : "none"}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likes}
          </Text>
        </TouchableOpacity>

        {!isReply && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReply?.(id)}
          >
            <ReplyIcon color={theme.colors.textSecondary} size={18} />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isReply && replies.length > 0 && (
        <View>
          <TouchableOpacity
            style={styles.showRepliesButton}
            onPress={() => setShowReplies(!showReplies)}
          >
            {showReplies ? (
              <ChevronUp color={theme.colors.primary} size={18} />
            ) : (
              <ChevronDown color={theme.colors.primary} size={18} />
            )}
            <Text style={styles.showRepliesText}>
              {showReplies ? "Hide" : "Show"} {replies.length}{" "}
              {replies.length === 1 ? "reply" : "replies"}
            </Text>
          </TouchableOpacity>

          {showReplies && (
            <View style={styles.repliesContainer}>
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  id={reply.id}
                  user={reply.user}
                  content={reply.content}
                  timeAgo={reply.timeAgo}
                  likes={reply.likes}
                  isLiked={reply.isLiked}
                  onLike={onLike}
                  isReply={true}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
