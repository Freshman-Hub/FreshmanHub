// contexts/UserContext.tsx
import React, { createContext, useState, useContext } from "react";

type Role =
  | "freshman"
  | "student"
  | "peerCoach"
  | "peerAdvisor"
  | "buddy"
  | "headCoach"
  | "academicAdvisor"
  | "odip"
  | "sle"
  | null;

interface UserContextProps {
  role: Role;
  setRole: (role: Role) => void;
}

const UserContext = createContext<UserContextProps>({
  role: null,
  setRole: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(null);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};
