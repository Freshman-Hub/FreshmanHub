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
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";
import { Event, CreateEventData } from "@/types/event.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getSyncKey = (collectionName: string) => `lastSync_${collectionName}`;

export class EventsService {
  private static sqliteDb: any = null;

  // TODO: Change this to 30 days (30 * 24 * 60 * 60 * 1000) for production
  private static readonly PERMANENT_DELETE_DELAY = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Initialize SQLite context (call this from your component that has access to useSQLiteContext)
  static setSQLiteContext(db: any) {
    this.sqliteDb = db;
  }

  // Add timestamp conversion helper
  private static convertTimestampToISO(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();

    try {
      // If it's a Firestore Timestamp with seconds and nanoseconds
      if (typeof timestamp === "object" && timestamp.seconds !== undefined) {
        const milliseconds =
          timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
        return new Date(milliseconds).toISOString();
      }
      // If it's already an ISO string
      else if (typeof timestamp === "string") {
        return timestamp;
      }
      // If it's a JavaScript Date
      else if (timestamp instanceof Date) {
        return timestamp.toISOString();
      }
      // If it has a toDate method (Firestore Timestamp)
      else if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
      }

      return new Date().toISOString(); // fallback
    } catch (error) {
      console.warn("Error converting timestamp:", error);
      return new Date().toISOString();
    }
  }

  // Get last sync timestamp from AsyncStorage
  private static async getLastSyncTime(
    collectionName: string
  ): Promise<string | null> {
    try {
      const key = getSyncKey(collectionName);
      const value = await AsyncStorage.getItem(key);
      console.log(
        `📅 Last sync time for ${collectionName}:`,
        value || "First time sync"
      );
      return value;
    } catch (error) {
      console.error("Error getting last sync time:", error);
      return null;
    }
  }

  // Update last sync timestamp
  private static async updateLastSyncTime(
    collectionName: string,
    timestamp: string
  ): Promise<void> {
    try {
      const key = getSyncKey(collectionName);
      await AsyncStorage.setItem(key, timestamp);
      console.log(
        `✅ Updated last sync time for ${collectionName} to:`,
        timestamp
      );
    } catch (error) {
      console.error("Error updating last sync time:", error);
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

      const lastSync = await this.getLastSyncTime(collectionName);
      let firebaseQuery;

      if (lastSync) {
        console.log("📥 Fetching events updated after:", lastSync);
        const lastSyncTimestamp = Timestamp.fromDate(new Date(lastSync));
        firebaseQuery = query(
          collection(db, collectionName),
          where("updatedAt", ">", lastSyncTimestamp),
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
        events.push({
          id: doc.id,
          ...doc.data(),
          sourceCollection: collectionName,
        } as Event);
      });

      console.log(`🔥 Firebase returned ${events.length} events`);

      // Insert/update events in SQLite
      if (events.length > 0 && this.sqliteDb) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event, collectionName);
        }

        // Update last sync time with the latest event's updatedAt
        const latestEvent = events[events.length - 1];
        if (latestEvent.updatedAt) {
          const syncTime =
            latestEvent.updatedAt instanceof Timestamp
              ? latestEvent.updatedAt.toDate().toISOString()
              : String(latestEvent.updatedAt);
          await this.updateLastSyncTime(collectionName, syncTime);
        }
      }

      return { events, error: null };
    } catch (error: any) {
      console.error("❌ Error syncing events from Firebase:", error);
      return { events: [], error: error.message };
    }
  }

  // Fix the insertOrUpdateEventInSQLite method
  private static async insertOrUpdateEventInSQLite(
    event: Event,
    sourceCollection: string = "events"
  ): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Convert Firestore Timestamps to ISO strings before storing
      const convertedEvent = {
        ...event,
        createdAt: this.convertTimestampToISO(event.createdAt),
        updatedAt: this.convertTimestampToISO(event.updatedAt),
        deletedAt: event.deletedAt
          ? this.convertTimestampToISO(event.deletedAt)
          : null,
      };

      // Check if event exists
      const existingEvent = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM events WHERE id = ?",
        [event.id]
      );

      if (existingEvent) {
        // Update existing event - Fixed: removed deletedBy
        await this.sqliteDb.runAsync(
          `UPDATE events SET 
         title = ?, description = ?, date = ?, startTime = ?, endTime = ?, 
         allDay = ?, location = ?, category = ?, sourceCollection = ?, color = ?, repeat = ?, 
         status = ?, userDisplayName = ?, userAvatar = ?, userVerified = ?, 
         attendees = ?, attendeeCount = ?, invitedUsers = ?, rsvpYes = ?, 
         rsvpNo = ?, rsvpMaybe = ?, updatedAt = ?, isPublic = ?, 
         isDeleted = ?, deletedAt = ?
         WHERE id = ?`,
          [
            convertedEvent.title,
            convertedEvent.description || null,
            convertedEvent.date,
            convertedEvent.startTime || null,
            convertedEvent.endTime || null,
            convertedEvent.allDay ? 1 : 0,
            convertedEvent.location || null,
            convertedEvent.category,
            sourceCollection,
            convertedEvent.color,
            convertedEvent.repeat,
            convertedEvent.status || "upcoming",
            convertedEvent.userDisplayName,
            convertedEvent.userAvatar || null,
            convertedEvent.userVerified ? 1 : 0,
            JSON.stringify(convertedEvent.attendees),
            convertedEvent.attendeeCount,
            JSON.stringify(convertedEvent.invitedUsers),
            JSON.stringify(convertedEvent.rsvpYes),
            JSON.stringify(convertedEvent.rsvpNo),
            JSON.stringify(convertedEvent.rsvpMaybe),
            convertedEvent.updatedAt,
            convertedEvent.isPublic ? 1 : 0,
            convertedEvent.isDeleted ? 1 : 0,
            convertedEvent.deletedAt,
            convertedEvent.id,
          ]
        );
        console.log(`🔄 Updated event ${convertedEvent.title} in SQLite`);
      } else {
        // Insert new event - Fixed: removed deletedBy from both columns and values
        await this.sqliteDb.runAsync(
          `INSERT OR REPLACE INTO events (
          id, title, description, date, startTime, endTime, allDay, location, 
          category, sourceCollection, color, repeat, status, userId, userDisplayName, userAvatar, 
          userVerified, attendees, attendeeCount, invitedUsers, rsvpYes, rsvpNo, 
          rsvpMaybe, createdAt, updatedAt, isPublic, isDeleted, deletedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            convertedEvent.id,
            convertedEvent.title,
            convertedEvent.description || null,
            convertedEvent.date,
            convertedEvent.startTime || null,
            convertedEvent.endTime || null,
            convertedEvent.allDay ? 1 : 0,
            convertedEvent.location || null,
            convertedEvent.category,
            sourceCollection,
            convertedEvent.color,
            convertedEvent.repeat,
            convertedEvent.status || "upcoming",
            convertedEvent.userId,
            convertedEvent.userDisplayName,
            convertedEvent.userAvatar || null,
            convertedEvent.userVerified ? 1 : 0,
            JSON.stringify(convertedEvent.attendees),
            convertedEvent.attendeeCount,
            JSON.stringify(convertedEvent.invitedUsers),
            JSON.stringify(convertedEvent.rsvpYes),
            JSON.stringify(convertedEvent.rsvpNo),
            JSON.stringify(convertedEvent.rsvpMaybe),
            convertedEvent.createdAt,
            convertedEvent.updatedAt,
            convertedEvent.isPublic ? 1 : 0,
            convertedEvent.isDeleted ? 1 : 0,
            convertedEvent.deletedAt,
          ]
        );
        console.log(
          `➕ Inserted new event ${convertedEvent.title} into SQLite`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating event ${event.title} in SQLite:`,
        error
      );
    }
  }

  // Get events from SQLite - Exclude soft deleted events
  private static async getEventsFromSQLite(
    limitCount: number = 50,
    category?: string,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (!this.sqliteDb) {
        console.warn(
          "⚠️ SQLite context not available, falling back to Firebase"
        );
        return await this.getAllEventsFromFirebase(limitCount, category);
      }

      console.log("💾 Fetching events from SQLite...");

      let query = "SELECT * FROM events";
      let params: any[] = [];
      let conditions: string[] = [];

      // Filter by sourceCollection
      conditions.push("sourceCollection = ?");
      params.push(collectionName);

      // Exclude soft deleted events
      conditions.push("(isDeleted IS NULL OR isDeleted = 0)");

      if (category && category !== "All") {
        conditions.push("category = ?");
        params.push(category);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
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
        sourceCollection: row.sourceCollection || "events",
        isDeleted: row.isDeleted === 1,
        deletedAt: row.deletedAt,
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

      console.log(`💾 SQLite returned ${events.length} ## ${collectionName}`);
      return { events: sortedEvents, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching events from SQLite:", error);
      console.log("🔄 Falling back to Firebase...");
      return await this.getAllEventsFromFirebase(limitCount, category);
    }
  }

  // Firebase fallback - Exclude soft deleted events
  private static async getAllEventsFromFirebase(
    limitCount: number = 50,
    category?: string
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      console.log("🔥 Fetching events from Firebase (fallback)...");

      let firebaseQuery;

      if (category && category !== "All") {
        firebaseQuery = query(
          collection(db, "events"),
          where("category", "==", category),
          where("isDeleted", "!=", true),
          orderBy("isDeleted"),
          orderBy("date", "asc"),
          limit(limitCount)
        );
      } else {
        firebaseQuery = query(
          collection(db, "events"),
          where("isDeleted", "!=", true),
          orderBy("isDeleted"),
          orderBy("date", "asc"),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(firebaseQuery);
      const events: Event[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.isDeleted) {
          events.push({
            id: doc.id,
            ...data,
            sourceCollection: "events",
          } as Event);
        }
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
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        sourceCollection: contentType,
        isDeleted: false,
        deletedAt: null,
      };

      // 1. Save to SQLite first (with temp ID and converted timestamps)
      if (this.sqliteDb) {
        // For SQLite, we need ISO strings, so convert the serverTimestamp to current time
        const localEvent = {
          ...newEvent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await this.insertOrUpdateEventInSQLite(localEvent as any, contentType);
        console.log(`💾 Event ${newEvent.title} saved to SQLite with temp ID`);
      }

      // 2. Then save to Firebase (with serverTimestamp)
      try {
        const firebaseEvent = {
          ...newEvent,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          isDeleted: false,
          deletedAt: null,
        };
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
          // Insert with real ID (keep local ISO timestamps for SQLite)
          const localFinalEvent = {
            ...finalEvent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await this.insertOrUpdateEventInSQLite(
            localFinalEvent as any,
            contentType
          );
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
      return await this.getEventsFromSQLite(
        limitCount,
        category,
        collectionName
      );
    } catch (error: any) {
      console.error("Get all events error:", error);
      // Final fallback to Firebase
      return await this.getAllEventsFromFirebase(limitCount, category);
    }
  }

  // Get single event by ID (tries SQLite first, then Firebase) - Exclude soft deleted
  static async getEvent(
    eventId: string,
    collectionName: string = "events"
  ): Promise<{ event: Event | null; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Fetching event ${eventId} from SQLite...`);
        const result = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ? AND sourceCollection = ? AND (isDeleted IS NULL OR isDeleted = 0)",
          [eventId, collectionName]
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
            sourceCollection: result.sourceCollection || "events",
            isDeleted: result.isDeleted === 1,
            deletedAt: result.deletedAt,
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

      const eventData = eventDoc.data();
      if (eventData.isDeleted) {
        return { event: null, error: "Event not found" };
      }

      const event = {
        id: eventDoc.id,
        ...eventData,
        sourceCollection: collectionName,
      } as Event;

      // Cache in SQLite for next time
      if (this.sqliteDb) {
        await this.insertOrUpdateEventInSQLite(event, collectionName);
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
        updatedAt: serverTimestamp(),
      };

      Object.keys(cleanUpdateData).forEach((key) => {
        if (cleanUpdateData[key] === undefined) {
          delete cleanUpdateData[key];
        }
      });

      // 1. Update SQLite first
      if (this.sqliteDb) {
        const existingEvent = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ? AND sourceCollection = ?",
          [eventId, collectionName]
        );

        if (existingEvent) {
          // For SQLite, convert serverTimestamp to ISO string
          const sqliteUpdateData = {
            ...cleanUpdateData,
            updatedAt: new Date().toISOString(),
          };

          // Build update query dynamically
          const updateFields = Object.keys(sqliteUpdateData)
            .map((key) => `${key} = ?`)
            .join(", ");
          const updateValues = Object.values(sqliteUpdateData);

          await this.sqliteDb.runAsync(
            `UPDATE events SET ${updateFields} WHERE id = ? AND sourceCollection = ?`,
            [...updateValues, eventId, collectionName]
          );
          console.log(`💾 Updated event ${eventId} in SQLite`);
        }
      }

      // 2. Then update Firebase (with serverTimestamp)
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

  // Fix deleteEvent method - add userId parameter and remove deletedBy references
  static async deleteEvent(
    eventId: string,
    userId: string, // ✅ Add userId parameter for permission check
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // Optional: Check if user owns the event
      const { event, error } = await this.getEvent(eventId, collectionName);
      if (error || !event) {
        return { error: "Event not found" };
      }
      if (event.userId !== userId) {
        return { error: "You don't have permission to delete this event" };
      }

      const now = new Date().toISOString();

      // 1. Soft delete in SQLite first - Fixed: removed deletedBy
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          `UPDATE events SET 
         isDeleted = 1, 
         deletedAt = ?, 
         updatedAt = ?
         WHERE id = ? AND sourceCollection = ?`,
          [now, now, eventId, collectionName] // ✅ Removed deletedBy parameter
        );
        console.log(`💾 Soft deleted event ${eventId} from SQLite`);
      }

      // 2. Then soft delete in Firebase - Fixed: removed deletedBy
      try {
        await updateDoc(doc(db, collectionName, eventId), {
          isDeleted: true,
          deletedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // ✅ Removed deletedBy field
        });
        console.log(`🔥 Soft deleted event ${eventId} from Firebase`);

        // 3. Schedule permanent deletion
        this.schedulePermanentDeletion(eventId, collectionName);
      } catch (firebaseError) {
        console.error("❌ Firebase soft delete failed:", firebaseError);
        // Event is still soft deleted locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Delete event error:", error);
      return { error: error.message };
    }
  }

  // Schedule permanent deletion after delay
  private static schedulePermanentDeletion(
    eventId: string,
    collectionName: string
  ): void {
    console.log(
      `⏰ Scheduling permanent deletion of event ${eventId} in ${this.PERMANENT_DELETE_DELAY / 1000} seconds`
    );

    setTimeout(async () => {
      try {
        // Check if the event is still soft deleted (not restored)
        const eventDoc = await getDoc(doc(db, collectionName, eventId));

        if (eventDoc.exists() && eventDoc.data().isDeleted) {
          // Permanently delete from Firebase
          await deleteDoc(doc(db, collectionName, eventId));
          console.log(`🗑️ Permanently deleted event ${eventId} from Firebase`);

          // Permanently delete from SQLite
          if (this.sqliteDb) {
            await this.sqliteDb.runAsync(
              "DELETE FROM events WHERE id = ? AND sourceCollection = ?",
              [eventId, collectionName]
            );
            console.log(`🗑️ Permanently deleted event ${eventId} from SQLite`);
          }
        } else {
          console.log(
            `✅ Event ${eventId} was restored, canceling permanent deletion`
          );
        }
      } catch (error) {
        console.error(`❌ Error permanently deleting event ${eventId}:`, error);
      }
    }, this.PERMANENT_DELETE_DELAY);
  }

  // Restore soft deleted event
  static async restoreEvent(
    eventId: string,
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // 1. Restore in SQLite first
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          `UPDATE events SET 
           isDeleted = 0, 
           deletedAt = NULL, 
           updatedAt = ?
           WHERE id = ? AND sourceCollection = ?`,
          [new Date().toISOString(), eventId, collectionName]
        );
        console.log(`💾 Restored event ${eventId} in SQLite`);
      }

      // 2. Then restore in Firebase
      try {
        await updateDoc(doc(db, collectionName, eventId), {
          isDeleted: false,
          deletedAt: null,
          updatedAt: serverTimestamp(),
        });
        console.log(`🔥 Restored event ${eventId} in Firebase`);
      } catch (firebaseError) {
        console.error("❌ Firebase restore failed:", firebaseError);
        // Event is still restored locally
      }

      return { error: null };
    } catch (error: any) {
      console.error("Restore event error:", error);
      return { error: error.message };
    }
  }

  // Update removeEventFromUser method to be local-only
  static async removeEventFromUser(
    eventId: string,
    userId: string,
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // Skip Firebase completely - this is a local-only operation
      console.log(`🗑️ Removing event ${eventId} locally for user ${userId}`);

      // Only remove event from SQLite for this user's device
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          "DELETE FROM events WHERE id = ? AND sourceCollection = ?",
          [eventId, collectionName]
        );
        console.log(
          `🗑️ Completely removed event ${eventId} from SQLite (local removal only)`
        );
      } else {
        return { error: "Local database not available" };
      }

      return { error: null };
    } catch (error: any) {
      console.error("Remove event from user error:", error);
      return { error: error.message };
    }
  }

  // Fix permanent delete method to check deleted events
  static async permanentlyDeleteEvent(
    eventId: string,
    userId: string,
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      // Check if event exists in SQLite (including deleted events)
      let eventExists = false;
      let isOwner = false;

      if (this.sqliteDb) {
        const result = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM events WHERE id = ? AND sourceCollection = ?",
          [eventId, collectionName]
        );

        if (result) {
          eventExists = true;
          isOwner = result.userId === userId;
          console.log(`💾 Found event ${eventId} in SQLite, owner: ${isOwner}`);
        }
      }

      // If not found in SQLite, check Firebase
      if (!eventExists) {
        try {
          const eventDoc = await getDoc(doc(db, collectionName, eventId));
          if (eventDoc.exists()) {
            eventExists = true;
            isOwner = eventDoc.data().userId === userId;
            console.log(
              `🔥 Found event ${eventId} in Firebase, owner: ${isOwner}`
            );
          }
        } catch {
          console.log(`⚠️ Event ${eventId} not found in Firebase either`);
        }
      }

      if (!eventExists) {
        return { error: "Event not found" };
      }

      if (!isOwner) {
        return {
          error: "You don't have permission to permanently delete this event",
        };
      }

      // 1. Permanently delete from Firebase (if it exists there)
      try {
        await deleteDoc(doc(db, collectionName, eventId));
        console.log(`🗑️ Permanently deleted event ${eventId} from Firebase`);
      } catch {
        console.log(`⚠️ Event ${eventId} was already deleted from Firebase`);
        // Continue with SQLite deletion
      }

      // 2. Permanently delete from SQLite
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          "DELETE FROM events WHERE id = ? AND sourceCollection = ?",
          [eventId, collectionName]
        );
        console.log(`🗑️ Permanently deleted event ${eventId} from SQLite`);
      }

      return { error: null };
    } catch (error: any) {
      console.error("Permanent delete event error:", error);
      return { error: error.message };
    }
  }

  // Get soft deleted events (for potential restoration)
  static async getDeletedEvents(
    limitCount: number = 50,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log("💾 Fetching soft deleted events from SQLite...");
        const result = await this.sqliteDb.getAllAsync(
          "SELECT * FROM events WHERE isDeleted = 1 AND sourceCollection = ? ORDER BY deletedAt DESC LIMIT ?",
          [collectionName, limitCount]
        );

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
          sourceCollection: row.sourceCollection || "events",
          isDeleted: row.isDeleted === 1,
          deletedAt: row.deletedAt,
        }));

        console.log(`💾 Found ${events.length} soft deleted events in SQLite`);
        return { events, error: null };
      }

      // Fallback to Firebase
      console.log(
        "🔥 Fetching soft deleted events from Firebase (fallback)..."
      );
      const q = query(
        collection(db, collectionName),
        where("isDeleted", "==", true),
        orderBy("deletedAt", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sourceCollection: collectionName,
      })) as Event[];

      console.log(`🔥 Found ${events.length} soft deleted events in Firebase`);
      return { events, error: null };
    } catch (error: any) {
      console.error("Get deleted events error:", error);
      return { events: [], error: error.message };
    }
  }

  // RSVP to event (SQLite first, then Firebase) - Only for non-deleted events
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
          "SELECT * FROM events WHERE id = ? AND sourceCollection = ? AND (isDeleted IS NULL OR isDeleted = 0)",
          [eventId, collectionName]
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
             WHERE id = ? AND sourceCollection = ?`,
            [
              JSON.stringify(newAttendees),
              newAttendeeCount,
              JSON.stringify(newRsvpYes),
              JSON.stringify(newRsvpNo),
              JSON.stringify(newRsvpMaybe),
              new Date().toISOString(),
              eventId,
              collectionName,
            ]
          );
          console.log(`💾 Updated RSVP for event ${eventId} in SQLite`);
        } else {
          return { error: "Event not found or has been deleted" };
        }
      }

      // 2. Then update Firebase
      try {
        const eventRef = doc(db, collectionName, eventId);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists() && !eventDoc.data().isDeleted) {
          const eventData = eventDoc.data() as Event;

          const updates: any = {
            rsvpYes: arrayRemove(userId),
            rsvpNo: arrayRemove(userId),
            rsvpMaybe: arrayRemove(userId),
            updatedAt: serverTimestamp(),
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
        } else {
          return { error: "Event not found or has been deleted" };
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

  // Get user's events (SQLite first) - Exclude soft deleted
  static async getUserEvents(
    userId: string,
    limitCount: number = 50,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(`💾 Fetching user events for ${userId} from SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          "SELECT * FROM events WHERE userId = ? AND sourceCollection = ? AND (isDeleted IS NULL OR isDeleted = 0) ORDER BY date ASC LIMIT ?",
          [userId, collectionName, limitCount]
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
            sourceCollection: row.sourceCollection || "events",
            isDeleted: row.isDeleted === 1,
            deletedAt: row.deletedAt,
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
        where("isDeleted", "!=", true),
        orderBy("isDeleted"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sourceCollection: "events",
      })) as Event[];

      // Cache in SQLite
      if (this.sqliteDb && events.length > 0) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event, "events");
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

  // Get events user is attending (SQLite first) - Exclude soft deleted
  static async getAttendingEvents(
    userId: string,
    limitCount: number = 50,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(
          `💾 Fetching attending events for ${userId} from SQLite...`
        );
        const result = await this.sqliteDb.getAllAsync(
          `SELECT * FROM events WHERE attendees LIKE ? AND sourceCollection = ? AND (isDeleted IS NULL OR isDeleted = 0) ORDER BY date ASC LIMIT ?`,
          [`%"${userId}"%`, collectionName, limitCount]
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
            sourceCollection: row.sourceCollection || "events",
            isDeleted: row.isDeleted === 1,
            deletedAt: row.deletedAt,
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
        where("isDeleted", "!=", true),
        orderBy("isDeleted"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const events: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sourceCollection: "events",
      })) as Event[];

      // Cache in SQLite
      if (this.sqliteDb && events.length > 0) {
        for (const event of events) {
          await this.insertOrUpdateEventInSQLite(event, "events");
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

  // Search events (SQLite first) - Exclude soft deleted
  static async searchEvents(
    searchQuery: string,
    limitCount: number = 20,
    collectionName: string = "events"
  ): Promise<{ events: Event[]; error: string | null }> {
    try {
      if (this.sqliteDb) {
        console.log(`💾 Searching events for '${searchQuery}' in SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          `SELECT * FROM events 
           WHERE (title LIKE ? OR description LIKE ? OR location LIKE ? OR category LIKE ?) 
           AND sourceCollection = ? 
           AND (isDeleted IS NULL OR isDeleted = 0)
           ORDER BY date ASC LIMIT ?`,
          [
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            `%${searchQuery}%`,
            collectionName,
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
            sourceCollection: row.sourceCollection || "events",
            isDeleted: row.isDeleted === 1,
            deletedAt: row.deletedAt,
          }));
          console.log(`💾 Found ${events.length} events in SQLite search`);
          return { events, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Searching events for '${searchQuery}' in Firebase (fallback)...`
      );
      const q = query(
        collection(db, "events"),
        where("isDeleted", "!=", true),
        orderBy("isDeleted"),
        limit(limitCount * 3)
      );

      const querySnapshot = await getDocs(q);
      const allEvents: Event[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sourceCollection: "events",
      })) as Event[];

      const filteredEvents = allEvents
        .filter(
          (event) =>
            !event.isDeleted &&
            (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              event.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              event.location
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              event.category.toLowerCase().includes(searchQuery.toLowerCase()))
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

  // Auto-complete past events - Exclude soft deleted
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
        return (
          eventDate < now && event.status === "upcoming" && !event.isDeleted
        );
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

  // Clean up old soft deleted events (manual cleanup)
  static async cleanupOldDeletedEvents(
    olderThanDays: number = 30,
    collectionName: string = "events"
  ): Promise<{ deleted: number; error?: string }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      const cutoffISO = cutoffDate.toISOString();

      let deletedCount = 0;

      // Clean up from SQLite
      if (this.sqliteDb) {
        const oldDeletedEvents = await this.sqliteDb.getAllAsync(
          "SELECT id FROM events WHERE isDeleted = 1 AND deletedAt < ? AND sourceCollection = ?",
          [cutoffISO, collectionName]
        );

        for (const event of oldDeletedEvents) {
          await this.sqliteDb.runAsync(
            "DELETE FROM events WHERE id = ? AND sourceCollection = ?",
            [event.id, collectionName]
          );
          deletedCount++;
        }
        console.log(
          `🗑️ Permanently deleted ${deletedCount} old events from SQLite`
        );
      }

      // Clean up from Firebase
      const q = query(
        collection(db, collectionName),
        where("isDeleted", "==", true),
        where("deletedAt", "<", Timestamp.fromDate(cutoffDate))
      );

      const querySnapshot = await getDocs(q);

      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnapshot.id));
      }

      console.log(
        `🗑️ Permanently deleted ${querySnapshot.size} old events from Firebase`
      );

      return { deleted: Math.max(deletedCount, querySnapshot.size) };
    } catch (error: any) {
      console.error("Error cleaning up old deleted events:", error);
      return { deleted: 0, error: error.message };
    }
  }
}
