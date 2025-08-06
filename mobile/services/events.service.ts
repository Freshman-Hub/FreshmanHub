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
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";
import { Event, CreateEventData } from "@/types/event.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_EVENTS_SYNC_KEY = "lastEventsSync";

export class EventsService {
  private static sqliteDb: any = null;

  // Initialize SQLite context (call this from your component that has access to useSQLiteContext)
  static setSQLiteContext(db: any) {
    this.sqliteDb = db;
  }

  // Get last sync timestamp from AsyncStorage
  private static async getLastSyncTime(): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(LAST_EVENTS_SYNC_KEY);
      console.log("📅 Last events sync time:", value || "First time sync");
      return value;
    } catch (error) {
      console.error("Error getting last events sync time:", error);
      return null;
    }
  }

  // Update last sync timestamp
  private static async updateLastSyncTime(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_EVENTS_SYNC_KEY, timestamp);
      console.log("✅ Updated last events sync time to:", timestamp);
    } catch (error) {
      console.error("Error updating last events sync time:", error);
    }
  }

  // Sync events from Firebase to SQLite
  private static async syncEventsFromFirebase(
    collectionName: string = "events"
  ): Promise<{
    events: Event[];
    error: string | null;
  }> {
    try {
      console.log(
        `🔄 Starting events sync from Firebase (${collectionName})...`
      );

      const lastSync = await this.getLastSyncTime();
      let firebaseQuery;

      if (lastSync) {
        console.log("📥 Fetching events updated after:", lastSync);
        firebaseQuery = query(
          collection(db, collectionName),
          where("updatedAt", ">", lastSync),
          orderBy("updatedAt", "asc")
        );
      } else {
        console.log("📥 First time sync - fetching all events from Firebase");
        firebaseQuery = query(
          collection(db, collectionName),
          orderBy("updatedAt", "asc")
        );
      }

      const querySnapshot = await getDocs(firebaseQuery);
      const events: Event[] = [];

      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() } as Event);
      });

      console.log(`🔥 Firebase returned ${events.length} events`);

      // Insert/update events in SQLite
      if (events.length > 0 && this.sqliteDb) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event);
        }

        // Update last sync time with the latest event's updatedAt
        const latestEvent = events[events.length - 1];
        if (latestEvent.updatedAt) {
          await this.updateLastSyncTime(latestEvent.updatedAt);
        }
      }

      return { events, error: null };
    } catch (error: any) {
      console.error("❌ Error syncing events from Firebase:", error);
      return { events: [], error: error.message };
    }
  }

  // Insert or update event in SQLite
  private static async insertOrUpdateEventInSQLite(
    event: Event
  ): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Check if event exists
      const existingEvent = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM events WHERE id = ?",
        [event.id]
      );

      if (existingEvent) {
        // Update existing event
        await this.sqliteDb.runAsync(
          `UPDATE events SET 
           title = ?, description = ?, date = ?, startTime = ?, endTime = ?, 
           allDay = ?, location = ?, category = ?, color = ?, repeat = ?, 
           status = ?, userDisplayName = ?, userAvatar = ?, userVerified = ?, 
           attendees = ?, attendeeCount = ?, invitedUsers = ?, rsvpYes = ?, 
           rsvpNo = ?, rsvpMaybe = ?, updatedAt = ?, isPublic = ?
           WHERE id = ?`,
          [
            event.title,
            event.description || null,
            event.date,
            event.startTime || null,
            event.endTime || null,
            event.allDay ? 1 : 0,
            event.location || null,
            event.category,
            event.color,
            event.repeat,
            event.status || "upcoming",
            event.userDisplayName,
            event.userAvatar || null,
            event.userVerified ? 1 : 0,
            JSON.stringify(event.attendees),
            event.attendeeCount,
            JSON.stringify(event.invitedUsers),
            JSON.stringify(event.rsvpYes),
            JSON.stringify(event.rsvpNo),
            JSON.stringify(event.rsvpMaybe),
            event.updatedAt,
            event.isPublic ? 1 : 0,
            event.id,
          ]
        );
        console.log(`🔄 Updated event ${event.title} in SQLite`);
      } else {
        // Insert new event
        await this.sqliteDb.runAsync(
          `INSERT INTO events (
            id, title, description, date, startTime, endTime, allDay, location, 
            category, color, repeat, status, userId, userDisplayName, userAvatar, 
            userVerified, attendees, attendeeCount, invitedUsers, rsvpYes, rsvpNo, 
            rsvpMaybe, createdAt, updatedAt, isPublic
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            event.id,
            event.title,
            event.description || null,
            event.date,
            event.startTime || null,
            event.endTime || null,
            event.allDay ? 1 : 0,
            event.location || null,
            event.category,
            event.color,
            event.repeat,
            event.status || "upcoming",
            event.userId,
            event.userDisplayName,
            event.userAvatar || null,
            event.userVerified ? 1 : 0,
            JSON.stringify(event.attendees),
            event.attendeeCount,
            JSON.stringify(event.invitedUsers),
            JSON.stringify(event.rsvpYes),
            JSON.stringify(event.rsvpNo),
            JSON.stringify(event.rsvpMaybe),
            event.createdAt,
            event.updatedAt,
            event.isPublic ? 1 : 0,
          ]
        );
        console.log(`➕ Inserted new event ${event.title} into SQLite`);
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating event ${event.title} in SQLite:`,
        error
      );
    }
  }

  // Get events from SQLite
  private static async getEventsFromSQLite(
    limitCount: number = 50,
    category?: string
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (!this.sqliteDb) {
        console.warn(
          "⚠️ SQLite context not available, falling back to Firebase"
        );
        return await this.getAllEventsFromFirebase(limitCount, category);
      }

      console.log("💾 Fetching events from SQLite...");

      let query = "SELECT * FROM events WHERE isPublic = 1";
      let params: any[] = [];

      if (category && category !== "All") {
        query += " AND category = ?";
        params.push(category);
      }

      query += " ORDER BY date ASC LIMIT ?";
      params.push(limitCount);

      const result = await this.sqliteDb.getAllAsync(query, params);

      const events: Event[] = result.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        date: row.date,
        startTime: row.startTime,
        endTime: row.endTime,
        allDay: row.allDay === 1,
        location: row.location,
        category: row.category,
        color: row.color,
        repeat: row.repeat,
        status: row.status,
        userId: row.userId,
        userDisplayName: row.userDisplayName,
        userAvatar: row.userAvatar,
        userVerified: row.userVerified === 1,
        attendees: row.attendees ? JSON.parse(row.attendees) : [],
        attendeeCount: row.attendeeCount,
        invitedUsers: row.invitedUsers ? JSON.parse(row.invitedUsers) : [],
        rsvpYes: row.rsvpYes ? JSON.parse(row.rsvpYes) : [],
        rsvpNo: row.rsvpNo ? JSON.parse(row.rsvpNo) : [],
        rsvpMaybe: row.rsvpMaybe ? JSON.parse(row.rsvpMaybe) : [],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        isPublic: row.isPublic === 1,
      }));

      // Sort events (upcoming first, then by date)
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

      console.log(`💾 SQLite returned ${events.length} events`);
      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching events from SQLite:", error);
      console.log("🔄 Falling back to Firebase...");
      return await this.getAllEventsFromFirebase(limitCount, category);
    }
  }

  // Add this method for Firebase fallback
  private static async getAllEventsFromFirebase(
    limitCount: number = 50,
    category?: string
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      console.log("🔥 Fetching events from Firebase (fallback)...");

      let firebaseQuery = query(
        collection(db, "events"),
        orderBy("date", "asc"),
        limit(limitCount)
      );

      if (category && category !== "All") {
        firebaseQuery = query(
          collection(db, "events"),
          where("category", "==", category),
          orderBy("date", "asc"),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(firebaseQuery);
      const events: Event[] = [];

      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() } as Event);
      });

      console.log(`🔥 Firebase returned ${events.length} events (fallback)`);
      return { events, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching events from Firebase:", error);
      return { events: [], error: error.message };
    }
  }

  // Create event (SQLite first, then Firebase)
  static async createEvent(
    eventData: CreateEventData,
    userId: string,
    userDisplayName: string,
    userAvatar?: string,
    contentType: "events" | "sessions" = "events"
  ): Promise<{ event?: Event; error?: string }> {
    try {
      const now = new Date().toISOString();
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // For one-on-one sessions, ensure privacy
      const isPrivateSession = eventData.category === "One-on-One";

      const newEvent: Event = {
        id: tempId,
        ...eventData,
        userId,
        userDisplayName,
        userAvatar: userAvatar || "",
        userVerified: false,
        attendees: [userId],
        attendeeCount: 1,
        invitedUsers: eventData.invitedUsers || [],
        rsvpYes: [userId],
        rsvpNo: [],
        rsvpMaybe: [],
        status: eventData.status || "upcoming",
        isPublic: !isPrivateSession,
        createdAt: now,
        updatedAt: now,
      };

      // 1. Save to SQLite first (with temp ID)
      if (this.sqliteDb) {
        await this.insertOrUpdateEventInSQLite(newEvent);
        console.log(`💾 Event ${newEvent.title} saved to SQLite with temp ID`);
      }

      // 2. Then save to Firebase
      try {
        const firebaseEvent = { ...newEvent };
        delete (firebaseEvent as any).id; // Remove temp ID for Firebase

        const docRef = await addDoc(collection(db, contentType), firebaseEvent);
        const finalEvent = {
          ...newEvent,
          id: docRef.id,
        };

        // 3. Update SQLite with real Firebase ID
        if (this.sqliteDb) {
          // Delete temp event
          await this.sqliteDb.runAsync("DELETE FROM events WHERE id = ?", [
            tempId,
          ]);
          // Insert with real ID
          await this.insertOrUpdateEventInSQLite(finalEvent);
          console.log(
            `🔥 Event ${finalEvent.title} synced to Firebase and updated in SQLite`
          );
        }

        return { event: finalEvent };
      } catch (firebaseError) {
        console.error(
          "❌ Firebase sync failed, event remains in SQLite only:",
          firebaseError
        );
        // Event is still available locally
        return { event: newEvent };
      }
    } catch (error) {
      console.error(`Error creating ${contentType.slice(0, -1)}:`, error);
      return { error: `Failed to create ${contentType.slice(0, -1)}` };
    }
  }

  // Update getEvents method
  static async getEvents(
    limitCount: number = 50,
    category?: string,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      // First try to sync from Firebase (only new/updated events)
      const syncResult = await this.syncEventsFromFirebase(collectionName);
      if (syncResult.error) {
        console.warn(
          "Sync failed, proceeding with local data:",
          syncResult.error
        );
      }

      // Then return events from SQLite (with Firebase fallback)
      return await this.getEventsFromSQLite(limitCount, category);
    } catch (error: any) {
      console.error("Get all events error:", error);
      // Final fallback to Firebase
      return await this.getAllEventsFromFirebase(limitCount, category);
    }
  }

  // Get single event by ID (tries SQLite first, then Firebase)
  static async getEvent(
    eventId: string,
    collectionName: string = "events"
  ): Promise<{ event: Event | null; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Fetching event ${eventId} from SQLite...`);
        const result = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ?",
          [eventId]
        );

        if (result) {
          const event: Event = {
            id: result.id,
            title: result.title,
            description: result.description,
            date: result.date,
            startTime: result.startTime,
            endTime: result.endTime,
            allDay: result.allDay === 1,
            location: result.location,
            category: result.category,
            color: result.color,
            repeat: result.repeat,
            status: result.status,
            userId: result.userId,
            userDisplayName: result.userDisplayName,
            userAvatar: result.userAvatar,
            userVerified: result.userVerified === 1,
            attendees: result.attendees ? JSON.parse(result.attendees) : [],
            attendeeCount: result.attendeeCount,
            invitedUsers: result.invitedUsers
              ? JSON.parse(result.invitedUsers)
              : [],
            rsvpYes: result.rsvpYes ? JSON.parse(result.rsvpYes) : [],
            rsvpNo: result.rsvpNo ? JSON.parse(result.rsvpNo) : [],
            rsvpMaybe: result.rsvpMaybe ? JSON.parse(result.rsvpMaybe) : [],
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            isPublic: result.isPublic === 1,
          };
          console.log(`💾 Found event ${eventId} in SQLite`);
          return { event, error: null };
        }
      }

      // Fallback to Firebase
      console.log(`🔥 Fetching event ${eventId} from Firebase (fallback)...`);
      const eventDoc = await getDoc(doc(db, collectionName, eventId));

      if (!eventDoc.exists()) {
        return { event: null, error: "Event not found" };
      }

      const event = { id: eventDoc.id, ...eventDoc.data() } as Event;

      // Cache in SQLite for next time
      if (this.sqliteDb) {
        await this.insertOrUpdateEventInSQLite(event);
      }

      console.log(`🔥 Found event ${eventId} in Firebase (cached to SQLite)`);
      return { event, error: null };
    } catch (error: any) {
      console.error("Get event by ID error:", error);
      return { event: null, error: error.message };
    }
  }

  // Update event (SQLite first, then Firebase)
  static async updateEvent(
    eventId: string,
    updateData: Partial<CreateEventData>,
    collectionName: string = "events"
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

      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingEvent = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ?",
          [eventId]
        );

        if (existingEvent) {
          // Build update query dynamically
          const updateFields = Object.keys(cleanUpdateData)
            .map((key) => `${key} = ?`)
            .join(", ");
          const updateValues = Object.values(cleanUpdateData);

          await this.sqliteDb.runAsync(
            `UPDATE events SET ${updateFields} WHERE id = ?`,
            [...updateValues, eventId]
          );
          console.log(`💾 Updated event ${eventId} in SQLite`);
        }
      }

      // 2. Then update Firebase
      try {
        await updateDoc(doc(db, collectionName, eventId), cleanUpdateData);
        console.log(`🔥 Updated event ${eventId} in Firebase`);
      } catch (firebaseError) {
        console.error(
          "❌ Firebase update failed, changes remain in SQLite only:",
          firebaseError
        );
        // Changes are still saved locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Update event error:", error);
      return { error: error.message };
    }
  }

  // Delete event (SQLite first, then Firebase)
  static async deleteEvent(
    eventId: string,
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // 1. Delete from SQLite first
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync("DELETE FROM events WHERE id = ?", [
          eventId,
        ]);
        console.log(`💾 Deleted event ${eventId} from SQLite`);
      }

      // 2. Then delete from Firebase
      try {
        await deleteDoc(doc(db, collectionName, eventId));
        console.log(`🔥 Deleted event ${eventId} from Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase delete failed:", firebaseError);
        // Event is still deleted locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Delete event error:", error);
      return { error: error.message };
    }
  }

  // RSVP to event (SQLite first, then Firebase)
  static async rsvpToEvent(
    eventId: string,
    userId: string,
    response: "yes" | "no" | "maybe",
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingEvent = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ?",
          [eventId]
        );

        if (existingEvent) {
          const attendees = existingEvent.attendees
            ? JSON.parse(existingEvent.attendees)
            : [];
          const rsvpYes = existingEvent.rsvpYes
            ? JSON.parse(existingEvent.rsvpYes)
            : [];
          const rsvpNo = existingEvent.rsvpNo
            ? JSON.parse(existingEvent.rsvpNo)
            : [];
          const rsvpMaybe = existingEvent.rsvpMaybe
            ? JSON.parse(existingEvent.rsvpMaybe)
            : [];

          // Remove user from all RSVP arrays first
          const newRsvpYes = rsvpYes.filter((id: string) => id !== userId);
          const newRsvpNo = rsvpNo.filter((id: string) => id !== userId);
          const newRsvpMaybe = rsvpMaybe.filter((id: string) => id !== userId);
          let newAttendees = attendees.filter((id: string) => id !== userId);
          let newAttendeeCount = newAttendees.length;

          // Add user to appropriate RSVP array
          if (response === "yes") {
            newRsvpYes.push(userId);
            if (!newAttendees.includes(userId)) {
              newAttendees.push(userId);
              newAttendeeCount++;
            }
          } else if (response === "no") {
            newRsvpNo.push(userId);
          } else if (response === "maybe") {
            newRsvpMaybe.push(userId);
          }

          await this.sqliteDb.runAsync(
            `UPDATE events SET 
             attendees = ?, attendeeCount = ?, rsvpYes = ?, rsvpNo = ?, rsvpMaybe = ?, updatedAt = ?
             WHERE id = ?`,
            [
              JSON.stringify(newAttendees),
              newAttendeeCount,
              JSON.stringify(newRsvpYes),
              JSON.stringify(newRsvpNo),
              JSON.stringify(newRsvpMaybe),
              new Date().toISOString(),
              eventId,
            ]
          );
          console.log(`💾 Updated RSVP for event ${eventId} in SQLite`);
        }
      }

      // 2. Then update Firebase
      try {
        const eventRef = doc(db, collectionName, eventId);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          const eventData = eventDoc.data() as Event;

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
          console.log(`🔥 Updated RSVP for event ${eventId} in Firebase`);
        }
      } catch (firebaseError) {
        console.error("❌ Firebase RSVP update failed:", firebaseError);
        // RSVP is still updated locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("RSVP error:", error);
      return { error: error.message };
    }
  }

  // Get user's events (SQLite first)
  static async getUserEvents(
    userId: string,
    limitCount: number = 50
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(`💾 Fetching user events for ${userId} from SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          "SELECT * FROM events WHERE userId = ? ORDER BY date ASC LIMIT ?",
          [userId, limitCount]
        );

        if (result.length > 0) {
          const events: Event[] = result.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            date: row.date,
            startTime: row.startTime,
            endTime: row.endTime,
            allDay: row.allDay === 1,
            location: row.location,
            category: row.category,
            color: row.color,
            repeat: row.repeat,
            status: row.status,
            userId: row.userId,
            userDisplayName: row.userDisplayName,
            userAvatar: row.userAvatar,
            userVerified: row.userVerified === 1,
            attendees: row.attendees ? JSON.parse(row.attendees) : [],
            attendeeCount: row.attendeeCount,
            invitedUsers: row.invitedUsers ? JSON.parse(row.invitedUsers) : [],
            rsvpYes: row.rsvpYes ? JSON.parse(row.rsvpYes) : [],
            rsvpNo: row.rsvpNo ? JSON.parse(row.rsvpNo) : [],
            rsvpMaybe: row.rsvpMaybe ? JSON.parse(row.rsvpMaybe) : [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            isPublic: row.isPublic === 1,
          }));
          console.log(`💾 Found ${events.length} user events in SQLite`);
          return { events, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Fetching user events for ${userId} from Firebase (fallback)...`
      );
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

      // Cache in SQLite
      if (this.sqliteDb && events.length > 0) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event);
        }
      }

      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      console.log(`🔥 Found ${events.length} user events in Firebase`);
      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("Get user events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Get events user is attending (SQLite first)
  static async getAttendingEvents(
    userId: string,
    limitCount: number = 50
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(
          `💾 Fetching attending events for ${userId} from SQLite...`
        );
        // SQLite doesn't have array-contains, so we use LIKE with JSON search
        const result = await this.sqliteDb.getAllAsync(
          `SELECT * FROM events WHERE attendees LIKE ? ORDER BY date ASC LIMIT ?`,
          [`%"${userId}"%`, limitCount]
        );

        if (result.length > 0) {
          // Filter to ensure exact match (not partial string match)
          const filteredEvents = result.filter((row: any) => {
            const attendees = row.attendees ? JSON.parse(row.attendees) : [];
            return attendees.includes(userId);
          });

          const events: Event[] = filteredEvents.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            date: row.date,
            startTime: row.startTime,
            endTime: row.endTime,
            allDay: row.allDay === 1,
            location: row.location,
            category: row.category,
            color: row.color,
            repeat: row.repeat,
            status: row.status,
            userId: row.userId,
            userDisplayName: row.userDisplayName,
            userAvatar: row.userAvatar,
            userVerified: row.userVerified === 1,
            attendees: row.attendees ? JSON.parse(row.attendees) : [],
            attendeeCount: row.attendeeCount,
            invitedUsers: row.invitedUsers ? JSON.parse(row.invitedUsers) : [],
            rsvpYes: row.rsvpYes ? JSON.parse(row.rsvpYes) : [],
            rsvpNo: row.rsvpNo ? JSON.parse(row.rsvpNo) : [],
            rsvpMaybe: row.rsvpMaybe ? JSON.parse(row.rsvpMaybe) : [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            isPublic: row.isPublic === 1,
          }));
          console.log(`💾 Found ${events.length} attending events in SQLite`);
          return { events, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Fetching attending events for ${userId} from Firebase (fallback)...`
      );
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

      // Cache in SQLite
      if (this.sqliteDb && events.length > 0) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event);
        }
      }

      const sortedEvents = events.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      console.log(`🔥 Found ${events.length} attending events in Firebase`);
      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("Get attending events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Search events (SQLite first)
  static async searchEvents(
    searchQuery: string,
    limitCount: number = 20
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(`💾 Searching events for '${searchQuery}' in SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          `SELECT * FROM events 
           WHERE (title LIKE ? OR description LIKE ? OR location LIKE ? OR category LIKE ?) 
           AND isPublic = 1 
           ORDER BY date ASC LIMIT ?`,
          [
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            limitCount,
          ]
        );

        if (result.length > 0) {
          const events: Event[] = result.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            date: row.date,
            startTime: row.startTime,
            endTime: row.endTime,
            allDay: row.allDay === 1,
            location: row.location,
            category: row.category,
            color: row.color,
            repeat: row.repeat,
            status: row.status,
            userId: row.userId,
            userDisplayName: row.userDisplayName,
            userAvatar: row.userAvatar,
            userVerified: row.userVerified === 1,
            attendees: row.attendees ? JSON.parse(row.attendees) : [],
            attendeeCount: row.attendeeCount,
            invitedUsers: row.invitedUsers ? JSON.parse(row.invitedUsers) : [],
            rsvpYes: row.rsvpYes ? JSON.parse(row.rsvpYes) : [],
            rsvpNo: row.rsvpNo ? JSON.parse(row.rsvpNo) : [],
            rsvpMaybe: row.rsvpMaybe ? JSON.parse(row.rsvpMaybe) : [],
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            isPublic: row.isPublic === 1,
          }));
          console.log(`💾 Found ${events.length} events in SQLite search`);
          return { events, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Searching events for '${searchQuery}' in Firebase (fallback)...`
      );
      const q = query(collection(db, "events"), limit(limitCount * 3));

      const querySnapshot = await getDocs(q);
      const allEvents: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];

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

      filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

      console.log(
        `🔥 Found ${filteredEvents.length} events in Firebase search`
      );
      return { events: filteredEvents, error: null };
    } catch (error: any) {
      console.error("Search events error:", error);
      return { events: [], error: error.message };
    }
  }

  // Auto-complete past events
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
