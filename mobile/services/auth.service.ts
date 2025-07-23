import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "@/firebase/config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { User, UserRole } from "../types/user.types";
import { logSystemAction, logAdminAction } from "./logging.service";

export class AuthService {
  // Sign in with email and password
  static async signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data() as User;

      // Update last login
      await updateDoc(doc(db, "users", firebaseUser.uid), {
        lastLoginAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // Log the login
      await logSystemAction("USER_LOGIN", firebaseUser.uid, userData.email, {
        role: userData.role,
        loginMethod: "email_password",
      });

      return { user: { ...userData, id: firebaseUser.uid }, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { user: null, error: error.message };
    }
  }

  // Create user account (Admin only)
  static async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "isActive">,
    password: string,
    adminId: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // Create Firebase Auth account
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, userData.email, password);
      const firebaseUser = userCredential.user;

      // Clean userData to remove undefined values
      const cleanUserData: any = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        country: userData.country,
        gender: userData.gender,
        id: firebaseUser.uid,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: adminId,
      };

      // Only add optional fields if they have values
      if (userData.studentId) cleanUserData.studentId = userData.studentId;
      if (userData.yearGroup) cleanUserData.yearGroup = userData.yearGroup;
      if (userData.major) cleanUserData.major = userData.major;
      if (userData.department) cleanUserData.department = userData.department;
      if (userData.phoneNumber)
        cleanUserData.phoneNumber = userData.phoneNumber;
      if (userData.profileImage)
        cleanUserData.profileImage = userData.profileImage;
      if (userData.assignedStudents)
        cleanUserData.assignedStudents = userData.assignedStudents;
      if (userData.assignedCoach)
        cleanUserData.assignedCoach = userData.assignedCoach;
      if (userData.permissions)
        cleanUserData.permissions = userData.permissions;

      await setDoc(doc(db, "users", firebaseUser.uid), cleanUserData);

      // Log admin action
      await logAdminAction(
        "USER_CREATED",
        adminId,
        firebaseUser.uid,
        userData.email,
        {
          role: userData.role,
          createdUserEmail: userData.email,
        }
      );

      return { user: cleanUserData as User, error: null };
    } catch (error: any) {
      console.error("Create user error:", error);
      return { user: null, error: error.message };
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Log the logout
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          await logSystemAction(
            "USER_LOGOUT",
            currentUser.uid,
            userData.email,
            {
              role: userData.role,
            }
          );
        }
      }

      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      console.error("Sign out error:", error);
      return { error: error.message };
    }
  }

  // Send password reset email
  static async sendPasswordReset(
    email: string
  ): Promise<{ error: string | null }> {
    try {
      await sendPasswordResetEmail(auth, email);

      // // Log password reset request
      // await logSystemAction("PASSWORD_RESET_REQUESTED", undefined, email, {
      //   requestedAt: new Date().toISOString(),
      // });

      return { error: null };
    } catch (error: any) {
      console.error("Password reset error:", error);
      return { error: error.message };
    }
  }

  // Update password
  static async updatePassword(
    newPassword: string
  ): Promise<{ error: string | null }> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      await updatePassword(currentUser, newPassword);

      // Update user document
      await updateDoc(doc(db, "users", currentUser.uid), {
        updatedAt: Timestamp.now(),
      });

      return { error: null };
    } catch (error: any) {
      console.error("Update password error:", error);
      return { error: error.message };
    }
  }

  // Get current user data
  static async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) return null;

      return { ...userDoc.data(), id: currentUser.uid } as User;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Check if user has admin permissions
  static hasAdminPermissions(user: User): boolean {
    const adminRoles: UserRole[] = [
      "head_of_coaches",
      "academic_advisor",
      "odip",
      "sle",
    ];
    return adminRoles.includes(user.role);
  }

  // Verify admin credentials
  static async verifyAdminCredentials(
    adminCode: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      // TODO: Verify admin code against secure collection
      // For now, using hardcoded code
      if (adminCode !== "ADMIN2024") {
        throw new Error("Invalid admin access code");
      }

      // Sign in and verify admin role
      const { user, error } = await this.signIn(email, password);

      if (error || !user) {
        throw new Error(error || "Authentication failed");
      }

      if (!this.hasAdminPermissions(user)) {
        throw new Error("Insufficient permissions for admin access");
      }

      // Log admin login
      await logAdminAction("ADMIN_LOGIN", user.id, undefined, undefined, {
        adminEmail: email,
        accessMethod: "admin_portal",
      });

      return { user, error: null };
    } catch (error: any) {
      console.error("Admin verification error:", error);
      return { user: null, error: error.message };
    }
  }
}