"use client";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { User as UserType } from "@/types/user.types";
import {
  Calendar,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  Shield,
  User,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react-native";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ViewContactModalProps {
  visible: boolean;
  onClose: () => void;
  contact: UserType | null;
  onStartChat?: () => void;
  onCall?: () => void;
  onAddFriend?: () => void;
  onRemoveFriend?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  isFriend?: boolean;
  isBlocked?: boolean;
  currentUserId?: string;
}

export function ViewContactModal({
  visible,
  onClose,
  contact,
  onStartChat,
  onCall,
  onAddFriend,
  onRemoveFriend,
  onBlock,
  onReport,
  isFriend = false,
  isBlocked = false,
  currentUserId,
}: ViewContactModalProps) {
  const { theme } = useTheme();

  if (!contact) return null;

  const isCurrentUser = contact.id === currentUserId;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";

    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  const handlePhonePress = () => {
    if (contact.phoneNumber) {
      Linking.openURL(`tel:${contact.phoneNumber}`);
    }
  };

  const handleEmailPress = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const getInitials = () => {
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    moreButton: {
      padding: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    profileSection: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    avatar: {
      marginBottom: theme.spacing.md,
      padding: 0,
      
    },
    name: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    roleContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxl,
      marginBottom: theme.spacing.sm,
    },
    roleText: {
      fontSize: 14,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    statusContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    bio: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      fontStyle: "italic",
    },
    actionsSection: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      gap: theme.spacing.xs,
    },
    primaryAction: {
      backgroundColor: theme.colors.primary,
    },
    secondaryAction: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    dangerAction: {
      backgroundColor: theme.colors.error + "15",
      borderWidth: 1,
      borderColor: theme.colors.error + "30",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "600",
    },
    primaryActionText: {
      color: "white",
    },
    secondaryActionText: {
      color: theme.colors.text,
    },
    dangerActionText: {
      color: theme.colors.error,
    },
    detailsSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailIcon: {
      marginRight: theme.spacing.md,
      width: 24,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    detailValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "400",
    },
    detailValueLink: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "400",
    },
    academicInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
    },
    academicRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs,
    },
    academicLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    academicValue: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "600",
    },
    emptyValue: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    blockedBanner: {
      backgroundColor: theme.colors.error + "15",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.error + "30",
    },
    blockedText: {
      fontSize: 14,
      color: theme.colors.error,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Info</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Blocked Banner */}
        {isBlocked && (
          <View style={styles.blockedBanner}>
            <Text style={styles.blockedText}>This contact is blocked</Text>
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Avatar
                imageUrl={contact.profileImage}
                initials={getInitials()}
                size={65}
              />
            </View>

            <Text style={styles.name}>
              {contact.firstName} {contact.lastName}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: contact.online
                      ? theme.colors.success || "#4CAF50"
                      : theme.colors.textSecondary,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {contact.online ? "Online" : "Offline"}
              </Text>
            </View>

            {contact.bio && <Text style={styles.bio}>{contact.bio}</Text>}
          </View>

          {/* Action Buttons */}
          {!isCurrentUser && (
            <View style={styles.actionsSection}>
              {!isBlocked && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={onStartChat}
                  >
                    <MessageCircle color="white" size={20} />
                    <Text style={[styles.actionText, styles.primaryActionText]}>
                      Message
                    </Text>
                  </TouchableOpacity>

                  {contact.phoneNumber && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.secondaryAction]}
                      onPress={handlePhonePress}
                    >
                      <Phone color={theme.colors.text} size={20} />
                      <Text
                        style={[styles.actionText, styles.secondaryActionText]}
                      >
                        Call
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}

              {isFriend ? (
                <TouchableOpacity
                  style={[styles.actionButton, styles.dangerAction]}
                  onPress={onRemoveFriend}
                >
                  <UserMinus color={theme.colors.error} size={20} />
                  <Text style={[styles.actionText, styles.dangerActionText]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryAction]}
                  onPress={onAddFriend}
                >
                  <UserPlus color={theme.colors.text} size={20} />
                  <Text style={[styles.actionText, styles.secondaryActionText]}>
                    Add Friend
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Contact Details</Text>

            {/* Email */}
            <TouchableOpacity
              style={styles.detailRow}
              onPress={handleEmailPress}
            >
              <Mail
                color={theme.colors.textSecondary}
                size={20}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValueLink}>{contact.email}</Text>
              </View>
            </TouchableOpacity>

            {/* Phone */}
            {contact.phoneNumber && (
              <TouchableOpacity
                style={styles.detailRow}
                onPress={handlePhonePress}
              >
                <Phone
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.detailIcon}
                />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValueLink}>
                    {contact.phoneNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Student ID */}
            {contact.studentId && (
              <View style={styles.detailRow}>
                <User
                  color={theme.colors.textSecondary}
                  size={20}
                  style={styles.detailIcon}
                />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Student ID</Text>
                  <Text style={styles.detailValue}>{contact.studentId}</Text>
                </View>
              </View>
            )}

            {/* Country */}
            <View style={styles.detailRow}>
              <Globe
                color={theme.colors.textSecondary}
                size={20}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Country</Text>
                <Text style={styles.detailValue}>{contact.country}</Text>
              </View>
            </View>

            {/* Academic Information */}
            {(contact.yearGroup || contact.major || contact.department) && (
              <>
                <Text
                  style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}
                >
                  Academic Information
                </Text>

                <View style={styles.academicInfo}>
                  {contact.yearGroup && (
                    <View style={styles.academicRow}>
                      <Text style={styles.academicLabel}>Year Group</Text>
                      <Text style={styles.academicValue}>
                        {contact.yearGroup}
                      </Text>
                    </View>
                  )}

                  {contact.major && (
                    <View style={styles.academicRow}>
                      <Text style={styles.academicLabel}>Major</Text>
                      <Text style={styles.academicValue}>{contact.major}</Text>
                    </View>
                  )}

                  {contact.department && (
                    <View style={styles.academicRow}>
                      <Text style={styles.academicLabel}>Department</Text>
                      <Text style={styles.academicValue}>
                        {contact.department}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Account Information */}
            <Text
              style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}
            >
              Account Information
            </Text>

            <View style={styles.detailRow}>
              <Calendar
                color={theme.colors.textSecondary}
                size={20}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={styles.detailValue}>
                  {formatDate(contact.createdAt)}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <MapPin
                color={theme.colors.textSecondary}
                size={20}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{contact.gender}</Text>
              </View>
            </View>

            {/* Account Status */}
            <View style={styles.detailRow}>
              <Shield
                color={theme.colors.textSecondary}
                size={20}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Account Status</Text>
                <Text
                  style={[
                    styles.detailValue,
                    {
                      color: contact.isActive
                        ? theme.colors.success || "#4CAF50"
                        : theme.colors.error,
                    },
                  ]}
                >
                  {contact.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
