"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Heart, MessageCircle, Share, CheckCircle } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { PostOptionsMenu } from "@/components/ui/PostOptionsMenu";
import { Avatar } from "@/components/ui/Avatar";

interface User {
  name: string;
  avatar: string;
  year?: string;
  verified?: boolean;
}

interface PostCardProps {
  id: number;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares?: number;
  timeAgo: string;
  isLiked: boolean;
  category?: string;
  isOwner?: boolean;
  isFollowing?: boolean;
  onLike?: (id: number) => void;
  onComment?: (id: number) => void;
  onShare?: (id: number) => void;
  onPress?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onCopyLink?: (id: number) => void;
  onSavePost?: (id: number) => void;
  onReportPost?: (id: number) => void;
  onUnfollow?: (id: number) => void;
  showViewMore?: boolean;
  maxContentLength?: number;
}

export function PostCard({
  id,
  user,
  content,
  image,
  likes,
  comments,
  shares,
  timeAgo,
  isLiked,
  category,
  isOwner = false,
  isFollowing = false,
  onLike,
  onComment,
  onShare,
  onPress,
  onEdit,
  onDelete,
  onCopyLink,
  onSavePost,
  onReportPost,
  onUnfollow,
  showViewMore = true,
  maxContentLength = 150,
}: PostCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [likeAnimation] = useState(new Animated.Value(1));

  const handleLike = () => {
    // Animate heart
    Animated.sequence([
      Animated.timing(likeAnimation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onLike?.(id);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      router.push(`/(routes)/post/${id}`);
    }
  };

  const shouldTruncate = content.length > maxContentLength && showViewMore;
  const displayContent =
    isExpanded || !shouldTruncate
      ? content
      : content.substring(0, maxContentLength) + "...";

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
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
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      fontSize: 15,
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
      backgroundColor: theme.colors.accent + "15",
      paddingHorizontal: theme.spacing.sm,
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
      marginBottom: theme.spacing.sm,
      fontStyle: "normal",
      textAlign: "left",
      fontWeight: "400" as const,
    },
    viewMoreButton: {
      marginBottom: theme.spacing.sm,
    },
    viewMoreText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    postImage: {
      width: "100%",
      height: 200,
      borderRadius: theme.borderRadius.xl,
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
      minWidth: 50,
      justifyContent: "center",
    },
    actionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "600",
      fontSize: 15,
    },
    likedText: {
      color: "#e11d48",
      fontWeight: "700",
    },
  });

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Avatar
              imageUrl={user.avatar}
              initials={user.name.charAt(0)}
              size={45}
            />
            <View style={styles.userDetails}>
              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>{user.name}</Text>
                {user.verified && (
                  <CheckCircle
                    color={theme.colors.primary}
                    size={18}
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <Text style={styles.userMeta}>
                {user.year && `${user.year} • `}
                {timeAgo}
              </Text>
              {category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              )}
            </View>
          </View>

          <PostOptionsMenu
            postId={id}
            isOwner={isOwner}
            isFollowing={isFollowing}
            onEdit={onEdit}
            onDelete={onDelete}
            onCopyLink={onCopyLink}
            onSavePost={onSavePost}
            onReportPost={onReportPost}
            onUnfollow={onUnfollow}
            onShare={onShare}
          />
        </View>

        <Text style={styles.postContent}>{displayContent}</Text>

        {shouldTruncate && (
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.viewMoreText}>
              {isExpanded ? "View less" : "View more"}
            </Text>
          </TouchableOpacity>
        )}

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <Heart
                color={isLiked ? "#e11d48" : theme.colors.textSecondary}
                size={24}
                fill={isLiked ? "#e11d48" : "none"}
              />
            </Animated.View>
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment?.(id)}
          >
            <MessageCircle color={theme.colors.textSecondary} size={24} />
            <Text style={styles.actionText}>{comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare?.(id)}
          >
            <Share color={theme.colors.textSecondary} size={24} />
            <Text style={styles.actionText}>{shares || "Share"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
