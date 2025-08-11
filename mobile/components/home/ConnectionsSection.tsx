import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar } from "@/components/ui/Avatar";
import { MapPin, GraduationCap, Calendar, Plus } from "lucide-react-native";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  online?: boolean;
  country?: string;
  major?: string;
  yearGroup?: string;
}

export interface ConnectionsSectionProps {
  title?: string;
  actionText?: string;
  onActionPress?: () => void;
  people: Person[];
  pulseAnim?: Animated.Value;
  onConnect?: (person: Person) => void;
  emptyText?: string;
  style?: any;
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  title = "Personalized Connections",
  actionText = "Find More",
  onActionPress,
  people,
  pulseAnim,
  onConnect,
  emptyText = "No suggestions available.",
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
    peopleScroll: {
      paddingLeft: theme.spacing.lg,
    },
    personCard: {
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
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    onlineIndicator: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: theme.colors.success,
      position: "absolute",
      top: -2,
      right: -2,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    personName: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
      textAlign: "center",
    },
    personMetaContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    personMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: 4,
      marginBottom: 4,
    },
    personMetaText: {
      ...theme.typography.captionSmall,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    connectButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
    },
    connectText: {
      ...theme.typography.captionSmall,
      color: "white",
      fontWeight: "700",
      marginLeft: theme.spacing.xs,
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
        <Text style={styles.sectionTitle}>🤝 {title}</Text>
        {onActionPress && (
          <TouchableOpacity onPress={onActionPress}>
            <Text style={styles.sectionAction}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.peopleScroll}
      >
        {people.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={styles.personCard}
            activeOpacity={0.9}
          >
            <View style={styles.avatarContainer}>
              <Avatar
                imageUrl={person.profileImage}
                initials={`${person.firstName?.charAt(0) ?? ""}${person.lastName?.charAt(0) ?? ""}`}
                size={60}
              />
              {person.online && pulseAnim && (
                <Animated.View
                  style={[
                    styles.onlineIndicator,
                    { transform: [{ scale: pulseAnim }] },
                  ]}
                />
              )}
            </View>
            <Text style={styles.personName}>
              {person.firstName} {person.lastName}
            </Text>
            <View style={styles.personMetaContainer}>
              {person.country && (
                <View style={styles.personMetaItem}>
                  <MapPin color={theme.colors.textSecondary} size={14} />
                  <Text style={styles.personMetaText}>{person.country}</Text>
                </View>
              )}
              {person.major && (
                <View style={styles.personMetaItem}>
                  <GraduationCap color={theme.colors.textSecondary} size={14} />
                  <Text style={styles.personMetaText}>{person.major}</Text>
                </View>
              )}
              {person.yearGroup && (
                <View style={styles.personMetaItem}>
                  <Calendar color={theme.colors.textSecondary} size={14} />
                  <Text style={styles.personMetaText}>{person.yearGroup}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => onConnect?.(person)}
            >
              <Plus color="white" size={16} />
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        {people.length === 0 && (
          <Text style={styles.emptyText}>{emptyText}</Text>
        )}
      </ScrollView>
    </View>
  );
};
