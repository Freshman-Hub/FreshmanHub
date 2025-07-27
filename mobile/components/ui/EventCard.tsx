"use client";

import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar, MapPin, Users, Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { RSVPModal } from "@/components/ui/RSVPModal";

interface CompactEventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  rsvpStatus: "yes" | "no" | "maybe" | "none";
  onPress: (id: string) => void;
  onRSVP: (id: string, response: "yes" | "no" | "maybe") => void;
}

export function CompactEventCard({
  id,
  title,
  date,
  time,
  location,
  attendees,
  category,
  rsvpStatus,
  onPress,
  onRSVP,
}: CompactEventCardProps) {
  const { theme } = useTheme();
  const [showRSVPModal, setShowRSVPModal] = useState(false);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "cultural":
        return "#667eea";
      case "academic":
        return "#f093fb";
      case "sports":
        return "#4facfe";
      case "social":
        return "#26de81";
      default:
        return theme.colors.primary;
    }
  };

  const getRSVPButtonStyle = () => {
    switch (rsvpStatus) {
      case "yes":
        return {
          backgroundColor: "#e8f5e8",
          borderColor: "#4caf50",
          textColor: "#2e7d32",
          text: "Going",
        };
      case "maybe":
        return {
          backgroundColor: "#fff3e0",
          borderColor: "#ff9800",
          textColor: "#ef6c00",
          text: "Maybe",
        };
      case "no":
        return {
          backgroundColor: "#ffebee",
          borderColor: "#f44336",
          textColor: "#c62828",
          text: "Not Going",
        };
      default:
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors.border,
          textColor: theme.colors.textSecondary,
          text: "RSVP",
        };
    }
  };

  const rsvpStyle = getRSVPButtonStyle();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: getCategoryColor(category),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
    },
    title: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    categoryBadge: {
      backgroundColor: getCategoryColor(category) + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    categoryText: {
      ...theme.typography.bodySmall,
      color: getCategoryColor(category),
      fontWeight: "600",
      fontSize: 10,
    },
    details: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
      fontSize: 12,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    attendeesText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    rsvpButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      backgroundColor: rsvpStyle.backgroundColor,
      borderColor: rsvpStyle.borderColor,
    },
    rsvpText: {
      ...theme.typography.bodySmall,
      fontWeight: "600",
      color: rsvpStyle.textColor,
    },
  });

  const handleRSVPPress = () => {
    setShowRSVPModal(true);
  };

  const handleRSVPResponse = (response: "yes" | "no" | "maybe") => {
    onRSVP(id, response);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(id)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Calendar color={theme.colors.textSecondary} size={14} />
            <Text style={styles.detailText}>{date}</Text>
          </View>

          <View style={styles.detailItem}>
            <Clock color={theme.colors.textSecondary} size={14} />
            <Text style={styles.detailText}>{time}</Text>
          </View>

          <View style={styles.detailItem}>
            <MapPin color={theme.colors.textSecondary} size={14} />
            <Text style={styles.detailText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.detailItem}>
            <Users color={theme.colors.textSecondary} size={14} />
            <Text style={styles.attendeesText}>{attendees} going</Text>
          </View>

          <TouchableOpacity style={styles.rsvpButton} onPress={handleRSVPPress}>
            <Text style={styles.rsvpText}>{rsvpStyle.text}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <RSVPModal
        visible={showRSVPModal}
        onClose={() => setShowRSVPModal(false)}
        onRSVP={handleRSVPResponse}
        eventTitle={title}
      />
    </>
  );
}
