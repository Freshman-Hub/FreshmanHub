"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Calendar, MapPin, Users, Heart } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

const upcomingEvents = [
  {
    id: 1,
    title: "International Night",
    date: "Friday, Jan 26",
    time: "7:00 PM",
    location: "Main Hall",
    attendees: 156,
    image:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Cultural",
    isLiked: false,
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: 2,
    title: "Study Skills Workshop",
    date: "Monday, Jan 29",
    time: "3:00 PM",
    location: "Library Conference Room",
    attendees: 42,
    image:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Academic",
    isLiked: true,
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    id: 3,
    title: "Football Match: Ashesi vs UG",
    date: "Saturday, Feb 3",
    time: "4:00 PM",
    location: "Sports Complex",
    attendees: 89,
    image:
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sports",
    isLiked: false,
    gradient: ["#4facfe", "#00f2fe"],
  },
];

export function EventCarousel() {
  const { theme } = useTheme();
  const router = useRouter();
  const [events, setEvents] = useState(upcomingEvents);
  const [likeAnimations] = useState(
    upcomingEvents.reduce(
      (acc, event) => {
        acc[event.id] = new Animated.Value(1);
        return acc;
      },
      {} as Record<number, Animated.Value>
    )
  );

  const handleLike = (eventId: number) => {
    // Animate heart
    const animation = likeAnimations[eventId];
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Update event state
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            isLiked: !event.isLiked,
          };
        }
        return event;
      })
    );

    // TODO: Send like/unlike request to backend
    console.log(
      `${events.find((e) => e.id === eventId)?.isLiked ? "Unliked" : "Liked"} event ${eventId}`
    );
  };

  const handleInterested = (eventId: number) => {
    // TODO: Mark as interested in backend
    console.log("Marked interested in event", eventId);
    router.push(`/(routes)/event/${eventId}`);
  };

  const handleSeeAll = () => {
    router.push("/(tabs)/events");
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerText: {
      flex: 1,
    },
    title: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "700",
    },
    subtitle: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginTop: 4,
      fontWeight: undefined,
    },
    seeAllButton: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxl,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    seeAllText: {
      ...theme.typography.buttonSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    eventCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      width: 340,
      marginRight: theme.spacing.sm,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 5,
    },
    imageContainer: {
      position: "relative",
      height: 150,
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
      top: theme.spacing.md,
      left: theme.spacing.md,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    categoryText: {
      ...theme.typography.captionSmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    likeButton: {
      position: "absolute",
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    cardContent: {
      padding: theme.spacing.md,
    },
    eventTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "700",
    },
    eventDetails: {
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
      fontWeight: "500",
    },
    interestedButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    buttonText: {
      ...theme.typography.buttonSmall,
      color: "white",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Upcoming Events</Text>
          <Text style={styles.subtitle}>
            Don&apos;t miss out on these amazing events
          </Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={356}
      >
        {events.map((event) => (
          <TouchableOpacity key={event.id} activeOpacity={0.95}>
            <View style={styles.eventCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLike(event.id)}
                >
                  <Animated.View
                    style={{ transform: [{ scale: likeAnimations[event.id] }] }}
                  >
                    <Heart
                      color={event.isLiked ? "#e11d48" : "#64748b"}
                      size={20}
                      fill={event.isLiked ? "#e11d48" : "none"}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>

                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Calendar color={theme.colors.textSecondary} size={18} />
                    <Text style={styles.detailText}>
                      {event.date} • {event.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin color={theme.colors.textSecondary} size={18} />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Users color={theme.colors.textSecondary} size={18} />
                    <Text style={styles.detailText}>
                      {event.attendees} interested
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.interestedButton}
                  onPress={() => handleInterested(event.id)}
                >
                  <Text style={styles.buttonText}>I&apos;m Interested</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
