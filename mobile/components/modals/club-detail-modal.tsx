"use client";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Users, Check, Plus } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "@/components/ui/Avatar";
import type { Club as ClubType } from "@/types/club.types";

interface ClubDetailModalProps {
  visible: boolean;
  onClose: () => void;
  club: ClubType | null;
  onJoinClub?: () => void;
  onLeaveClub?: () => void;
}

export function ClubDetailModal({
  visible,
  onClose,
  club,
  onJoinClub,
  onLeaveClub,
}: ClubDetailModalProps) {
  const { theme } = useTheme();

  if (!club) return null;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      flex: 1,
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
      flex: 1,
      textAlign: "center",
      marginRight: 24, // Offset for close button
    },
    clubSection: {
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
      marginBottom: theme.spacing.md,
    },
    clubLogo: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
    },
    clubName: {
      ...theme.typography.h4, // Increased font size
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    clubMeta: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.sm,
      textAlign: "center",
    },
    description: {
      ...theme.typography.body, // Increased font size
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24, // Adjusted line height
      maxWidth: "90%",
      marginBottom: theme.spacing.md,
      fontWeight: "500", // Increased font weight
    },
    joinButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs, // Increased gap
      minWidth: 120,
      marginTop: theme.spacing.md,
    },
    joinButtonText: {
      ...theme.typography.bodySmall, // Increased font size
      color: "white",
      fontWeight: "700",
    },
    joinedButton: {
      backgroundColor: theme.colors.success,
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
    membersGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: theme.spacing.md, // Gap between member cards
      marginTop: theme.spacing.md,
    },
    memberCard: {
      alignItems: "center",
      width: 80, // Fixed width for member card
    },
    memberName: {
      ...theme.typography.caption,
      color: theme.colors.text,
      fontWeight: "600",
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },
    noMembersText: {
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
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{club.name}</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Club Section */}
          <View style={styles.clubSection}>
            <Image
              source={{ uri: club.logo }}
              style={styles.clubLogo}
              resizeMode="cover"
            />
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubMeta}>
              <Text>{club.members}</Text> members
            </Text>
            <Text style={styles.clubMeta}>
              <Text>Focus: </Text>
              <Text>{club.focus}</Text>
            </Text>
            <Text style={styles.description}>{club.description}</Text>

            <TouchableOpacity
              style={[styles.joinButton, club.isJoined && styles.joinedButton]}
              onPress={() => (club.isJoined ? onLeaveClub?.() : onJoinClub?.())}
            >
              {club.isJoined ? (
                <Check color="white" size={20} />
              ) : (
                <Plus color="white" size={20} />
              )}
              <Text style={styles.joinButtonText}>
                {club.isJoined ? "Joined" : "Join Club"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Users
                color={theme.colors.textSecondary}
                size={24}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Total Members</Text>
                <Text style={styles.detailValue}>{club.members}</Text>
              </View>
            </View>

            {/* Club Members List */}
            <Text style={styles.sectionTitle}>Members</Text>
            {club.membersList && club.membersList.length > 0 ? (
              <View style={styles.membersGrid}>
                {club.membersList.map((member) => (
                  <TouchableOpacity key={member.id} style={styles.memberCard}>
                    <Avatar
                      imageUrl={member.profileImage}
                      initials={`${member.firstName?.charAt(0) || ""}${member.lastName?.charAt(0) || ""}`}
                      size={60}
                    />
                    <Text style={styles.memberName}>
                      {member.firstName} {member.lastName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noMembersText}>
                No members listed for this club yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
