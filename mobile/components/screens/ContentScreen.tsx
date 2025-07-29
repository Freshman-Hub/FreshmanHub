"use client";

import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Calendar, List, CalendarDays } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";

import { UserService } from "@/services/user.service";
import { User } from "@/types/user.types";

// Import components
import { Header } from "@/components/ui/Header";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { CalendarView } from "@/components/ui/CalendarView";
import { CompactEventCard } from "@/components/ui/EventCard";
import { CreateEventModal } from "@/components/ui/CreateEventModal";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { EditEventModal } from "@/components/modals/EditEventModal";
import { FilterChip } from "@/components/ui/FilterChip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; // Replace Loader with LoadingSpinner
import DateTimePicker from "@react-native-community/datetimepicker";

// Import your existing services
import { EventsService } from "@/services/events.service";
import { CreateEventData, Event } from "@/types/event.types";
import { router } from "expo-router";

interface ContentScreenProps {
  contentType: "event" | "session";
  title: string;
  collectionName?: string;
  getFilters: (userRole?: string) => string[];
  getCategoryOptions: (
    userRole?: string
  ) => { label: string; value: string; color?: string }[];
  canUserCreate: (userRole?: string) => boolean;
  getFloatingActions: (userRole?: string) => { type: string; label: string }[];
}

