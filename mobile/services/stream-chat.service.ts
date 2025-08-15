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
      // channels.forEach((channel) => {
      //   const members = Object.values(channel.state.members);
      //   console.log(
      //     `Channel ${channel.id}:`,
      //     members.map((m) => ({
      //       userId: m.user_id,
      //       userName: m.user?.name,
      //     }))
      //   );
      // });
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
  // In stream-chat.service.ts - Add notification trigger

  static async sendMessage(channel: Channel, text: string) {
    try {
      const message = await channel.sendMessage({ text });
      console.log("✅ Message sent");

      // 🔔 NEW: Send notifications to other channel members
      const channelMembers = Object.keys(channel.state.members || {});
      if (channelMembers.length > 1) {
        // Import NotificationService dynamically to avoid circular imports
        const { NotificationService } = await import("./notifications.service");

        await NotificationService.notifyMessageReceived(
          message.message,
          channel,
          channelMembers
        );
      }

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
    isAnonymous: boolean = false,
    description?: string
  ): Promise<Channel> {
    try {
      // Generate a custom channel ID for the group (required for member management)
      const timestamp = Date.now();
      const groupId = `members-${timestamp}_${createdBy.slice(0, 8)}`;

      const channel = this.client.channel("team", groupId, {
        name: name,
        members,

        created_by_id: createdBy,
        // Only include custom fields that are allowed by your Stream configuration
        // If 'name' and 'anonymous' are custom fields, ensure they are enabled in your dashboard
        ...(name && { name }),
        ...(description && { description: description }),
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
      console.log(
        `🔄 Deleting message ${messageId} via service (hard: ${hard})`
      );

      const result = await this.client.deleteMessage(messageId, hard);

      console.log(`✅ Message deleted successfully:`, result);
      return result;
    } catch (error: any) {
      console.error("❌ Failed to delete message:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
      });
      throw error;
    }
  }
  // Hide channel (soft delete)
  static async hideChannel(channel: Channel) {
    try {
      console.log(`🔄 Hiding channel: ${channel.id}`);
      await channel.hide();
      console.log(`✅ Channel hidden successfully`);
    } catch (error: any) {
      console.error("❌ Failed to hide channel:", error);
      throw error;
    }
  }

  // Leave group channel
  static async leaveChannel(channel: Channel, userId: string) {
    try {
      console.log(`🔄 Leaving channel: ${channel.id}`);
      await channel.removeMembers([userId]);
      console.log(`✅ Left channel successfully`);
    } catch (error: any) {
      console.error("❌ Failed to leave channel:", error);
      throw error;
    }
  }

  // Delete channel (only for channel owners)
  static async deleteChannel(channel: Channel) {
    try {
      console.log(`🔄 Deleting channel: ${channel.id}`);
      await channel.delete();
      console.log(`✅ Channel deleted successfully`);
    } catch (error: any) {
      console.error("❌ Failed to delete channel:", error);
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

  static async blockUser(userId: string, channel: Channel) {
    try {
      await channel.banUser(userId, { reason: "Blocked by admin" });
      console.log(`✅ User ${userId} blocked in channel ${channel.id}`);
    } catch (error) {
      console.error("❌ Failed to block user:", error);
      throw error;
    }
  }

  static async unblockUser(userId: string, channel: Channel) {
    try {
      await channel.unbanUser(userId);
      console.log(`✅ User ${userId} unblocked in channel ${channel.id}`);
    } catch (error) {
      console.error("❌ Failed to unblock user:", error);
      throw error;
    }
  }

  // Block user globally
  static async blockUserGlobally(userId: string) {
    try {
      await chatClient.blockUser(userId);
      console.log(`✅ User ${userId} blocked globally`);
    } catch (error) {
      console.error("❌ Failed to block user globally:", error);
      throw error;
    }
  }

  // Unblock user globally
  static async unblockUserGlobally(userId: string) {
    try {
      await chatClient.unBlockUser(userId);
      console.log(`✅ User ${userId} unblocked globally`);
    } catch (error) {
      console.error("❌ Failed to unblock user globally:", error);
      throw error;
    }
  }
}
