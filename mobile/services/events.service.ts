import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";
import { Event, CreateEventData } from "@/types/event.types";

export class EventsService {
  static async createEvent(
    eventData: CreateEventData,
    userId: string,
    userDisplayName: string,
    userAvatar?: string,
    contentType: "events" | "sessions" = "events"
  ): Promise<{ event?: Event; error?: string }> {
    try {
      const now = new Date().toISOString();

      // For one-on-one sessions, ensure privacy
      const isPrivateSession = eventData.category === "One-on-One";

      const newEvent = {
        ...eventData,
        userId,
        userDisplayName,
        userAvatar: userAvatar || "",
        userVerified: false,
        attendees: [userId],
        attendeeCount: 1,
        invitedUsers: eventData.invitedUsers || [], // Use invitedUsers consistently
        rsvpYes: [userId],
        rsvpNo: [],
        rsvpMaybe: [],
        status: eventData.status || "upcoming",
        isPublic: !isPrivateSession, // One-on-one sessions are private
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, contentType), newEvent);

      return {
        event: {
          id: docRef.id,
          ...newEvent,
        } as unknown as Event,
      };
    } catch (error) {
      console.error(`Error creating ${contentType.slice(0, -1)}:`, error);
      return { error: `Failed to create ${contentType.slice(0, -1)}` };
    }
  }

  // Get all events - NO orderBy to avoid indexes
  static async getEvents(
    limitCount: number = 50,
    category?: string,
    collectionName: string = "events" // Add this parameter
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      let querySnapshot;

      if (category && category !== "All") {
        const q = query(
          collection(db, collectionName), // Use collectionName
          where("category", "==", category),
          limit(limitCount)
        );
        querySnapshot = await getDocs(q);
      } else {
        const q = query(collection(db, collectionName), limit(limitCount)); // Use collectionName
        querySnapshot = await getDocs(q);
      }

      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Keep your existing sorting logic
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const now = new Date();

        const isAUpcoming = dateA >= now;
        const isBUpcoming = dateB >= now;

        if (isAUpcoming && !isBUpcoming) return -1;
        if (!isAUpcoming && isBUpcoming) return 1;

        return dateA.getTime() - dateB.getTime();
      });

      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("Get events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Get single event by ID
  static async getEvent(
    eventId: string
  ): Promise<{ event: Event | null; error: string | null }> {
    try {
      const eventDoc = await getDoc(doc(db, "events", eventId));

      if (!eventDoc.exists()) {
        return { event: null, error: "Event not found" };
      }

      const event = {
        id: eventDoc.id,
        ...eventDoc.data(),
      } as Event;

      return { event, error: null };
    } catch (error: any) {
      console.error("Get event error:", error);
      return { event: null, error: error.message };
    }
  }

  // Update event
  static async updateEvent(
    eventId: string,
    updateData: Partial<CreateEventData>,
    collectionName: string = "events" // Add this parameter
  ): Promise<{ error: string | null }> {
    try {
      const cleanUpdateData: any = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      Object.keys(cleanUpdateData).forEach((key) => {
        if (cleanUpdateData[key] === undefined) {
          delete cleanUpdateData[key];
        }
      });

      await updateDoc(doc(db, collectionName, eventId), cleanUpdateData); // Use collectionName

      return { error: null };
    } catch (error: any) {
      console.error("Update event error:", error);
      return { error: error.message };
    }
  }

  // Delete event
  static async deleteEvent(
    eventId: string,
    collectionName: string = "events" // Add this parameter
  ): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, collectionName, eventId)); // Use collectionName
      return { error: null };
    } catch (error: any) {
      console.error("Delete event error:", error);
      return { error: error.message };
    }
  }

  // RSVP to event
  static async rsvpToEvent(
    eventId: string,
    userId: string,
    response: "yes" | "no" | "maybe",
    collectionName: string = "events" // Add this parameter
  ): Promise<{ error: string | null }> {
    try {
      const eventRef = doc(db, collectionName, eventId); // Use collectionName
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        return { error: "Event not found" };
      }

      const eventData = eventDoc.data() as Event;

      // Keep your existing RSVP logic
      const updates: any = {
        rsvpYes: arrayRemove(userId),
        rsvpNo: arrayRemove(userId),
        rsvpMaybe: arrayRemove(userId),
        updatedAt: new Date().toISOString(),
      };

      if (response === "yes") {
        updates.rsvpYes = arrayUnion(userId);
        if (!eventData.attendees?.includes(userId)) {
          updates.attendees = arrayUnion(userId);
          updates.attendeeCount = increment(1);
        }
      } else if (response === "no") {
        updates.rsvpNo = arrayUnion(userId);
        if (eventData.attendees?.includes(userId)) {
          updates.attendees = arrayRemove(userId);
          updates.attendeeCount = increment(-1);
        }
      } else if (response === "maybe") {
        updates.rsvpMaybe = arrayUnion(userId);
        if (eventData.attendees?.includes(userId)) {
          updates.attendees = arrayRemove(userId);
          updates.attendeeCount = increment(-1);
        }
      }

      await updateDoc(eventRef, updates);

      return { error: null };
    } catch (error: any) {
      console.error("RSVP error:", error);
      return { error: error.message };
    }
  }

  // Get user's events - NO orderBy
  static async getUserEvents(
    userId: string,
    limitCount: number = 50
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      const q = query(
        collection(db, "events"),
        where("userId", "==", userId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Sort by date on client side
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("Get user events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Get events user is attending - NO orderBy
  static async getAttendingEvents(
    userId: string,
    limitCount: number = 50
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      const q = query(
        collection(db, "events"),
        where("attendees", "array-contains", userId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Sort by date on client side
      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("Get attending events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Search events - NO orderBy
  static async searchEvents(
    searchQuery: string,
    limitCount: number = 20
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      // Get all events without ordering
      const q = query(
        collection(db, "events"),
        limit(limitCount * 3) // Get more to account for filtering
      );

      const querySnapshot = await getDocs(q);
      const allEvents: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

      // Filter events based on search query
      const filteredEvents = allEvents
        .filter(
          (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, limitCount);

      // Sort filtered results by date
      filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      return { events: filteredEvents, error: null };
    } catch (error: any) {
      console.error("Search events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Add this method to check and auto-complete past events
  static async autoCompletePastEvents(
    collectionName: "events" | "sessions" = "events"
  ) {
    try {
      const now = new Date();
      const { events, error } = await this.getEvents(
        100,
        "All",
        collectionName
      );

      if (error || !events) return;

      const pastEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < now && event.status === "upcoming";
      });

      // Update past events to completed
      for (const event of pastEvents) {
        await this.updateEvent(
          event.id,
          { status: "completed" },
          collectionName
        );
      }

      return { updated: pastEvents.length };
    } catch (error) {
      console.error("Error auto-completing past events:", error);
      return { error: "Failed to auto-complete past events" };
    }
  }
}
