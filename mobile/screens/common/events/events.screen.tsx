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
import { Calendar, List } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

// Import components
import { Header } from "@/components/ui/Header";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { CalendarView } from "@/components/ui/CalendarView";
import { CompactEventCard } from "@/components/ui/EventCard";
import { CreateEventModal } from "@/components/ui/CreateEventModal";
import { EventDetailModal } from "@/components/modals/EventDetailModal";
import { EditEventModal } from "@/components/modals/EditEventModal";

import { FilterChip } from "@/components/ui/FilterChip";

import { EventsService } from "@/services/events.service";
import { CreateEventData, Event } from "@/types/event.types";
import { useUser } from "@/contexts/UserContext";
import { Loader } from "@/components/ui/Loader";

export default function EventsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const { user } = useUser(); // Get current user

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]); // Use Event type
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date>();
  const [createModalTime, setCreateModalTime] = useState<string>();

  // Add these states after your existing useState declarations
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // Add this for delete operations

  const filters = ["All", "Cultural", "Academic", "Sports", "Social"];

  // Load events from Firebase
  const loadEvents = useCallback(async () => {
    try {
      // Only show main loader on initial load, not on filter changes
      if (events.length === 0) {
        setLoading(true);
      }

      const { events: fetchedEvents, error } = await EventsService.getEvents(
        50,
        selectedFilter
      );

      if (error) {
        console.error("Error loading events:", error);
        Alert.alert("Error", "Failed to load events");
      } else {
        setEvents(fetchedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      Alert.alert("Error", "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, events.length]);

  // Load events on component mount and filter change
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useFocusEffect(
    useCallback(() => {
      if (params.newEvent) {
        try {
          const parsedEvent = JSON.parse(params.newEvent as string);
          setEvents((prevEvents) => {
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
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

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (
    eventId: string,
    updatedData: Partial<CreateEventData>
  ) => {
    try {
      setEditLoading(true);

      const { error } = await EventsService.updateEvent(eventId, updatedData);

      if (error) {
        Alert.alert("Error", "Failed to update event. Please try again.");
      } else {
        // Update local state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, ...updatedData } : event
          )
        );
        setShowEditModal(false);
        setSelectedEvent(null);
        Alert.alert("Success", "Event updated successfully");
      }
    } catch (error) {
      console.error("Error editing event:", error);
      Alert.alert("Error", "Failed to update event");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setDeleteLoading(true); // Use separate loading state

      const { error } = await EventsService.deleteEvent(eventId);

      if (error) {
        Alert.alert("Error", "Failed to delete event. Please try again.");
      } else {
        // Remove event from local state
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        setShowEventDetail(false);
        setSelectedEvent(null);
        Alert.alert("Success", "Event deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error", "Failed to delete event");
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

            // Remove user from all RSVP arrays
            updatedEvent.rsvpYes =
              event.rsvpYes?.filter((id) => id !== user.id) || [];
            updatedEvent.rsvpNo =
              event.rsvpNo?.filter((id) => id !== user.id) || [];
            updatedEvent.rsvpMaybe =
              event.rsvpMaybe?.filter((id) => id !== user.id) || [];

            // Add user to appropriate RSVP array
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

      // API call
      const { error } = await EventsService.rsvpToEvent(
        eventId,
        user.id,
        response
      );

      if (error) {
        console.error("Error updating RSVP:", error);
        Alert.alert("Error", "Failed to update RSVP");
        // Revert optimistic update
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
      Alert.alert("Error", "Please log in to create events");
      return;
    }

    try {
      // Don't use main loading state for create operation
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
          isPublic: true, // Default to public
        },
        user.id,
        `${user.firstName} ${user.lastName}`,
        user.profileImage
      );

      if (error) {
        Alert.alert("Error", "Failed to create event");
      } else if (event) {
        setEvents((prevEvents) => [event, ...prevEvents]);
        setCreateModalVisible(false);
        Alert.alert("Success", "Event created successfully");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("Error", "Failed to create event");
    }
  };

  // Add a loading message function similar to community screen
  const getLoadingMessage = () => {
    if (deleteLoading) return "Deleting event...";
    if (editLoading) return "Updating event...";
    return "Loading events...";
  };

  const getUserRSVPStatus = (event: Event): "yes" | "no" | "maybe" | "none" => {
    if (!user?.id) return "none";
    if (event.rsvpYes?.includes(user.id)) return "yes";
    if (event.rsvpNo?.includes(user.id)) return "no";
    if (event.rsvpMaybe?.includes(user.id)) return "maybe";
    return "none";
  };

  const filteredEvents = events.filter((event) => {
    const matchesFilter =
      selectedFilter === "All" || event.category === selectedFilter;
    return matchesFilter;
  });

  // Convert events for calendar view
  const calendarEvents = filteredEvents
    .filter((event) => event.startTime !== undefined)
    .map((event) => ({
      ...event,
      startTime: event.startTime as string,
      endTime: event.endTime || (event.startTime as string),
      isRSVP: getUserRSVPStatus(event) !== "none",
    }));

  const handleTimeSlotPress = (date: Date, time: string) => {
    setCreateModalDate(date);
    setCreateModalTime(time);
    setCreateModalVisible(true);
  };

  const handleFloatingButtonPress = () => {
    setCreateModalDate(undefined);
    setCreateModalTime(undefined);
    setCreateModalVisible(true);
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
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
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

 return (
   <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
     {/* Add Loader component similar to community screen */}
     <Loader
       visible={loading || deleteLoading || editLoading}
       message={getLoadingMessage()}
     />

     <Header
       title="Events"
       showSearch={true}
       onSearchPress={() => {}}
       showFilter={true}
       onFilterPress={() => {}}
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
     )}

     {viewMode === "calendar" ? (
       <CalendarView
         events={calendarEvents}
         onEventPress={(event) => handleEventPress(event.id)}
         selectedDate={selectedDate}
         onDateChange={setSelectedDate}
         onTimeSlotPress={handleTimeSlotPress}
       />
     ) : (
       <ScrollView
         style={styles.listContainer}
         showsVerticalScrollIndicator={false}
         refreshControl={
           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
       >
         <Text style={styles.sectionTitle}>Upcoming Events</Text>
         {/* Only show content when not loading */}
         {!loading && (
           <>
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
                   No events found in {selectedFilter} category
                 </Text>
               </View>
             )}
           </>
         )}
       </ScrollView>
     )}

     <FloatingActionButton
       onEventPress={handleFloatingButtonPress}
       onTaskPress={() => {}}
       onReminderPress={() => {}}
     />

     <CreateEventModal
       visible={createModalVisible}
       onClose={() => setCreateModalVisible(false)}
       onSave={handleCreateEvent}
       initialDate={createModalDate}
       initialTime={createModalTime}
     />

     {/* Add these modals at the end */}
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
     />
   </SafeAreaView>
 );
}
