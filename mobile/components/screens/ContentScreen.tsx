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
import {
  ArrowLeft,
  Calendar,
  List,
  CalendarDays,
  Trash2,
  RotateCcw,
} from "lucide-react-native";
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
// import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Update the DeletedEventCard component
const DeletedEventCard = ({
  event,
  onRestore,
  onPermanentDelete,
  onRemove,
  currentUserId,
}: {
  event: Event;
  onRestore: (eventId: string) => void;
  onPermanentDelete: (eventId: string) => void;
  onRemove: (eventId: string) => void;
  currentUserId?: string;
}) => {
  const { theme } = useTheme();

  // Check if current user is the owner
  const isOwner = currentUserId === event.userId;

  const deletedCardStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: "#ff6b6b",
      opacity: 0.7,
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
      flex: 1,
      textDecorationLine: "line-through",
      fontWeight: "600",
    },
    deletedLabel: {
      backgroundColor: "#ff6b6b",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginLeft: theme.spacing.sm,
    },
    deletedText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    details: {
      marginBottom: theme.spacing.md,
    },
    detailText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
    deletedInfo: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    deletedInfoText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    actionsContainer: {
      gap: theme.spacing.sm,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      gap: theme.spacing.sm,
    },
    restoreButton: {
      backgroundColor: theme.colors.primary,
    },
    permanentDeleteButton: {
      backgroundColor: "#dc3545",
    },
    removeButton: {
      backgroundColor: "#6c757d",
    },
    actionText: {
      color: "white",
      fontWeight: "600",
    },
    ownerActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    ownerActionButton: {
      flex: 1,
    },
    noPermissionText: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontStyle: "italic",
      padding: theme.spacing.sm,
    },
    ownerInfo: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      fontWeight: "500",
    },
  });

  const formatDeletedTime = (deletedAt: string | { toDate: () => Date }) => {
    let deletedDate: Date;
    if (typeof deletedAt === "string") {
      deletedDate = new Date(deletedAt);
    } else if (deletedAt && typeof deletedAt.toDate === "function") {
      deletedDate = deletedAt.toDate();
    } else {
      return "Deleted date unknown";
    }
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - deletedDate.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `Deleted ${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Deleted ${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Deleted ${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handlePermanentDelete = () => {
    Alert.alert(
      "Permanently Delete",
      `Are you sure you want to permanently delete "${event.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: () => onPermanentDelete(event.id),
        },
      ]
    );
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove Event",
      `Remove "${event.title}" from your device? You will no longer see this event, and you'll be removed as an attendee. The event will remain active for other participants.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove & Leave",
          style: "destructive",
          onPress: () => onRemove(event.id),
        },
      ]
    );
  };

  return (
    <View style={deletedCardStyles.card}>
      <View style={deletedCardStyles.header}>
        <Text style={deletedCardStyles.title}>{event.title}</Text>
        <View style={deletedCardStyles.deletedLabel}>
          <Text style={deletedCardStyles.deletedText}>DELETED</Text>
        </View>
      </View>

      <View style={deletedCardStyles.details}>
        <Text style={deletedCardStyles.detailText}>
          Date:{" "}
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <Text style={deletedCardStyles.detailText}>
          Time:{" "}
          {event.allDay ? "All day" : `${event.startTime} - ${event.endTime}`}
        </Text>
        {event.location && (
          <Text style={deletedCardStyles.detailText}>
            Location: {event.location}
          </Text>
        )}
        <Text style={deletedCardStyles.detailText}>
          Category: {event.category}
        </Text>
        {!isOwner && (
          <Text style={deletedCardStyles.ownerInfo}>
            Created by: {event.userDisplayName}
          </Text>
        )}
      </View>

      {event.deletedAt && (
        <View style={deletedCardStyles.deletedInfo}>
          <Text style={deletedCardStyles.deletedInfoText}>
            {formatDeletedTime(event.deletedAt)}
          </Text>
        </View>
      )}

      <View style={deletedCardStyles.actionsContainer}>
        {isOwner ? (
          // Owner actions: Restore and Permanent Delete
          <View style={deletedCardStyles.ownerActions}>
            <TouchableOpacity
              style={[
                deletedCardStyles.actionButton,
                deletedCardStyles.restoreButton,
                deletedCardStyles.ownerActionButton,
              ]}
              onPress={() => onRestore(event.id)}
            >
              <RotateCcw color="white" size={16} />
              <Text style={deletedCardStyles.actionText}>Restore</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                deletedCardStyles.actionButton,
                deletedCardStyles.permanentDeleteButton,
                deletedCardStyles.ownerActionButton,
              ]}
              onPress={handlePermanentDelete}
            >
              <Trash2 color="white" size={16} />
              <Text style={deletedCardStyles.actionText}>Delete Forever</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Non-owner action: Remove from my view
          <TouchableOpacity
            style={[
              deletedCardStyles.actionButton,
              deletedCardStyles.removeButton,
            ]}
            onPress={handleRemove}
          >
            <Trash2 color="white" size={16} />
            <Text style={deletedCardStyles.actionText}>
              Remove from My View
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

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
  const [deletedEvents, setDeletedEvents] = useState<Event[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Add dataLoaded state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date>();
  const [createModalTime, setCreateModalTime] = useState<string>();

  // New states for the requested features - Updated timeFilter type
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past" | "deleted">(
    "upcoming"
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0); // For pagination
  const [hasMore, setHasMore] = useState(true); // If more events are available
  const PAGE_SIZE = 50; // Match service default

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [permanentDeleteLoading, setPermanentDeleteLoading] = useState(false);

  const filters = getFilters(user?.role);
  const categoryOptions = getCategoryOptions(user?.role);
  const userCanCreate = canUserCreate(user?.role);
  const floatingActions = getFloatingActions(user?.role);

  const [attendeeProfiles, setAttendeeProfiles] = useState<
    Record<string, User[]>
  >({});
  console.log("🟢 ContentScreen loaded with collectionName:", collectionName);

  // useEffect(() => {
  //   AsyncStorage.removeItem("lastSync_sessions");
  // }, []);


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

  // Load deleted events
  const loadDeletedEvents = useCallback(async () => {
    try {
      const { events: fetchedDeletedEvents, error } =
        await EventsService.getDeletedEvents(50, collectionName);

      if (error) {
        console.error("Error loading deleted content:", error);
      } else if (fetchedDeletedEvents) {
        // Filter deleted events based on invitee status
        const filteredDeletedEvents =
          filterEventsByInvitee(fetchedDeletedEvents);
        setDeletedEvents(filteredDeletedEvents);
      }
    } catch (error) {
      console.error("Error loading deleted content:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, user?.id]);

  // Use your existing EventsService
 const loadEvents = useCallback(
   async (reset = false) => {
     try {
       setLoading(true);
       // If reset, start from page 0
       const currentPage = reset ? 0 : page;
       const offset = currentPage * PAGE_SIZE;

       const { events: fetchedEvents, error } = await EventsService.getEvents(
         PAGE_SIZE,
         selectedFilter,
         collectionName,
         user?.id,
         user?.role,
         offset
       );

       if (error) {
         console.error("Error loading content:", error);
         Alert.alert("Error", `Failed to load ${contentType}s`);
         setHasMore(false);
       } else if (fetchedEvents) {
         // Filter events based on invitee status
         const filteredEvents = filterEventsByInvitee(fetchedEvents);
         if (reset) {
           setEvents(filteredEvents);
         } else {
           setEvents((prev) => [...prev, ...filteredEvents]);
         }
         setHasMore(filteredEvents.length === PAGE_SIZE);

         // Load attendee profiles for each event
         filteredEvents.forEach((event) => {
           if (event.rsvpYes?.length > 0) {
             loadAttendeeProfiles(event.id, event.rsvpYes);
           }
         });
       }

       // Also load deleted events
       await loadDeletedEvents();
     } catch (error) {
       console.error("Error loading content:", error);
       Alert.alert("Error", `Failed to load ${contentType}s`);
       // TODO: Send error to monitoring system
       setHasMore(false);
     } finally {
       setLoading(false);
       setDataLoaded(true);
     }
   },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [
     contentType,
     selectedFilter,
     collectionName,
     user?.id,
     user?.role,
     page,
     loadAttendeeProfiles,
     loadDeletedEvents,
   ]
 );

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
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setDeleteLoading(true);

      const { error } = await EventsService.deleteEvent(
        eventId,
        user.id,
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

        // Reload deleted events to show the newly deleted event
        await loadDeletedEvents();
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      Alert.alert("Error", `Failed to delete ${contentType}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // New restore function
  const handleRestoreEvent = async (eventId: string) => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    // Find the event and check ownership
    const eventToRestore = deletedEvents.find((event) => event.id === eventId);
    if (!eventToRestore) {
      Alert.alert("Error", "Event not found");
      return;
    }

    if (eventToRestore.userId !== user.id) {
      Alert.alert("Error", "You can only restore events that you created");
      return;
    }

    try {
      setRestoreLoading(true);

      const { error } = await EventsService.restoreEvent(
        eventId,
        collectionName
      );

      if (error) {
        Alert.alert(
          "Error",
          `Failed to restore ${contentType}. Please try again.`
        );
      } else {
        // Remove from deleted events
        setDeletedEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        Alert.alert("Success", `${contentType} restored successfully`);

        // Reload events to show the restored event
        setDataLoaded(false); // Force reload
        await loadEvents();
      }
    } catch (error) {
      console.error("Error restoring content:", error);
      Alert.alert("Error", `Failed to restore ${contentType}`);
    } finally {
      setRestoreLoading(false);
    }
  };

  // Update handleRemoveEvent with better error handling
  const handleRemoveEvent = async (eventId: string) => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setRestoreLoading(true);

      const { error } = await EventsService.removeEventFromUser(
        eventId,
        user.id,
        collectionName
      );

      if (error) {
        Alert.alert("Error", `Failed to remove ${contentType}. ${error}`);
      } else {
        // Remove from both deleted events and regular events view
        setDeletedEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        // Also remove from regular events if it's there
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        Alert.alert("Success", `${contentType} removed from your view`);
      }
    } catch (error) {
      console.error("Error removing content:", error);
      Alert.alert("Error", `Failed to remove ${contentType}`);
    } finally {
      setRestoreLoading(false);
    }
  };

  // Update handlePermanentDeleteEvent with better error handling
  const handlePermanentDeleteEvent = async (eventId: string) => {
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setPermanentDeleteLoading(true);

      const { error } = await EventsService.permanentlyDeleteEvent(
        eventId,
        user.id,
        collectionName
      );

      if (error) {
        Alert.alert("Error", error); // Show the exact error message
      } else {
        // Remove from deleted events
        setDeletedEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );

        Alert.alert("Success", `${contentType} permanently deleted`);
      }
    } catch (error) {
      console.error("Error permanently deleting content:", error);
      Alert.alert("Error", `Failed to permanently delete ${contentType}`);
    } finally {
      setPermanentDeleteLoading(false);
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
        // 🔔 Show success message with notification info
        const invitedCount = eventData.attendeeIds?.length || 0;
        const successMessage =
          invitedCount > 0
            ? `${contentType} created successfully!\n\n🔔 Notifications sent to ${invitedCount} invited user${invitedCount > 1 ? "s" : ""}.`
            : `${contentType} created successfully!`;
        Alert.alert("Success", successMessage);
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
          } else if (timeFilter === "past") {
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
          } else if (timeFilter === "past") {
            return eventDateOnly < nowDateOnly;
          }
        }

        return true; // Should not reach here
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

  // Get filtered deleted events
  const getFilteredDeletedEvents = () => {
    let filtered = deletedEvents;

    // Filter by category
    if (selectedFilter !== "All") {
      filtered = filtered.filter((event) => event.category === selectedFilter);
    }

    // Filter by specific date if selected
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
  const filteredEvents =
    timeFilter === "deleted" ? getFilteredDeletedEvents() : getFilteredEvents();

  // Update calendarEvents to include ALL events when in calendar view
  const calendarEvents = (
    viewMode === "calendar"
      ? events
      : timeFilter === "deleted"
        ? []
        : getFilteredEvents()
  )
    .filter((event) => event.startTime !== undefined)
    .map((event) => ({
      ...event,
      startTime: event.startTime as string,
      endTime: event.endTime || (event.startTime as string),
      color: event.color || theme.colors.primary, // Ensure color is passed
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

  // Get section title based on time filter
  const getSectionTitle = () => {
    switch (timeFilter) {
      case "upcoming":
        return `Upcoming ${contentType === "event" ? "Events" : "Sessions"}`;
      case "past":
        return `Past ${contentType === "event" ? "Events" : "Sessions"}`;
      case "deleted":
        return `Deleted ${contentType === "event" ? "Events" : "Sessions"}`;
      default:
        return `${contentType === "event" ? "Events" : "Sessions"}`;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Show bottom toast loading indicator */}
      {(deleteLoading ||
        editLoading ||
        restoreLoading ||
        permanentDeleteLoading) && (
        <View
          style={{
            position: "absolute",
            bottom: 100, // Above floating button
            left: 20,
            right: 20,
            backgroundColor: theme.colors.background,
            opacity: 0.9,
            paddingHorizontal: 10,
            paddingVertical: 14,
            borderRadius: theme.spacing.xl,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <LoadingSpinner size="small" />
          <Text
            style={{
              color: theme.colors.text,
              marginLeft: 12,
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            {deleteLoading
              ? `Deleting ${contentType}...`
              : permanentDeleteLoading
                ? `Permanently deleting ${contentType}...`
                : restoreLoading
                  ? `Processing ${contentType}...`
                  : `Updating ${contentType}...`}
          </Text>
        </View>
      )}

      <Header
        title={title}
        showSearch={true}
        onSearchPress={() => {}}
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      {/* Only show view toggle when not viewing deleted events */}
      {timeFilter !== "deleted" && (
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
      )}

      {(viewMode === "list" || timeFilter === "deleted") && (
        <>
          {/* Time Toggle - Updated to include deleted option */}
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
                Upcoming
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
                Past
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeToggleButton,
                timeFilter === "deleted" && styles.timeToggleButtonActive,
              ]}
              onPress={() => setTimeFilter("deleted")}
            >
              <Text
                style={[
                  styles.timeToggleText,
                  timeFilter === "deleted" && styles.timeToggleTextActive,
                ]}
              >
                Deleted
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

      {viewMode === "calendar" && timeFilter !== "deleted" ? (
        <View style={{ flex: 1 }}>
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
            <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
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
              timeFilter === "deleted" ? (
                // Render deleted events with restore functionality
                filteredEvents.map((event) => (
                  <DeletedEventCard
                    key={event.id}
                    event={event}
                    onRestore={handleRestoreEvent}
                    onPermanentDelete={handlePermanentDeleteEvent}
                    onRemove={handleRemoveEvent}
                    currentUserId={user?.id}
                  />
                ))
              ) : (
                // Render normal events
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
              )
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

      {userCanCreate && timeFilter !== "deleted" && (
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
