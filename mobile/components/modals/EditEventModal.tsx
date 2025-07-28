"use client";

import React from "react";
import { Alert } from "react-native";
import { CreateEventModal } from "@/components/ui/CreateEventModal";
import { Event, CreateEventData } from "@/types/event.types";
import { ContentItem, CreateContentData } from "@/services/content.service";

interface EditEventModalProps {
  visible: boolean;
  event: Event | ContentItem | null; // Support both types
  onClose: () => void;
  onSave: (
    eventId: string,
    updatedData: Partial<CreateEventData | CreateContentData>
  ) => void;
  loading?: boolean;
  contentType?: "event" | "session"; // Add this prop
  categoryOptions?: { label: string; value: string; color?: string }[]; // Add this prop
}

export function EditEventModal({
  visible,
  event,
  onClose,
  onSave,
  loading = false,
  contentType = "event", // Default to event
  categoryOptions, // Pass through to CreateEventModal
}: EditEventModalProps) {
  if (!event) return null;

  const handleSave = (eventData: any) => {
    if (!eventData.title?.trim()) {
      Alert.alert("Error", `${contentType} title cannot be empty`);
      return;
    }

    const updateData: Partial<CreateEventData | CreateContentData> = {
      title: eventData.title.trim(),
      description: eventData.description,
      date: eventData.date,
      startTime: eventData.allDay ? undefined : eventData.startTime,
      endTime: eventData.allDay ? undefined : eventData.endTime,
      allDay: eventData.allDay,
      location: eventData.location,
      category: eventData.category,
      color: eventData.color,
      repeat: eventData.repeat,
      isPublic: true, // Keep as public for now
      status: eventData.status, // Add status for sessions
    };

    onSave(event.id, updateData);
  };

  // Convert Event/ContentItem to the format expected by CreateEventModal
  const eventForModal = {
    ...event,
    // Map any fields that might have different names
    allDay: event.allDay || false,
    color: event.color || "#4285f4",
    repeat: event.repeat || "Does not repeat",
  };

  return (
    <CreateEventModal
      visible={visible}
      onClose={onClose}
      onSave={handleSave}
      initialEvent={eventForModal} // Pass the event to pre-populate fields
      isEditing={true}
      loading={loading}
      contentType={contentType} // Pass through contentType
      categoryOptions={categoryOptions} // Pass through categoryOptions
    />
  );
}
