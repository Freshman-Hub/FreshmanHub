import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal as RNModal,
  SafeAreaView,
} from "react-native";
import {
  X,
  MoreVertical,
  Clock,
  MapPin,
  Users,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Share,
  FileText,
} from "lucide-react-native";
import { Avatar } from "@/components/ui/Avatar";
import { Event } from "@/types/event.types";
import { ContentItem } from "@/services/content.service"; // Add this import
import { UserService } from "@/services/user.service";
import { User } from "@/types/user.types";

interface EventDetailModalProps {
  visible: boolean;
  event: Event | ContentItem | null; // Support both types
  onClose: () => void;
  onEdit: (event: Event | ContentItem) => void; // Support both types
  onDelete: (eventId: string) => void;
  onRSVP: (eventId: string, response: "yes" | "no" | "maybe") => void;
  currentUserId?: string;
  userRSVPStatus: "yes" | "no" | "maybe" | "none";
  contentType?: "event" | "session"; // Add this prop
}

export function EventDetailModal({
  visible,
  event,
  onClose,
  onEdit,
  onDelete,
  onRSVP,
  currentUserId,
  userRSVPStatus,
  contentType = "event", // Add this with default
}: EventDetailModalProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [attendeeProfiles, setAttendeeProfiles] = useState<User[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Fetch attendee profiles when modal opens or event changes
  useEffect(() => {
    const fetchAttendeeProfiles = async () => {
      if (!visible || !event?.rsvpYes?.length) return;

      setLoadingAttendees(true);
      try {
        // Get all attendee IDs (excluding the organizer)
        const attendeeIds = event.rsvpYes.filter((id) => id !== event.userId);

        if (attendeeIds.length > 0) {
          const profiles: User[] = [];

          // Fetch each user individually using existing service
          for (const userId of attendeeIds.slice(0, 10)) {
            // Limit to first 10
            const { user, error } = await UserService.getUserById(userId);
            if (user && !error) {
              profiles.push(user);
            }
          }

          setAttendeeProfiles(profiles);
        } else {
          setAttendeeProfiles([]);
        }
      } catch (error) {
        console.error("Error fetching attendee profiles:", error);
        setAttendeeProfiles([]);
      } finally {
        setLoadingAttendees(false);
      }
    };

    fetchAttendeeProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, event?.id, event?.rsvpYes]);

  // Reset attendee profiles when modal closes
  useEffect(() => {
    if (!visible) {
      setAttendeeProfiles([]);
      setShowMoreMenu(false);
    }
  }, [visible]);

  if (!event) return null;

  const isOwner = event.userId === currentUserId;

  const handleEdit = () => {
    setShowMoreMenu(false);
    onEdit(event);
  };

  const handleDelete = () => {
    setShowMoreMenu(false);
    Alert.alert(
      `Delete ${contentType}`, // Dynamic text based on content type
      `Are you sure you want to delete this ${contentType}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(event.id),
        },
      ]
    );
  };

  const handleShare = () => {
    setShowMoreMenu(false);
    Alert.alert("Share", "Share functionality would be implemented here");
  };

  const handleCopy = () => {
    setShowMoreMenu(false);
    Alert.alert("Copy", `${contentType} link copied to clipboard`);
  };

  const formatDateTime = () => {
    if (!event.date) return "";
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    if (event.allDay) return dateStr;
    return `${dateStr} • ${event.startTime} – ${event.endTime}`;
  };

  // Update the attendees section with real names
  const renderAttendeesSection = () => {
    const totalAttendees = event.rsvpYes?.length || 0;
    const visibleAttendees = attendeeProfiles.slice(0, 5);
    const remainingCount = Math.max(
      0,
      totalAttendees - visibleAttendees.length - 1
    ); // -1 for organizer

    return (
      <View style={styles.attendeesSection}>
        <View style={styles.attendeesHeader}>
          <Users color="#666" size={20} />
          <Text style={styles.attendeesCount}>
            {totalAttendees}{" "}
            {contentType === "session" ? "participant" : "guest"}
            {totalAttendees !== 1 ? "s" : ""}
          </Text>
          <Text style={styles.attendeesResponse}>{totalAttendees} yes</Text>
        </View>

        <View style={styles.attendeesList}>
          {/* Event Creator */}
          <View style={styles.attendeeItem}>
            <Avatar
              imageUrl={event.userAvatar}
              initials={
                event.userDisplayName
                  ?.split(" ")
                  .map((n) => n.charAt(0))
                  .join("") || "U"
              }
              size={32}
            />
            <Text style={styles.attendeeName}>
              {event.userDisplayName || "Unknown User"}
            </Text>
            <Text style={styles.attendeeRole}>
              {contentType === "session" ? "Host" : "Organizer"}
            </Text>
          </View>

          {/* Show loading state */}
          {loadingAttendees && (
            <Text style={[styles.sectionText, { color: "#666", fontSize: 14 }]}>
              Loading {contentType === "session" ? "participants" : "attendees"}
              ...
            </Text>
          )}

          {/* Real Attendee Profiles */}
          {!loadingAttendees &&
            visibleAttendees.map((attendee, index) => (
              <View key={attendee.id} style={styles.attendeeItem}>
                <Avatar
                  imageUrl={attendee.profileImage}
                  initials={
                    `${attendee.firstName} ${attendee.lastName}`
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("") || "U"
                  }
                  size={32}
                />
                <Text style={styles.attendeeName}>
                  {`${attendee.firstName} ${attendee.lastName}` ||
                    attendee.email ||
                    "Unknown User"}
                </Text>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: "#4caf50",
                  }}
                />
              </View>
            ))}

          {/* Show remaining count */}
          {!loadingAttendees && remainingCount > 0 && (
            <Text
              style={[
                styles.sectionText,
                { color: "#666", fontSize: 14, paddingLeft: 44 },
              ]}
            >
              +{remainingCount} more
            </Text>
          )}

          {/* Show message when no other attendees */}
          {!loadingAttendees &&
            attendeeProfiles.length === 0 &&
            totalAttendees === 1 && (
              <Text
                style={[
                  styles.sectionText,
                  { color: "#666", fontSize: 14, paddingLeft: 44 },
                ]}
              >
                No other{" "}
                {contentType === "session" ? "participants" : "attendees"} yet
              </Text>
            )}
        </View>
      </View>
    );
  };

  // ... Keep ALL your existing styles exactly as they are
  const styles = StyleSheet.create({
    fullScreenContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    container: {
      flex: 1,
      backgroundColor: "white",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      backgroundColor: "white",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    eventColor: {
      width: 20,
      height: 20,
      borderRadius: 4,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
      flex: 1,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    iconButton: {
      padding: 8,
      borderRadius: 20,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    dateTime: {
      fontSize: 16,
      color: "#333",
      fontWeight: "500",
      marginBottom: 20,
    },
    section: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f5f5f5",
    },
    sectionIcon: {
      marginRight: 16,
      width: 20,
    },
    sectionText: {
      fontSize: 16,
      color: "#333",
      flex: 1,
    },
    attendeesSection: {
      paddingVertical: 16,
    },
    attendeesHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    attendeesCount: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginLeft: 12,
    },
    attendeesList: {
      gap: 12,
    },
    attendeeItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
    },
    attendeeName: {
      fontSize: 16,
      color: "#333",
      marginLeft: 12,
      flex: 1,
    },
    attendeeRole: {
      fontSize: 14,
      color: "#666",
      marginLeft: 12,
    },
    rsvpSection: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: "#f0f0f0",
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      backgroundColor: "white",
    },
    rsvpButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      minWidth: 80,
      alignItems: "center",
    },
    rsvpButtonSelected: {
      backgroundColor: "#1976d2",
      borderColor: "#1976d2",
    },
    rsvpButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#333",
    },
    rsvpButtonTextSelected: {
      color: "white",
    },
    moreMenu: {
      position: "absolute",
      top: 100,
      right: 20,
      backgroundColor: "white",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      minWidth: 180,
      zIndex: 1000,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f5f5f5",
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemDelete: {},
    menuIcon: {
      marginRight: 12,
      width: 20,
    },
    menuText: {
      fontSize: 16,
      color: "#333",
    },
    menuTextDelete: {
      color: "#f44336",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.1)",
      zIndex: 999,
    },
    attendeesResponse: {
      fontSize: 14,
      color: "#666",
      marginLeft: 8,
    },
    descriptionSection: {
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: "#f5f5f5",
    },
    descriptionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    descriptionTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginLeft: 16,
    },
    descriptionText: {
      fontSize: 16,
      color: "#333",
      lineHeight: 22,
      paddingLeft: 36,
    },
  });

  return (
    <>
      <RNModal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
        statusBarTranslucent={false} // Changed to true for consistency
        hardwareAccelerated={true}
      >
        <SafeAreaView style={styles.fullScreenContainer}>
          <View style={styles.container}>
            {/* Header - Add status badge for sessions */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View
                  style={[
                    styles.eventColor,
                    { backgroundColor: event.color || "#4285f4" },
                  ]}
                />
                <Text style={styles.title} numberOfLines={1}>
                  {event.title}
                </Text>
                {/* Add status badge for sessions */}
                {contentType === "session" && (event as ContentItem).status && (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginLeft: 8,
                      backgroundColor:
                        (event as ContentItem).status === "completed"
                          ? "#4caf50"
                          : (event as ContentItem).status === "cancelled"
                            ? "#f44336"
                            : "#2196f3",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                    >
                      {(event as ContentItem).status}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.headerRight}>
                {isOwner && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleEdit}
                  >
                    <Edit color="#666" size={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowMoreMenu(true)}
                >
                  <MoreVertical color="#666" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                  <X color="#666" size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Keep ALL your existing content exactly as is */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.scrollContent}>
                <Text style={styles.dateTime}>{formatDateTime()}</Text>

                <View style={styles.section}>
                  <Clock color="#666" size={20} style={styles.sectionIcon} />
                  <Text style={styles.sectionText}>15 minutes before</Text>
                </View>

                {event.location && (
                  <View style={styles.section}>
                    <MapPin color="#666" size={20} style={styles.sectionIcon} />
                    <Text style={styles.sectionText}>{event.location}</Text>
                  </View>
                )}

                <View style={styles.section}>
                  <Calendar color="#666" size={20} style={styles.sectionIcon} />
                  <Text style={styles.sectionText}>
                    {event.userDisplayName || "My calendar"}
                  </Text>
                </View>

                {renderAttendeesSection()}

                {event.description && (
                  <View style={styles.descriptionSection}>
                    <View style={styles.descriptionHeader}>
                      <FileText
                        color="#666"
                        size={20}
                        style={styles.sectionIcon}
                      />
                      <Text style={styles.descriptionTitle}>Description</Text>
                    </View>
                    <Text style={styles.descriptionText}>
                      {event.description}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Update RSVP button text for sessions */}
            {!isOwner && (
              <View style={styles.rsvpSection}>
                <TouchableOpacity
                  style={[
                    styles.rsvpButton,
                    userRSVPStatus === "yes" && styles.rsvpButtonSelected,
                  ]}
                  onPress={() => onRSVP(event.id, "yes")}
                >
                  <Text
                    style={[
                      styles.rsvpButtonText,
                      userRSVPStatus === "yes" && styles.rsvpButtonTextSelected,
                    ]}
                  >
                    {contentType === "session" ? "Join" : "Yes"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.rsvpButton,
                    userRSVPStatus === "no" && styles.rsvpButtonSelected,
                  ]}
                  onPress={() => onRSVP(event.id, "no")}
                >
                  <Text
                    style={[
                      styles.rsvpButtonText,
                      userRSVPStatus === "no" && styles.rsvpButtonTextSelected,
                    ]}
                  >
                    {contentType === "session" ? "Can't Join" : "No"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.rsvpButton,
                    userRSVPStatus === "maybe" && styles.rsvpButtonSelected,
                  ]}
                  onPress={() => onRSVP(event.id, "maybe")}
                >
                  <Text
                    style={[
                      styles.rsvpButtonText,
                      userRSVPStatus === "maybe" &&
                        styles.rsvpButtonTextSelected,
                    ]}
                  >
                    Maybe
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Keep your existing more menu exactly as is */}
          {showMoreMenu && (
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setShowMoreMenu(false)}
              activeOpacity={1}
            >
              <View style={styles.moreMenu}>
                {isOwner && (
                  <>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={handleEdit}
                    >
                      <Edit color="#333" size={20} style={styles.menuIcon} />
                      <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.menuItem, styles.menuItemDelete]}
                      onPress={handleDelete}
                    >
                      <Trash2
                        color="#f44336"
                        size={20}
                        style={styles.menuIcon}
                      />
                      <Text style={[styles.menuText, styles.menuTextDelete]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity style={styles.menuItem} onPress={handleCopy}>
                  <Copy color="#333" size={20} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Copy to...</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, styles.menuItemLast]}
                  onPress={handleShare}
                >
                  <Share color="#333" size={20} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Help & feedback</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </RNModal>
    </>
  );
}
