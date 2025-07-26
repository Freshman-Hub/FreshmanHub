"use client";

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import {
  Heart,
  ReplyIcon,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Check,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "@/components/ui/Avatar";
import { CommentOptionsMenu } from "@/components/ui/CommentOptionsMenu";

interface User {
  name: string;
  avatar: string;
  verified?: boolean;
}

interface Reply {
  id: string;
  userId: string;
  user: User;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

interface CommentCardProps {
  id: string;
  user: User;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
  replies?: Reply[];
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
  onReplyLike?: (replyId: string) => void;
  onReplyEdit?: (replyId: string, newContent: string) => void;
  onReplyDelete?: (replyId: string) => void;
  isOwner?: boolean;
  currentUserId?: string;
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
  onEdit,
  onDelete,
  onReplyLike,
  onReplyEdit,
  onReplyDelete,
  isOwner = false,
  currentUserId,
  isReply = false,
}: CommentCardProps) {
  const { theme } = useTheme();
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState("");

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
      fontWeight: "500",
    },
    editInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      color: theme.colors.text,
      fontSize: isReply ? 15 : 16,
      marginBottom: theme.spacing.sm,
      minHeight: 40,
    },
    editActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    leftActions: {
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== content) {
      onEdit?.(id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(content);
  };

  const handleDelete = () => {
    Alert.alert(
      `Delete ${isReply ? "Reply" : "Comment"}`,
      `Are you sure you want to delete this ${isReply ? "reply" : "comment"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(id),
        },
      ]
    );
  };

  const handleReplyEdit = (replyId: string) => {
    const reply = replies.find((r) => r.id === replyId);
    if (reply) {
      setEditingReplyId(replyId);
      setEditReplyContent(reply.content);
    }
  };

  const handleSaveReplyEdit = (replyId: string) => {
    if (editReplyContent.trim()) {
      onReplyEdit?.(replyId, editReplyContent.trim());
    }
    setEditingReplyId(null);
    setEditReplyContent("");
  };

  const handleCancelReplyEdit = () => {
    setEditingReplyId(null);
    setEditReplyContent("");
  };

  const handleReplyDelete = (replyId: string) => {
    Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onReplyDelete?.(replyId),
      },
    ]);
  };

const renderContentWithTags = (content: string, theme: any) => {
  const parts = content.split(/(@[A-Za-z]+(?:\s+[A-Za-z]+)*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.match(/^@[A-Za-z]+(?:\s+[A-Za-z]+)*$/)) {
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
        return part;
      })}
    </>
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.commentHeader}>
        <Avatar
          imageUrl={user.avatar}
          initials={user.name.charAt(0)}
          size={isReply ? 30 : 40}
        />
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

        <CommentOptionsMenu
          commentId={id}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isReply={isReply}
        />
      </View>

      {isEditing ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editContent}
            onChangeText={setEditContent}
            multiline
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleSaveEdit}
            >
              <Check color="white" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelEdit}
            >
              <X color="white" size={16} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.content}>
          {renderContentWithTags(content, theme)}
        </Text>
      )}

      <View style={styles.actions}>
        <View style={styles.leftActions}>
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
                <View key={reply.id}>
                  <View style={styles.commentHeader}>
                    <Avatar
                      imageUrl={reply.user.avatar}
                      initials={reply.user.name.charAt(0)}
                      size={30}
                    />
                    <View style={styles.userDetails}>
                      <View style={styles.userNameContainer}>
                        <Text style={[styles.userName, { fontSize: 15 }]}>
                          {reply.user.name}
                        </Text>
                        {reply.user.verified && (
                          <CheckCircle
                            color={theme.colors.primary}
                            size={14}
                            style={styles.verifiedBadge}
                          />
                        )}
                      </View>
                      <Text style={styles.timeText}>{reply.timeAgo}</Text>
                    </View>

                    {/* FIXED: Correct ownership check */}
                    <CommentOptionsMenu
                      commentId={reply.id}
                      isOwner={reply.userId === currentUserId} // Use reply.userId, not reply.user.name
                      onEdit={() => handleReplyEdit(reply.id)}
                      onDelete={() => handleReplyDelete(reply.id)}
                      isReply={true}
                    />
                  </View>

                  {editingReplyId === reply.id ? (
                    <>
                      <TextInput
                        style={styles.editInput}
                        value={editReplyContent}
                        onChangeText={setEditReplyContent}
                        multiline
                        autoFocus
                      />
                      <View style={styles.editActions}>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleSaveReplyEdit(reply.id)}
                        >
                          <Check color="white" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCancelReplyEdit}
                        >
                          <X color="white" size={16} />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <Text style={[styles.content, { fontSize: 15 }]}>
                      {renderContentWithTags
                        ? renderContentWithTags(reply.content, theme)
                        : reply.content}
                    </Text>
                  )}

                  <View style={styles.actions}>
                    <View style={styles.leftActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onReplyLike?.(reply.id)}
                      >
                        <Heart
                          color={
                            reply.isLiked
                              ? "#e11d48"
                              : theme.colors.textSecondary
                          }
                          size={16}
                          fill={reply.isLiked ? "#e11d48" : "none"}
                        />
                        <Text
                          style={[
                            styles.actionText,
                            reply.isLiked && styles.likedText,
                          ]}
                        >
                          {reply.likes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
