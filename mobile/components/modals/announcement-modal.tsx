"use client";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Megaphone } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface Announcement {
  id: number;
  title: string;
  content: string;
  time: string;
}

interface AnnouncementModalProps {
  visible: boolean;
  onClose: () => void;
  announcement: Announcement | null;
}

export function AnnouncementModal({
  visible,
  onClose,
  announcement,
}: AnnouncementModalProps) {
  const { theme } = useTheme();

  if (!announcement) return null;

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
    announcementSection: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
      marginBottom: theme.spacing.md,
      alignItems: "center",
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.xxl,
      backgroundColor: theme.colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    announcementTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    announcementTime: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    announcementContent: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 26,
      textAlign: "center",
      maxWidth: "90%",
      fontWeight: "500",
    },
    detailsSection: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
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
      alignItems: "center",
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      marginBottom: theme.spacing.xs,
    },
    detailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
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
          <Text style={styles.headerTitle}>Announcement</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Announcement Section */}
          <View style={styles.announcementSection}>
            <View style={styles.iconContainer}>
              <Megaphone color={theme.colors.primary} size={40} />
            </View>
            <Text style={styles.announcementTitle}>{announcement.title}</Text>
            <Text style={styles.announcementTime}>{announcement.time}</Text>
            <Text style={styles.announcementContent}>
              {announcement.content}
            </Text>
          </View>

          {/* Additional Details Section (Optional) */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Megaphone
                color={theme.colors.textSecondary}
                size={24}
                style={styles.detailIcon}
              />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>Campus-wide</Text>
              </View>
            </View>
            {/* Add more details like sender, date posted, etc. */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
