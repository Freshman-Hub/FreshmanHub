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
  // Create a new event
  static async createEvent(
    eventData: CreateEventData,
    userId: string,
    userDisplayName: string,
    userAvatar?: string,
    collectionName: string = "events" // Add this parameter
  ): Promise<{ event: Event | null; error: string | null }> {
    try {
      const now = new Date().toISOString();

      const newEvent = {
        ...eventData,
        userId,
        userDisplayName,
        userAvatar: userAvatar || "",
        userVerified: false,
        attendees: [userId],
        attendeeCount: 1,
        rsvpYes: [userId],
        rsvpNo: [],
        rsvpMaybe: [],
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(collection(db, collectionName), newEvent); // Use collectionName

      const event: Event = {
        id: docRef.id,
        ...newEvent,
      };

      return { event, error: null };
    } catch (error: any) {
      console.error("Create event error:", error);
      return { event: null, error: error.message };
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
}
