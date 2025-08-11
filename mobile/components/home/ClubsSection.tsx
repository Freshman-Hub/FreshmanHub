import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Plus, Check } from "lucide-react-native";

export interface Club {
  id: string | number;
  name: string;
  members: number;
  focus: string;
  logo: string;
  isJoined: boolean;
}

export interface ClubsSectionProps {
  title?: string;
  actionText?: string;
  onActionPress?: () => void;
  clubs: Club[];
  onClubPress?: (club: Club) => void;
  onJoinPress?: (club: Club) => void;
  emptyText?: string;
  style?: any;
}

export const ClubsSection: React.FC<ClubsSectionProps> = ({
  title = "Club & Society Showcase",
  actionText = "Explore Clubs",
  onActionPress,
  clubs,
  onClubPress,
  onJoinPress,
  emptyText = "No clubs available.",
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
    clubsScroll: {
      paddingLeft: theme.spacing.lg,
    },
    clubCard: {
      width: 260,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginRight: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
    },
    clubLogo: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
    },
    clubName: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    clubMeta: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      textAlign: "center",
    },
    joinButton: {
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    joinText: {
      fontSize: 13,
      color: "white",
      fontWeight: "700",
      marginLeft: 6,
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
        <Text style={styles.sectionTitle}>📚 {title}</Text>
        {onActionPress && (
          <TouchableOpacity onPress={onActionPress}>
            <Text style={styles.sectionAction}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.clubsScroll}
      >
        {clubs.map((club) => (
          <TouchableOpacity
            key={club.id}
            style={styles.clubCard}
            activeOpacity={0.9}
            onPress={() => onClubPress?.(club)}
          >
            <Image
              source={{ uri: club.logo }}
              style={styles.clubLogo}
              resizeMode="cover"
            />
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubMeta}>{club.members} members</Text>
            <Text style={styles.clubMeta}>{club.focus}</Text>
            <TouchableOpacity
              style={[
                styles.joinButton,
                {
                  backgroundColor: club.isJoined
                    ? theme.colors.success
                    : theme.colors.primary,
                },
              ]}
              onPress={() => onJoinPress?.(club)}
            >
              {club.isJoined ? (
                <Check color="white" size={16} />
              ) : (
                <Plus color="white" size={16} />
              )}
              <Text style={styles.joinText}>
                {club.isJoined ? "Joined" : "Join"}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        {clubs.length === 0 && (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )}
      </ScrollView>
    </View>
  );
};
