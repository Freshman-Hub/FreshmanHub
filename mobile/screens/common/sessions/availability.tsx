"use client";

import { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { CalendarView } from "@/components/ui/CalendarView";
import { CreateEventModal } from "@/components/ui/CreateEventModal";

interface AvailabilityProps {
  userRole?: "head-coach" | "peer-coach" | "advisor" | "student-leader";
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  notes?: string;
  date: string;
  title: string;
  category: string;
  isRSVP: boolean;
}

// Mock availability data converted to calendar events
const mockAvailability: TimeSlot[] = [
  {
    id: "1",
    day: "Monday",
    startTime: "09:00",
    endTime: "12:00",
    isRecurring: true,
    notes: "Academic support sessions",
    date: "2024-01-29",
    title: "Academic Support",
    category: "Academic",
    isRSVP: true,
  },
  {
    id: "2",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "17:00",
    isRecurring: true,
    notes: "Career guidance sessions",
    date: "2024-01-30",
    title: "Career Guidance",
    category: "Academic",
    isRSVP: true,
  },
  {
    id: "3",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "13:00",
    isRecurring: true,
    notes: "Personal development sessions",
    date: "2024-01-31",
    title: "Personal Development",
    category: "Academic",
    isRSVP: true,
  },
  {
    id: "4",
    day: "Thursday",
    startTime: "15:00",
    endTime: "18:00",
    isRecurring: true,
    notes: "Open office hours",
    date: "2024-02-01",
    title: "Office Hours",
    category: "Academic",
    isRSVP: true,
  },
  {
    id: "5",
    day: "Friday",
    startTime: "09:00",
    endTime: "11:00",
    isRecurring: true,
    notes: "Wellness check sessions",
    date: "2024-02-02",
    title: "Wellness Check",
    category: "Academic",
    isRSVP: true,
  },
];

export default function AvailabilityScreen({
  userRole = "peer-coach",
}: AvailabilityProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [availability, setAvailability] =
    useState<TimeSlot[]>(mockAvailability);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date>();
  const [createModalTime, setCreateModalTime] = useState<string>();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleEventPress = (event: any) => {
    // Handle event press - could open edit modal
    console.log("Event pressed:", event);
  };

  const handleTimeSlotPress = (date: Date, time: string) => {
    setCreateModalDate(date);
    setCreateModalTime(time);
    setCreateModalVisible(true);
  };

  const handleCreateAvailability = (event: any) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
      }),
      startTime: event.startTime,
      endTime: event.endTime,
      isRecurring: event.repeat !== "Does not repeat",
      notes: event.description,
      date: event.date,
      title: event.title,
      category: event.category,
      isRSVP: true,
    };
    setAvailability([...availability, newSlot]);
  };

  const handleEventDrag = (
    eventId: number,
    newDate: string,
    newTime: string
  ) => {
    setAvailability((prev) =>
      prev.map((slot) =>
        slot.id === eventId.toString()
          ? { ...slot, date: newDate, startTime: newTime }
          : slot
      )
    );
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
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xxl,
    },
    emptyStateText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Availability"
        leftIcon={ArrowLeft}
        onLeftPress={() => router.back()}
      />

      <CalendarView
        events={availability}
        onEventPress={handleEventPress}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onTimeSlotPress={handleTimeSlotPress}
        onEventDrag={handleEventDrag}
      />

      <CreateEventModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreateAvailability}
        initialDate={createModalDate}
        initialTime={createModalTime}
      />
    </SafeAreaView>
  );
}
