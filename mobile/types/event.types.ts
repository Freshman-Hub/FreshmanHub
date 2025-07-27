export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  allDay: boolean;
  location?: string;
  category: string;
  color: string;
  repeat: string;

  // Creator info
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userVerified?: boolean;

  // Event stats
  attendees: string[]; // Array of user IDs
  attendeeCount: number;

  // RSVP responses
  rsvpYes: string[];
  rsvpNo: string[];
  rsvpMaybe: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface EventAttendee {
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  rsvpStatus: "yes" | "no" | "maybe" | "none";
  rsvpAt?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  category: string;
  color: string;
  repeat: string;
  isPublic: boolean;
  invitedUsers?: string[];
}
