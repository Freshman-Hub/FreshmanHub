import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Share as RNShare,
  TextStyle,
  ViewStyle,
  ImageStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Users,
  Share,
  Clock,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Mock event data - in real app, this would come from API
const eventData = {
  1: {
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
    description:
      "Join us for an evening celebrating diverse cultures from around the world with food, music, and performances. This annual event brings together students from different backgrounds to share their heritage and traditions.\n\nThe night will feature:\n• Traditional food from 15+ countries\n• Cultural performances and dances\n• Art exhibitions\n• Interactive workshops\n• Live music and DJ sets\n\nCome dressed in your traditional attire and be part of this amazing celebration of diversity!",
    organizer: {
      name: "International Students Association",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    tags: ["Cultural", "Food", "Music", "International", "Diversity"],
    ticketPrice: "Free",
    capacity: 300,
    requirements: "Student ID required for entry",
  },
  2: {
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
    description:
      "Learn effective study techniques and time management strategies to excel in your academic journey. This workshop is designed specifically for first-year students but is open to all.\n\nTopics covered:\n• Note-taking strategies\n• Time management techniques\n• Exam preparation methods\n• Group study best practices\n• Digital tools for studying\n• Stress management during exams\n\nMaterials will be provided, and you'll receive a study planner to take home!",
    organizer: {
      name: "Academic Success Center",
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    tags: ["Academic", "Study", "Workshop", "Skills", "Time Management"],
    ticketPrice: "Free",
    capacity: 50,
    requirements: "Bring a notebook and pen",
  },
  3: {
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
    description:
      "Cheer for our team as they take on the University of Ghana in this exciting football match. This is a crucial game in the inter-university championship.\n\nMatch Details:\n• Kickoff at 4:00 PM sharp\n• Pre-match entertainment starts at 3:30 PM\n• Food and drinks available at the venue\n• Free face painting for supporters\n• Live commentary and updates\n• Post-match celebration (if we win!)\n\nWear your Ashesi colors and bring your loudest voice to support our team!",
    organizer: {
      name: "Ashesi Sports Department",
      avatar:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    tags: ["Sports", "Football", "Competition", "University", "Team Spirit"],
    ticketPrice: "Free",
    capacity: 500,
    requirements: "None - open to all",
  },
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState(eventId ? eventData[parseInt(eventId) as keyof typeof eventData] : undefined);

  const styles = StyleSheet.create<{
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    headerTitle: TextStyle;
    heroImage: ViewStyle;
    imageOverlay: ViewStyle;
    categoryBadge: ViewStyle;
    categoryText: TextStyle;
    actionButtons: ViewStyle;
    actionButton: ViewStyle;
    content: ViewStyle;
    eventTitle: TextStyle;
    eventDetails: ViewStyle;
    detailRow: ViewStyle;
    detailIcon: ViewStyle;
    detailText: TextStyle;
    organizerSection: ViewStyle;
    sectionTitle: TextStyle;
    organizerInfo: ViewStyle;
    organizerAvatar: ImageStyle;
    organizerName: TextStyle;
    descriptionSection: ViewStyle;
    description: TextStyle;
    tagsSection: ViewStyle;
    tagsContainer: ViewStyle;
    tag: ViewStyle;
    tagText: TextStyle;
    interestedButton: ViewStyle;
    interestedButtonText: TextStyle;
    attendeesInfo: ViewStyle;
    attendeesText: TextStyle;
  }>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: theme.spacing.sm,
      marginRight: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
    },
    heroImage: {
      width: "100%",
      height: 250,
      position: "relative",
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
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
    },
    categoryText: {
      ...theme.typography.body,
      color: theme.colors.primary,
      fontWeight: "700",
    },
    actionButtons: {
      position: "absolute",
      top: theme.spacing.lg,
      right: theme.spacing.lg,
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.xxxl,
    },
    content: {
      padding: theme.spacing.md,
    },
    eventTitle: {
      ...theme.typography.h4,
      color: theme.colors.text,
      fontWeight: "800",
      marginBottom: theme.spacing.md,
    },
    eventDetails: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    detailIcon: {
      marginRight: theme.spacing.lg,
      width: 24,
    },
    detailText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      flex: 1,
    },
    organizerSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },
    organizerInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    organizerAvatar: {
      width: 45,
      height: 45,
      borderRadius: theme.spacing.xxl,
      marginRight: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.primary + "20",
    },
    organizerName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
    },
    descriptionSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    description: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 26,
    } as TextStyle,
    tagsSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xl,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    tag: {
      backgroundColor: theme.colors.primary + "20",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.xxxl,
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
    },
    tagText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    interestedButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      marginHorizontal: theme.spacing.xxl,
      marginBottom: theme.spacing.xl,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 5,
    },
    interestedButtonText: {
      ...theme.typography.button,
      color: "white",
      fontWeight: "700",
    },
    attendeesInfo: {
      backgroundColor: theme.colors.accent + "20",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      alignSelf: "flex-start",
      marginTop: theme.spacing.sm,
    },
    attendeesText: {
      ...theme.typography.caption,
      color: theme.colors.accent,
      fontWeight: "600",
    },
  });

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={theme.colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Not Found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    setEvent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isLiked: !prev.isLiked,
      };
    });
  };

  const handleShare = async () => {
    try {
      await RNShare.share({
        message: `Check out this event: ${event.title} on ${event.date} at ${event.time}`,
        title: event.title,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleInterested = () => {
    setEvent((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        attendees: prev.isLiked ? prev.attendees - 1 : prev.attendees + 1,
        isLiked: !prev.isLiked,
      };
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color={theme.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroImage}>
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                color={event.isLiked ? "#e11d48" : "#64748b"}
                size={24}
                fill={event.isLiked ? "#e11d48" : "none"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share color="#64748b" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Calendar
                color={theme.colors.primary}
                size={24}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{event.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Clock
                color={theme.colors.primary}
                size={24}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin
                color={theme.colors.primary}
                size={24}
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{event.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Users
                color={theme.colors.primary}
                size={24}
                style={styles.detailIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.detailText}>
                  {event.attendees} interested
                </Text>
                <View style={styles.attendeesInfo}>
                  <Text style={styles.attendeesText}>
                    {event.capacity - event.attendees} spots remaining
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organized by</Text>
            <View style={styles.organizerInfo}>
              <Image
                source={{ uri: event.organizer.avatar }}
                style={styles.organizerAvatar}
              />
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.interestedButton}
          onPress={handleInterested}
        >
          <Text style={styles.interestedButtonText}>
            {event.isLiked ? "✓ Interested" : "I'm Interested"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
