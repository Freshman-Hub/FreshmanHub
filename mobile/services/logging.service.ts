import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config/firebaseConfig";
import type {
  AdminLog,
  SystemLog,
  AdminAction,
  SystemAction,
} from "../types/user.types";

export class LoggingService {
  // Log admin actions
  static async logAdminAction(
    action: AdminAction,
    adminId: string,
    targetUserId?: string,
    targetUserEmail?: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      if (!auth.currentUser) return;

      // Remove undefined values completely
      const logData: any = {
        action,
        adminId,
        details: details || {},
        timestamp: serverTimestamp(),
      };

      // Only add fields that have values
      if (targetUserId) logData.targetUserId = targetUserId;
      if (targetUserEmail) logData.targetUserEmail = targetUserEmail;

      await addDoc(collection(db, "adminLogs"), logData);
    } catch (error) {
      console.error("Error logging admin action:", error);
    }
  }

  // Log system actions
  static async logSystemAction(
    action: SystemAction,
    userId?: string,
    email?: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Remove undefined values completely
      const logData: any = {
        action,
        details: details || {},
        timestamp: serverTimestamp(),
      };

      // Only add fields that have values
      if (userId) logData.userId = userId;
      if (email) logData.email = email;

      await addDoc(collection(db, "systemLogs"), logData);
    } catch (error) {
      console.error("Error logging system action:", error);
    }
  }

  // Get admin logs
  static async getAdminLogs(
    limitCount = 50
  ): Promise<{ logs: AdminLog[]; error: string | null }> {
    try {
      if (!auth.currentUser)
        return { logs: [], error: "Authentication required" };

      const q = query(
        collection(db, "adminLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const logs: AdminLog[] = [];

      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as AdminLog);
      });

      return { logs, error: null };
    } catch (error: any) {
      return { logs: [], error: error.message };
    }
  }

  // Get system logs
  static async getSystemLogs(
    limitCount = 50
  ): Promise<{ logs: SystemLog[]; error: string | null }> {
    try {
      if (!auth.currentUser)
        return { logs: [], error: "Authentication required" };

      const q = query(
        collection(db, "systemLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const logs: SystemLog[] = [];

      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() } as SystemLog);
      });

      return { logs, error: null };
    } catch (error: any) {
      return { logs: [], error: error.message };
    }
  }
}

export const logAdminAction = LoggingService.logAdminAction;
export const logSystemAction = LoggingService.logSystemAction;
