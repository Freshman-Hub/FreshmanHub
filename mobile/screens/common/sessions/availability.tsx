"use client";

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
} from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";

// Import reusable components
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextInput } from "@/components/ui/TextInput";
import { FilterChip } from "@/components/ui/FilterChip";
import { TimePicker } from "@/components/ui/TimePicker";

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
}

// Mock availability data
const mockAvailability: TimeSlot[] = [
  {
    id: "1",
    day: "Monday",
    startTime: "09:00",
    endTime: "12:00",
    isRecurring: true,
    notes: "Academic support sessions",
  },
  {
    id: "2",
    day: "Tuesday",
    startTime: "14:00",
    endTime: "17:00",
    isRecurring: true,
    notes: "Career guidance sessions",
  },
  {
    id: "3",
    day: "Wednesday",
    startTime: "10:00",
    endTime: "13:00",
    isRecurring: true,
    notes: "Personal development sessions",
  },
  {
    id: "4",
    day: "Thursday",
    startTime: "15:00",
    endTime: "18:00",
    isRecurring: true,
    notes: "Open office hours",
  },
  {
    id: "5",
    day: "Friday",
    startTime: "09:00",
    endTime: "11:00",
    isRecurring: true,
    notes: "Wellness check sessions",
  },
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AvailabilityScreen({
  userRole = "peer-coach",
}: AvailabilityProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [availability, setAvailability] =
    useState<TimeSlot[]>(mockAvailability);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const resetForm = () => {
    setSelectedDay("Monday");
    setStartTime("");
    setEndTime("");
    setNotes("");
  };

  const handleAddSlot = () => {
    if (!startTime || !endTime) {
      alert("Please select start and end times");
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      day: selectedDay,
      startTime,
      endTime,
      isRecurring: true,
      notes,
    };
    setAvailability([...availability, slot]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setSelectedDay(slot.day);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setNotes(slot.notes || "");
    setShowAddModal(true);
  };

  const handleUpdateSlot = () => {
    if (!editingSlot || !startTime || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    const updatedAvailability = availability.map((slot) =>
      slot.id === editingSlot.id
        ? {
            ...slot,
            day: selectedDay,
            startTime,
            endTime,
            notes,
          }
        : slot
    );
    setAvailability(updatedAvailability);
    setShowAddModal(false);
    setEditingSlot(null);
    resetForm();
  };

  const handleDeleteSlot = (slotId: string) => {
    setAvailability(availability.filter((slot) => slot.id !== slotId));
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
    addButton: {
      marginBottom: theme.spacing.lg,
    },
    slotCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    slotHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    slotDay: {
      ...theme.typography.h6,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
    },
    slotTime: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    slotNotes: {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    slotActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
    },
    modalContent: {
      padding: theme.spacing.lg,
    },
    modalTitle: {
      ...theme.typography.h5,
      color: theme.colors.text,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
      textAlign: "center",
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
    dayChips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    timeRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    timeInput: {
      flex: 1,
    },
    modalActions: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
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

  const renderSlotCard = ({ item: slot }: { item: TimeSlot }) => (
    <View style={styles.slotCard}>
      <View style={styles.slotHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.slotDay}>{slot.day}</Text>
          <Text style={styles.slotTime}>
            {new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )}{" "}
            -{" "}
            {new Date(`2000-01-01T${slot.endTime}`).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )}
          </Text>
          {slot.notes && <Text style={styles.slotNotes}>{slot.notes}</Text>}
        </View>
        <View style={styles.slotActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditSlot(slot)}
          >
            <Edit3 color={theme.colors.primary} size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteSlot(slot.id)}
          >
            <Trash2 color={theme.colors.error} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Availability"
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>

          <Button
            title="Add Time Slot"
            onPress={() => setShowAddModal(true)}
            icon={Plus}
            mode="contained"
            style={styles.addButton}
          />

          {availability.length > 0 ? (
            <FlatList
              data={availability.sort(
                (a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day)
              )}
              renderItem={renderSlotCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Calendar color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyStateText}>
                No availability set yet.{"\n"}Add your first time slot to get
                started.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingSlot(null);
          resetForm();
        }}
        dismissable={true}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editingSlot ? "Edit Time Slot" : "Add Time Slot"}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Day</Text>
            <View style={styles.dayChips}>
              {daysOfWeek.map((day) => (
                <FilterChip
                  key={day}
                  label={day}
                  selected={selectedDay === day}
                  onPress={() => setSelectedDay(day)}
                />
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Time</Text>
            <View style={styles.timeRow}>
              <TimePicker
                value={startTime}
                onSelect={setStartTime}
                placeholder="Start time"
                style={styles.timeInput}
              />
              <TimePicker
                value={endTime}
                onSelect={setEndTime}
                placeholder="End time"
                style={styles.timeInput}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes (Optional)</Text>
            <TextInput
              placeholder="Add notes about this time slot"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              onPress={() => {
                setShowAddModal(false);
                setEditingSlot(null);
                resetForm();
              }}
              mode="outlined"
              style={{ flex: 1 }}
            />
            <Button
              title={editingSlot ? "Update" : "Add"}
              onPress={editingSlot ? handleUpdateSlot : handleAddSlot}
              icon={Save}
              mode="contained"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
