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
import { useEffect, useRef, useState } from "react";
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
// Remove this import since we're using native Modal
// import { Modal } from "@/components/ui/Modal";
import { CategoryInput } from "@/components/ui/CategoryInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { LocationInput } from "@/components/ui/LocationInput";
import { PeoplePicker } from "@/components/ui/PeoplePicker";
import { TimePickerModal } from "@/components/ui/TimePickerModal";
import { Event } from "@/types/event.types";

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  initialDate?: Date;
  initialTime?: string;
  initialEvent?: Event;
  isEditing?: boolean;
  loading?: boolean;
  contentType?: "event" | "session"; // Add this
  categoryOptions?: { label: string; value: string; color?: string }[]; // Add this
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

  const titleInputRef = useRef<TextInput>(null);

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
  });

  // Compact modal content (when not expanded)
  if (!isExpanded) {
    return (
      <>
        <RNModal
          visible={visible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleClose}
          statusBarTranslucent={false} // Set to false
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
                  placeholder={`Add ${contentType} title`} // Dynamic placeholder
                  placeholderTextColor="#999"
                  autoFocus={true}
                />

                {formatDateTime() && (
                  <Text style={styles.compactDateTime}>{formatDateTime()}</Text>
                )}

                <TouchableOpacity
                  style={styles.addPeopleRow}
                  onPress={() => setShowPeoplePicker(true)}
                >
                  <Users color="#666" size={20} style={styles.addPeopleIcon} />
                  <Text style={styles.addPeopleText}>Add people</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </RNModal>

        <PeoplePicker
          visible={showPeoplePicker}
          onClose={() => setShowPeoplePicker(false)}
          onSelect={setSelectedPeople}
          selectedPeople={selectedPeople}
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

              <TouchableOpacity
                style={styles.sectionRow}
                onPress={() => setShowPeoplePicker(true)}
              >
                <Users color="#666" size={20} style={styles.sectionIcon} />
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionTitle}>Add people</Text>
                  {selectedPeople.length > 0 && (
                    <Text style={styles.peopleCount}>
                      {selectedPeople.length}{" "}
                      {selectedPeople.length === 1 ? "person" : "people"}{" "}
                      selected
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

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
