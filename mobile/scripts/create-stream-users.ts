import { UserService } from "@/services/user.service";

interface FirebaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role: string;
  studentId?: string;
  yearGroup?: string;
  major?: string;
  country: string;
  gender: string;
  department?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export class StreamUserCreationScript {
  private static baseURL = "http://192.168.0.127:3001/api/stream"; // Update this to your server URL

  // Create a single user via backend
  static async createSingleUser(userData: FirebaseUser): Promise<boolean> {
    try {
      console.log(
        `🔄 Creating user via backend: ${userData.firstName} ${userData.lastName}`
      );

      const response = await fetch(`${this.baseURL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log(
          `✅ Successfully created user: ${userData.firstName} ${userData.lastName}`
        );
        return true;
      } else {
        console.error(`❌ Failed to create user: ${result.error}`);
        return false;
      }
    } catch (error: any) {
      console.error(`❌ Error creating user: ${error.message}`);
      return false;
    }
  }

  // Create multiple users via backend
  static async createMultipleUsers(
    usersData: FirebaseUser[]
  ): Promise<{ success: number; failed: number }> {
    try {
      console.log(`🔄 Creating ${usersData.length} users via backend...`);

      const response = await fetch(`${this.baseURL}/users/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: usersData }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Successfully created ${result.count} users`);
        return { success: result.count, failed: 0 };
      } else {
        console.error(`❌ Failed to create users: ${result.error}`);
        return { success: 0, failed: usersData.length };
      }
    } catch (error: any) {
      console.error(`❌ Error creating users: ${error.message}`);
      return { success: 0, failed: usersData.length };
    }
  }

  // Sync all Firebase users via backend
  static async syncAllFirebaseUsers(): Promise<void> {
    try {
      console.log("🔄 Starting Firebase sync via backend...");

      // Get Firebase users (assuming you have UserService)
      const { users: firebaseUsers, error } = await UserService.getAllUsers();

      if (error || !firebaseUsers) {
        console.error("❌ Failed to fetch Firebase users:", error);
        return;
      }

      const response = await fetch(`${this.baseURL}/sync/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseUsers }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Firebase sync completed successfully!");
        console.log("📊 Sync Statistics:");
        console.log(`- Total Firebase users: ${result.stats.total}`);
        console.log(`- Already existed: ${result.stats.alreadyExisted}`);
        console.log(`- Created successfully: ${result.stats.created}`);
        console.log(`- Failed to create: ${result.stats.failed}`);
      } else {
        console.error("❌ Firebase sync failed:", result.error);
      }
    } catch (error: any) {
      console.error("❌ Error during Firebase sync:", error.message);
    }
  }

  // Quick fix for problematic users
  static async fixProblematicUsers(): Promise<void> {
    try {
      console.log("🔄 Fixing problematic users via backend...");

      const problematicUserIds = [
        "0EmQUEDw9zVbO6zsiDhJWO62kRH2",
        "5zzuXdnDCAOMB559LsNCZl9QHln1",
      ];

      // Get these users from Firebase
      const usersData: FirebaseUser[] = [];

      for (const userId of problematicUserIds) {
        try {
          const { user } = await UserService.getUserById(userId);
          if (user) {
            usersData.push(user);
          }
        } catch (error) {
          console.error(`❌ Failed to fetch user ${userId}:`, error);
        }
      }

      if (usersData.length > 0) {
        const result = await this.createMultipleUsers(usersData);
        console.log(
          `📊 Fixed users: ${result.success} success, ${result.failed} failed`
        );
      }
    } catch (error: any) {
      console.error("❌ Error fixing problematic users:", error.message);
    }
  }

  // Get sync statistics
  static async getSyncStatistics(): Promise<void> {
    try {
      console.log("📊 Getting sync statistics...");

      const response = await fetch(`${this.baseURL}/users`);
      const result = await response.json();

      if (result.success) {
        console.log(`📊 Stream Chat Users: ${result.count}`);
        console.log("✅ Check backend logs for detailed statistics");
      }
    } catch (error: any) {
      console.error("❌ Error getting statistics:", error.message);
    }
  }

  // These methods are no longer needed since we use backend
  static async initializeServerClient(): Promise<void> {
    console.log("✅ Using backend server - no client initialization needed");
  }

  static async cleanup(): Promise<void> {
    console.log("✅ Using backend server - no cleanup needed");
  }

  static debugClientInfo(): void {
    console.log("🔍 DEBUG - Using Backend Server");
    console.log(`- Backend URL: ${this.baseURL}`);
    console.log("- Server-side authentication: ✅");
    console.log("- Full admin permissions: ✅");
  }
}

export const {
  createSingleUser,
  createMultipleUsers,
  syncAllFirebaseUsers,
  getSyncStatistics,
  fixProblematicUsers,
  initializeServerClient,
  cleanup,
} = StreamUserCreationScript;
