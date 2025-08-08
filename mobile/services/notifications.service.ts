import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { router } from "expo-router";

import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // ✅ New
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  private static token: string | null = null;

  // Register for push notifications and get token
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      let token = null;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log("Failed to get push token for push notification!");
          return null;
        }

        // Get the token
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        token = tokenData.data;
        console.log("🔔 Push notification token:", token);

        this.token = token;
        return token;
      } else {
        console.log("Must use physical device for Push Notifications");
        return null;
      }
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      return null;
    }
  }

  // Save token to separate tokens collection
  static async saveTokenToUser(userId: string, token: string): Promise<void> {
    try {
      // Create a unique document ID based on userId and token hash
      const tokenId = `${userId}_${token.slice(-10)}`; // Use last 10 chars of token as ID

      await setDoc(doc(db, "pushTokens", tokenId), {
        userId,
        token,
        deviceInfo: {
          platform: Platform.OS,
          deviceName: Device.deviceName || "Unknown",
          deviceType: Device.deviceType || "Unknown",
        },
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        isActive: true,
      });

      console.log("✅ Push token saved to tokens collection");
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  }

  // Get user push tokens from tokens collection
  static async getUserPushTokens(userId: string): Promise<string[]> {
    try {
      const tokensQuery = query(
        collection(db, "pushTokens"),
        where("userId", "==", userId),
        where("isActive", "==", true)
      );

      const querySnapshot = await getDocs(tokensQuery);
      const tokens: string[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tokens.push(data.token);
      });

      return tokens;
    } catch (error) {
      console.error("Error getting user push tokens:", error);
      return [];
    }
  }

  // Get multiple users' tokens
  static async getMultipleUserTokens(userIds: string[]): Promise<string[]> {
    try {
      const allTokens: string[] = [];

      // Query in batches (Firestore 'in' query limit is 10)
      const batchSize = 10;
      for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);

        const tokensQuery = query(
          collection(db, "pushTokens"),
          where("userId", "in", batch),
          where("isActive", "==", true)
        );

        const querySnapshot = await getDocs(tokensQuery);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allTokens.push(data.token);
        });
      }

      return allTokens;
    } catch (error) {
      console.error("Error getting multiple user tokens:", error);
      return [];
    }
  }

  // Mark token as inactive (instead of deleting)
  static async deactivateToken(userId: string, token: string): Promise<void> {
    try {
      const tokenId = `${userId}_${token.slice(-10)}`;

      await updateDoc(doc(db, "pushTokens", tokenId), {
        isActive: false,
        deactivatedAt: new Date().toISOString(),
      });

      console.log("✅ Push token deactivated");
    } catch (error) {
      console.error("Error deactivating push token:", error);
    }
  }

  // Update token last used timestamp
  static async updateTokenLastUsed(token: string): Promise<void> {
    try {
      const tokensQuery = query(
        collection(db, "pushTokens"),
        where("token", "==", token)
      );

      const querySnapshot = await getDocs(tokensQuery);

      querySnapshot.forEach(async (docSnapshot) => {
        await updateDoc(docSnapshot.ref, {
          lastUsed: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error("Error updating token last used:", error);
    }
  }

  // Clean up old/inactive tokens
  static async cleanupOldTokens(daysOld: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const tokensQuery = query(
        collection(db, "pushTokens"),
        where("lastUsed", "<", cutoffDate.toISOString())
      );

      const querySnapshot = await getDocs(tokensQuery);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      console.log(`✅ Cleaned up ${querySnapshot.size} old tokens`);
    } catch (error) {
      console.error("Error cleaning up old tokens:", error);
    }
  }

  // Send notification to specific users
  static async sendNotificationToUsers(
    userTokens: string[],
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      const messages = userTokens.map((token) => ({
        to: token,
        sound: "default",
        title,
        body,
        data: data || {},
      }));

      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      console.log("✅ Notifications sent:", result);

      // Update last used timestamp for successful sends
      for (const token of userTokens) {
        await this.updateTokenLastUsed(token);
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  }

  // In notifications.service.ts - Update notifyEventCreated method
  // Send notification for new event
  static async notifyEventCreated(
    event: any,
    invitedUserIds: string[]
  ): Promise<void> {
    try {
      console.log(`🔔 Preparing notifications for event: ${event.title}`);
      console.log(`🔔 Invited users: ${invitedUserIds.join(", ")}`);

      // Get push tokens for invited users
      const userTokens = await this.getMultipleUserTokens(invitedUserIds);
      console.log(
        `🔔 Found ${userTokens.length} push tokens for ${invitedUserIds.length} users`
      );

      if (userTokens.length > 0) {
        const eventDate = new Date(event.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        const eventTime = event.allDay
          ? "All day"
          : event.startTime
            ? `at ${event.startTime}`
            : "";

        const notificationTitle =
          event.sourceCollection === "sessions"
            ? `New Session Invitation`
            : `New Event Invitation`;

        const notificationBody =
          `${event.userDisplayName} invited you to "${event.title}" on ${eventDate} ${eventTime}`.trim();

        await this.sendNotificationToUsers(
          userTokens,
          notificationTitle,
          notificationBody,
          {
            type: "event_invitation",
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            creatorName: event.userDisplayName,
            sourceCollection: event.sourceCollection,
            timestamp: new Date().toISOString(),
          }
        );

        console.log(`✅ Notifications sent to ${userTokens.length} devices`);
      } else {
        console.log(`⚠️ No push tokens found for invited users`);
      }
    } catch (error) {
      console.error("❌ Error notifying event created:", error);
    }
  }

  // In notifications.service.ts - Update notifyMessageReceived method

  static async notifyMessageReceived(
    message: any,
    channel: any,
    recipientUserIds: string[]
  ): Promise<void> {
    try {
      console.log(`🔔 Preparing message notifications for: ${message.text}`);
      console.log(`🔔 Recipients: ${recipientUserIds.join(", ")}`);

      // Get push tokens for recipients (excluding sender)
      const senderUserId = message.user?.id;
      const filteredRecipients = recipientUserIds.filter(
        (id) => id !== senderUserId
      );

      if (filteredRecipients.length === 0) {
        console.log("🔔 No recipients to notify (excluding sender)");
        return;
      }

      const userTokens = await this.getMultipleUserTokens(filteredRecipients);
      console.log(
        `🔔 Found ${userTokens.length} push tokens for ${filteredRecipients.length} recipients`
      );

      if (userTokens.length > 0) {
        // Determine notification content based on channel type
        const isDirectMessage =
          Object.keys(channel.state.members || {}).length === 2;
        const isAnonymousGroup =
          channel.data?.anonymous || channel.data?.isAnonymous;

        let notificationTitle: string;
        let notificationBody: string;

        if (isDirectMessage) {
          // Direct message
          notificationTitle = message.user?.name || "Someone";
          notificationBody = message.text || "Sent you a message";
        } else {
          // Group message
          const groupName = channel.data?.name || "Group Chat";
          const senderName = isAnonymousGroup
            ? "Anonymous member"
            : message.user?.name || "Someone";

          notificationTitle = groupName;
          notificationBody = `${senderName}: ${message.text || "Sent a message"}`;
        }

        // Truncate long messages
        if (notificationBody.length > 100) {
          notificationBody = notificationBody.substring(0, 97) + "...";
        }

        await this.sendNotificationToUsers(
          userTokens,
          notificationTitle,
          notificationBody,
          {
            type: "chat_message",
            messageId: message.id,
            channelId: channel.id,
            channelType: channel.type,
            senderId: senderUserId,
            senderName: message.user?.name || "Unknown",
            senderAvatar: message.user?.image || null, // Add avatar
            channelName: channel.data?.name || null, // Add channel name
            isDirectMessage,
            isAnonymousGroup,
            timestamp: new Date().toISOString(),
          }
        );

        console.log(
          `✅ Message notifications sent to ${userTokens.length} devices`
        );
      } else {
        console.log(`⚠️ No push tokens found for message recipients`);
      }
    } catch (error) {
      console.error("❌ Error notifying message received:", error);
    }
  }

  // Send notification for typing indicators (optional)
  static async notifyTyping(
    channel: any,
    typingUserId: string,
    recipientUserIds: string[]
  ): Promise<void> {
    try {
      // Only send typing notifications for direct messages to avoid spam
      const isDirectMessage =
        Object.keys(channel.state.members || {}).length === 2;
      if (!isDirectMessage) return;

      const filteredRecipients = recipientUserIds.filter(
        (id) => id !== typingUserId
      );
      if (filteredRecipients.length === 0) return;

      const userTokens = await this.getMultipleUserTokens(filteredRecipients);

      if (userTokens.length > 0) {
        // Get typing user info
        const typingUser = channel.state.members[typingUserId]?.user;
        const typingUserName = typingUser?.name || "Someone";

        await this.sendNotificationToUsers(
          userTokens,
          "💬 Typing...",
          `${typingUserName} is typing...`,
          {
            type: "typing_indicator",
            channelId: channel.id,
            typingUserId,
            timestamp: new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error("❌ Error notifying typing:", error);
    }
  }

  // Send RSVP notification
  static async notifyEventRSVP(
    event: any,
    rsvpUser: any,
    response: "yes" | "no" | "maybe"
  ): Promise<void> {
    try {
      // Get event creator's tokens
      const creatorTokens = await this.getUserPushTokens(event.userId);

      if (creatorTokens.length > 0) {
        const responseText =
          response === "yes"
            ? "accepted"
            : response === "no"
              ? "declined"
              : "might attend";

        await this.sendNotificationToUsers(
          creatorTokens,
          `RSVP Update`,
          `${rsvpUser.firstName} ${rsvpUser.lastName} ${responseText} your event: ${event.title}`,
          {
            type: "rsvp_update",
            eventId: event.id,
            rsvpResponse: response,
            userId: rsvpUser.id,
          }
        );
      }
    } catch (error) {
      console.error("Error notifying RSVP:", error);
    }
  }

  // In notifications.service.ts - Update setupNotificationListeners

  static setupNotificationListeners() {
    // Notification received while app is foregrounded
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("🔔 Notification received:", notification);

      // Try both data and dataString
      let data = notification.request.content.data;

      // If data is empty, try parsing dataString (Expo Go fallback)
      if (!data || Object.keys(data).length === 0) {
        const dataString = notification.request.content.dataString;
        if (dataString) {
          try {
            data = JSON.parse(dataString);
            console.log("🔧 Parsed data from dataString:", data);
          } catch (error) {
            console.error("❌ Failed to parse dataString:", error);
          }
        }
      }

      if (data?.type === "event_invitation") {
        console.log(`🔔 Event invitation received: ${data.eventTitle}`);
      } else if (data?.type === "chat_message") {
        console.log(`🔔 Chat message received from channel: ${data.channelId}`);
      } else if (data?.type === "typing_indicator") {
        console.log(`🔔 Typing indicator: ${data.typingUserId}`);
      }
    });

    // User tapped notification - FIXED VERSION
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("🔔 Notification tapped:", response);

      // 🔧 FIXED: Try multiple ways to get the data
      let data = response.notification.request.content.data;

      console.log("🔍 Raw data object:", data);

      // If data is empty or undefined, try parsing dataString
      if (!data || Object.keys(data).length === 0) {
        const dataString = response.notification.request.content.dataString;
        console.log("🔍 DataString found:", dataString);

        if (dataString) {
          try {
            data = JSON.parse(dataString);
            console.log("🔧 Successfully parsed data from dataString:", data);
          } catch (error) {
            console.error("❌ Failed to parse dataString:", error);
            console.log("🔍 Raw dataString:", dataString);
            return; // Exit if we can't parse the data
          }
        } else {
          console.log("❌ No data or dataString found in notification");
          return;
        }
      }

      // 🐛 DEBUG: Log the extracted data
      console.log("🔍 Final notification data:", {
        type: data?.type,
        channelId: data?.channelId,
        isDirectMessage: data?.isDirectMessage,
        senderName: data?.senderName,
        eventId: data?.eventId,
        eventTitle: data?.eventTitle,
        allData: data,
      });

      // Handle different notification types
      if (data?.type === "event_invitation" && data?.eventId) {
        console.log(`🔔 Navigating to event: ${data.eventTitle}`);

        const routePath =
          data.sourceCollection === "sessions" ? "/sessions" : "/events";

        try {
          router.replace(routePath);
          console.log(`✅ Navigated to ${routePath}`);
        } catch (error) {
          console.error("❌ Navigation error:", error);
        }
      } else if (data?.type === "chat_message" && data?.channelId) {
        console.log(
          `🔔 User tapped chat notification for channel: ${data.channelId}`
        );

        try {
          const channelId = String(data.channelId);
          const senderName = String(data.senderName || "Chat");
          const isDirectMessage = Boolean(data.isDirectMessage);

          console.log(`🔔 Navigating to chat with params:`, {
            id: channelId,
            userName: senderName,
            isGroup: (!isDirectMessage).toString(),
          });

          // Use router.push with a simple path
          router.push(`/(routes)/chats/${channelId}`);

          console.log(
            `✅ Navigation attempted to: /(routes)/chats/${channelId}`
          );
        } catch (error) {
          console.error("❌ Chat navigation error:", error);

          // Fallback navigation
          try {
            console.log("🔄 Trying fallback navigation...");
            router.replace("/(routes)/chats");
            console.log("✅ Fallback: Navigated to chats list");
          } catch (fallbackError) {
            console.error("❌ Even fallback navigation failed:", fallbackError);
          }
        }
      } else if (data?.type === "rsvp_update" && data?.eventId) {
        console.log(`🔔 Navigating to RSVP update: ${data.eventTitle}`);

        const routePath =
          data.sourceCollection === "sessions" ? "/sessions" : "/events";

        try {
          router.replace(routePath);
          console.log(`✅ Navigated to ${routePath} for RSVP`);
        } catch (error) {
          console.error("❌ Navigation error:", error);
        }
      } else {
        // 🐛 DEBUG: Log unhandled notification types
        console.log("⚠️ Unhandled notification type or missing data:", {
          type: data?.type,
          hasChannelId: !!data?.channelId,
          hasEventId: !!data?.eventId,
          dataExists: !!data,
          dataKeys: data ? Object.keys(data) : [],
          fullData: data,
        });
      }
    });
  }

  // Get current token
  static getCurrentToken(): string | null {
    return this.token;
  }
}
