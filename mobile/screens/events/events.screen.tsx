"use client";
import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Filter,
  Plus,
  X,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { EventCard } from "@/components/common/EventCard";

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
    description:
      "Join us for an evening celebrating diverse cultures from around the world with food, music, and performances.",
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
    description:
      "Learn effective study techniques and time management strategies to excel in your academic journey.",
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
    description:
      "Cheer for our team as they take on the University of Ghana in this exciting football match.",
  },
  {
    id: 4,
    title: "Tech Innovation Summit",
    date: "Wednesday, Feb 7",
    time: "10:00 AM",
    location: "Innovation Hub",
    attendees: 234,
    image:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Academic",
    isLiked: true,
    description:
      "Explore the latest trends in technology and innovation with industry leaders and entrepreneurs.",
  },
];

const eventStats = [
  { label: "This Week", value: "12", icon: Calendar, color: "#3b82f6" },
  { label: "This Month", value: "47", icon: TrendingUp, color: "#059669" },
  { label: "Total Attendees", value: "2.1K", icon: Users, color: "#dc2626" },
  { label: "Venues", value: "8", icon: MapPin, color: "#7c3aed" },
];

export default function EventsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [events, setEvents] = useState(upcomingEvents);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchWidth = useRef(new Animated.Value(44)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  const filters = ["All", "Cultural", "Academic", "Sports", "Social"];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const expandSearch = () => {
    setIsSearchExpanded(true);
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 200,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const collapseSearch = () => {
    Animated.parallel([
      Animated.timing(searchWidth, {
        toValue: 44,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsSearchExpanded(false);
      setSearchQuery("");
    });
  };

  const handleLike = (eventId: number) => {
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
  };

  const handleInterested = (eventId: number) => {
    console.log("Marked interested in event", eventId);
    router.push(`/(routes)/event/${eventId}`);
  };

  // Filter events based on search query and selected filter
  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      selectedFilter === "All" || event.category === selectedFilter;
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

    const styles = StyleSheet.create<{
      container: ViewStyle;
      headerContainer: ViewStyle;
      headerTop: ViewStyle;
      title: TextStyle;
      headerActions: ViewStyle;
      searchContainer: ViewStyle;
      searchInput: TextStyle;
      searchButton: ViewStyle;
      createEventButton: ViewStyle;
      filterButton: ViewStyle;
      scrollContent: ViewStyle;
      statsContainer: ViewStyle;
      statsRow: ViewStyle;
      statCard: ViewStyle;
      statIcon: ViewStyle;
      statValue: TextStyle;
      statLabel: TextStyle;
      filtersContainer: ViewStyle;
      filtersScroll: ViewStyle;
      filterChip: ViewStyle;
      filterChipActive: ViewStyle;
      filterChipText: TextStyle;
      filterChipTextActive: TextStyle;
      eventsContainer: ViewStyle;
      sectionTitle: TextStyle;
      noResultsContainer: ViewStyle;
      noResultsText: TextStyle;
    }>({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      headerContainer: {
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        paddingBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      },
      headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
      },
      title: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: "700",
        fontSize: 24,
      },
      headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
      },
      searchContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xxxl,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.sm,
        height: 44,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      searchInput: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
        paddingHorizontal: theme.spacing.sm,
        fontWeight: "500",
      },
      searchButton: {
        padding: theme.spacing.sm,
      },
      createEventButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.xxxl,
      },
      filterButton: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.xxxl,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      scrollContent: {
        paddingBottom: theme.spacing.md,
      },
      statsContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
      },
      statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: theme.spacing.sm,
      },
      statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.sm,

        borderRadius: theme.borderRadius.xl,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.border,
      },
      statIcon: {
        marginBottom: theme.spacing.sm,
      },
      statValue: {
        ...theme.typography.h6,
        color: theme.colors.text,
        fontWeight: "800",
        marginBottom: 4,
      },
      statLabel: {
        ...theme.typography.captionSmall,
        color: theme.colors.textSecondary,
        textAlign: "center",
        fontWeight: "600",
      },
      filtersContainer: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
      },
      filtersScroll: {
        flexDirection: "row",
        gap: theme.spacing.xs,
        paddingBottom: theme.spacing.xs,
      },
      filterChip: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.xxxl,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOpacity: 0.3,
      },
      filterChipText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        fontWeight: "600",
      },
      filterChipTextActive: {
        color: "white",
        fontWeight: "700",
      },
      eventsContainer: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.xl,
      },
      sectionTitle: {
        ...theme.typography.h4,
        color: theme.colors.text,
        fontWeight: "700",
        marginBottom: theme.spacing.md,
      },
      noResultsContainer: {
        alignItems: "center",
        paddingVertical: theme.spacing.xxl,
      },
      noResultsText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: "center",
      } as TextStyle,
    });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Events</Text>
          <View style={styles.headerActions}>
            <Animated.View
              style={[styles.searchContainer, { width: searchWidth }]}
            >
              {!isSearchExpanded ? (
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={expandSearch}
                >
                  <Search color={theme.colors.textSecondary} size={22} />
                </TouchableOpacity>
              ) : (
                <>
                  <Animated.View style={{ opacity: searchOpacity, flex: 1 }}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search events..."
                      placeholderTextColor={theme.colors.textSecondary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoFocus
                    />
                  </Animated.View>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={collapseSearch}
                  >
                    <X color={theme.colors.textSecondary} size={20} />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>

            <TouchableOpacity style={styles.filterButton}>
              <Filter color={theme.colors.textSecondary} size={22} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.createEventButton}>
              <Plus color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            {eventStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <IconComponent
                    color={stat.color}
                    size={28}
                    style={styles.statIcon}
                  />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.eventsContainer}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                attendees={event.attendees}
                image={event.image}
                category={event.category}
                isLiked={event.isLiked}
                description={event.description}
                onLike={handleLike}
                onInterested={handleInterested}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {searchQuery
                  ? `No events found for "${searchQuery}"`
                  : `No events found in ${selectedFilter} category`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
