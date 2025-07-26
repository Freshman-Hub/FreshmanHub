"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Users,
  MapPin,
  Video,
  Phone,
  Save,
  Plus,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { FilterChip } from "@/components/ui/FilterChip";
import { PersonPicker } from "@/components/ui/PersonPicker";
import { CalendarPicker } from "@/components/ui/CalendarPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { LocationInput } from "@/components/ui/LocationInput";
import { Avatar } from "@/components/ui/Avatar";

interface ScheduleSessionProps {
  userRole?: "head-coach" | "peer-coach" | "advisor" | "student-leader";
}

// Mock data - 100+ students and coaches
const generateMockCoaches = () => {
  const coaches = [];
  const names = [
    "Sarah Johnson",
    "David Wilson",
    "Emily Chen",
    "Marcus Rodriguez",
    "Lisa Thompson",
    "James Park",
    "Maria Garcia",
    "Alex Kim",
    "Rachel Brown",
    "Michael Davis",
  ];
  const specialties = [
    ["Academic Support", "Time Management"],
    ["Career Guidance", "Interview Prep"],
    ["Personal Development", "Leadership"],
    ["Wellness", "Stress Management"],
    ["Study Skills", "Test Prep"],
  ];

  for (let i = 0; i < 15; i++) {
    coaches.push({
      id: i + 1,
      name:
        names[i % names.length] + (i > 9 ? ` ${Math.floor(i / 10) + 1}` : ""),
      avatar: `https://images.pexels.com/photos/${1239291 + i}/pexels-photo-${1239291 + i}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      role: "Peer Coach",
      specialties: specialties[i % specialties.length],
      rating: 4.5 + Math.random() * 0.5,
      capacity: 8 + Math.floor(Math.random() * 4),
      currentStudents: Math.floor(Math.random() * 6),
    });
  }

  // Add head coach option
  coaches.unshift({
    id: 0,
    name: "Dr. Jennifer Martinez",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
    role: "Head Coach",
    specialties: ["Leadership", "Strategic Planning", "Crisis Management"],
    rating: 4.9,
    capacity: 12,
    currentStudents: 8,
  });

  return coaches;
};

const generateMockStudents = () => {
  const students = [];
  const firstNames = [
    "Emily",
    "Marcus",
    "Sarah",
    "David",
    "Lisa",
    "James",
    "Maria",
    "Alex",
    "Rachel",
    "Michael",
    "Jessica",
    "Daniel",
    "Ashley",
    "Christopher",
    "Amanda",
  ];
  const lastNames = [
    "Chen",
    "Johnson",
    "Rodriguez",
    "Wilson",
    "Thompson",
    "Park",
    "Garcia",
    "Kim",
    "Brown",
    "Davis",
    "Miller",
    "Anderson",
    "Taylor",
    "Thomas",
    "Jackson",
  ];
  const majors = [
    "Computer Science",
    "Psychology",
    "Business",
    "Engineering",
    "Biology",
    "English",
    "Mathematics",
    "History",
    "Art",
    "Music",
  ];
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];
  const needs = [
    ["Academic Support", "Study Skills"],
    ["Career Guidance", "Interview Prep"],
    ["Time Management", "Organization"],
    ["Personal Development", "Leadership"],
    ["Wellness", "Stress Management"],
  ];

  for (let i = 0; i < 120; i++) {
    const coachId = Math.floor(Math.random() * 15) + 1; // Assign to random coach
    students.push({
      id: i + 1,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
      avatar: `https://images.pexels.com/photos/${1239291 + (i % 20)}/pexels-photo-${1239291 + (i % 20)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      year: years[i % years.length],
      major: majors[i % majors.length],
      needs: needs[i % needs.length],
      coachId: coachId,
    });
  }

  return students;
};

const mockCoaches = generateMockCoaches();
const mockStudents = generateMockStudents();

const sessionTypes = [
  "Academic Support",
  "Career Guidance",
  "Personal Development",
  "Wellness Check",
  "Leadership Training",
];
const sessionFormats = ["In-Person", "Video Call", "Phone Call"];
const durations = ["30 min", "45 min", "60 min", "90 min"];

