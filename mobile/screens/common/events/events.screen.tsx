"use client";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  type TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, MapPin, Users, TrendingUp } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { EventCard } from "@/components/common/EventCard";

// Import our reusable components
import { Header } from "@/components/ui/Header";
import { FullSearchHeader } from "@/components/ui/FullSearchHeader";
import { StatCard } from "@/components/ui/StatCard";
import { FilterChip } from "@/components/ui/FilterChip";

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
  const params = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [events, setEvents] = useState(upcomingEvents);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (params.newEvent) {
        try {
          const parsedEvent = JSON.parse(params.newEvent as string);
          setEvents((prevEvents) => {
            // Check if event already exists to prevent duplicates
            const eventExists = prevEvents.some(
              (event) => event.id === parsedEvent.id
            );
            if (!eventExists) {
              return [parsedEvent, ...prevEvents];
            }
            return prevEvents;
          });
        } catch (error) {
          console.error("Error parsing new event:", error);
        }
      }
    }, [params.newEvent])
  );

  const filters = ["All", "Cultural", "Academic", "Sports", "Social"];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleSearchPress = () => {
    setIsSearchMode(true);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
      // Simulate search API call
      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    }
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

  const handleCreateEvent = () => {
    console.log("Creating new event");
    // Navigate to create event screen
    router.push("/(routes)/create-event");
  };

  const handleFilterPress = () => {
    console.log("Opening event filter options");
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
      paddingBottom: theme.spacing.xs,
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
    searchResultsContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
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
    searchSuggestions: {
      padding: theme.spacing.md,
    },
    suggestionText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
    } as TextStyle,
  });

  // Search Results Component
  const SearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searchQuery.length === 0 ? (
        <View style={styles.searchSuggestions}>
          <Text style={styles.suggestionText}>
            Try searching for events, locations, or categories...
          </Text>
        </View>
      ) : filteredEvents.length > 0 ? (
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
            No events found for &quot;{searchQuery}&quot;
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {isSearchMode ? (
        <>
          <FullSearchHeader
            query={searchQuery}
            onChangeQuery={setSearchQuery}
            onClose={handleSearchClose}
            onSubmit={handleSearchSubmit}
            placeholder="Search events, locations, categories..."
            loading={searchLoading}
            showResults={true}
            resultComponent={<SearchResults />}
          />
        </>
      ) : (
        <>
          <Header
            title="Events"
            showSearch={true}
            onSearchPress={handleSearchPress}
            showFilter={true}
            onFilterPress={handleFilterPress}
            showCreate={true}
            onCreatePress={handleCreateEvent}
            createIconType="event"
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                {eventStats.map((stat, index) => (
                  <StatCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                  />
                ))}
              </View>
            </View>

            <View style={styles.filtersContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScroll}
              >
                {filters.map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    selected={selectedFilter === filter}
                    onPress={() => setSelectedFilter(filter)}
                  />
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
                    No events found in {selectedFilter} category
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
