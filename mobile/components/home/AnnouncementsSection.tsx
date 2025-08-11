import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Megaphone } from "lucide-react-native";

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  time: string;
  onPress?: () => void;
}

export interface AnnouncementsSectionProps {
  title?: string;
  actionText?: string;
  onActionPress?: () => void;
  announcements: Announcement[];
  emptyText?: string;
  style?: any;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  title = "Global Announcements",
  actionText = "View All",
  onActionPress,
  announcements,
  emptyText = "No announcements available.",
  style,
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
    announcementCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.md,
    },
    announcementHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    announcementTitle: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "700",
      marginLeft: theme.spacing.md,
      flex: 1,
    },
    announcementTime: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    announcementContent: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      lineHeight: 20,
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
        <Text style={styles.sectionTitle}>📣 {title}</Text>
        {onActionPress && (
          <TouchableOpacity onPress={onActionPress}>
            <Text style={styles.sectionAction}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={false}>
        {announcements.map((announcement) => (
          <TouchableOpacity
            key={announcement.id}
            style={styles.announcementCard}
            activeOpacity={0.8}
            onPress={announcement.onPress}
          >
            <View style={styles.announcementHeader}>
              <Megaphone color={theme.colors.primary} size={20} />
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementTime}>{announcement.time}</Text>
            </View>
            <Text style={styles.announcementContent}>
              {announcement.content}
            </Text>
          </TouchableOpacity>
        ))}
        {announcements.length === 0 && (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )}
      </ScrollView>
    </View>
  );
};
