import { Channel, MessageResponse } from "stream-chat";

// Convert Stream Chat channel to our Chat interface
export function streamChannelToChat(channel: Channel) {
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];

  const isAnonymous =
    (channel.data as { anonymous?: boolean })?.anonymous ||
    (channel.data as { isAnonymous?: boolean })?.isAnonymous ||
    false;


  return {
    id: channel.id || "",
    name: (channel.data as { name?: string })?.name || "Unnamed Chat",
    type: isAnonymous
      ? ("anonymous" as const)
      : channel.type === "team"
        ? ("group" as const)
        : ("direct" as const),
    participants: Object.keys(channel.state.members),
    isVerified: (channel.data as { isVerified?: boolean })?.isVerified || false,
    isAnonymous: isAnonymous,
    lastMessage: lastMessage?.text || "",
    timestamp: lastMessage
      ? new Date(lastMessage.created_at!).getTime()
      : Date.now(),
    unreadCount: channel.state.unreadCount || 0,
    avatar: (channel.data as { image?: string })?.image,
    online: false, // Can be determined based on member presence
  };
}

// Convert Stream Chat message to our Message interface
export function streamMessageToMessage(
  message: MessageResponse,
  currentUserId: string
) {
  return {
    id: message.id,
    chatId: message.cid || "",
    senderId: message.user?.id || "",
    text: message.text || "",
    timestamp: new Date(message.created_at!).getTime(),
    status: "sent" as const,
    isOwn: message.user?.id === currentUserId,
    synced: true,
    isRead: true, // Stream handles read status differently
    deletedFor: [],
    isDeletedForEveryone: message.deleted_at !== undefined,
  };
}

export function getChannelDisplayName(
  channel: Channel,
  currentUserId: string
): string {

  const isAnonymous =
    (channel.data as { anonymous?: boolean })?.anonymous ||
    (channel.data as { isAnonymous?: boolean })?.isAnonymous ||
    false;

  if (channel.type === "team") {
    if ((channel.data as { name?: string })?.name) {
      const channelName = (channel.data as { name?: string }).name!;
      console.log("🔍 Team channel name found:", channelName);
      return isAnonymous ? `🎭 ${channelName}` : channelName;
    }
    console.log("⚠️ Team channel without name:", channel.data);
    return isAnonymous ? "🎭 Anonymous Group" : "Unnamed Group";
  }
  if ((channel.data as { name?: string })?.name) {
    return (channel.data as { name?: string }).name!;
  }

  // For direct chats, show the other user's name
  if (channel.type === "messaging") {
    const otherMember = (
      Object.values(channel.state.members) as {
        user_id: string;
        user?: { name?: string };
      }[]
    ).find((member) => member.user_id !== currentUserId);

    if (otherMember?.user?.name) {
      return otherMember.user.name;
    }

    return otherMember?.user_id || "Unknown User";
  }

  return "Unnamed Chat";
}

// Get channel avatar
export function getChannelAvatar(
  channel: Channel,
  currentUserId: string
): string | null {
  if ((channel.data as { image?: string })?.image) {
    return (channel.data as { image?: string })?.image ?? null;
  }

  // For direct chats, use the other user's avatar
  if (channel.type === "messaging") {
    const otherMembers = Object.values(channel.state.members).filter(
      (member) =>
        (member as { user?: { id?: string; image?: string } }).user?.id !==
        currentUserId
    ) as { user?: { id?: string; image?: string } }[];

    if (otherMembers.length > 0) {
      return otherMembers[0].user?.image || null;
    }
  }

  return null;
}

// Check if user is online in channel
export function isUserOnlineInChannel(
  channel: Channel,
  userId: string
): boolean {
  const member = channel.state.members[userId];
  return member?.user?.online || false;
}

// Format timestamp for chat list
export function formatChatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
}
