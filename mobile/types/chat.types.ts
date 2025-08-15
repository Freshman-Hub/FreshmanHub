import { Channel, MessageResponse, UserResponse } from "stream-chat";

export type ChatType = "direct" | "group" | "anonymous";
export type MessageStatus = "pending" | "sent" | "delivered" | "read";

// Extend Stream Chat types with our custom properties
export interface CustomChannelData {
  isAnonymous?: boolean;
  isVerified?: boolean;
  memberCount?: number;
  image?: string;
}

export interface CustomUserData {
  role?: string;
  studentId?: string;
  yearGroup?: string;
  major?: string;
  online?: boolean;
}

export interface CustomMessageData {
  forwardedFrom?: string;
  isSystemMessage?: boolean;
}

// Type aliases for Stream Chat with our custom data
export type ChatChannel = Channel;
export type ChatMessage = MessageResponse;
export type ChatUser = UserResponse;

// Legacy types for backward compatibility (can be removed gradually)
export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  participants: string[];
  isVerified: boolean;
  isAnonymous: boolean;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
  avatar?: string;
  online?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
  isOwn: boolean;
  synced: boolean;
  isRead: boolean;
  deletedFor: string[];
  isDeletedForEveryone: boolean;
  forwardedFrom?: string;
}

export interface SharedMessagePayload {
  destChatId: string;
  originalMessage: Message;
  senderId: string;
}
