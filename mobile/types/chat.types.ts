export type ChatType = "direct" | "group" | "anonymous";
export type MessageStatus = "pending" | "sent" | "delivered" | "read";

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  participants: string[]; // userIds
  isVerified: boolean;
  isAnonymous: boolean;
  lastMessage: string;
  timestamp: number; // stored as millis
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: number; // millis
  status: MessageStatus;
  isOwn: boolean;
  synced: boolean;
  isRead: boolean;
  deletedFor: string[]; // userIds
  isDeletedForEveryone: boolean;
  forwardedFrom?: string;
}

export interface SharedMessagePayload {
  destChatId: string;
  originalMessage: Message;
  senderId: string;
}
