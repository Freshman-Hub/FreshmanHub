"use client";

import { useTheme } from "@/contexts/ThemeContext";
import {
  Clock,
  FileText,
  Globe,
  MapPin,
  Palette,
  Repeat,
  Users,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal as RNModal, // Add this import
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "@/components/ui/Avatar";

// import { Modal } from "@/components/ui/Modal";
import { CategoryInput } from "@/components/ui/CategoryInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { LocationInput } from "@/components/ui/LocationInput";
import { PeoplePicker } from "@/components/ui/PeoplePicker";
import { TimePickerModal } from "@/components/ui/TimePickerModal";
import { Event } from "@/types/event.types";
import { UserService } from "@/services/user.service";
import { useSQLiteContext } from "expo-sqlite";

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  initialDate?: Date;
  initialTime?: string;
  initialEvent?: Event & { selectedPeople?: any[] }; // Fix: Add selectedPeople to the type
  isEditing?: boolean;
  loading?: boolean;
  contentType?: "event" | "session"; // Add this
  categoryOptions?: { label: string; value: string; color?: string }[]; // Add this
}

interface SelectedPersonCardProps {
  person: any;
  onRemove: (personId: string) => void;
}



export function CreateEventModal({
  visible,
  onClose,
  onSave,
  initialDate,
  initialTime,
  initialEvent,
  isEditing = false,
  loading = false,
  contentType = "event",
}: CreateEventModalProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState("My calendar");
  const [category, setCategory] = useState("Event");
  const [repeatOption, setRepeatOption] = useState("Does not repeat");
  const [selectedColor, setSelectedColor] = useState("#4285f4");
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  
  const [loadingUsers, setLoadingUsers] = useState(false);

  const titleInputRef = useRef<TextInput>(null);

  
    // Add this line to get SQLite context
    const db = useSQLiteContext();
  
    // Add this useEffect to set the SQLite context in UserService
    useEffect(() => {
      if (db) {
        UserService.setSQLiteContext(db);
        console.log("✅ SQLite context set in CreateEventModal");
      }
    }, [db]);

  // Update the loadAllUsers function to properly preselect "Everyone" group
  const loadAllUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);

      // Fetch all users first
      const { users, error } = await UserService.getAllUsers();

      if (error) {
        console.error("Error loading users:", error);
        setAllUsers([]);
        return;
      }

      if (users) {
        setAllUsers(users);

        // Create the "Everyone" group with actual user count
        const activeUsers = users.filter((user) => user.isActive);
        const everyoneGroup = {
          id: "everyone",
          name: `Everyone (${activeUsers.length} members)`,
          type: "group" as const,
          userIds: activeUsers.map((user) => user.id),
          description: "All users in the organization",
        };

        // Preselect "Everyone" group for new events/sessions (except coaching one-on-one)
        if (!isEditing && !initialEvent?.selectedPeople) {
          const isCoachingOneOnOne = initialEvent?.category === "One-on-One";
          if (!isCoachingOneOnOne) {
            setSelectedPeople([everyoneGroup]);
          }
        }
      }
    } catch (error) {
      console.error("Error setting up default selection:", error);
      setAllUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [isEditing, initialEvent?.selectedPeople, initialEvent?.category]);

  // Load users when modal opens
  useEffect(() => {
    if (visible && !isEditing) {
      loadAllUsers();
    }
  }, [visible, isEditing, loadAllUsers]);

  const handleRemovePerson = (personId: string) => {
    setSelectedPeople((prev) =>
      prev.filter((person) => person.id !== personId)
    );
  };

  useEffect(() => {
    if (visible && initialEvent && isEditing) {
      setTitle(initialEvent.title || "");
      setStartDate(initialEvent.date || "");
      setEndDate(initialEvent.date || "");
      setStartTime(initialEvent.startTime || "16:00");
      setEndTime(initialEvent.endTime || "17:00");
      setAllDay(initialEvent.allDay || false);
      setLocation(initialEvent.location || "");
      setDescription(initialEvent.description || "");
      setCategory(initialEvent.category || "Event");
      setSelectedColor(initialEvent.color || "#4285f4");
      setRepeatOption(initialEvent.repeat || "Does not repeat");
    } else if (visible && !isEditing) {
      resetForm();

      // Handle preselected data from initialEvent
      if (initialEvent) {
        if (initialEvent.category) {
          setCategory(initialEvent.category);
        }
        // Fix: Check if selectedPeople exists and is an array
        if (
          initialEvent.selectedPeople &&
          Array.isArray(initialEvent.selectedPeople)
        ) {
          setSelectedPeople(initialEvent.selectedPeople);
        }
      }

      if (initialDate) {
        const dateStr = initialDate.toISOString().split("T")[0];
        setStartDate(dateStr);
        setEndDate(dateStr);
      }
      if (initialTime) {
        setStartTime(initialTime);
        const [hours, minutes] = initialTime.split(":");
        const endHour = (Number.parseInt(hours) + 1)
          .toString()
          .padStart(2, "0");
        setEndTime(`${endHour}:${minutes}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialEvent, isEditing, initialDate, initialTime]);
  const handleTitleFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const expandGroupsToUserIds = (selectedPeople: any[], allUsers: any[]) => {
    const userIds: string[] = [];

    selectedPeople.forEach((person) => {
      if (person.type === "person") {
        // Individual person
        userIds.push(person.id);
      } else if (person.type === "group" && person.userIds) {
        // Group - add all user IDs from the group
        userIds.push(...person.userIds);
      }
    });

    // Remove duplicates
    return [...new Set(userIds)];
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    if (!startDate) {
      Alert.alert("Error", "Please select a start date");
      return;
    }

    // Validate start time vs end time
    if (
      !allDay &&
      !validateTimes(startTime, endTime, startDate, endDate || startDate)
    ) {
      Alert.alert(
        "Invalid Time",
        "End time must be after start time. Please adjust your times."
      );
      return;
    }

    const attendeeIds = expandGroupsToUserIds(selectedPeople, []);

    const event = {
      id: Date.now(),
      title: title.trim(),
      date: startDate,
      startTime: allDay ? "" : startTime,
      endTime: allDay ? "" : endTime,
      allDay,
      location,
      description,
      category,
      color: selectedColor,
      repeat: repeatOption,
      attendees: selectedPeople,
      attendeeIds,
      isRSVP: true,
    };

    onSave(event);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setIsExpanded(false);
    setAllDay(false);
    setLocation("");
    setDescription("");
    // Set default category based on what's available
    setCategory(categories[0]?.value || "Event");
    setSelectedCalendar("My calendar");
    setRepeatOption("Does not repeat");
    setSelectedColor("#4285f4");
    setSelectedPeople([]);
    setStartDate("");
    setEndDate("");
    setStartTime("16:00");
    setEndTime("17:00");
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getCategories = () => {
    if (contentType === "session") {
      // For sessions screen - show Session and Task chips
      return [
        { label: "Session", value: "Session", color: "#e3f2fd" },
        { label: "Task", value: "Task", color: "#e8f5e8" },
      ];
    } else {
      // For events screen - show Event and Task chips
      return [
        { label: "Event", value: "Event", color: "#e3f2fd" },
        { label: "Task", value: "Task", color: "#e8f5e8" },
      ];
    }
  };

  const categories = getCategories();

  const calendars = [
    { label: "My calendar", value: "My calendar", color: "#4285f4" },
    { label: "Study class", value: "Study class", color: "#fdd835" },
  ];

  const repeatOptions = [
    { label: "Does not repeat", value: "Does not repeat" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
  ];

  const colors = [
    "#4285f4", // Blue
    "#34a853", // Green
    "#fbbc04", // Yellow
    "#ea4335", // Red
    "#9c27b0", // Purple
    "#ff9800", // Orange
    "#795548", // Brown
    "#607d8b", // Blue Grey
  ];

  const locationOptions = [
    { label: "Conference Room A", value: "Conference Room A" },
    { label: "Conference Room B", value: "Conference Room B" },
    { label: "Library", value: "Library" },
    { label: "Auditorium", value: "Auditorium" },
    { label: "Main Hall", value: "Main Hall" },
    { label: "Sports Complex", value: "Sports Complex" },
  ];

  // Add this validation function near the top of the component
  const validateTimes = (
    startTime: string,
    endTime: string,
    startDate: string,
    endDate: string
  ) => {
    // If dates are the same, compare times
    if (startDate === endDate) {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      return startMinutes < endMinutes;
    }

    // If end date is after start date, times are valid
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    return startDateTime <= endDateTime;
  };

  const formatDateTime = () => {
    if (!startDate) return "";
    const date = new Date(startDate);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (allDay) return dateStr;
    return `${dateStr} • ${startTime} – ${endTime}`;
  };

  const TimeValidationMessage = () => {
    if (
      allDay ||
      validateTimes(startTime, endTime, startDate, endDate || startDate)
    ) {
      return null;
    }

    return (
      <View style={styles.validationMessage}>
        <Text style={styles.validationText}>
          ⚠️ End time must be after start time
        </Text>
      </View>
    );
  };

  const newStyles = {
    selectedPeopleContainer: {
      marginTop: 8,
      gap: 8,
    },
    selectedPeopleList: {
      flexDirection: "row" as const,
      flexWrap: "wrap" as const,
      gap: 8,
    },
    selectedPersonCard: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: "#f0f9ff",
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: "#bae6fd",
      gap: 8,
      maxWidth: 220, // Increased from 180 to show full names
      minWidth: 150,
    },
    selectedPersonName: {
      fontSize: 14,
      color: "#0369a1",
      fontWeight: "500" as const,
      flex: 1,
    },
    removePersonButton: {
      padding: 2,
    },
    peopleCountText: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
      fontWeight: "500" as const,
    },
    selectAllButton: {
      backgroundColor: "#e0f2fe",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginTop: 8,
      alignSelf: "flex-start" as const,
    },
    selectAllButtonText: {
      fontSize: 12,
      color: "#0369a1",
      fontWeight: "600" as const,
    },
  };

  const styles = StyleSheet.create({
    ...newStyles,
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
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      backgroundColor: "white",
    },
    closeButton: {
      padding: 8,
    },
    saveButton: {
      backgroundColor:
        !title.trim() ||
        (!allDay &&
          !validateTimes(startTime, endTime, startDate, endDate || startDate))
          ? theme.colors.textSecondary
          : theme.colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      opacity:
        !title.trim() ||
        (!allDay &&
          !validateTimes(startTime, endTime, startDate, endDate || startDate))
          ? 0.6
          : 1,
    },
    saveButtonDisabled: {
      backgroundColor: "#e0e0e0",
    },
    saveButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 14,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    titleInput: {
      fontSize: 24,
      fontWeight: "400",
      color: "#333",
      marginBottom: 20,
      padding: 0,
    },
    categoryContainer: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap",
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#f5f5f5",
    },
    categoryChipSelected: {
      backgroundColor: "#e3f2fd",
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    calendarContainer: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 24,
      flexWrap: "wrap",
    },
    calendarChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: "#f5f5f5",
      gap: 8,
    },
    calendarChipSelected: {
      backgroundColor: "#e3f2fd",
    },
    calendarDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    calendarText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#333",
    },
    sectionRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    sectionIcon: {
      marginRight: 20,
      width: 24,
    },
    sectionContent: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 16,
      color: "#333",
      fontWeight: "400",
    },
    allDayContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    dateTimeText: {
      fontSize: 16,
      color: "#666",
      marginTop: 8,
      marginBottom: 16,
    },
    timeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 16,
      marginTop: 12,
    },
    timeContainer: {
      flex: 1,
    },
    timeSection: {
      marginTop: 12,
    },
    timeColumn: {
      flex: 1,
    },
    timeLabel: {
      fontSize: 14,
      color: "#666",
      marginBottom: 8,
      fontWeight: "500",
    },
    timeButton: {
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      alignItems: "center",
    },
    timeButtonText: {
      fontSize: 16,
      color: "#333",
      fontWeight: "500",
    },
    compactDateTime: {
      fontSize: 16,
      color: "#666",
      marginBottom: 16,
    },
    addPeopleRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
    },
    addPeopleIcon: {
      marginRight: 20,
    },
    addPeopleText: {
      fontSize: 16,
      color: "#333",
      flex: 1,
    },
    colorContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
      flexWrap: "wrap",
    },
    colorOption: {
      width: 28,
      height: 28,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: "#333",
      borderWidth: 3,
    },
    peopleCount: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
    },
    descriptionInput: {
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      fontSize: 16,
      color: "#333",
      minHeight: 80,
      textAlignVertical: "top",
      marginBottom: theme.spacing.lg,
    },
    dateTimeRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },
    dateTimeColumn: {
      flex: 1,
    },
    validationMessage: {
      backgroundColor: theme.colors.error + "15",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.error + "30",
    },
    validationText: {
      color: theme.colors.error,
      fontSize: 14,
      fontWeight: "500",
      textAlign: "center",
    },
    warningContainer: {
      backgroundColor: "#fff3cd",
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 6,
      marginTop: 8,
      borderWidth: 1,
      borderColor: "#ffeaa7",
    },
    warningText: {
      fontSize: 12,
      color: "#856404",
      fontWeight: "500",
      lineHeight: 16,
    },
    statusContainer: {
      marginTop: 12,
    },
    statusTitle: {
      fontSize: 14,
      color: "#666",
      marginBottom: 8,
      fontWeight: "500",
    },
    statusButtons: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    statusButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#e0e0e0",
      backgroundColor: "#f8f9fa",
    },
    statusButtonActive: {
      backgroundColor: "#e3f2fd",
      borderColor: "#2196f3",
    },
    statusButtonText: {
      fontSize: 12,
      color: "#333",
      fontWeight: "500",
    },
    statusButtonTextActive: {
      color: "#2196f3",
    },
  });

  const SelectedPersonCard = ({
    person,
    onRemove,
  }: SelectedPersonCardProps) => {
    // Get the display name - prioritize full name construction
    const getDisplayName = () => {
      if (person.type === "group") {
        return person.name || "Group";
      }

      // For individuals, construct full name properly
      if (person.firstName && person.lastName) {
        return `${person.firstName} ${person.lastName}`;
      }

      if (person.name) {
        return person.name;
      }

      if (person.email) {
        return person.email;
      }

      return "Unknown User";
    };

    // Get initials for avatar
    const getInitials = () => {
      if (person.type === "group") {
        return person.name?.charAt(0) || "G";
      }

      const displayName = getDisplayName();
      return displayName
        .split(" ")
        .map((n: string) => n.charAt(0))
        .join("")
        .toUpperCase();
    };

    return (
      <View style={styles.selectedPersonCard}>
        <Avatar
          imageUrl={person.avatar || person.profileImage}
          initials={getInitials()}
          size={24}
        />
        <Text style={styles.selectedPersonName} numberOfLines={1}>
          {getDisplayName()}
        </Text>
        <TouchableOpacity
          style={styles.removePersonButton}
          onPress={() => onRemove(person.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X color="#666" size={16} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPeopleSection = () => (
    <TouchableOpacity
      style={styles.sectionRow}
      onPress={() => setShowPeoplePicker(true)}
    >
      <Users color="#666" size={20} style={styles.sectionIcon} />
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>Add people</Text>

        {/* Show selection status */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.peopleCountText}>
            {selectedPeople.length > 0
              ? selectedPeople.some(
                  (p) => p.type === "group" && p.id === "everyone"
                )
                ? "Everyone selected"
                : `${selectedPeople.length} ${selectedPeople.length === 1 ? "person" : "people"} selected`
              : "No one selected"}
          </Text>

          {/* Show "Select Everyone" button if not already selected */}
          {!selectedPeople.some(
            (p) => p.type === "group" && p.id === "everyone"
          ) && (
            <TouchableOpacity
              style={styles.selectAllButton}
              onPress={() =>
                setSelectedPeople([
                  {
                    id: "everyone",
                    name: "Everyone",
                    type: "group" as const,
                    userIds: [],
                    description: "All users in the organization",
                  },
                ])
              }
            >
              <Text style={styles.selectAllButtonText}>Select Everyone</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Show selected people/groups as cards */}
        {selectedPeople.length > 0 && (
          <View style={styles.selectedPeopleContainer}>
            <View style={styles.selectedPeopleList}>
              {selectedPeople.slice(0, 10).map((person) => (
                <SelectedPersonCard
                  key={person.id}
                  person={person}
                  onRemove={handleRemovePerson}
                />
              ))}
              {selectedPeople.length > 10 && (
                <View
                  style={[
                    styles.selectedPersonCard,
                    { backgroundColor: "#f3f4f6" },
                  ]}
                >
                  <Text
                    style={[styles.selectedPersonName, { color: "#6b7280" }]}
                  >
                    +{selectedPeople.length - 10} more
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Warning message */}
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Only invited people and you will be able to see this{" "}
            {contentType}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Update the compact view people section as well
  const renderCompactPeopleSection = () => (
    <TouchableOpacity
      style={styles.addPeopleRow}
      onPress={() => setShowPeoplePicker(true)}
    >
      <Users color="#666" size={20} style={styles.addPeopleIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.addPeopleText}>Add people</Text>
        {selectedPeople.length > 0 && (
          <>
            <Text style={styles.peopleCountText}>
              {selectedPeople.some(
                (p) => p.type === "group" && p.id === "everyone"
              )
                ? "Everyone selected"
                : `${selectedPeople.length} ${selectedPeople.length === 1 ? "person" : "people"} selected`}
            </Text>
            <View style={[styles.selectedPeopleList, { marginTop: 8 }]}>
              {selectedPeople.slice(0, 3).map((person) => (
                <SelectedPersonCard
                  key={person.id}
                  person={person}
                  onRemove={handleRemovePerson}
                />
              ))}
              {selectedPeople.length > 3 && (
                <View
                  style={[
                    styles.selectedPersonCard,
                    { backgroundColor: "#f3f4f6" },
                  ]}
                >
                  <Text
                    style={[styles.selectedPersonName, { color: "#6b7280" }]}
                  >
                    +{selectedPeople.length - 3} more
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  // Compact modal content (when not expanded)
if (!isExpanded) {
  return (
    <>
      <RNModal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
        statusBarTranslucent={false}
        hardwareAccelerated={true}
      >
        <SafeAreaView style={styles.fullScreenContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X color="#666" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !title.trim() && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!title.trim()}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                onFocus={handleTitleFocus}
                placeholder={`Add ${contentType} title`}
                placeholderTextColor="#999"
                autoFocus={true}
              />
              {formatDateTime() && (
                <Text style={styles.compactDateTime}>{formatDateTime()}</Text>
              )}
              {/* Show compact people selection */}
              {renderCompactPeopleSection()}
            </View>
          </View>
        </SafeAreaView>
      </RNModal>

      <PeoplePicker
        visible={showPeoplePicker}
        onClose={() => setShowPeoplePicker(false)}
        onSelect={setSelectedPeople}
        selectedPeople={selectedPeople}
        allUsers={allUsers}
        loading={loadingUsers}
      />
    </>
  );
}


  // Expanded modal content
  return (
    <>
      <RNModal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
        statusBarTranslucent={false}
        hardwareAccelerated={true}
      >
        <SafeAreaView style={styles.fullScreenContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X color="#666" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!title.trim() || loading) && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={!title.trim() || loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? "Saving..." : isEditing ? "Update" : "Save"}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                ref={titleInputRef}
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder={`Add ${contentType} title`} // Dynamic placeholder
                placeholderTextColor="#999"
                autoFocus={true}
              />

              {/* Categories - now uses dynamic categories */}
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryChip,
                      category === cat.value && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={styles.categoryText}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Add Status Update Section for Sessions */}
              {contentType === "session" && isEditing && (
                <View style={styles.statusContainer}>
                  <Text style={styles.statusTitle}>Session Status</Text>
                  <View style={styles.statusButtons}>
                    {[
                      { label: "Upcoming", value: "upcoming" },
                      { label: "Ongoing", value: "ongoing" },
                      { label: "Completed", value: "completed" },
                      { label: "Cancelled", value: "cancelled" },
                    ].map((status) => (
                      <TouchableOpacity
                        key={status.value}
                        style={[
                          styles.statusButton,
                          category === status.value &&
                            styles.statusButtonActive,
                        ]}
                        onPress={() => setCategory(status.value)}
                      >
                        <Text
                          style={[
                            styles.statusButtonText,
                            category === status.value &&
                              styles.statusButtonTextActive,
                          ]}
                        >
                          {status.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {/* Calendar - simplified, only show "My calendar" */}
              <View style={styles.calendarContainer}>
                {calendars.map((cal) => (
                  <TouchableOpacity
                    key={cal.value}
                    style={[
                      styles.calendarChip,
                      selectedCalendar === cal.value &&
                        styles.calendarChipSelected,
                    ]}
                    onPress={() => setSelectedCalendar(cal.value)}
                  >
                    <View
                      style={[
                        styles.calendarDot,
                        { backgroundColor: cal.color },
                      ]}
                    />
                    <Text style={styles.calendarText}>{cal.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Rest of the form remains the same */}
              <View style={styles.sectionRow}>
                <Clock color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <View style={styles.allDayContainer}>
                    <Text style={styles.sectionTitle}>All-day</Text>
                    <Switch
                      value={allDay}
                      onValueChange={setAllDay}
                      trackColor={{ false: "#e0e0e0", true: "#bbdefb" }}
                      thumbColor={allDay ? "#1976d2" : "#f4f3f4"}
                    />
                  </View>

                  <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeColumn}>
                      <Text style={styles.timeLabel}>Date</Text>
                      <DatePicker
                        value={startDate}
                        onSelect={setStartDate}
                        placeholder="Select date"
                      />
                    </View>
                  </View>

                  {!allDay && (
                    <View style={styles.timeSection}>
                      <View style={styles.timeRow}>
                        <View style={styles.timeColumn}>
                          <Text style={styles.timeLabel}>Start Time</Text>
                          <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => setShowStartTimePicker(true)}
                          >
                            <Text style={styles.timeButtonText}>
                              {startTime}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.timeColumn}>
                          <Text style={styles.timeLabel}>End Time</Text>
                          <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => setShowEndTimePicker(true)}
                          >
                            <Text style={styles.timeButtonText}>{endTime}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TimeValidationMessage />
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.sectionRow}>
                <Globe color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Greenwich Mean Time</Text>
                </View>
              </View>
              <View style={styles.sectionRow}>
                <Repeat color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <CustomSelect
                    value={repeatOption}
                    options={repeatOptions}
                    onSelect={setRepeatOption}
                    placeholder="Select repeat option"
                  />
                </View>
              </View>
              <View style={styles.sectionRow}>
                <Palette color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Color</Text>
                  <View style={styles.colorContainer}>
                    {colors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          selectedColor === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                </View>
              </View>
              {/* Add CategoryInput here - for event/session categories */}
              <View style={styles.sectionRow}>
                <FileText color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <CategoryInput
                    value={category}
                    onSelect={setCategory}
                    options={
                      contentType === "session"
                        ? // Session categories
                          [
                            {
                              label: "Advising Session",
                              value: "Advising Session",
                              color: "#667eea",
                            },
                            {
                              label: "Coaching Session",
                              value: "Coaching Session",
                              color: "#f093fb",
                            },
                            {
                              label: "Buddy Session",
                              value: "Buddy Session",
                              color: "#4facfe",
                            },
                            {
                              label: "Group Session",
                              value: "Group Session",
                              color: "#26de81",
                            },
                            {
                              label: "One-on-One",
                              value: "One-on-One",
                              color: "#ff9800",
                            },
                            {
                              label: "Workshop",
                              value: "Workshop",
                              color: "#9c27b0",
                            },
                          ] // Event categories
                        : [
                            {
                              label: "Cultural",
                              value: "Cultural",
                              color: "#667eea",
                            },
                            {
                              label: "Academic",
                              value: "Academic",
                              color: "#f093fb",
                            },
                            {
                              label: "Sports",
                              value: "Sports",
                              color: "#4facfe",
                            },
                            {
                              label: "Social",
                              value: "Social",
                              color: "#26de81",
                            },
                            {
                              label: "Workshop",
                              value: "Workshop",
                              color: "#ff9800",
                            },
                            {
                              label: "Meeting",
                              value: "Meeting",
                              color: "#9c27b0",
                            },
                          ]
                    }
                    placeholder={`Select ${contentType} category`}
                  />
                </View>
              </View>

              {renderPeopleSection()}

              <View style={styles.sectionRow}>
                <MapPin color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <LocationInput
                    value={location}
                    onSelect={setLocation}
                    placeholder="Add location"
                    options={locationOptions}
                  />
                </View>
              </View>
              <View style={styles.sectionRow}>
                <FileText color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <TextInput
                    style={styles.descriptionInput}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={`Add ${contentType} description...`} // Dynamic placeholder
                    placeholderTextColor="#999"
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </RNModal>
      <PeoplePicker
        visible={showPeoplePicker}
        onClose={() => setShowPeoplePicker(false)}
        onSelect={setSelectedPeople}
        selectedPeople={selectedPeople}
        allUsers={allUsers} // Pass the loaded users
        loading={loadingUsers} // Pass the loading state
      />
      
      <TimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onSelect={setStartTime}
        initialTime={startTime}
        title="Start Time"
      />
      <TimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onSelect={setEndTime}
        initialTime={endTime}
        title="End Time"
      />
    </>
  );
}
