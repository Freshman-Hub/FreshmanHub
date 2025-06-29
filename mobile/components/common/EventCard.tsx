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
import { Calendar, MapPin, Users, Heart, Clock } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image: string;
  category: string;
  isLiked: boolean;
  description?: string;
  onLike?: (id: number) => void;
  onInterested?: (id: number) => void;
  onPress?: (id: number) => void;
  variant?: "card" | "list";
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  attendees,
  image,
  category,
  isLiked,
  description,
  onLike,
  onInterested,
  onPress,
  variant = "card",
}: EventCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [likeAnimation] = useState(new Animated.Value(1));

  const handleLike = () => {
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
      router.push(`/(routes)/event/${id}`);
    }
  };

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

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      marginBottom: theme.spacing.md,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    imageContainer: {
      position: "relative",
      height: variant === "card" ? 200 : 160,
    },
    eventImage: {
      width: "100%",
      height: "100%",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    categoryBadge: {
      position: "absolute",
      top: theme.spacing.lg,
      left: theme.spacing.lg,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    categoryText: {
      ...theme.typography.button,
      fontWeight: "700",
    },
    likeButton: {
      position: "absolute",
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    cardContent: {
      padding: theme.spacing.md,
    },
    eventTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "700",
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontWeight: "500"
    },
    eventDetails: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxl,
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
      fontWeight: "600",
      flex: 1,
    },
    interestedButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xxxl,
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 5,
    },
    buttonText: {
      ...theme.typography.h6,
      color: "white",
      fontWeight: "700",
    },
  });

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.categoryBadge}>
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(category) },
              ]}
            >
              {category}
            </Text>
          </View>

          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
              <Heart
                color={isLiked ? "#e11d48" : "#64748b"}
                size={22}
                fill={isLiked ? "#e11d48" : "none"}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.eventTitle}>{title}</Text>

          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Calendar color={theme.colors.primary} size={20} />
              <Text style={styles.detailText}>{date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Clock color={theme.colors.textSecondary} size={20} />
              <Text style={styles.detailText}>{time}</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin color={theme.colors.textSecondary} size={20} />
              <Text style={styles.detailText}>{location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Users color={theme.colors.textSecondary} size={20} />
              <Text style={styles.detailText}>{attendees} interested</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.interestedButton}
            onPress={() => onInterested?.(id)}
          >
            <Text style={styles.buttonText}>I&apos;m Interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
