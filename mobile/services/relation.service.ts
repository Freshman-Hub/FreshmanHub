import { db } from "@/firebase/config/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import type {
  UserRelationship,
  RelationshipType,
  RelationshipStatus,
} from "../types/relation.types";

// Only allow queries that the current user can read according to Firestore rules
const RELATION_COLLECTION = "relationships";

export class RelationService {
  // Add a relationship (friend, block, remove)
  static async addRelationship(
    userId: string,
    targetId: string,
    type: RelationshipType,
    status: RelationshipStatus = "pending",
    metadata: Partial<UserRelationship> = {}
  ): Promise<{ id: string | null; error: string | null }> {
    try {
      const relationship: Omit<UserRelationship, "id"> = {
        userId,
        targetId,
        type,
        status,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        ...metadata,
      };
      const docRef = await addDoc(
        collection(db, RELATION_COLLECTION),
        relationship
      );
      return { id: docRef.id, error: null };
    } catch (error: any) {
      console.error("Error adding relationship:", error);
      return { id: null, error: error.message };
    }
  }

  // Update relationship status/type
  static async updateRelationship(
    relationshipId: string,
    updates: Partial<UserRelationship>
  ): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, RELATION_COLLECTION, relationshipId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      return { error: null };
    } catch (error: any) {
      console.error("Error updating relationship:", error);
      return { error: error.message };
    }
  }

  // Remove relationship
  static async removeRelationship(
    relationshipId: string
  ): Promise<{ error: string | null }> {
    try {
      await deleteDoc(doc(db, RELATION_COLLECTION, relationshipId));
      return { error: null };
    } catch (error: any) {
      console.error("Error removing relationship:", error);
      return { error: error.message };
    }
  }

  // Get all relationships for the current user (only userId or targetId == currentUserId)
  static async getRelationshipsForUser(
    currentUserId: string,
    type?: RelationshipType,
    status?: RelationshipStatus
  ): Promise<{ relationships: UserRelationship[]; error: string | null }> {
    try {
      // Query for relationships where currentUserId is either userId or targetId
      let queries: Promise<DocumentData[]>[] = [];
      let baseQuery = (field: "userId" | "targetId") => {
        let q = query(
          collection(db, RELATION_COLLECTION),
          where(field, "==", currentUserId)
        );
        if (type) q = query(q, where("type", "==", type));
        if (status) q = query(q, where("status", "==", status));
        return getDocs(q).then((snap) =>
          snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
        );
      };
      queries.push(baseQuery("userId"));
      queries.push(baseQuery("targetId"));

      const results = await Promise.all(queries);
      // Merge and deduplicate relationships
      const relationships: UserRelationship[] = [...results[0], ...results[1]]
        .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
        .map((rel) => rel as UserRelationship);
      return { relationships, error: null };
    } catch (error: any) {
      console.error("Error fetching relationships:", error);
      return { relationships: [], error: error.message };
    }
  }

  static async getMutualFriends(
    currentUserId: string,
    otherUserId: string
  ): Promise<{ mutualFriendIds: string[]; error: string | null }> {
    try {
      // Get current user's accepted friends
      const currentUserSnap = await getDocs(
        query(
          collection(db, RELATION_COLLECTION),
          where("userId", "==", currentUserId),
          where("type", "==", "friend"),
          where("status", "==", "accepted")
        )
      );
      const currentUserFriends = currentUserSnap.docs.map(
        (doc) => doc.data().targetId
      );

      // Get other user's accepted friends
      const otherUserSnap = await getDocs(
        query(
          collection(db, RELATION_COLLECTION),
          where("userId", "==", otherUserId),
          where("type", "==", "friend"),
          where("status", "==", "accepted")
        )
      );
      const otherUserFriends = otherUserSnap.docs.map(
        (doc) => doc.data().targetId
      );

      // Find intersection, exclude each other
      const mutualFriendIds = currentUserFriends.filter(
        (id) =>
          otherUserFriends.includes(id) &&
          id !== currentUserId &&
          id !== otherUserId
      );

      return { mutualFriendIds, error: null };
    } catch (error: any) {
      console.error("Error fetching mutual friends:", error);
      return { mutualFriendIds: [], error: error.message };
    }
  }
  // Get relationship between two users (if exists, only if current user is involved)
  static async getRelationshipBetween(
    currentUserId: string,
    otherUserId: string
  ): Promise<{ relationship: UserRelationship | null; error: string | null }> {
    try {
      // Query where currentUserId is either userId or targetId
      let q = query(
        collection(db, RELATION_COLLECTION),
        where("userId", "in", [currentUserId, otherUserId]),
        where("targetId", "in", [currentUserId, otherUserId])
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        return {
          relationship: {
            id: docSnap.id,
            ...docSnap.data(),
          } as UserRelationship,
          error: null,
        };
      }
      return { relationship: null, error: null };
    } catch (error: any) {
      console.error("Error fetching relationship:", error);
      return { relationship: null, error: error.message };
    }
  }
}
