import { Timestamp } from "firebase/firestore";

export type RelationshipType = "friend" | "blocked" | "removed";
export type RelationshipStatus = "pending" | "accepted" | "blocked" | "removed";

export interface UserRelationship {
  id: string; // Firestore doc ID
  userId: string; // The user who initiated the relationship
  targetId: string; // The other user
  type: RelationshipType;
  status: RelationshipStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  // Optionally, metadata:
  note?: string;
  // For friend requests:
  requestedBy?: string; // userId of who sent the request
  acceptedAt?: Timestamp;
  blockedAt?: Timestamp;
  removedAt?: Timestamp;
}
