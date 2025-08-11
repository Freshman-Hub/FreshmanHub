import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { PostCard } from "@/components/common/PostCard";
import { Post } from "@/types/post.types";

export interface CommunityFeedSectionProps {
  title?: string;
  actionText?: string;
  onActionPress?: () => void;
  posts: Post[];
  userId?: string;
  emptyText?: string;
  formatTimeAgo?: (dateString: string) => string;
  style?: any;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onCopyLink?: (postId: string) => void;
  onSavePost?: (postId: string) => void;
  onReportPost?: (postId: string) => void;
  onUnfollow?: (postId: string) => void;
}

export const CommunityFeedSection: React.FC<CommunityFeedSectionProps> = ({
  title = "Community Updates",
  actionText = "Share Update",
  onActionPress,
  posts,
  userId,
  emptyText = "No community posts yet.",
  formatTimeAgo,
  style,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  onCopyLink,
  onSavePost,
  onReportPost,
  onUnfollow,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    section: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
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
    momentsContainer: {
      gap: theme.spacing.md,
    },
    emptyText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginTop: theme.spacing.sm,
    },
  });

  return (
    <View style={[styles.section, style]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📰 {title}</Text>
        {onActionPress && (
          <TouchableOpacity onPress={onActionPress}>
            <Text style={styles.sectionAction}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.momentsContainer}>
        {posts.map((post) => (
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
            timeAgo={
              formatTimeAgo ? formatTimeAgo(post.createdAt) : post.createdAt
            }
            isLiked={post.likedBy?.includes(userId || "") || false}
            category={post.category}
            isOwner={post.userId === userId}
            isFollowing={true}
            onLike={() => onLike?.(post.id)}
            onComment={() => onComment?.(post.id)}
            onShare={() => onShare?.(post.id)}
            onEdit={() => onEdit?.(post.id)}
            onDelete={() => onDelete?.(post.id)}
            onCopyLink={() => onCopyLink?.(post.id)}
            onSavePost={() => onSavePost?.(post.id)}
            onReportPost={() => onReportPost?.(post.id)}
            onUnfollow={() => onUnfollow?.(post.id)}
            showViewMore={true}
            maxContentLength={150}
          />
        ))}
        {posts.length === 0 && (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )}
      </View>
    </View>
  );
};
