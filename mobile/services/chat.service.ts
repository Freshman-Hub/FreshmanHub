/**
 * ChatService: Handles all chat and message logic using Firestore.
 * - Supports direct, group, and anonymous group chats.
 * - Handles message status, deletion, sharing, and unread counts.
 */

import { db as firestore } from "@/firebase/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { User } from "@/types/user.types";

const USERS_LAST_SYNC_KEY = "users_last_sync_timestamp";

// async function getLastUserSyncTimestamp(): Promise<number> {
//   const ts = await AsyncStorage.getItem(USERS_LAST_SYNC_KEY);
//   return ts ? parseInt(ts, 10) : 0;
// }

async function setLastUserSyncTimestamp(ts: number): Promise<void> {
  await AsyncStorage.setItem(USERS_LAST_SYNC_KEY, ts.toString());
}

// --- Chat Logic ---
export const ChatService = {
  /**
   * Create or update a chat in Firestore.
   */
  async upsertChat(chat: {
    id: string;
    name: string;
    type: "direct" | "group" | "anonymous";
    participants: string[];
    isVerified: boolean;
    isAnonymous: boolean;
    lastMessage: string;
    timestamp: number;
    unreadCount: number;
    avatar?: string;
    online?: boolean;
  }) {
    try {
      await setDoc(
        doc(firestore, "chats", chat.id),
        {
          ...chat,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error upserting chat:", error);
      throw error;
    }
  },

  /**
   * Create a welcome message for a new group.
   */
  async createWelcomeMessage(
    chatId: string,
    groupName: string,
    createdBy: string
  ) {
    try {
      console.log("Creating welcome message for group:", chatId, groupName);
      const messageId = `welcome_${Date.now()}`;
      const welcomeMessage = {
        id: messageId,
        chatId: chatId,
        senderId: "system",
        text: `Welcome to "${groupName}"! This is the beginning of your group conversation.`,
        timestamp: serverTimestamp(),
        status: "sent",
        synced: true,
        isSystem: true,
        isRead: true,
      };

      console.log("Welcome message data:", welcomeMessage);

      await setDoc(
        doc(firestore, "chats", chatId, "messages", messageId),
        welcomeMessage
      );

      // Update the chat's lastMessage
      await updateDoc(doc(firestore, "chats", chatId), {
        lastMessage: welcomeMessage.text,
        timestamp: serverTimestamp(),
      });

      console.log("✅ Created welcome message for group:", chatId);
    } catch (error) {
      console.error("Error creating welcome message:", error);
      // Don't throw error, just log it
    }
  },

  /**
   * Create a new group chat.
   */
  async createGroupChat(
    groupName: string,
    participants: string[],
    createdBy: string,
    isAnonymous: boolean = false
  ) {
    try {
      const groupId = `group_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      const group = {
        id: groupId,
        name: groupName,
        type: "group" as const,
        participants: participants,
        createdBy: createdBy,
        isVerified: false,
        isAnonymous: isAnonymous,
        lastMessage: "",
        timestamp: Date.now(),
        unreadCount: 0,
        memberCount: participants.length,
      };

      await this.upsertChat(group);
      console.log("✅ Created group chat:", groupId);

      // Create a welcome message for the group
      await this.createWelcomeMessage(groupId, groupName, createdBy);

      return groupId;
    } catch (error) {
      console.error("Error creating group chat:", error);
      throw error;
    }
  },

  /**
   * Create a new direct chat between two users.
   */
  async createDirectChat(userId1: string, userId2: string) {
    try {
      const participants = [userId1, userId2].sort();
      const chatId = participants.join("_");

      const chat = {
        id: chatId,
        name: "Direct Chat", // Generic name, will be resolved per user
        type: "direct" as const,
        participants: participants,
        isVerified: false,
        isAnonymous: false,
        lastMessage: "",
        timestamp: Date.now(),
        unreadCount: 0,
      };

      await this.upsertChat(chat);
      console.log("✅ Created direct chat:", chatId);
      return chatId;
    } catch (error) {
      console.error("Error creating direct chat:", error);
      throw error;
    }
  },

  /**
   * Get chats from Firestore where the user is a participant.
   */
  async getLocalChats(
    limit = 20,
    offset = 0,
    currentUserId?: string
  ): Promise<any[]> {
    try {
      let q;

      if (currentUserId) {
        // Only get chats where the user is a participant
        q = query(
          collection(firestore, "chats"),
          where("participants", "array-contains", currentUserId),
          orderBy("timestamp", "desc")
        );
      } else {
        // Fallback to getting all chats (for admin purposes)
        q = query(collection(firestore, "chats"), orderBy("timestamp", "desc"));
      }

      const snapshot = await getDocs(q);
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get the last message for each chat
      const chatsWithLastMessage = await Promise.all(
        chats.map(async (chat: any) => {
          try {
            const lastMessage = await this.getLastMessage(chat.id);
            const unreadCount = currentUserId
              ? await this.getUnreadCount(chat.id, currentUserId)
              : 0;
            return {
              ...chat,
              lastMessage: lastMessage?.text || chat.lastMessage || "",
              unreadCount: unreadCount,
            };
          } catch (error) {
            console.error(
              `Error getting last message for chat ${chat.id}:`,
              error
            );
            // Return chat with default values if there's an error
            return {
              ...chat,
              lastMessage: chat.lastMessage || "",
              unreadCount: 0,
            };
          }
        })
      );

      return chatsWithLastMessage.slice(offset, offset + limit);
    } catch (error) {
      console.error("Error getting chats:", error);
      return [];
    }
  },

  /**
   * Get the last message for a chat.
   */
  async getLastMessage(chatId: string): Promise<any | null> {
    try {
      const q = query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }

      const lastMessage = snapshot.docs[0];
      return {
        id: lastMessage.id,
        ...lastMessage.data(),
      };
    } catch (error) {
      console.error("Error getting last message:", error);
      // Return null if there's a permission error or other issue
      return null;
    }
  },

  /**
   * Listen for chat changes in Firestore where the user is a participant.
   */
  listenChatsFirestore(
    onUpdate: (chats: any[]) => void,
    currentUserId?: string
  ) {
    let q;

    if (currentUserId) {
      // Only listen to chats where the user is a participant
      q = query(
        collection(firestore, "chats"),
        where("participants", "array-contains", currentUserId),
        orderBy("timestamp", "desc")
      );
    } else {
      // Fallback to listening to all chats (for admin purposes)
      q = query(collection(firestore, "chats"), orderBy("timestamp", "desc"));
    }

    return onSnapshot(q, async (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get the last message for each chat
      const chatsWithLastMessage = await Promise.all(
        chats.map(async (chat: any) => {
          try {
            const lastMessage = await this.getLastMessage(chat.id);
            const unreadCount = currentUserId
              ? await this.getUnreadCount(chat.id, currentUserId)
              : 0;
            return {
              ...chat,
              lastMessage: lastMessage?.text || chat.lastMessage || "",
              unreadCount: unreadCount,
            };
          } catch (error) {
            console.error(
              `Error getting last message for chat ${chat.id}:`,
              error
            );
            // Return chat with default values if there's an error
            return {
              ...chat,
              lastMessage: chat.lastMessage || "",
              unreadCount: 0,
            };
          }
        })
      );

      onUpdate(chatsWithLastMessage);
    });
  },

  // --- Message Logic ---

  /**
   * Send a message: Save to Firestore.
   */
  async sendMessage(message: {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: number;
    isOwn: boolean;
    forwardedFrom?: string;
    replyTo?: any;
  }) {
    try {
      // Clean the message data to remove undefined fields
      const cleanMessage: any = {
        id: message.id,
        chatId: message.chatId,
        senderId: message.senderId,
        text: message.text,
        timestamp: serverTimestamp(),
        status: "sent",
        synced: true,
        deletedFor: [],
        isDeletedForEveryone: false,
        isRead: false,
      };

      // Only add optional fields if they have values
      if (message.forwardedFrom) {
        cleanMessage.forwardedFrom = message.forwardedFrom;
      }
      if (message.replyTo) {
        cleanMessage.replyTo = message.replyTo;
      }

      // Save the message
      await setDoc(
        doc(firestore, "chats", message.chatId, "messages", message.id),
        cleanMessage
      );

      // Get the chat document to update unread count for other participants
      const chatDoc = await getDoc(doc(firestore, "chats", message.chatId));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const participants = chatData.participants || [];

        // Get current unread count and increment for other participants
        const currentUnreadCount = chatData.unreadCount || 0;
        const otherParticipants = participants.filter(
          (id: string) => id !== message.senderId
        );
        const newUnreadCount = currentUnreadCount + otherParticipants.length;

        // Update the chat's lastMessage, timestamp, and unread count
        await updateDoc(doc(firestore, "chats", message.chatId), {
          lastMessage: message.text,
          timestamp: serverTimestamp(),
          unreadCount: newUnreadCount,
        });
      } else {
        // Fallback if chat document doesn't exist
        await updateDoc(doc(firestore, "chats", message.chatId), {
          lastMessage: message.text,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Listen for new messages in Firestore for a chat.
   */
  listenMessagesFirestore(
    chatId: string,
    lastSynced: number,
    onUpdate: (messages: any[]) => void
  ) {
    return onSnapshot(
      query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        onUpdate(messages);
      }
    );
  },

  /**
   * Get messages from Firestore for a chat.
   */
  async getLocalMessages(
    chatId: string,
    limit = 50,
    offset = 0
  ): Promise<any[]> {
    try {
      const q = query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      );

      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return messages.slice(offset, offset + limit);
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  },

  /**
   * Sync new messages from Firestore.
   */
  async syncMessages(
    chatId: string,
    newMessages: any[],
    currentUserId: string
  ) {
    // This is now handled by the listener, but you can add additional logic here
    console.log(
      "Syncing messages for chat:",
      chatId,
      "count:",
      newMessages.length
    );
  },

  /**
   * Mark message as delivered/read in Firestore.
   */
  async updateMessageStatus(
    chatId: string,
    messageId: string,
    status: "delivered" | "read",
    userId: string
  ) {
    try {
      await updateDoc(doc(firestore, "chats", chatId, "messages", messageId), {
        status,
        [`${status}By`]: arrayUnion(userId),
      });
    } catch (error) {
      console.error("Error updating message status:", error);
      throw error;
    }
  },

  /**
   * Delete message for me: update Firestore.
   */
  async deleteMessageForMe(chatId: string, messageId: string, userId: string) {
    try {
      await updateDoc(doc(firestore, "chats", chatId, "messages", messageId), {
        deletedFor: arrayUnion(userId),
      });
    } catch (error) {
      console.error("Error deleting message for me:", error);
      throw error;
    }
  },

  /**
   * Delete message for everyone (sender only): update Firestore.
   */
  async deleteMessageForEveryone(chatId: string, messageId: string) {
    try {
      await updateDoc(doc(firestore, "chats", chatId, "messages", messageId), {
        isDeletedForEveryone: true,
        text: "",
      });
    } catch (error) {
      console.error("Error deleting message for everyone:", error);
      throw error;
    }
  },

  /**
   * Share a message: create a new message in destination chat.
   */
  async shareMessage(
    destChatId: string,
    originalMessage: any,
    senderId: string
  ) {
    try {
      const newId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newMessage = {
        id: newId,
        chatId: destChatId,
        senderId,
        text: originalMessage.text,
        timestamp: Date.now(),
        isOwn: true,
        forwardedFrom: originalMessage.senderId,
      };
      await this.sendMessage(newMessage);
    } catch (error) {
      console.error("Error sharing message:", error);
      throw error;
    }
  },

  // --- User Management ---

  /**
   * Sync users from Firestore (get all users).
   */
  async syncUsers(): Promise<void> {
    try {
      console.log("🔄 Syncing users from Firestore...");
      const q = query(collection(firestore, "users"));
      const snapshot = await getDocs(q);
      console.log("✅ Found", snapshot.docs.length, "users in Firestore");

      // Update the last sync timestamp
      await setLastUserSyncTimestamp(Date.now());
    } catch (error) {
      console.error("❌ Error syncing users:", error);
      throw error;
    }
  },

  /**
   * Get users from Firestore.
   */
  async getLocalUsers(limit = 100, offset = 0): Promise<User[]> {
    try {
      console.log("👥 Getting users from Firestore...");
      const q = query(
        collection(firestore, "users"),
        orderBy("firstName", "asc")
      );

      const snapshot = await getDocs(q);
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      console.log("✅ Retrieved", users.length, "users from Firestore");
      return users.slice(offset, offset + limit);
    } catch (error) {
      console.error("❌ Error getting users:", error);
      return [];
    }
  },

  /**
   * Utility: Get receiverId in direct chat.
   */
  getReceiverId(
    chat: { participants: string[] },
    senderId: string
  ): string | null {
    return chat.participants.find((id) => id !== senderId) || null;
  },

  /**
   * Get unread count for a specific user in a chat.
   */
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    try {
      const q = query(
        collection(firestore, "chats", chatId, "messages"),
        where("isRead", "==", false),
        where("senderId", "!=", userId)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      // Return 0 if there's a permission error or other issue
      return 0;
    }
  },

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    try {
      // Get all unread messages for this chat that are not from the current user
      const q = query(
        collection(firestore, "chats", chatId, "messages"),
        where("isRead", "==", false),
        where("senderId", "!=", userId)
      );

      const snapshot = await getDocs(q);

      // Update all unread messages to read
      const updatePromises = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { isRead: true })
      );

      await Promise.all(updatePromises);

      // Get the chat document to update unread count
      const chatDoc = await getDoc(doc(firestore, "chats", chatId));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        // const participants = chatData.participants || [];

        // Calculate remaining unread count (exclude current user)
        // const otherParticipants = participants.filter(
        //   (id: string) => id !== userId
        // );
        const remainingUnreadCount = Math.max(
          0,
          (chatData.unreadCount || 0) - snapshot.docs.length
        );

        // Update the unread count in the chat document
        await updateDoc(doc(firestore, "chats", chatId), {
          unreadCount: remainingUnreadCount,
        });
      }

      console.log(
        "✅ Marked",
        snapshot.docs.length,
        "messages as read for user",
        userId
      );
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
      // Don't throw the error, just log it and continue
      // This prevents the app from crashing if there are permission issues
    }
  },
};
