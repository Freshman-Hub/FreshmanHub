import { Timestamp } from "firebase/firestore";

export type UserRole =
  | "freshman"
  | "continuous"
  | "student_leader"
  | "peer_coach"
  | "peer_advisor"
  | "buddy"
  | "head_of_coaches"
  | "academic_advisor"
  | "odip"
  | "sle"
  | "admin";

export type RequestStatus = "pending" | "approved" | "rejected";

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  role: UserRole;
  studentId?: string;
  yearGroup?: string;
  major?: string;
  country: string;
  gender: Gender;
  department?: string;
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string; // Admin who created the account
  lastLoginAt?: Timestamp;
  // Role-specific fields
  assignedStudents?: string[]; // for coaches/advisors
  assignedCoach?: string; // for students
  permissions?: UserPermissions;
  online: boolean; // For real-time presence tracking
}

export interface UserPermissions {
  canCreateUsers?: boolean;
  canManageUsers?: boolean;
  canViewReports?: boolean;
  canManageEvents?: boolean;
  canSendNotifications?: boolean;
}

export interface UserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  yearGroup: string;
  major: string;
  country: string;
  gender: Gender;
  phoneNumber?: string;
  additionalInfo?: string;
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectionReason?: string;
}

export type AdminAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "USER_ACTIVATED"
  | "USER_DEACTIVATED"
  | "REQUEST_APPROVED"
  | "REQUEST_REJECTED"
  | "ADMIN_LOGIN"
  | "ADMIN_LOGOUT"
  | "PASSWORD_RESET"
  | "ROLE_CHANGED";

// Update these interfaces to make optional fields truly optional:
export interface AdminLog {
  id: string;
  action: AdminAction;
  adminId: string;
  adminEmail?: string; // Made optional
  targetUserId?: string; // Keep optional but handled properly
  targetUserEmail?: string; // Keep optional but handled properly
  details: Record<string, any>;
  timestamp: Timestamp;
  ipAddress?: string;
}

export interface SystemLog {
  id: string;
  action: SystemAction;
  userId?: string; // Keep optional but handled properly
  email?: string; // Keep optional but handled properly
  details: Record<string, any>;
  timestamp: Timestamp;
  ipAddress?: string;
}

export type SystemAction =
  | "USER_LOGIN"
  | "USER_LOGOUT"
  | "USER_REQUEST_SUBMITTED"
  | "PASSWORD_RESET_REQUESTED"
  | "PROFILE_UPDATED"
  | "EVENT_CREATED"
  | "EVENT_JOINED";
