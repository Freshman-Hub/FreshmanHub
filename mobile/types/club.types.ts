import type { User } from "./user.types";

export interface Club {
  id: number;
  name: string;
  members: number;
  focus: string;
  logo: string;
  description: string;
  isJoined: boolean;
  membersList?: Pick<User, "id" | "firstName" | "lastName" | "profileImage">[]; // Added membersList
}