export function ContentScreen({
  contentType,
  title,
  collectionName = "events",
  getFilters,
  getCategoryOptions,
  canUserCreate,
  getFloatingActions,
}: ContentScreenProps) {
  const { theme } = useTheme();
  const { user } = useUser();

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Add dataLoaded state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date>();
  const [createModalTime, setCreateModalTime] = useState<string>();

  // New states for the requested features
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filters = getFilters(user?.role);
  const categoryOptions = getCategoryOptions(user?.role);
  const userCanCreate = canUserCreate(user?.role);
  const floatingActions = getFloatingActions(user?.role);

  const [attendeeProfiles, setAttendeeProfiles] = useState<
    Record<string, User[]>
  >({});

  // Add function to load attendee profiles
  const loadAttendeeProfiles = useCallback(
    async (eventId: string, attendeeIds: string[]) => {
      try {
        const profiles: User[] = [];

        for (const userId of attendeeIds.slice(0, 10)) {
          const { user, error } = await UserService.getUserById(userId);
          if (user && !error) {
            profiles.push(user);
          }
        }

        setAttendeeProfiles((prev) => ({
          ...prev,
          [eventId]: profiles,
        }));
      } catch (error) {
        console.error("Error loading attendee profiles:", error);
      }
    },
    []
  );

  // Filter events based on invitee status
  const filterEventsByInvitee = (events: Event[]) => {
    if (!user?.id) return [];

    return events.filter((event) => {
      // Show if user is creator
      if (event.userId === user.id) return true;

      // Show if user is in invitedUsers list
      if (event.invitedUsers?.includes(user.id)) return true;

      // Show if user is in attendees list
      if (event.attendees?.includes(user.id)) return true;

      // Special case: Head coach can see all sessions between peer coaches and freshmen
      if (user.role === "head_of_coaches" && contentType === "session") {
        return true; // Head coach sees all sessions
      }

      // For events (not sessions): only show if user is explicitly invited OR if it's a public event AND user is not restricted
      if (contentType === "event" && event.isPublic) {
        // Only show public events if they don't have an invitedUsers list (open to everyone)
        // OR if the invitedUsers list is empty (open to everyone)
        if (!event.invitedUsers || event.invitedUsers.length === 0) {
          return true;
        }
        // If there's an invitedUsers list, only show if user is in it (already checked above)
        return false;
      }

      // Sessions are always private - only show to invited users (already checked above)
      return false;
    });
  };

  // Use your existing EventsService
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);

      const { events: fetchedEvents, error } = await EventsService.getEvents(
        50,
        selectedFilter,
        collectionName
      );

      if (error) {
        console.error("Error loading content:", error);
        Alert.alert("Error", `Failed to load ${contentType}s`);
      } else if (fetchedEvents) {
        // Filter events based on invitee status
        const filteredEvents = filterEventsByInvitee(fetchedEvents);
        setEvents(filteredEvents);
        setDataLoaded(true); // Mark data as loaded

        // Load attendee profiles for each event
        filteredEvents.forEach((event) => {
          if (event.rsvpYes?.length > 0) {
            loadAttendeeProfiles(event.id, event.rsvpYes);
          }
        });
      }
    } catch (error) {
      console.error("Error loading content:", error);
      Alert.alert("Error", `Failed to load ${contentType}s`);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentType,
    selectedFilter,
    collectionName,
    user?.id,
    loadAttendeeProfiles,
  ]);

  // Load events only if data not already loaded
  useEffect(() => {
    if (!dataLoaded) {
      loadEvents();
    }
  }, [dataLoaded, loadEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDataLoaded(false); // Reset flag to force reload
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  const handleEventPress = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetail(true);
    }
  };

  const handleEditEvent = (event: Event | any) => {
    setSelectedEvent(event);
    setShowEventDetail(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (
    eventId: string,
    updatedData: Partial<CreateEventData | any>
  ) => {
    try {
      setEditLoading(true);

      const { error } = await EventsService.updateEvent(
        eventId,
        updatedData,
        collectionName
      );

      if (error) {
        Alert.alert(
          "Error",
          `Failed to update ${contentType}. Please try again.`
        );
      } else {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, ...updatedData } : event
          )
        );
        setShowEditModal(false);
        setSelectedEvent(null);
        Alert.alert("Success", `${contentType} updated successfully`);
      }
    } catch (error) {
      console.error("Error editing content:", error);
      Alert.alert("Error", `Failed to update ${contentType}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setDeleteLoading(true);

      const { error } = await EventsService.deleteEvent(
        eventId,
        collectionName
      );

      if (error) {
        Alert.alert(
          "Error",
          `Failed to delete ${contentType}. Please try again.`
        );
      } else {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        setShowEventDetail(false);
        setSelectedEvent(null);
        Alert.alert("Success", `${contentType} deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      Alert.alert("Error", `Failed to delete ${contentType}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRSVP = async (
    eventId: string,
    response: "yes" | "no" | "maybe"
  ) => {
    if (!user?.id) {
      Alert.alert("Error", "Please log in to RSVP");
      return;
    }

    try {
      // Optimistic update
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          if (event.id === eventId) {
            const updatedEvent = { ...event };

            updatedEvent.rsvpYes =
              event.rsvpYes?.filter((id) => id !== user.id) || [];
            updatedEvent.rsvpNo =
              event.rsvpNo?.filter((id) => id !== user.id) || [];
            updatedEvent.rsvpMaybe =
              event.rsvpMaybe?.filter((id) => id !== user.id) || [];

            if (response === "yes") {
              updatedEvent.rsvpYes.push(user.id);
              if (!event.attendees?.includes(user.id)) {
                updatedEvent.attendees = [...(event.attendees || []), user.id];
                updatedEvent.attendeeCount = (event.attendeeCount || 0) + 1;
              }
            } else if (response === "no") {
              updatedEvent.rsvpNo.push(user.id);
              updatedEvent.attendees =
                event.attendees?.filter((id) => id !== user.id) || [];
              updatedEvent.attendeeCount = Math.max(
                (event.attendeeCount || 0) - 1,
                0
              );
            } else if (response === "maybe") {
              updatedEvent.rsvpMaybe.push(user.id);
              updatedEvent.attendees =
                event.attendees?.filter((id) => id !== user.id) || [];
              updatedEvent.attendeeCount = Math.max(
                (event.attendeeCount || 0) - 1,
                0
              );
            }

            return updatedEvent;
          }
          return event;
        })
      );

      const { error } = await EventsService.rsvpToEvent(
        eventId,
        user.id,
        response,
        collectionName
      );

      if (error) {
        console.error("Error updating RSVP:", error);
        Alert.alert("Error", "Failed to update RSVP");
        await loadEvents();
      }
    } catch (error) {
      console.error("Error handling RSVP:", error);
      Alert.alert("Error", "Failed to update RSVP");
      await loadEvents();
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    if (!user) {
      Alert.alert("Error", `Please log in to create ${contentType}s`);
      return;
    }

    try {
      const { event, error } = await EventsService.createEvent(
        {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          allDay: eventData.allDay,
          location: eventData.location,
          category: eventData.category,
          color: eventData.color,
          repeat: eventData.repeat,
          isPublic: contentType === "event", // Events public, sessions private
          invitedUsers: eventData.attendeeIds || [],
        },
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.profileImage,
        collectionName as "events" | "sessions"
      );

      if (error) {
        Alert.alert("Error", `Failed to create ${contentType}`);
      } else if (event) {
        setEvents((prevEvents) => [event, ...prevEvents]);
        setCreateModalVisible(false);
        Alert.alert("Success", `${contentType} created successfully`);
      }
    } catch (error) {
      console.error("Error creating content:", error);
      Alert.alert("Error", `Failed to create ${contentType}`);
    }
  };

  const getUserRSVPStatus = (event: Event): "yes" | "no" | "maybe" | "none" => {
    if (!user?.id) return "none";
    if (event.rsvpYes?.includes(user.id)) return "yes";
    if (event.rsvpNo?.includes(user.id)) return "no";
    if (event.rsvpMaybe?.includes(user.id)) return "maybe";
    return "none";
  };

  // Update the getFilteredEvents function
  const getFilteredEvents = () => {
    const now = new Date();
    let filtered = events;

    // Filter by category
    if (selectedFilter !== "All") {
      filtered = filtered.filter((event) => event.category === selectedFilter);
    }

    // Only apply time filtering in LIST view, not calendar view
    if (viewMode === "list") {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);

        // If event has a specific time, use it for comparison
        if (event.startTime && !event.allDay) {
          // Parse the start time and combine with event date
          const [hours, minutes] = event.startTime.split(":").map(Number);
          const eventDateTime = new Date(eventDate);
          eventDateTime.setHours(hours, minutes, 0, 0);

          if (timeFilter === "upcoming") {
            return eventDateTime >= now;
          } else {
            return eventDateTime < now;
          }
        } else {
          // For all-day events, compare just the date
          const eventDateOnly = new Date(
            eventDate.getFullYear(),
            eventDate.getMonth(),
            eventDate.getDate()
          );
          const nowDateOnly = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );

          if (timeFilter === "upcoming") {
            return eventDateOnly >= nowDateOnly;
          } else {
            return eventDateOnly < nowDateOnly;
          }
        }
      });
    }
    // For calendar view, don't filter by time - show all events

    // Filter by specific date if selected (applies to both views)
    if (filterDate) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === filterDate.getFullYear() &&
          eventDate.getMonth() === filterDate.getMonth() &&
          eventDate.getDate() === filterDate.getDate()
        );
      });
    }

    return filtered;
  };

  // Update the filteredEvents assignment
  const filteredEvents = getFilteredEvents();

  // Update calendarEvents to include ALL events when in calendar view
  const calendarEvents = (viewMode === "calendar" ? events : filteredEvents)
    .filter((event) => event.startTime !== undefined)
    .map((event) => ({
      ...event,
      startTime: event.startTime as string,
      endTime: event.endTime || (event.startTime as string),
      isRSVP: getUserRSVPStatus(event) !== "none",
    }));

  const handleTimeSlotPress = (date: Date, time: string) => {
    if (!userCanCreate) {
      return;
    }
    setCreateModalDate(date);
    setCreateModalTime(time);
    setCreateModalVisible(true);
  };

  const handleFloatingButtonPress = (actionType: string) => {
    if (actionType === "event" || actionType === "session") {
      setCreateModalDate(undefined);
      setCreateModalTime(undefined);
      setCreateModalVisible(true);
    }
    console.log(`Pressed: ${actionType}`);
  };

  const handleDatePickerChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFilterDate(selectedDate);
    }
  };

  const clearDateFilter = () => {
    setFilterDate(null);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    viewToggle: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
      margin: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    viewButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing.sm,
    },
    viewButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    viewButtonText: {
      ...theme.typography.button,
      fontWeight: "600",
    },
    viewButtonTextActive: {
      color: "white",
    },
    viewButtonTextInactive: {
      color: theme.colors.textSecondary,
    },
    filtersContainer: {
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    filtersScroll: {
      flexDirection: "row",
      gap: theme.spacing.xs,
    },
    timeToggleContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 4,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    timeToggleButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
    },
    timeToggleButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    timeToggleText: {
      ...theme.typography.button,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    timeToggleTextActive: {
      color: "white",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      flex: 1,
    },
    dateFilterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    dateFilterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dateFilterText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    dateFilterTextActive: {
      color: "white",
    },
    clearDateButton: {
      marginLeft: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    clearDateText: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "500",
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: theme.spacing.md,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
  });

  // Show loading spinner when loading initial data
  if (loading && !dataLoaded) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header
          title={title}
          showSearch={true}
          onSearchPress={() => {}}
          leftIcon={ArrowLeft}
          onLeftPress={() => router.back()}
        />
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Show overlay loading spinner for edit/delete operations */}
      {(deleteLoading || editLoading) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.xl,
              borderRadius: theme.borderRadius.lg,
              alignItems: "center",
              minWidth: 200,
            }}
          >
            <LoadingSpinner size="small" />
            <Text
              style={{
                color: theme.colors.text,
                marginTop: theme.spacing.md,
                textAlign: "center",
              }}
            >
              {deleteLoading
                ? `Deleting ${contentType}...`
                : `Updating ${contentType}...`}
            </Text>
          </View>
        </View>
      )}

      <Header
        title={title}
        showSearch={true}
        onSearchPress={() => {}}
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === "list" && styles.viewButtonActive,
          ]}
          onPress={() => setViewMode("list")}
        >
          <List
            color={viewMode === "list" ? "white" : theme.colors.textSecondary}
            size={18}
          />
          <Text
            style={[
              styles.viewButtonText,
              viewMode === "list"
                ? styles.viewButtonTextActive
                : styles.viewButtonTextInactive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === "calendar" && styles.viewButtonActive,
          ]}
          onPress={() => setViewMode("calendar")}
        >
          <Calendar
            color={
              viewMode === "calendar" ? "white" : theme.colors.textSecondary
            }
            size={18}
          />
          <Text
            style={[
              styles.viewButtonText,
              viewMode === "calendar"
                ? styles.viewButtonTextActive
                : styles.viewButtonTextInactive,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "list" && (
        <>
          {/* Time Toggle - Only show in list view */}
          <View style={styles.timeToggleContainer}>
            <TouchableOpacity
              style={[
                styles.timeToggleButton,
                timeFilter === "upcoming" && styles.timeToggleButtonActive,
              ]}
              onPress={() => setTimeFilter("upcoming")}
            >
              <Text
                style={[
                  styles.timeToggleText,
                  timeFilter === "upcoming" && styles.timeToggleTextActive,
                ]}
              >
                Upcoming {contentType === "event" ? "Events" : "Sessions"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeToggleButton,
                timeFilter === "past" && styles.timeToggleButtonActive,
              ]}
              onPress={() => setTimeFilter("past")}
            >
              <Text
                style={[
                  styles.timeToggleText,
                  timeFilter === "past" && styles.timeToggleTextActive,
                ]}
              >
                Past {contentType === "event" ? "Events" : "Sessions"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
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
        </>
      )}

      {viewMode === "calendar" ? (
        <View style={{ flex: 1 }}>
          {/* Category filters for calendar view */}
          {/* <View style={styles.filtersContainer}>
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
          </View> */}

          <CalendarView
            events={calendarEvents}
            onEventPress={(event) => handleEventPress(event.id)}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onTimeSlotPress={handleTimeSlotPress}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          {/* Section Header with Date Filter */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {timeFilter === "upcoming"
                ? `Upcoming ${contentType === "event" ? "Events" : "Sessions"}`
                : `Past ${contentType === "event" ? "Events" : "Sessions"}`}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={[
                  styles.dateFilterButton,
                  filterDate && styles.dateFilterButtonActive,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <CalendarDays
                  color={filterDate ? "white" : theme.colors.textSecondary}
                  size={16}
                />
                <Text
                  style={[
                    styles.dateFilterText,
                    filterDate && styles.dateFilterTextActive,
                  ]}
                >
                  {filterDate
                    ? filterDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Date"}
                </Text>
              </TouchableOpacity>
              {filterDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={clearDateFilter}
                >
                  <Text style={styles.clearDateText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView
            style={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <CompactEventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  time={
                    event.allDay
                      ? "All day"
                      : `${event.startTime} - ${event.endTime}`
                  }
                  location={event.location || "No location"}
                  attendees={event.attendeeCount || 0}
                  category={event.category}
                  rsvpStatus={getUserRSVPStatus(event)}
                  onPress={() => handleEventPress(event.id)}
                  onRSVP={handleRSVP}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  No {timeFilter} {contentType}s found
                  {selectedFilter !== "All" && ` in ${selectedFilter} category`}
                  {filterDate && ` for ${filterDate.toLocaleDateString()}`}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {userCanCreate && (
        <FloatingActionButton
          actions={floatingActions}
          onActionPress={handleFloatingButtonPress}
        />
      )}

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateEvent}
        initialDate={createModalDate}
        initialTime={createModalTime}
        contentType={contentType}
        categoryOptions={categoryOptions}
      />

      <EventDetailModal
        visible={showEventDetail}
        event={selectedEvent}
        onClose={() => {
          setShowEventDetail(false);
          setSelectedEvent(null);
        }}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onRSVP={handleRSVP}
        currentUserId={user?.id}
        userRSVPStatus={
          selectedEvent ? getUserRSVPStatus(selectedEvent) : "none"
        }
        contentType={contentType}
        attendeeProfiles={
          selectedEvent ? attendeeProfiles[selectedEvent.id] || [] : []
        }
      />

      <EditEventModal
        visible={showEditModal}
        event={selectedEvent}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEdit}
        loading={editLoading}
        contentType={contentType}
        categoryOptions={categoryOptions}
      />

      {showDatePicker && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDatePickerChange}
        />
      )}
    </SafeAreaView>
  );
}