// Location options for the LocationInput
const locationOptions = [
  { label: "Student Success Center", value: "Student Success Center" },
  { label: "Library Study Room A", value: "Library Study Room A" },
  { label: "Library Study Room B", value: "Library Study Room B" },
  { label: "Library Study Room C", value: "Library Study Room C" },
  { label: "Academic Advising Office", value: "Academic Advising Office" },
  { label: "Career Services Center", value: "Career Services Center" },
  { label: "Counseling Center", value: "Counseling Center" },
  { label: "Tutoring Center", value: "Tutoring Center" },
  { label: "Student Union Lounge", value: "Student Union Lounge" },
  { label: "Coffee Shop Meeting Area", value: "Coffee Shop Meeting Area" },
  { label: "Outdoor Pavilion", value: "Outdoor Pavilion" },
  { label: "Conference Room A", value: "Conference Room A" },
  { label: "Conference Room B", value: "Conference Room B" },
  { label: "Peer Mentor Office", value: "Peer Mentor Office" },
  { label: "Group Study Area", value: "Group Study Area" },
];

export default function ScheduleSessionScreen({
  userRole = "head-coach",
}: ScheduleSessionProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { coachId, studentId } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const [selectedCoaches, setSelectedCoaches] = useState<any[]>(
    coachId
      ? [mockCoaches.find((c) => c.id.toString() === coachId)].filter(Boolean)
      : []
  );
  const [selectedStudents, setSelectedStudents] = useState<any[]>(
    studentId
      ? [mockStudents.find((s) => s.id.toString() === studentId)].filter(
          Boolean
        )
      : []
  );
  const [sessionType, setSessionType] = useState("Academic Support");
  const [sessionFormat, setSessionFormat] = useState("In-Person");
  const [duration, setDuration] = useState("60 min");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Modal states
  const [showCoachPicker, setShowCoachPicker] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleScheduleSession = () => {
    // Validate required fields
    if (
      selectedCoaches.length === 0 ||
      selectedStudents.length === 0 ||
      !selectedDate ||
      !selectedTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (sessionFormat === "In-Person" && !location.trim()) {
      alert("Please select a location for in-person sessions");
      return;
    }

    // Create session object
    const sessionData = {
      coaches: selectedCoaches,
      students: selectedStudents,
      type: sessionType,
      format: sessionFormat,
      duration,
      date: selectedDate,
      time: selectedTime,
      location: sessionFormat === "In-Person" ? location : "",
      notes,
    };

    console.log("Scheduling session:", sessionData);

    // Show success message and navigate back
    alert("Session scheduled successfully!");
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xl,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.md,
    },
    formGroup: {
      marginBottom: theme.spacing.lg,
    },
    formLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    required: {
      color: theme.colors.error,
    },
    selectionButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 60,
    },
    selectedButton: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "10",
    },
    selectionContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    selectionText: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: "600",
      marginLeft: theme.spacing.md,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
      fontWeight: "400",
    },
    selectionMeta: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.md,
      marginTop: 2,
    },
    selectedPeopleContainer: {
      marginTop: theme.spacing.md,
      marginLeft: theme.spacing.md + 24 + theme.spacing.md, // Icon width + margin
    },
    selectedPeopleList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    selectedPersonChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    selectedPersonName: {
      ...theme.typography.bodySmall,
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
    chipContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    dateTimeRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    dateTimeInput: {
      flex: 1,
    },
    scheduleButton: {
      marginTop: theme.spacing.lg,
    },
  });

  const renderSelectedPeople = (people: any[], type: "coach" | "student") => {
    if (people.length === 0) return null;

    return (
      <View style={styles.selectedPeopleContainer}>
        <View style={styles.selectedPeopleList}>
          {people.slice(0, 3).map((person) => (
            <View key={person.id} style={styles.selectedPersonChip}>
              <Avatar
                imageUrl={person.avatar}
                initials={person.name.charAt(0)}
                size={20}
              />
              <Text style={styles.selectedPersonName}>
                {person.name.split(" ")[0]}
              </Text>
            </View>
          ))}
          {people.length > 3 && (
            <View style={styles.selectedPersonChip}>
              <Text style={styles.selectedPersonName}>
                +{people.length - 3} more
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Schedule Session"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Select Coach */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Coach <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              selectedCoaches.length > 0 && styles.selectedButton,
            ]}
            onPress={() => setShowCoachPicker(true)}
          >
            <View style={styles.selectionContent}>
              <User
                color={
                  selectedCoaches.length > 0
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
                size={24}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionText,
                    selectedCoaches.length === 0 && styles.placeholderText,
                  ]}
                >
                  {selectedCoaches.length > 0
                    ? selectedCoaches.length === 1
                      ? selectedCoaches[0].name
                      : `${selectedCoaches.length} coaches selected`
                    : "Choose coaches"}
                </Text>
                {selectedCoaches.length === 1 &&
                  selectedCoaches[0].specialties && (
                    <Text style={styles.selectionMeta}>
                      {selectedCoaches[0].specialties.join(", ")} • ★{" "}
                      {selectedCoaches[0].rating?.toFixed(1)}
                    </Text>
                  )}
              </View>
            </View>
            <Plus color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
          {renderSelectedPeople(selectedCoaches, "coach")}
        </View>

        {/* Select Student */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Students <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectionButton,
              selectedStudents.length > 0 && styles.selectedButton,
            ]}
            onPress={() => setShowStudentPicker(true)}
          >
            <View style={styles.selectionContent}>
              <Users
                color={
                  selectedStudents.length > 0
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
                size={24}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.selectionText,
                    selectedStudents.length === 0 && styles.placeholderText,
                  ]}
                >
                  {selectedStudents.length > 0
                    ? selectedStudents.length === 1
                      ? selectedStudents[0].name
                      : `${selectedStudents.length} students selected`
                    : "Choose students"}
                </Text>
                {selectedStudents.length === 1 && (
                  <Text style={styles.selectionMeta}>
                    {selectedStudents[0].year} • {selectedStudents[0].major}
                  </Text>
                )}
              </View>
            </View>
            <Plus color={theme.colors.textSecondary} size={20} />
          </TouchableOpacity>
          {renderSelectedPeople(selectedStudents, "student")}
        </View>

        {/* Session Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Session Type</Text>
            <View style={styles.chipContainer}>
              {sessionTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  selected={sessionType === type}
                  onPress={() => setSessionType(type)}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Format</Text>
            <View style={styles.chipContainer}>
              {sessionFormats.map((format) => (
                <FilterChip
                  key={format}
                  label={format}
                  selected={sessionFormat === format}
                  onPress={() => setSessionFormat(format)}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Duration</Text>
            <View style={styles.chipContainer}>
              {durations.map((dur) => (
                <FilterChip
                  key={dur}
                  label={dur}
                  selected={duration === dur}
                  onPress={() => setDuration(dur)}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              Date & Time <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.dateTimeRow}>
              <CalendarPicker
                value={selectedDate}
                onSelect={setSelectedDate}
                placeholder="Select date"
                style={styles.dateTimeInput}
              />
              <TimePicker
                value={selectedTime}
                onSelect={setSelectedTime}
                placeholder="Select time"
                style={styles.dateTimeInput}
              />
            </View>
          </View>

          {sessionFormat === "In-Person" && (
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <LocationInput
                value={location}
                onSelect={setLocation}
                placeholder="Select meeting location"
                options={locationOptions}
              />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes (Optional)</Text>
            <TextInput
              placeholder="Add any additional notes or agenda items"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Schedule Button */}
        <View style={styles.section}>
          <Button
            title="Schedule Session"
            onPress={handleScheduleSession}
            icon={Save}
            mode="contained"
            style={styles.scheduleButton}
          />
        </View>
      </ScrollView>

      {/* Coach Picker Modal */}
      <PersonPicker
        visible={showCoachPicker}
        people={mockCoaches}
        selectedPeople={selectedCoaches}
        onSelect={(coaches) => {
          setSelectedCoaches(coaches);
          setShowCoachPicker(false);
        }}
        onCancel={() => setShowCoachPicker(false)}
        title="Select Coaches"
        subtitle="Choose who will conduct the session"
        type="coach"
        allowMultiple={true}
        allowSelectAll={true}
      />

      {/* Student Picker Modal */}
      <PersonPicker
        visible={showStudentPicker}
        people={mockStudents}
        selectedPeople={selectedStudents}
        onSelect={(students) => {
          setSelectedStudents(students);
          setShowStudentPicker(false);
        }}
        onCancel={() => setShowStudentPicker(false)}
        title="Select Students"
        subtitle="Choose who will attend the session"
        type="student"
        allowMultiple={true}
        allowSelectAll={true}
        showCoachFilter={true}
      />
    </SafeAreaView>
  );
}
