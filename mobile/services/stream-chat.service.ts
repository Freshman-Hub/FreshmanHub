import { chatClient } from "@/config/stream.config";
import {
  Channel,
} from "stream-chat";

export class StreamChatService {
  private static client = chatClient;

  // Fix the createDirectChat function:

  static async createDirectChat(
    user1Id: string,
    user2Id: string,
    user1Data?: any,
    user2Data?: any
  ): Promise<Channel> {
    try {
      console.log(
        "🔄 Creating/getting direct chat between:",
        user1Id,
        "and",
        user2Id
      );

      const currentUserId = this.client.userID;

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      // FIXED: Query only channels where current user is a member
      const existingChannels = await this.client.queryChannels({
        type: "messaging",
        members: { $in: [currentUserId] }, // Current user must be a member
      });

      // FIXED: Filter client-side to find exact match
      const exactMatch = existingChannels.find((channel) => {
        const members = Object.keys(channel.state.members || {});
        return (
          members.length === 2 &&
          members.includes(user1Id) &&
          members.includes(user2Id)
        );
      });

      if (exactMatch) {
        console.log("✅ Found existing direct chat:", exactMatch.id);
        // Watch the existing channel to ensure it's initialized
        await exactMatch.watch();
        return exactMatch;
      }

      // Create new channel with a unique ID
      const sortedIds = [user1Id, user2Id].sort(); // Sort to ensure consistent ID
      const channelId = `${sortedIds[0]}_${sortedIds[1]}`;

      const channel = this.client.channel("messaging", channelId, {
        members: [user1Id, user2Id],
        created_by_id: currentUserId,
      });

      // Create and watch the channel
      await channel.create();
      await channel.watch();

      console.log("✅ New direct chat created and initialized:", channel.id);
      return channel;
    } catch (error: any) {
      console.error("❌ Failed to create/get direct chat:", error);
      throw error;
    }
  }

  // Get user's channels
  static async getUserChannels(userId: string): Promise<Channel[]> {
    try {
      console.log("🔄 Loading channels for user:", userId);

      const channels = await this.client.queryChannels(
        {
          members: { $in: [userId] },
        },
        { last_message_at: -1 },

        { limit: 50 }
      );

      console.log(`✅ Found ${channels.length} channels`);
      channels.forEach((channel) => {
        const members = Object.values(channel.state.members);
        console.log(
          `Channel ${channel.id}:`,
          members.map((m) => ({
            userId: m.user_id,
            userName: m.user?.name,
          }))
        );
      });
      console.log("===========end===========");
      return channels;
    } catch (error: any) {
      console.error("❌ Failed to get user channels:", error);
      return [];
    }
  }

  // Update getChannel method with better error handling:

  static async getChannel(
    channelType: string,
    channelId: string
  ): Promise<Channel> {
    try {
      console.log(`🔄 Getting channel: ${channelType}:${channelId}`);

      const channel = this.client.channel(channelType, channelId);

      // Try to watch the channel
      await channel.watch();
      console.log(`✅ Channel watched successfully: ${channel.id}`);

      return channel;
    } catch (error: any) {
      console.error(
        `❌ Failed to get channel ${channelType}:${channelId}:`,
        error
      );

      // If it's a permission error, try querying instead
      if (error.code === 17 || error.code === 70) {
        try {
          console.log("🔄 Trying to query channel instead...");
          const channels = await this.client.queryChannels(
            { id: channelId, type: channelType },
            {},
            { limit: 1 }
          );

          if (channels.length > 0) {
            console.log("✅ Found channel via query");
            return channels[0];
          }
        } catch (queryError) {
          console.error("❌ Query also failed:", queryError);
        }
      }

      throw error;
    }
  }

  // Send message
  static async sendMessage(channel: Channel, text: string) {
    try {
      const message = await channel.sendMessage({ text });
      console.log("✅ Message sent");
      return message;
    } catch (error: any) {
      console.error("❌ Failed to send message:", error);
      throw error;
    }
  }

  // Create group chat
  static async createGroupChat(
    name: string,
    members: string[],
    createdBy: string,
    isAnonymous: boolean = false
  ): Promise<Channel> {
    try {
      const channel = this.client.channel("team", undefined, {
        members,
        created_by_id: createdBy,
        // Only include custom fields that are allowed by your Stream configuration
        // If 'name' and 'anonymous' are custom fields, ensure they are enabled in your dashboard
        ...(name && { name }),
        ...(isAnonymous && { anonymous: isAnonymous }),
      });

      await channel.create();
      return channel;
    } catch (error: any) {
      console.error("❌ Failed to create group chat:", error);
      throw error;
    }
  }

  // Mark channel as read
  static async markChannelAsRead(channel: Channel) {
    try {
      await channel.markRead();
    } catch (error: any) {
      console.error("❌ Failed to mark as read:", error);
    }
  }

  // Delete message
  static async deleteMessage(messageId: string, hard: boolean = false) {
    try {
      return await this.client.deleteMessage(messageId, hard);
    } catch (error: any) {
      console.error("❌ Failed to delete message:", error);
      throw error;
    }
  }

  // Search channels
  static async searchChannels(
    query: string,
    userId: string
  ): Promise<Channel[]> {
    try {
      return await this.client.queryChannels(
        {
          members: { $in: [userId] },
          name: { $autocomplete: query },
        },
        { last_message_at: -1 }
      );
    } catch (error: any) {
      console.error("❌ Failed to search channels:", error);
      return [];
    }
  }

  // Get unread count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const channels = await this.client.queryChannels(
        { members: { $in: [userId] } },
        {},
        { limit: 100 }
      );

      return channels.reduce((total, channel) => {
        return total + (channel.state.unreadCount || 0);
      }, 0);
    } catch (error: any) {
      console.error("❌ Failed to get unread count:", error);
      return 0;
    }
  }

  // Update channel
  static async updateChannel(channel: Channel, data: Record<string, any>) {
    try {
      return await channel.update(data);
    } catch (error: any) {
      console.error("❌ Failed to update channel:", error);
      throw error;
    }
  }

  // Add members to group
  static async addMembersToGroup(channel: Channel, memberIds: string[]) {
    try {
      return await channel.addMembers(memberIds);
    } catch (error: any) {
      console.error("❌ Failed to add members:", error);
      throw error;
    }
  }

  // Remove members from group
  static async removeMembersFromGroup(channel: Channel, memberIds: string[]) {
    try {
      return await channel.removeMembers(memberIds);
    } catch (error: any) {
      console.error("❌ Failed to remove members:", error);
      throw error;
    }
  }
}
