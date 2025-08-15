import { db } from "@/firebase/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import type { User, UserRequest } from "../types/user.types";
import { logAdminAction, logSystemAction } from "./logging.service";
// import { useSQLiteContext } from "expo-sqlite";

const LAST_SYNC_KEY = "lastUserSync";

export class UserService {
  private static sqliteDb: any = null;

  // Initialize SQLite context (call this from your component that has access to useSQLiteContext)
  static setSQLiteContext(db: any) {
    this.sqliteDb = db;
  }

  // Get last sync timestamp from AsyncStorage
  private static async getLastSyncTime(): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(LAST_SYNC_KEY);
      console.log("📅 Last sync time:", value || "First time sync");
      return value;
    } catch (error) {
      console.error("Error getting last sync time:", error);
      return null;
    }
  }

  // Update last sync timestamp
  private static async updateLastSyncTime(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp);
      console.log("✅ Updated last sync time to:", timestamp);
    } catch (error) {
      console.error("Error updating last sync time:", error);
    }
  }

  // Sync users from Firebase to SQLite
  private static async syncUsersFromFirebase(): Promise<{
    users: User[];
    error: string | null;
  }> {
    try {
      console.log("🔄 Starting user sync from Firebase...");

      const lastSync = await this.getLastSyncTime();
      let firebaseQuery;

      if (lastSync) {
        console.log("📥 Fetching users updated after:", lastSync);
        // ✅ Convert ISO string to Firestore Timestamp
        const lastSyncTimestamp = Timestamp.fromDate(new Date(lastSync));

        firebaseQuery = query(
          collection(db, "users"),
          where("updatedAt", ">", lastSyncTimestamp),
          orderBy("updatedAt", "asc")
        );
      } else {
        console.log("📥 First time sync - fetching all users from Firebase");
        firebaseQuery = query(
          collection(db, "users"),
          orderBy("updatedAt", "asc")
        );
      }

      const querySnapshot = await getDocs(firebaseQuery);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      console.log(`🔥 Firebase returned ${users.length} users`);

      // Insert/update users in SQLite
      if (users.length > 0 && this.sqliteDb) {
        for (const user of users) {
          await this.insertOrUpdateUserInSQLite(user);
        }

        // Update last sync time with the latest user's updatedAt
        const latestUser = users[users.length - 1];
        if (latestUser.updatedAt) {
          await this.updateLastSyncTime(
            latestUser.updatedAt instanceof Timestamp
              ? latestUser.updatedAt.toDate().toISOString()
              : String(latestUser.updatedAt)
          );
        }
      }

      return { users, error: null };
    } catch (error: any) {
      console.error("❌ Error syncing users from Firebase:", error);
      return { users: [], error: error.message };
    }
  }

  // Fix the insertOrUpdateUserInSQLite method:

  private static async insertOrUpdateUserInSQLite(user: User): Promise<void> {
    if (!this.sqliteDb) {
      console.warn("⚠️ SQLite context not available");
      return;
    }

    try {
      // Convert Firestore Timestamps to ISO strings before storing
      const convertedUser = {
        ...user,
        createdAt: this.convertTimestampToISO(user.createdAt),
        updatedAt: this.convertTimestampToISO(user.updatedAt),
        lastLoginAt: user.lastLoginAt
          ? this.convertTimestampToISO(user.lastLoginAt)
          : null,
      };

      // Check if user exists
      const existingUser = await this.sqliteDb.getFirstAsync(
        "SELECT id FROM users WHERE id = ?",
        [user.id]
      );

      if (existingUser) {
        // Update existing user
        await this.sqliteDb.runAsync(
          `UPDATE users SET 
         firstName = ?, lastName = ?, email = ?, bio = ?, role = ?, 
         studentId = ?, yearGroup = ?, major = ?, country = ?, gender = ?, 
         department = ?, phoneNumber = ?, profileImage = ?, isActive = ?, 
         updatedAt = ?, createdBy = ?, lastLoginAt = ?, assignedStudents = ?, 
         assignedCoach = ?, permissions = ?, online = ?
         WHERE id = ?`,
          [
            convertedUser.firstName,
            convertedUser.lastName,
            convertedUser.email,
            convertedUser.bio || null,
            convertedUser.role,
            convertedUser.studentId || null,
            convertedUser.yearGroup || null,
            convertedUser.major || null,
            convertedUser.country,
            convertedUser.gender,
            convertedUser.department || null,
            convertedUser.phoneNumber || null,
            convertedUser.profileImage || null,
            convertedUser.isActive ? 1 : 0,
            convertedUser.updatedAt,
            convertedUser.createdBy || null,
            convertedUser.lastLoginAt || null,
            convertedUser.assignedStudents
              ? JSON.stringify(convertedUser.assignedStudents)
              : null,
            convertedUser.assignedCoach || null,
            convertedUser.permissions
              ? JSON.stringify(convertedUser.permissions)
              : null,
            convertedUser.online ? 1 : 0,
            convertedUser.id,
          ]
        );
        console.log(`🔄 Updated user ${convertedUser.email} in SQLite`);
      } else {
        // Insert new user
        await this.sqliteDb.runAsync(
          `INSERT INTO users (
          id, firstName, lastName, email, bio, role, studentId, yearGroup, major, 
          country, gender, department, phoneNumber, profileImage, isActive, 
          createdAt, updatedAt, createdBy, lastLoginAt, assignedStudents, 
          assignedCoach, permissions, online
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            convertedUser.id,
            convertedUser.firstName,
            convertedUser.lastName,
            convertedUser.email,
            convertedUser.bio || null,
            convertedUser.role,
            convertedUser.studentId || null,
            convertedUser.yearGroup || null,
            convertedUser.major || null,
            convertedUser.country,
            convertedUser.gender,
            convertedUser.department || null,
            convertedUser.phoneNumber || null,
            convertedUser.profileImage || null,
            convertedUser.isActive ? 1 : 0,
            convertedUser.createdAt,
            convertedUser.updatedAt,
            convertedUser.createdBy || null,
            convertedUser.lastLoginAt || null,
            convertedUser.assignedStudents
              ? JSON.stringify(convertedUser.assignedStudents)
              : null,
            convertedUser.assignedCoach || null,
            convertedUser.permissions
              ? JSON.stringify(convertedUser.permissions)
              : null,
            convertedUser.online ? 1 : 0,
          ]
        );
        console.log(`➕ Inserted new user ${convertedUser.email} into SQLite`);
      }
    } catch (error) {
      console.error(
        `❌ Error inserting/updating user ${user.email} in SQLite:`,
        error
      );
    }
  }

  // Add this helper method to convert Firestore Timestamps to ISO strings
  private static convertTimestampToISO(timestamp: any): string {
    if (!timestamp) return new Date().toISOString();

    try {
      // If it's a Firestore Timestamp with seconds and nanoseconds
      if (typeof timestamp === "object" && timestamp.seconds !== undefined) {
        const milliseconds =
          timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000;
        return new Date(milliseconds).toISOString();
      }
      // If it's already an ISO string
      else if (typeof timestamp === "string") {
        return timestamp;
      }
      // If it's a JavaScript Date
      else if (timestamp instanceof Date) {
        return timestamp.toISOString();
      }
      // If it has a toDate method (Firestore Timestamp)
      else if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
      }

      return new Date().toISOString(); // fallback
    } catch (error) {
      console.warn("Error converting timestamp:", error);
      return new Date().toISOString();
    }
  }

  // Get users from SQLite
  private static async getUsersFromSQLite(): Promise<{
    users: User[];
    error: string | null;
  }> {
    try {
      if (!this.sqliteDb) {
        console.warn(
          "⚠️ SQLite context not available, falling back to Firebase"
        );
        return await this.getAllUsersFromFirebase();
      }

      console.log("💾 Fetching users from SQLite...");
      const result = await this.sqliteDb.getAllAsync(`
        SELECT * FROM users WHERE isActive = 1 ORDER BY createdAt DESC
      `);

      const users: User[] = result.map((row: any) => ({
        id: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        bio: row.bio,
        role: row.role,
        studentId: row.studentId,
        yearGroup: row.yearGroup,
        major: row.major,
        country: row.country,
        gender: row.gender,
        department: row.department,
        phoneNumber: row.phoneNumber,
        profileImage: row.profileImage,
        isActive: row.isActive === 1,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy,
        lastLoginAt: row.lastLoginAt,
        assignedStudents: row.assignedStudents
          ? JSON.parse(row.assignedStudents)
          : [],
        assignedCoach: row.assignedCoach,
        permissions: row.permissions ? JSON.parse(row.permissions) : {},
        online: row.online === 1,
      }));

      console.log(`💾 SQLite returned ${users.length} users`);
      return { users, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching users from SQLite:", error);
      return { users: [], error: error.message };
    }
  }

  // Get all users from Firebase (fallback)
  private static async getAllUsersFromFirebase(): Promise<{
    users: User[];
    error: string | null;
  }> {
    try {
      console.log("🔥 Fetching all users from Firebase (fallback)...");
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      console.log(`🔥 Firebase returned ${users.length} users (fallback)`);
      return { users, error: null };
    } catch (error: any) {
      console.error("❌ Error fetching users from Firebase:", error);
      return { users: [], error: error.message };
    }
  }

  // Submit user request
  static async submitUserRequest(
    requestData: Omit<UserRequest, "id" | "status" | "createdAt" | "updatedAt">
  ): Promise<{ requestId: string | null; error: string | null }> {
    try {
      const request: Omit<UserRequest, "id"> = {
        ...requestData,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "userRequests"), request);

      // Log the request submission
      await logSystemAction(
        "USER_REQUEST_SUBMITTED",
        undefined,
        requestData.email,
        {
          requestId: docRef.id,
          studentId: requestData.studentId,
          yearGroup: requestData.yearGroup,
          major: requestData.major,
        }
      );

      return { requestId: docRef.id, error: null };
    } catch (error: any) {
      console.error("Submit user request error:", error);
      return { requestId: null, error: error.message };
    }
  }

  // Get pending user requests (Admin only)
  static async getPendingRequests(): Promise<{
    requests: UserRequest[];
    error: string | null;
  }> {
    try {
      const q = query(
        collection(db, "userRequests"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const requests: UserRequest[] = [];

      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as UserRequest);
      });

      return { requests, error: null };
    } catch (error: any) {
      console.error("Get pending requests error:", error);
      return { requests: [], error: error.message };
    }
  }

  // Approve user request (Admin only)
  static async approveUserRequest(
    requestId: string,
    adminId: string,
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "isActive">,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // Update request status
      await updateDoc(doc(db, "userRequests", requestId), {
        status: "approved",
        reviewedBy: adminId,
        reviewedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Create user account using AuthService
      const { AuthService } = await import("./auth.service");
      const { user, error } = await AuthService.createUser(
        userData,
        password,
        adminId
      );

      if (error || !user) {
        throw new Error(error || "Failed to create user account");
      }

      // Insert new user into SQLite
      await this.insertOrUpdateUserInSQLite(user);

      // Log admin action
      await logAdminAction(
        "REQUEST_APPROVED",
        adminId,
        user.id,
        userData.email,
        {
          requestId,
          approvedUserEmail: userData.email,
          role: userData.role,
        }
      );

      return { user, error: null };
    } catch (error: any) {
      console.error("Approve user request error:", error);
      return { user: null, error: error.message };
    }
  }

  // Reject user request (Admin only)
  static async rejectUserRequest(
    requestId: string,
    adminId: string,
    rejectionReason: string
  ): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, "userRequests", requestId), {
        status: "rejected",
        reviewedBy: adminId,
        reviewedAt: Timestamp.now(),
        rejectionReason,
        updatedAt: Timestamp.now(),
      });

      // Get request data for logging
      const requestDoc = await getDoc(doc(db, "userRequests", requestId));
      const requestData = requestDoc.data() as UserRequest;

      // Log admin action
      await logAdminAction(
        "REQUEST_REJECTED",
        adminId,
        undefined,
        requestData.email,
        {
          requestId,
          rejectedUserEmail: requestData.email,
          rejectionReason,
        }
      );

      return { error: null };
    } catch (error: any) {
      console.error("Reject user request error:", error);
      return { error: error.message };
    }
  }

  // Get all users (with sync and local fallback)
  static async getAllUsers(): Promise<{ users: User[]; error: string | null }> {
    try {
      // First sync from Firebase (only new/updated users)
      await this.syncUsersFromFirebase();

      // Then return users from SQLite
      return await this.getUsersFromSQLite();
    } catch (error: any) {
      console.error("Get all users error:", error);
      return { users: [], error: error.message };
    }
  }

  // Update user (Admin only)
  static async updateUser(
    userId: string,
    updates: Partial<User>,
    adminId: string
  ): Promise<{ error: string | null }> {
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, "users", userId), updateData);

      // Update in SQLite as well
      if (this.sqliteDb) {
        const user = await this.getUserById(userId);
        if (user.user) {
          const updatedUser = { ...user.user, ...updates };
          await this.insertOrUpdateUserInSQLite(updatedUser);
        }
      }

      // Get user data for logging
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data() as User;

      // Log admin action
      await logAdminAction("USER_UPDATED", adminId, userId, userData.email, {
        updatedFields: Object.keys(updates),
        updates,
      });

      return { error: null };
    } catch (error: any) {
      console.error("Update user error:", error);
      return { error: error.message };
    }
  }

  // Deactivate user (Admin only)
  static async deactivateUser(
    userId: string,
    adminId: string
  ): Promise<{ error: string | null }> {
    try {
      await updateDoc(doc(db, "users", userId), {
        isActive: false,
        updatedAt: Timestamp.now(),
      });

      // Update in SQLite as well
      if (this.sqliteDb) {
        await this.sqliteDb.runAsync(
          "UPDATE users SET isActive = 0, updatedAt = ? WHERE id = ?",
          [new Date().toISOString(), userId]
        );
        console.log(`🔄 Deactivated user ${userId} in SQLite`);
      }

      // Get user data for logging
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data() as User;

      // Log admin action
      await logAdminAction(
        "USER_DEACTIVATED",
        adminId,
        userId,
        userData.email,
        {
          deactivatedUserEmail: userData.email,
          role: userData.role,
        }
      );

      return { error: null };
    } catch (error: any) {
      console.error("Deactivate user error:", error);
      return { error: error.message };
    }
  }

  // Get user by ID (tries SQLite first, then Firebase)
  static async getUserById(
    userId: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Fetching user ${userId} from SQLite...`);
        const result = await this.sqliteDb.getFirstAsync(
          "SELECT * FROM users WHERE id = ?",
          [userId]
        );

        if (result) {
          const user: User = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            bio: result.bio,
            role: result.role,
            studentId: result.studentId,
            yearGroup: result.yearGroup,
            major: result.major,
            country: result.country,
            gender: result.gender,
            department: result.department,
            phoneNumber: result.phoneNumber,
            profileImage: result.profileImage,
            isActive: result.isActive === 1,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            createdBy: result.createdBy,
            lastLoginAt: result.lastLoginAt,
            assignedStudents: result.assignedStudents
              ? JSON.parse(result.assignedStudents)
              : [],
            assignedCoach: result.assignedCoach,
            permissions: result.permissions
              ? JSON.parse(result.permissions)
              : {},
            online: result.online === 1,
          };
          console.log(`💾 Found user ${userId} in SQLite`);
          return { user, error: null };
        }
      }

      // Fallback to Firebase
      console.log(`🔥 Fetching user ${userId} from Firebase (fallback)...`);
      const userDoc = await getDoc(doc(db, "users", userId));

      if (!userDoc.exists()) {
        return { user: null, error: "User not found" };
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;

      // Cache in SQLite for next time
      if (this.sqliteDb) {
        await this.insertOrUpdateUserInSQLite(user);
      }

      console.log(`🔥 Found user ${userId} in Firebase (cached to SQLite)`);
      return { user, error: null };
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      return { user: null, error: error.message };
    }
  }

  // Search users by email
  static async searchUsersByEmail(
    email: string
  ): Promise<{ users: User[]; error: string | null }> {
    try {
      // Try SQLite first
      if (this.sqliteDb) {
        console.log(`💾 Searching users by email '${email}' in SQLite...`);
        const result = await this.sqliteDb.getAllAsync(
          "SELECT * FROM users WHERE email LIKE ? AND isActive = 1",
          [`%${email}%`]
        );

        if (result.length > 0) {
          const users: User[] = result.map((row: any) => ({
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            bio: row.bio,
            role: row.role,
            studentId: row.studentId,
            yearGroup: row.yearGroup,
            major: row.major,
            country: row.country,
            gender: row.gender,
            department: row.department,
            phoneNumber: row.phoneNumber,
            profileImage: row.profileImage,
            isActive: row.isActive === 1,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            createdBy: row.createdBy,
            lastLoginAt: row.lastLoginAt,
            assignedStudents: row.assignedStudents
              ? JSON.parse(row.assignedStudents)
              : [],
            assignedCoach: row.assignedCoach,
            permissions: row.permissions ? JSON.parse(row.permissions) : {},
            online: row.online === 1,
          }));
          console.log(`💾 Found ${users.length} users in SQLite`);
          return { users, error: null };
        }
      }

      // Fallback to Firebase
      console.log(
        `🔥 Searching users by email '${email}' in Firebase (fallback)...`
      );
      const q = query(
        collection(db, "users"),
        where("email", ">=", email),
        where("email", "<=", email + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      console.log(`🔥 Found ${users.length} users in Firebase`);
      return { users, error: null };
    } catch (error: any) {
      console.error("Search users by email error:", error);
      return { users: [], error: error.message };
    }
  }

  // Add to UserService class
  static async getUserPushTokens(userId: string): Promise<string[]> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().pushTokens || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting user push tokens:", error);
      return [];
    }
  }

  static async getMultipleUserTokens(userIds: string[]): Promise<string[]> {
    try {
      const tokens: string[] = [];

      for (const userId of userIds) {
        const userTokens = await this.getUserPushTokens(userId);
        tokens.push(...userTokens);
      }

      return tokens;
    } catch (error) {
      console.error("Error getting multiple user tokens:", error);
      return [];
    }
  }
}
