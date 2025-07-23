import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config/firebaseConfig";
import type { User, UserRequest } from "../types/user.types";
import { logAdminAction, logSystemAction } from "./logging.service";

export class UserService {
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

  // Get all users (Admin only)
  static async getAllUsers(): Promise<{ users: User[]; error: string | null }> {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });

      return { users, error: null };
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

  // Get user by ID
  static async getUserById(
    userId: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));

      if (!userDoc.exists()) {
        return { user: null, error: "User not found" };
      }

      const user = { id: userDoc.id, ...userDoc.data() } as User;
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

      return { users, error: null };
    } catch (error: any) {
      console.error("Search users by email error:", error);
      return { users: [], error: error.message };
    }
  }
}