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

export interface ContentItem {
  id: string;
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

  // Creator info
  userId: string;
  userDisplayName: string;
  userAvatar?: string;
  userVerified?: boolean;

  // Content stats
  attendees: string[];
  attendeeCount: number;
  invitedUsers: string[]

  // RSVP responses
  rsvpYes: string[];
  rsvpNo: string[];
  rsvpMaybe: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  contentType: "event" | "session";
  status?: "upcoming" | "completed" | "cancelled"; // For sessions
}

export interface CreateContentData {
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
  contentType: "event" | "session";
  status?: "upcoming" | "completed" | "cancelled";
  invitedUsers?: string[];
}

export class ContentService {
  // Create content (event or session)
  static async createContent(
    contentData: CreateContentData,
    userId: string,
    userDisplayName: string,
    userAvatar?: string,
    collectionName: string = "events"
  ): Promise<{ content: ContentItem | null; error: string | null }> {
    try {
      const now = new Date().toISOString();

      const newContent = {
        ...contentData,
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
        status: contentData.status || "upcoming",
      };

      const docRef = await addDoc(collection(db, collectionName), newContent);

      const content: ContentItem = {
        id: docRef.id,
        ...newContent,
        invitedUsers: []
      };

      return { content, error: null };
    } catch (error: any) {
      console.error("Create content error:", error);
      return { content: null, error: error.message };
    }
  }

  // Get content with filtering
  // Get content with filtering
  static async getContent(
    contentType: "event" | "session",
    limitCount: number = 50,
    category?: string,
    status?: string,
    collectionName: string = "events"
  ): Promise<{ content: ContentItem[]; error: string | null }> {
    try {
      let queryConstraints: any[] = [
        where("contentType", "==", contentType),
        limit(limitCount),
      ];

      // Only add category filter if it's provided and not "All"
      if (category && category !== "All") {
        queryConstraints.push(where("category", "==", category));
      }

      // Only add status filter if it's provided and not "All"
      if (status && status !== "All") {
        queryConstraints.push(where("status", "==", status));
      }

      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const content: ContentItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContentItem[];

      // Sort by date on client side
      const sortedContent = content.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const now = new Date();

        // Show upcoming first, then past
        const isAUpcoming = dateA >= now;
        const isBUpcoming = dateB >= now;

        if (isAUpcoming && !isBUpcoming) return -1;
        if (!isAUpcoming && isBUpcoming) return 1;

        return dateA.getTime() - dateB.getTime();
      });

      return { content: sortedContent, error: null };
    } catch (error: any) {
      console.error("Get content error:", error);
      return { content: [], error: error.message };
    }
  }

  // Update content
  static async updateContent(
    contentId: string,
    updateData: Partial<CreateContentData>,
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

      await updateDoc(doc(db, collectionName, contentId), cleanUpdateData);
      return { error: null };
    } catch (error: any) {
      console.error("Update content error:", error);
      return { error: error.message };
    }
  }

  // Delete content
  static async deleteContent(
    contentId: string,
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, collectionName, contentId));
      return { error: null };
    } catch (error: any) {
      console.error("Delete content error:", error);
      return { error: error.message };
    }
  }

  // RSVP to content
  static async rsvpToContent(
    contentId: string,
    userId: string,
    response: "yes" | "no" | "maybe",
    collectionName: string = "events"
  ): Promise<{ error: string | null }> {
    try {
      const contentRef = doc(db, collectionName, contentId);
      const contentDoc = await getDoc(contentRef);

      if (!contentDoc.exists()) {
        return { error: "Content not found" };
      }

      const contentData = contentDoc.data() as ContentItem;

      const updates: any = {
        rsvpYes: arrayRemove(userId),
        rsvpNo: arrayRemove(userId),
        rsvpMaybe: arrayRemove(userId),
        updatedAt: new Date().toISOString(),
      };

      if (response === "yes") {
        updates.rsvpYes = arrayUnion(userId);
        if (!contentData.attendees?.includes(userId)) {
          updates.attendees = arrayUnion(userId);
          updates.attendeeCount = increment(1);
        }
      } else if (response === "no") {
        updates.rsvpNo = arrayUnion(userId);
        if (contentData.attendees?.includes(userId)) {
          updates.attendees = arrayRemove(userId);
          updates.attendeeCount = increment(-1);
        }
      } else if (response === "maybe") {
        updates.rsvpMaybe = arrayUnion(userId);
        if (contentData.attendees?.includes(userId)) {
          updates.attendees = arrayRemove(userId);
          updates.attendeeCount = increment(-1);
        }
      }

      await updateDoc(contentRef, updates);
      return { error: null };
    } catch (error: any) {
      console.error("RSVP error:", error);
      return { error: error.message };
    }
  }
}
