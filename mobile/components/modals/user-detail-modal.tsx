"use client";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  X,
  MoreVertical,
  MessageCircle,
  Phone,
  UserPlus,
  Shield,
  Mail,
  Globe,
  GraduationCap,
  Calendar,
  User,
  Building2,
  Flag,
  Users, // For mutual connections
  Heart,
  Share2,
  MessageCircle as MessageCircleIcon,
  Check, // For connected status
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "@/components/ui/Avatar";
import type { User as UserType } from "@/types/user.types";
import { useState } from "react";

interface UserDetailModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserType | null;
  onStartChat?: () => void;
  onCall?: () => void;
  onConnect?: () => void; // Changed from onAddFriend
  onUnconnect?: () => void; // Changed from onRemoveFriend
  onBlock?: () => void;
  onUnblock?: () => void;
  onReport?: () => void;
  isFriend?: boolean;
  isBlocked?: boolean;
  currentUserId?: string;
}

export function UserDetailModal({
  visible,
  onClose,
  user,
  onStartChat,
  onCall,
  onConnect, // Changed
  onUnconnect, // Changed
  onBlock,
  onUnblock,
  onReport,
  isFriend = false,
  isBlocked = false,
  currentUserId,
}: UserDetailModalProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"about" | "contact" | "posts">(
    "about"
  );

  if (!user) return null;

  const isCurrentUser = user.id === currentUserId;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    try {
      // Handle Firestore Timestamp or Date objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  const handlePhonePress = () => {
    if (user.phoneNumber) {
      Linking.openURL(`tel:${user.phoneNumber}`);
    }
  };

  const handleEmailPress = () => {
    if (user.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      flex: 1, // Make it full screen
      backgroundColor: theme.colors.background,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    headerTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
    },
    moreButton: {
      padding: theme.spacing.xs,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
      marginBottom: theme.spacing.md,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    onlineIndicator: {
      width: 16, // Increased size
      height: 16, // Increased size
      borderRadius: 8, // Adjusted for new size
      backgroundColor: theme.colors.success,
      position: "absolute",
      bottom: 0,
      right: 0,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    name: {
      ...theme.typography.h4, // Increased font size
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    roleText: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.primary,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    bio: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24, // Adjusted line height
      fontStyle: "italic",
      maxWidth: "90%",
      fontWeight: "500",
    },
    actionsSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md, // Increased padding
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    actionButton: {
      alignItems: "center",
      paddingVertical: theme.spacing.sm, // Increased padding
      paddingHorizontal: theme.spacing.md, // Increased padding
      borderRadius: theme.borderRadius.lg,
      minWidth: 90, // Increased minWidth
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.spacing.xs, // Increased gap
    },
    actionButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    actionButtonSecondary: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonDanger: {
      backgroundColor: theme.colors.error + "15",
      borderWidth: 1,
      borderColor: theme.colors.error + "30",
    },
    actionText: {
      ...theme.typography.bodySmall, // Increased font size
      fontWeight: "700",
    },
    actionTextPrimary: {
      color: "white",
    },
    actionTextSecondary: {
      color: theme.colors.text,
    },
    actionTextDanger: {
      color: theme.colors.error,
    },
    detailsSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md, // Increased padding
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailIcon: {
      marginRight: theme.spacing.md,
      width: 24, // Increased size
      alignItems: "center",
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      ...theme.typography.caption, // Increased font size
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs, // Increased margin
    },
    detailValue: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.text,
      fontWeight: "600",
    },
    detailValueLink: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.primary,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
    blockedBanner: {
      backgroundColor: theme.colors.error + "15",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.error + "30",
    },
    blockedText: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.error,
      fontWeight: "600",
      textAlign: "center",
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    tabButton: {
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.md, // Increased padding
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabButtonActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      ...theme.typography.bodySmall, // Increased font size
      fontWeight: "700",
      color: theme.colors.textSecondary,
    },
    tabTextActive: {
      color: theme.colors.primary,
    },
    postCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg, // Increased padding
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md, // Increased margin
    },
    postUserInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    postUserName: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs, // Increased margin
    },
    postTime: {
      ...theme.typography.caption, // Increased font size
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    postContent: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.text,
      fontWeight: "500",
      lineHeight: 24, // Increased line height
      marginBottom: theme.spacing.md, // Increased margin
    },
    postImage: {
      width: "100%",
      height: 200, // Increased height
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md, // Increased margin
    },
    postActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    postActionGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg, // Increased gap
    },
    postAction: {
      flexDirection: "row",
      alignItems: "center",
    },
    postActionText: {
      ...theme.typography.caption, // Increased font size
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs, // Increased margin
    },
    noPostsText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.xl,
      fontWeight: "500",
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide" // Use slide for full-screen transition
      transparent={false} // Make it non-transparent for full screen
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Blocked Banner */}
        {isBlocked && (
          <View style={styles.blockedBanner}>
            <Text style={styles.blockedText}>This user is blocked</Text>
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar
                imageUrl={user.profileImage}
                initials={getInitials()}
                size={80}
              />
              {user.online && <View style={styles.onlineIndicator} />}
            </View>

            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.roleText}>{user.role.replace(/_/g, " ")}</Text>
            {user.bio && user.bio.length > 0 && (
              <Text style={styles.bio}>{user.bio}</Text>
            )}
          </View>

          {/* Action Buttons */}
          {!isCurrentUser && (
            <View style={styles.actionsSection}>
              {!isBlocked && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPrimary]}
                    onPress={onStartChat}
                  >
                    <MessageCircle color="white" size={20} />
                    {/* Increased icon size */}
                    <Text style={[styles.actionText, styles.actionTextPrimary]}>
                      Message
                    </Text>
                  </TouchableOpacity>

                  {user.phoneNumber && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        styles.actionButtonSecondary,
                      ]}
                      onPress={handlePhonePress}
                    >
                      <Phone color={theme.colors.text} size={20} />
                      {/* Increased icon size */}
                      <Text
                        style={[styles.actionText, styles.actionTextSecondary]}
                      >
                        Call
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {isFriend ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonDanger]}
                  onPress={onUnconnect}
                >
                  <Check color={theme.colors.error} size={20} />
                  {/* Increased icon size */}
                  <Text style={[styles.actionText, styles.actionTextDanger]}>
                    Unconnect
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={onConnect}
                >
                  <UserPlus color={theme.colors.text} size={20} />
                  {/* Increased icon size */}
                  <Text style={[styles.actionText, styles.actionTextSecondary]}>
                    Connect
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Tabs for About, Contact, Posts */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "about" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("about")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "about" && styles.tabTextActive,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "contact" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("contact")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "contact" && styles.tabTextActive,
                ]}
              >
                Contact
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "posts" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("posts")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "posts" && styles.tabTextActive,
                ]}
              >
                Posts
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content based on active tab */}
          <View style={styles.detailsSection}>
            {activeTab === "about" && (
              <View>
                {/* Major */}
                {user.major && (
                  <View style={styles.detailRow}>
                    <GraduationCap
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Major</Text>
                      <Text style={styles.detailValue}>{user.major}</Text>
                    </View>
                  </View>
                )}

                {/* Year Group */}
                {user.yearGroup && (
                  <View style={styles.detailRow}>
                    <Calendar
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Year Group</Text>
                      <Text style={styles.detailValue}>{user.yearGroup}</Text>
                    </View>
                  </View>
                )}

                {/* Country */}
                {user.country && (
                  <View style={styles.detailRow}>
                    <Flag
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Country</Text>
                      <Text style={styles.detailValue}>{user.country}</Text>
                    </View>
                  </View>
                )}

                {/* Gender */}
                {user.gender && (
                  <View style={styles.detailRow}>
                    <Globe
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Gender</Text>
                      <Text style={styles.detailValue}>{user.gender}</Text>
                    </View>
                  </View>
                )}

                {/* Mutual Connections (Placeholder) */}
                {user.mutuals !== undefined && (
                  <View style={styles.detailRow}>
                    <Users
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Mutual Connections</Text>
                      <Text style={styles.detailValue}>
                        {user.mutuals} mutuals
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {activeTab === "contact" && (
              <View>
                {/* Email */}
                <TouchableOpacity
                  style={styles.detailRow}
                  onPress={handleEmailPress}
                >
                  <Mail
                    color={theme.colors.textSecondary}
                    size={24}
                    style={styles.detailIcon}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValueLink}>{user.email}</Text>
                  </View>
                </TouchableOpacity>

                {/* Phone */}
                {user.phoneNumber && (
                  <TouchableOpacity
                    style={styles.detailRow}
                    onPress={handlePhonePress}
                  >
                    <Phone
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Phone</Text>
                      <Text style={styles.detailValueLink}>
                        {user.phoneNumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                {/* Student ID */}
                {user.studentId && (
                  <View style={styles.detailRow}>
                    <User
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Student ID</Text>
                      <Text style={styles.detailValue}>{user.studentId}</Text>
                    </View>
                  </View>
                )}

                {/* Department */}
                {user.department && (
                  <View style={styles.detailRow}>
                    <Building2
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Department</Text>
                      <Text style={styles.detailValue}>{user.department}</Text>
                    </View>
                  </View>
                )}

                {/* Member Since */}
                {user.createdAt && (
                  <View style={styles.detailRow}>
                    <Calendar
                      color={theme.colors.textSecondary}
                      size={24}
                      style={styles.detailIcon}
                    />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>Member Since</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(user.createdAt)}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Account Status */}
                <View style={styles.detailRow}>
                  <Shield
                    color={theme.colors.textSecondary}
                    size={24}
                    style={styles.detailIcon}
                  />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Account Status</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        {
                          color: user.isActive
                            ? theme.colors.success
                            : theme.colors.error,
                        },
                      ]}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "posts" && (
              <View style={{ marginTop: theme.spacing.md }}>
                {user.posts && user.posts.length > 0 ? (
                  user.posts.map((post) => (
                    <View key={post.id} style={styles.postCard}>
                      <View style={styles.postHeader}>
                        <Avatar
                          imageUrl={user.profileImage}
                          initials={getInitials()}
                          size={45}
                        />
                        {/* Increased avatar size */}
                        <View style={styles.postUserInfo}>
                          <Text style={styles.postUserName}>
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text style={styles.postTime}>{post.timeAgo}</Text>
                        </View>
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
                        <View style={styles.postActionGroup}>
                          <TouchableOpacity style={styles.postAction}>
                            <Heart color={theme.colors.primary} size={20} />
                            {/* Increased icon size */}
                            <Text style={styles.postActionText}>
                              {post.likes}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.postAction}>
                            <MessageCircleIcon
                              color={theme.colors.textSecondary}
                              size={20}
                            />
                            {/* Increased icon size */}
                            <Text style={styles.postActionText}>
                              {post.comments}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.postAction}>
                            <Share2
                              color={theme.colors.textSecondary}
                              size={20}
                            />
                            {/* Increased icon size */}
                            <Text style={styles.postActionText}>
                              {post.shares}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noPostsText}>
                    No posts available for this user.
                  </Text>
                )}
              </View>
            )}

            {/* Block/Unblock/Report Actions (moved to bottom of scroll view) */}
            {!isCurrentUser && (
              <View
                style={{
                  marginTop: theme.spacing.xl,
                  flexDirection: "row",
                  gap: theme.spacing.md,
                }}
              >
                {!isBlocked ? (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.actionButtonDanger,
                      { flex: 1 },
                    ]}
                    onPress={onBlock}
                  >
                    <Shield color={theme.colors.error} size={20} />
                    {/* Increased icon size */}
                    <Text style={[styles.actionText, styles.actionTextDanger]}>
                      Block User
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.actionButtonSecondary,
                      { flex: 1 },
                    ]}
                    onPress={onUnblock}
                  >
                    <Shield color={theme.colors.primary} size={20} />
                    {/* Increased icon size */}
                    <Text
                      style={[styles.actionText, styles.actionTextSecondary]}
                    >
                      Unblock User
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.actionButtonSecondary,
                    { flex: 1 },
                  ]}
                  onPress={onReport}
                >
                  <Flag color={theme.colors.textSecondary} size={20} />
                  {/* Increased icon size */}
                  <Text style={[styles.actionText, styles.actionTextSecondary]}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
